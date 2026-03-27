import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import adminAuthRepository from "../repositories/adminAuthRepository";
import { IAdmin, AdminModel } from "../models/adminAuthModel";
import newsLetterRepository from "../repositories/newsLetterRepository";
import ValidationHelper from "../utils/validationHelper";
import { Types } from "mongoose";
import { sendEmail } from '../utils/email';
import path from "path";
import fs from 'fs'
import crypto from 'crypto'
export class AdminAuthService {

  private readonly JWT_SECRET: Secret;
  private readonly JWT_ACCESS_EXPIRATION: SignOptions["expiresIn"];

  constructor() {

    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secure-jwt-secret-min-32-chars';
    this.JWT_ACCESS_EXPIRATION =
      (process.env.JWT_ACCESS_EXPIRATION as SignOptions["expiresIn"]) || "15m";
  }

  async login(email: string, password: string) {

    const admin = await adminAuthRepository.findEmail(email);

    if (!admin || !admin.isActive) {
      throw new Error("Invalid Email");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      throw new Error("Invalid Password");
    }

    const token = jwt.sign(
      { _id: admin._id, role: admin.role },
      this.JWT_SECRET,
      { expiresIn: this.JWT_ACCESS_EXPIRATION }
    );

    await adminAuthRepository.lastLoggedIn(admin._id as string);

    return {
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    };
  }

  async refreshAccessToken(token: string) {
    return await adminAuthRepository.refreshToken(token);
  }

  async getAdmin(id: string | Types.ObjectId): Promise<IAdmin | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await adminAuthRepository.getAdmin(id);
  }

  async changePassword(adminId: string | Types.ObjectId, payload: any) {
    const { currentPassword, newPassword, confirmPassword } = payload;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("Current, New, and Confirm passwords are required");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password do not match");
    }

    const admin = await AdminModel.findById(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      throw new Error("The current password you entered is incorrect");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    return { message: "Password updated successfully" };
  }
  async forgetPassword(email: string) {
    const error = ValidationHelper.isRequired(email, 'Email') || email.trim() !== '' ? ValidationHelper.isValidEmail(email, "Email") : null;
    if (error) {
      throw new Error(error.message);
    }
    const admin = await adminAuthRepository.findEmail(email);
    if (!admin) {
      throw new Error("Email not exist");
    }
    let htmlContent = "";
    let templatePath = "";
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await adminAuthRepository.saveResetToken(email, token, expires);

    const resetUrl = `${process.env.FRONTEND_URL ? process.env.FRONTEND_URL : 'http://localhost:3001'}/resetPassword?token=${token}`;
    const isNewsLetter = await newsLetterRepository.getNewsLetterBySlug('forgot-password');

    if (isNewsLetter && isNewsLetter.isPublished && !isNewsLetter.isDeleted && isNewsLetter.slug == "forgot-password") {
      templatePath = path.join(__dirname, '../templates/newsletters/forgot-password.html');
      htmlContent = fs.readFileSync(templatePath, 'utf-8');
      console.log("its here ")
    }
    else {
      templatePath = path.join(__dirname, '../templates/default/reset-password.html');
      htmlContent = fs.readFileSync(templatePath, 'utf-8');
    }
    htmlContent = htmlContent
      .replace('{{resetUrl}}', resetUrl)
      .replace('{{year}}', new Date().getFullYear().toString());
    return await sendEmail(email, "Reset your password", htmlContent);

  }
  async resetPassword(token: string, newPassword: string) {
    const tokenRequired = ValidationHelper.isRequired(token, "Reset Token");
    if (tokenRequired) throw new Error(tokenRequired.message);

    const tokenValid = ValidationHelper.isNonEmptyString(token, "Reset Token");
    if (tokenValid) throw new Error(tokenValid.message);

    const passwordRequired = ValidationHelper.isRequired(newPassword, "Password");
    if (passwordRequired) throw new Error(passwordRequired.message);

    const passwordLength = ValidationHelper.minLength(newPassword, "Password", 6);
    if (passwordLength) throw new Error(passwordLength.message);
    const admin = await adminAuthRepository.findResetToken(token);
    if (!admin) throw new Error('Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await adminAuthRepository.resetPassword(admin._id as string, hashedPassword);
  }
}

export const adminAuthService = new AdminAuthService();
