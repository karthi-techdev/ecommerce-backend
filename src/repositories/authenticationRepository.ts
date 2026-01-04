import {UserModel} from "../models/userModel";
import { GroupModel } from "../models/menuGroupModel";
import { RolePrivilgeModel } from "../models/rolePrivilegeModel";
import bcrypt from "bcryptjs";
import { sign, verify, SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";
import { Document, Types, FlattenMaps } from "mongoose";

export interface IAuthLoginInput {
  email: string;
  password: string;
}

interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  roleId: string;
  rolePrivilegeIds: string[];
  status: string;
  isDeleted: boolean;
}

interface IMenuItem {
  name: string;
  slug: string;
  icon: string;
  path?: string;
  sortOrder: number;
  children?: ISubmenuItem[];
  special?: boolean;
}

interface ISubmenuItem {
  name: string;
  slug: string;
  path: string;
  sortOrder?: number;
}

interface IPopulatedSubmenu {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  path: string;
  mainMenuId: IPopulatedMainMenu | Types.ObjectId;
  sortOrder: number;
}

interface IPopulatedMainMenu {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
}

class AuthenticationRepository {
  async authLogin(data: IAuthLoginInput): Promise<{
    token: string;
    data: Partial<IUser>;
    expiresIn: StringValue;
    menus: IMenuItem[];
  }> {
    const { email, password } = data;

    // Find user
    const user = await UserModel
      .findOne({ email })
      .select("_id email password role status rolePrivilegeIds")
      .lean<IUser>();

    if (!user) {
      throw new Error("Email does not exist");
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid password for user");
    }

    // Generate token
    const { token, data: userData, expiresIn } = this._generateToken(user);

    // Fetch menus and submenus
    const menus = await this._fetchUserMenus(user.rolePrivilegeIds);

    return { token, data: userData, expiresIn, menus };
  }

   async updateUser(userId: string, data: { 
     email?: string, 
     password?: string, 
     name?: string,
     roleId?: string, 
     status?: string, 
     isDeleted?: boolean 
   }) {
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (typeof data.password !== 'undefined' && data.password !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.name) updateData.name = data.name;
    if (data.roleId) updateData.roleId = data.roleId;
    if (data.status) updateData.status = data.status;
    if (typeof data.isDeleted !== 'undefined') updateData.isDeleted = data.isDeleted;
    // Always update user by userId, even if only email is present
    const user = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    return user ? user.toObject() : null;
  }

  async refreshToken(token: string): Promise<{
    token: string;
    data: Partial<IUser>;
    expiresIn: StringValue;
    menus: IMenuItem[];
  }> {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET not defined in environment");
    }

    let decoded: any;
    try {
      decoded = verify(token, jwtSecret);
    } catch {
      throw new Error("Invalid or expired token");
    }

    const userId = decoded._id || decoded.id;
    const user = await UserModel.findOne({ _id: userId })
      .select("_id email role status rolePrivilegeIds")
      .lean<IUser>();

    if (!user) {
      throw new Error("User not found");
    }

    const { token: newToken, data: userData, expiresIn } = this._generateToken(user);
    const menus = await this._fetchUserMenus(user.rolePrivilegeIds);

    return { token: newToken, data: userData, expiresIn, menus };
  }

  private async _fetchUserMenus(rolePrivilegeIds: string[]): Promise<IMenuItem[]> {
    if (!rolePrivilegeIds || rolePrivilegeIds.length === 0) {
      return [];
    }

    const objectIds = rolePrivilegeIds
      .map(id => {
        try {
          return new Types.ObjectId(id);
        } catch {
          return null;
        }
      })
      .filter(id => id !== null);

    const privileges = await RolePrivilgeModel.find({
      _id: { $in: objectIds },
      status: true,
      isDeleted: false
    }).select("menuGroupId").lean();

    const menuGroupIds = privileges.map((p: { menuGroupId: any }) => p.menuGroupId.toString());
    if (!menuGroupIds.length) return [];

    const groups = await GroupModel.find({
      _id: { $in: menuGroupIds.map(id => new Types.ObjectId(id)) },
      status: "active",
      isDeleted: false
    })
      .populate({
        path: "submenuId",
        match: { status: "active", isDeleted: false },
        select: "name slug path mainMenuId sortOrder",
        populate: {
          path: "mainMenuId",
          match: { status: "active", isDeleted: false },
          select: "name slug icon sortOrder"
        }
      })
      
      
      .lean();

    if (!groups.length) return [];

    const menuMap: { [key: string]: IMenuItem } = {};
    const seenSubmenuKeys: Set<string> = new Set();

    for (const group of groups) {
      const submenu = group.submenuId as Types.ObjectId | FlattenMaps<IPopulatedSubmenu>;

      if (
        !submenu ||
        (typeof submenu === "object" && "toHexString" in submenu && Types.ObjectId.isValid(submenu)) ||
        (typeof submenu === "object" && "_id" in submenu && Types.ObjectId.isValid((submenu as any)._id) && !(submenu as IPopulatedSubmenu).mainMenuId)
      ) {
        continue;
      }

      const populatedSubmenu = submenu as IPopulatedSubmenu;
      const mainMenu = populatedSubmenu.mainMenuId as IPopulatedMainMenu;
      const menuKey = mainMenu.slug;
      const submenuKey = `${populatedSubmenu.slug}-${populatedSubmenu.path}`;

      if (!menuMap[menuKey]) {
        menuMap[menuKey] = {
          name: mainMenu.name,
          slug: mainMenu.slug,
          icon: mainMenu.icon || "RiListIndefinite",
          sortOrder: mainMenu.sortOrder,
          children: [],
          special: mainMenu.slug === "dashboard"
        };
      }

      if (populatedSubmenu.path && !seenSubmenuKeys.has(submenuKey)) {
        const submenuItem: ISubmenuItem = {
          name: populatedSubmenu.name,
          slug: populatedSubmenu.slug,
          path: populatedSubmenu.path,
          sortOrder: populatedSubmenu.sortOrder
        };
        menuMap[menuKey].children!.push(submenuItem);
        seenSubmenuKeys.add(submenuKey);
      } else if (mainMenu.slug === "dashboard" && !menuMap[menuKey].path) {
        menuMap[menuKey].path = "/";
      }
    }

    const menus = Object.values(menuMap).sort((a, b) => a.sortOrder - b.sortOrder);
    for (const menu of menus) {
      if (menu.children && menu.children.length > 0) {
        menu.children.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      }
    }

    return menus;
  }

  private _generateToken(user: IUser): { token: string; data: Partial<IUser>; expiresIn: StringValue } {
    const jwtSecret = process.env.JWT_SECRET;
    const validExpireTimes = ["1d", "2d", "1h", "2h", "30m", "1m"];
    const expiresIn = process.env.JWT_EXPIRE_TIME && validExpireTimes.includes(process.env.JWT_EXPIRE_TIME)
      ? process.env.JWT_EXPIRE_TIME
      : "1d";
    const signOptions: SignOptions = { expiresIn: expiresIn as StringValue };
    const token = sign(
      { _id: user._id, id: user._id, email: user.email, roleId: user.roleId },
      jwtSecret!,
      signOptions
    );
    const { password: _, rolePrivilegeIds: __, ...userWithoutPassword } = user;
    return { token, data: userWithoutPassword, expiresIn: expiresIn as StringValue };
  }

  async createUser(data: { 
    email: string, 
    password: string, 
    name: string,
    roleId: string, 
    status: string, 
    isDeleted: boolean 
  }) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const userData = {
      ...data,
      password: hashedPassword,
    };
    // Create the new user with the hashed password
    const user = await UserModel.create(userData);
    return user;
  }

  async getUserById(id: string) {
    return await UserModel.findById(id)
      .select("_id email role status")
      .lean();
  }

  async checkEmailExists(email: string, currentUserId?: string | null): Promise<boolean> {
    const query: any = { 
      email, 
      isDeleted: false 
    };
    // Exclude current user from the check if currentUserId is provided
    if (currentUserId) {
      query._id = { $ne: currentUserId };
    }
    const exists = await UserModel.findOne(query);
    return !!exists;
  }

  async deleteUserPermanently(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId);
  }

  }


export default new AuthenticationRepository();
