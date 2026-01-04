import mongoose, { Types } from "mongoose";
import { CommonRepository } from "../repositories/commonRepository";
import { IRole, RoleModel } from "../models/roleModel";
import { MenuModel as MainMenuModel, IMenu } from "../models/menuModel";
import { SubmenuModel as SubMenuModel, ISubmenu } from "../models/subMenuModel";
import { MenuPermissionModel } from "../models/menuPermissonModel";
import { GroupModel, IGroup, ILeanGroup } from "../models/menuGroupModel";
import { RolePrivilgeModel, IRolePrivilge } from "../models/rolePrivilegeModel";

// Define a type for the lean group with populated fields and Mongoose metadata
interface LeanGroupWithPopulate {
  _id: string; // Lean query converts ObjectId to string
  submenuId?: { _id: string; name: string; slug: string } | null;
  menuPermissionId?: { _id: string; name: string; slug: string } | null;
  status: string;
  isDeleted: boolean;
  __v?: number;
  [key: string]: any; // Allow Mongoose metadata like $assertPopulated
}

class RoleRepository {
  private commonRepository: CommonRepository<IRole>;

  constructor() {
    this.commonRepository = new CommonRepository(RoleModel);
  }

  async createRole(data: Partial<IRole>): Promise<IRole> {
    return await RoleModel.create(data);
  }

  async createRolePrivileges(privileges: IRolePrivilge[]): Promise<IRolePrivilge[]> {
    for (const priv of privileges) {

      if (!priv.roleId || !Types.ObjectId.isValid(priv.roleId)) {
        throw new Error(`Invalid or missing roleId: ${priv.roleId}`);
      }
      if (!priv.menuGroupId || !Types.ObjectId.isValid(priv.menuGroupId)) {
        throw new Error(`Invalid or missing menuGroupId: ${priv.menuGroupId}`);
      }
    }
    const result = await RolePrivilgeModel.insertMany(privileges);
    return result;
  }

  async getAllRoles(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };
    if (filter === "active") query.status = "active";
    if (filter === "inactive") query.status = "inactive";

    const skip = (page - 1) * limit;
    const [data, stats] = await Promise.all([
      RoleModel.find(query).skip(skip).limit(limit),
      this.commonRepository.getStats(),
    ]);

    const totalPages = Math.ceil(stats.total / limit) || 1;
    return {
      data,
      meta: {
        ...stats,
        totalPages,
        page,
        limit,
      },
    };
  }

 async getRoleById(id: string | Types.ObjectId): Promise<IRole | null> {
  try {
    const objectId = typeof id === 'string' ? new Types.ObjectId(id) : id;
    const role = await RoleModel.findOne({ _id: objectId, isDeleted: false }); 
    return role;
  } catch (err: any) {
    throw err;
  }
}
  async getRolePrivileges(roleId: string | Types.ObjectId): Promise<IRolePrivilge[]> {
    const objectId = typeof roleId === 'string' ? new Types.ObjectId(roleId) : roleId;
    const privileges = await RolePrivilgeModel.find({ roleId: objectId, isDeleted: false, status: true });
    return privileges;
  }


  async softDeleteRole(id: string | Types.ObjectId): Promise<IRole | null> {
    return await RoleModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IRole | null> {
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }
  // In RoleRepository (already present)
  async updateRole(id: string | Types.ObjectId, data: Partial<IRole>): Promise<IRole | null> {
  const role = await RoleModel.findByIdAndUpdate(id, data, { new: true });
  return role;
}
  async getAllTrashRoles(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };
    if (filter === "active") query.status = "active";
    if (filter === "inactive") query.status = "inactive";

    const skip = (page - 1) * limit;
    const [data, count, stats] = await Promise.all([
      RoleModel.find(query).skip(skip).limit(limit),
      RoleModel.countDocuments(query),
      this.commonRepository.getStats(),
    ]);

    const totalPages = Math.max(1, Math.ceil(count / limit));
    return {
      data,
      meta: {
        ...stats,
        total: count,
        totalPages,
        page,
        limit,
      },
    };
  }

  async restoreRole(id: string | Types.ObjectId): Promise<IRole | null> {
    return await RoleModel.findByIdAndUpdate(id, { isDeleted: false, status: "active" }, { new: true });
  }

  async deleteRolePermanently(id: string | Types.ObjectId): Promise<IRole | null> {
    return await RoleModel.findByIdAndDelete(id);
  }

  async getActiveMenuPermissions() {
    try {
      const permissions = await MenuPermissionModel.find({ status: 'active', isDeleted: false }).lean();
      return permissions;
    } catch (error) {
      return [];
    }
  }

  async getActiveMainMenus(): Promise<IMenu[]> {
    try {
      const menus = await MainMenuModel.find({ status: 'active', isDeleted: false });
      return menus as IMenu[];
    } catch (error) {
      return [];
    }
  }

  async getSubmenusByMainMenuId(mainMenuId: Types.ObjectId): Promise<ISubmenu[]> {
    try {
      const submenus = await SubMenuModel.find({
        mainMenuId,
        status: 'active',
        isDeleted: false,
      }).lean();
      return submenus;
    } catch (error) {
      return [];
    }
  }

  async getSubmenuGroups(): Promise<ILeanGroup[]> {
    try {
      const rawGroups = await GroupModel.find({ status: 'active', isDeleted: false })
        .populate({
          path: 'submenuId',
          select: 'name slug _id',
          match: { status: 'active', isDeleted: false },
        })
        .populate({
          path: 'menuPermissionId',
          select: 'name slug _id',
          match: { status: 'active', isDeleted: false },
        })
        .lean();

      const filteredGroups = (rawGroups as unknown as LeanGroupWithPopulate[])
        .filter((g): g is ILeanGroup => {
          const hasSubmenuId = !!g.submenuId && '_id' in g.submenuId;
          const hasMenuPermissionId = !!g.menuPermissionId && '_id' in g.menuPermissionId;
          return hasSubmenuId && hasMenuPermissionId;
        })
        .map((g) => ({
          _id: String(g._id),
          submenuId: g.submenuId,
          menuPermissionId: g.menuPermissionId,
          status: g.status,
          isDeleted: g.isDeleted,
          createdAt: g.createdAt || new Date(),
          updatedAt: g.updatedAt || new Date(),
        }));


      return filteredGroups;
    } catch (error) {
      return [];
    }
  }
}

export default new RoleRepository();