import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import adminAuthRepository from "../repositories/adminAuthRepository";
import newsLetterRepository from "../repositories/newsLetterRepository";
import { IAdmin } from "../models/adminAuthModel";
import ValidationHelper from "../utils/validationHelper";
import { Types } from "mongoose";
import {sendEmail} from '../utils/email';
import path from "path";
import fs from 'fs'
export class AdminAuthService {

  private readonly JWT_SECRET: Secret ;
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

  async getAdmin(id: string | Types.ObjectId): Promise<IAdmin | null>{
        const error = ValidationHelper.isValidObjectId(id, "id");
        if (error) {
        throw new Error(error.message);
        }
        return await adminAuthRepository.getAdmin(id);
    }
    async forgetPassword(email:string){
      const error=ValidationHelper.isRequired(email,'Email')||email.trim()!==''?ValidationHelper.isValidEmail(email,"Email"):null;
      if(error){
        throw new Error(error.message);
      }
      const admin=await adminAuthRepository.findEmail(email);
      if(!admin){
        throw new Error("Email not exist");
      }
      let htmlContent="";
      let templatePath="";
      const isNewsLetter=await newsLetterRepository.getNewsLetterBySlug('forgot-password');
      if(isNewsLetter && isNewsLetter.isPublished && !isNewsLetter.isDeleted){
          templatePath=path.join(__dirname,'../templates/newsletters/forgot-password.html');
          htmlContent=fs.readFileSync(templatePath,'utf-8');
      }
      else{
        templatePath = path.join(__dirname, '../templates/default/reset-password.html');
    htmlContent = fs.readFileSync(templatePath, 'utf-8');
      }
      const sendMail=sendEmail(email,"Reset your password",htmlContent);
      return sendEmail;
    }
}

export const adminAuthService = new AdminAuthService();
 