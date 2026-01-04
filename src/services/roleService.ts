import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "../services/commonService";
import RoleRepository from "../repositories/roleRepository";
import { IRole, RoleModel } from "../models/roleModel";
import { IRolePrivilge, RolePrivilgeModel } from "../models/rolePrivilegeModel";
import { GroupModel } from "../models/menuGroupModel";

interface IPermission {
  menupermissonSlug: string;
  menupermissonId: string;
  menuGroupId: string;
}

interface ISubmenuEntry {
  submenu: string;
  slug: string;
  id: string;
  permisson: IPermission[];
}

interface IRoleWithPrivileges {
  name: string;
  rolePrivileges: { menuGroupId: string; status: boolean }[];
}

class RoleService {
  private commonService = new CommonService<IRole>(RoleModel);

  private validateRoleData(data: Partial<IRole>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : data.name !== undefined
          ? ValidationHelper.isNonEmptyString(data.name, "name")
          : null,
      data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 100) : null,
      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),
      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : data.slug !== undefined
          ? ValidationHelper.isNonEmptyString(data.slug, "slug")
          : null,
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createRole(data: IRoleWithPrivileges): Promise<IRole> {
    let slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    this.validateRoleData({ name: data.name, slug, status: "active", isDeleted: false });

    const [nameExists, slugExists] = await Promise.all([
      this.commonService.existsByField("name", data.name),
      this.commonService.existsByField("slug", slug),
    ]);
    if (nameExists) {
      throw new Error("Role with this name already exists");
    }
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const roleData: Partial<IRole> = {
      name: data.name,
      slug,
      status: "active",
      isDeleted: false,
    };

    const role = await RoleRepository.createRole(roleData);

    const allGroups = await GroupModel.find({ status: 'active', isDeleted: false }).select('_id').lean();
    const selectedMenuGroupIds = new Set(data.rolePrivileges?.map(p => p.menuGroupId) || []);

    const privileges: Partial<IRolePrivilge>[] = allGroups.map(group => {
      const groupId = group._id?.toString();
      return {
        roleId: role._id,
        menuGroupId: groupId ? new Types.ObjectId(groupId) : undefined,
        status: groupId ? selectedMenuGroupIds.has(groupId) : false,
      };
    });

    if (privileges.length > 0) {
      await RoleRepository.createRolePrivileges(privileges as IRolePrivilge[]);
    }

    return role;
  }

  async getAllRoles(page: number = 1, limit: number = 10, filter?: string) {
    return await RoleRepository.getAllRoles(page, limit, filter);
  }

  async getRoleById(id: string | Types.ObjectId): Promise<IRole & { rolePrivileges?: { menuGroupId: string; status: boolean }[] } | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    const role = await RoleRepository.getRoleById(id);
    if (!role) return null;

    let privileges: IRolePrivilge[] = [];
    try {
      privileges = await RoleRepository.getRolePrivileges(id);
    } catch {}

    const roleObj = typeof role.toObject === "function" ? role.toObject() : role;
    return {
      ...roleObj,
      rolePrivileges: privileges.map(p => ({
        menuGroupId: p.menuGroupId.toString(),
        status: p.status,
      })),
    };
  }

  async softDeleteRole(id: string | Types.ObjectId): Promise<IRole | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await RoleRepository.softDeleteRole(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IRole | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await RoleRepository.toggleStatus(id);
  }

  async updateRole(
    id: string | Types.ObjectId,
    data: Partial<IRole> & { rolePrivileges?: { menuGroupId: string; status: boolean }[] }
  ): Promise<IRole | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    this.validateRoleData(data, true);

    if (data.name || data.slug) {
      const [nameExists, slugExists] = await Promise.all([
        data.name ? this.commonService.existsByField(data.name, id) : Promise.resolve(false),
        data.slug ? this.commonService.existsByField(data.slug, id) : Promise.resolve(false),
      ]);
      if (nameExists) throw new Error("Role with this name already exists");
      if (slugExists) throw new Error("Role with this slug already exists");
    }

    if (data.name && !data.slug) {
      let slug = data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const slugExists = await this.commonService.existsByField(slug, id);
      if (slugExists) slug = `${slug}-${Date.now()}`;
      data.slug = slug;
    }

    const role = await RoleRepository.updateRole(id, data);
    if (!role) return null;

    if (data.rolePrivileges) {
      await RolePrivilgeModel.deleteMany({ roleId: id });

      const allGroups = await GroupModel.find({ status: 'active', isDeleted: false }).select('_id').lean();
      const privileges: Partial<IRolePrivilge>[] = allGroups.map(group => {
        const groupId = group._id.toString();
        return {
          roleId: new Types.ObjectId(id),
          menuGroupId: new Types.ObjectId(groupId),
          status: data.rolePrivileges?.some(p => p.menuGroupId === groupId && p.status) || false,
        };
      });

      const validPrivileges = privileges.filter(p => p.menuGroupId && Types.ObjectId.isValid(p.menuGroupId));
      if (validPrivileges.length > 0) {
        await RoleRepository.createRolePrivileges(validPrivileges as IRolePrivilge[]);
      }
    }

    return role;
  }

  async getAllTrashRoles(page: number = 1, limit: number = 10, filter?: string) {
    return await RoleRepository.getAllTrashRoles(page, limit, filter);
  }

  async restoreRole(id: string | Types.ObjectId): Promise<IRole | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await RoleRepository.restoreRole(id);
  }

  async deleteRolePermanently(id: string | Types.ObjectId): Promise<IRole | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await RoleRepository.deleteRolePermanently(id);
  }

  async createPrivilegeTable(): Promise<{ menupermissons: { name: string; id: string }[]; menu: any[] }> {
    const menuPermissions = await RoleRepository.getActiveMenuPermissions();
    const mainMenus = await RoleRepository.getActiveMainMenus();
    const submenuGroups = await RoleRepository.getSubmenuGroups();

    const menupermissons = menuPermissions.map(p => ({
      name: p.name,
      id: p._id.toString(),
    }));

    const menu = [];
    for (const mainMenu of mainMenus) {
      const mainEntry = {
        menu: mainMenu.name,
        slug: mainMenu.slug,
        submenus: [] as ISubmenuEntry[],
      };

      const submenus = await RoleRepository.getSubmenusByMainMenuId(mainMenu._id);

      for (const submenu of submenus) {
        const subEntry: ISubmenuEntry = {
          submenu: submenu.name,
          id: submenu._id.toString(),
          slug: submenu.slug,
          permisson: [],
        };

        const groups = submenuGroups
          .filter(g => g.submenuId && g.menuPermissionId && g.submenuId._id.toString() === submenu._id.toString())
          .map(g => ({
            menupermissonSlug: g.menuPermissionId?.slug ?? "",
            menupermissonId: g.menuPermissionId?._id?.toString() ?? "",
            menuGroupId: g._id.toString(),
          }));

        subEntry.permisson = groups;
        mainEntry.submenus.push(subEntry);
      }

      menu.push(mainEntry);
    }

    return { menupermissons, menu };
  }
}

export default new RoleService();
