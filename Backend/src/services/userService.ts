// src/services/userService.ts
import UserRepository from "../repositories/userRepository";
import newsLetterRepository from "../repositories/newsLetterRepository";
import { IUser, UserModel } from "../models/userModel";
import { RoleModel } from "../models/roleModel";
import { RolePrivilgeModel } from "../models/rolePrivilegeModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "./commonService";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/email";
import path from "path";
import fs from "fs";
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
  async userForgotPassword(email: string) {
  const error =
    ValidationHelper.isRequired(email, "Email") ||
    (email.trim() !== ""
      ? ValidationHelper.isValidEmail(email, "Email")
      : null);

  if (error) {
    throw new Error(error.message);
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new Error("Email not exist");
  }

  const MAX_ATTEMPTS = 5;
const ONE_HOUR = 60 * 60 * 1000;
const now = new Date();

const diff = user.resetAttemptTime
  ? now.getTime() -
    new Date(user.resetAttemptTime).getTime()
  : null;

if (diff && diff > ONE_HOUR) {
  user.resetAttempts = 0;
}

if (
  diff !== null &&
  diff < ONE_HOUR &&
  (user.resetAttempts || 0) >= MAX_ATTEMPTS
) {
  throw new Error(
    "You have reached the maximum number of reset email attempts. Please try again after 1 hour."
  );
}

user.resetAttempts =
  (user.resetAttempts || 0) + 1;

user.resetAttemptTime = now;

await user.save({ validateBeforeSave: false });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 2 * 60 * 1000); 

  await UserRepository.saveResetToken(email, token, expires);

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

  let htmlContent = "";
let templatePath = "";

const newsLetter = await newsLetterRepository.getNewsLetterBySlug('user-forgot-password');

if (
  newsLetter &&
  newsLetter.isPublished &&
  !newsLetter.isDeleted &&
  newsLetter.slug === "user-forgot-password"
) {
  templatePath = path.join(
    __dirname,
    "../templates/newsletters/user-forgot-password.html"
  );
} else {
  templatePath = path.join(
    __dirname,
    "../templates/default/user-reset-password.html"
  );
}

htmlContent = fs.readFileSync(templatePath, "utf-8");

htmlContent = htmlContent
  .replace("{{resetUrl}}", resetUrl)
  .replace("{{year}}", new Date().getFullYear().toString());

  return await sendEmail(email, "Reset your password", htmlContent);
}
async userResetPassword(token: string, newPassword: string) {

  const tokenRequired = ValidationHelper.isRequired(token, "Reset Token");
  if (tokenRequired) throw new Error(tokenRequired.message);

  const passwordRequired = ValidationHelper.isRequired(newPassword, "Password");
  if (passwordRequired) throw new Error(passwordRequired.message);

  const passwordLength = ValidationHelper.minLength(newPassword, "Password", 6);
  if (passwordLength) throw new Error(passwordLength.message);

  const existingUser = await UserModel.findOne({
    resetPasswordToken: token
  });
 const MAX_ATTEMPTS = 5;
const ONE_HOUR = 60 * 60 * 1000;

const now = new Date();

if (existingUser) {

  if (existingUser.resetAttemptTime) {

    const diff =
      now.getTime() -
      new Date(existingUser.resetAttemptTime).getTime();

    if (
      diff < ONE_HOUR &&
      (existingUser.resetAttempts || 0) >= MAX_ATTEMPTS
    ) {
      throw new Error(
       "You have reached the maximum number of reset attempts. Please try again after 1 hour."
      );
    }

    if (diff > ONE_HOUR) {
      existingUser.resetAttempts = 0;
    }

  }

  existingUser.resetAttempts =
    (existingUser.resetAttempts || 0) + 1;

  existingUser.resetAttemptTime = now;

  await existingUser.save({ validateBeforeSave: false });

}

  if (!existingUser) {
    throw new Error("Password already updated. Please login.");
  }
  if (
    !existingUser.resetPasswordExpires ||
    existingUser.resetPasswordExpires < new Date()
  ) {
    throw new Error("Reset link expired. Please request again.");
  }


  existingUser.password = newPassword;

  existingUser.resetPasswordToken = undefined;
  existingUser.resetPasswordExpires = undefined;

  await existingUser.save({ validateBeforeSave: false });

  return existingUser;
}
async validateResetToken(token: string) {
  const user = await UserModel.findOne({
    resetPasswordToken: token,
  });

  if (!user) {
    return { valid: false, message: "Password already updated" };
  }

  if (
    !user.resetPasswordExpires ||
    user.resetPasswordExpires < new Date()
  ) {
    return { valid: false, message: "Reset link expired" };
  }

  return { valid: true };
}



}

export default new UserService();