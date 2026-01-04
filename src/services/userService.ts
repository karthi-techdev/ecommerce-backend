// src/services/userService.ts
import UserRepository from "../repositories/userRepository";
import { IUser, UserModel } from "../models/userModel";
import { RoleModel } from "../models/roleModel";
import { RolePrivilgeModel } from "../models/rolePrivilegeModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "./commonService";

class UserService {
  private commonService = new CommonService<IUser>(UserModel);

  private validateUserData(
  data: Partial<IUser>,
  isUpdate: boolean = false
): void {
  const rules = [
    !isUpdate
      ? ValidationHelper.isRequired(data.username, "username")
      : data.username !== undefined
        ? ValidationHelper.isNonEmptyString(data.username, "username")
        : null,
    data.username !== undefined
      ? ValidationHelper.maxLength(data.username, "username", 100)
      : null,
    data.email !== undefined && data.email
      ? ValidationHelper.isValidEmail(data.email, "email")
      : null,

    data.userType !== undefined && data.userType
      ? ValidationHelper.isNonEmptyString(data.userType, "userType")
      : null,

    ValidationHelper.isValidEnum(data.status, "status", [
      "active",
      "inactive",
    ]),
    ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
  ];

  const errors = ValidationHelper.validate(rules);
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }
}


  async createUser(data: Partial<IUser>): Promise<IUser> {
    this.validateUserData(data);

    if (data.username) {
      const exists = await this.commonService.existsByField(
        "username",
        data.username
      );
      if (exists) throw new Error("User with this username already exists");
    }

    if (data.email) {
      const exists = await this.commonService.existsByField(
        "email",
        data.email
      );
      if (exists) throw new Error("Email already exists");
    }

    if (!data.role) throw new Error("role (slug) is required");
    const roleDoc = await RoleModel.findOne({
      slug: data.role,
      status: "active",
      isDeleted: false,
    }).lean();
    if (!roleDoc) throw new Error(`Role with slug '${data.role}' not found`);
    const rolePrivileges = await RolePrivilgeModel.find({
      roleId: roleDoc._id,
      status: true,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    const rolePrivilegeIds: Types.ObjectId[] = rolePrivileges.map(
      (p) => new Types.ObjectId(p._id.toString())
    );
    const payload: Partial<IUser> = {
      email: data.email?.toLowerCase().trim(),
      password: data.password,
      username: data.username?.trim(),
      role: data.role, 
      phone: data.phone?.trim(),
      userType: data.userType,
      status: data.status ?? "active",
      isDeleted: false,
      roleId: roleDoc._id,
      rolePrivilegeIds,
    };

    return await UserRepository.createUser(payload as IUser);
  }


  async getAllUsers(page = 1, limit = 10, filter?: string) {
    return await UserRepository.getAllUsers(page, limit, filter);
  }
  async getAllTrashUsers(page = 1, limit = 10, filter?: string) {
    return await UserRepository.getAllTrashUsers(page, limit, filter);
  }
  async getUserById(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await UserRepository.getUserById(id);
  }
  async updateUser(id: string | Types.ObjectId, data: Partial<IUser>) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    this.validateUserData(data, true);
    return await UserRepository.updateUser(id, data);
  }
  async softDeleteUser(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await UserRepository.softDeleteUser(id);
  }
  async toggleStatus(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await UserRepository.toggleStatus(id);
  }
  async restoreUser(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await UserRepository.restoreUser(id);
  }
  async deleteUserPermanently(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);
    return await UserRepository.deleteUserPermanently(id);
  }
}

export default new UserService();