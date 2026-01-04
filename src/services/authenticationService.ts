import authenticationRepository, { IAuthLoginInput } from "../repositories/authenticationRepository";
import ValidationHelper from "../utils/validationHelper";
import type { StringValue } from "ms";

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
}

interface IUser {
  _id: string;
  email: string;
  password?: string;
  name: string;
  roleId: string;
  rolePrivilegeIds?: string[];
  status: string;
  isDeleted: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
import { UserModel } from "../models/userModel";
import { CustomError } from "../utils/customError";
import { HTTP_STATUS_CODE } from "../utils/httpResponse";
import emailService from "../utils/emailConfig";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

class AuthenticationService {
  private validateLoginData(data: IAuthLoginInput): void {
    const rules = [
      ValidationHelper.isRequired(data.email, "email"),
      ValidationHelper.isValidEmail(data.email, "email"),
      ValidationHelper.isRequired(data.password, "password"),
      ValidationHelper.minLength(data.password, "password", 6),
      ValidationHelper.maxLength(data.password, "password", 100),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new CustomError(errors.map((e) => e.message).join(", "), HTTP_STATUS_CODE.BAD_REQUEST);
    }
  }

  private validatePasswordResetData(password: string): void {
    const rules = [
      ValidationHelper.isRequired(password, "password"),
      ValidationHelper.minLength(password, "password", 6),
      ValidationHelper.maxLength(password, "password", 100),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new CustomError(errors.map((e) => e.message).join(", "), HTTP_STATUS_CODE.BAD_REQUEST);
    }
  }

  async authLogin(data: IAuthLoginInput): Promise<{
    token: string;
    data: Partial<IUser>;
    expiresIn: StringValue;
    menus: IMenuItem[];
  }> {
    this.validateLoginData(data);
    return await authenticationRepository.authLogin(data);
  }

  async refreshToken(token: string): Promise<{
    token: string;
    data: Partial<IUser>;
    expiresIn: StringValue;
    menus: IMenuItem[];
  }> {
    return await authenticationRepository.refreshToken(token);
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email, isDeleted: false });
    if (!user) {
      return false;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Save reset token and expiry
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Send reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken);
      return true;
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      throw new CustomError('Error sending reset email', HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    this.validatePasswordResetData(newPassword);

    // Hash the token for comparison
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      isDeleted: false
    });

    if (!user) {
      throw new CustomError('Invalid or expired reset token', HTTP_STATUS_CODE.BAD_REQUEST);
    }

    // Let the mongoose pre-save hook handle password hashing
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async createOrUpdateUser(
    userId: string | null,
    data: {
      email: string;
      password?: string; // Make password optional for updates
      name: string;
      roleId: string;
      status: string;
      isDeleted: boolean;
      rolePrivilegeIds?: string[]; // Add optional rolePrivilegeIds
    }
  ) {
    if (userId) {
      return await authenticationRepository.updateUser(userId, data);
    } else {
      // Ensure password is provided for new users
      if (!data.password) {
        throw new CustomError("Password is required for creating a new user", HTTP_STATUS_CODE.BAD_REQUEST);
      }

      const createData = {
        email: data.email,
        password: data.password,
        name: data.name,
        roleId: data.roleId,
        status: data.status,
        isDeleted: data.isDeleted,
      };

      console.log('Creating user with data:', { ...createData, password: '***' });
      const user = await authenticationRepository.createUser(createData);

      // Send welcome email for new users
      try {
        await emailService.sendWelcomeEmail(data.email, data.email.split('@')[0]); // Using email username as name
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't throw error here as user creation was successful
      }

      return user;
    }
  }

  async getUserById(id: string) {
    return await authenticationRepository.getUserById(id);
  }

  async checkEmailExists(email: string, currentUserId?: string | null): Promise<boolean> {
    return await authenticationRepository.checkEmailExists(email, currentUserId);
  }

  async deleteUserPermanently(userId: string): Promise<void> {
    await authenticationRepository.deleteUserPermanently(userId);
  }

  async updateProfile(userId: string, data: { email: string; name: string }): Promise<void> {
    const { email, name } = data;
    // Validate email and name
    const rules = [
      ValidationHelper.isRequired(email, "email"),
      ValidationHelper.isValidEmail(email, "email"),
      ValidationHelper.isRequired(name, "name"),
      ValidationHelper.minLength(name, "name", 2),
      ValidationHelper.maxLength(name, "name", 50),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new CustomError(errors.map((e) => e.message).join(", "), HTTP_STATUS_CODE.BAD_REQUEST);
    }

    // Check if email exists for another user
    const emailExists = await this.checkEmailExists(email, userId);
    if (emailExists) {
      throw new CustomError("Email already exists", HTTP_STATUS_CODE.BAD_REQUEST);
    }

    // Update user with both email and name
    await UserModel.findByIdAndUpdate(userId, { email, name });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Validate password
    const rules = [
      ValidationHelper.isRequired(oldPassword, "current password"),
      ValidationHelper.isRequired(newPassword, "new password"),
      ValidationHelper.minLength(newPassword, "new password", 6),
      ValidationHelper.maxLength(newPassword, "new password", 100),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new CustomError(errors.map((e) => e.message).join(", "), HTTP_STATUS_CODE.BAD_REQUEST);
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new CustomError("User not found", HTTP_STATUS_CODE.NOT_FOUND);
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new CustomError("Current password is incorrect", HTTP_STATUS_CODE.BAD_REQUEST);
    }

    // Check if new password is same as old password
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      throw new CustomError("New password cannot be the same as your current password", HTTP_STATUS_CODE.BAD_REQUEST);
    }

    // Update password
    user.password = newPassword; // Password will be hashed by mongoose pre-save hook
    await user.save();
  }
}

export default new AuthenticationService();