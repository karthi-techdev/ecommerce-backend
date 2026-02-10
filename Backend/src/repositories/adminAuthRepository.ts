import { Types } from "mongoose";
import { IAdmin, AdminModel } from "../models/adminAuthModel";
import { CommonRepository } from "./commonRepository";
import { sign, verify } from "jsonwebtoken";
import { StringValue } from "ms";

class AdminRepository {
  private commonRepository: CommonRepository<IAdmin>;

  constructor() {
    this.commonRepository = new CommonRepository(AdminModel);
  }

  async findEmail(email: string) {
    return await AdminModel.findOne({ email });
  }

  async lastLoggedIn(id: string) {
    return await AdminModel.findByIdAndUpdate(id, {
      lastLoginAt: Date.now(),
    });
  }

  private _generateToken(user: IAdmin): {
    token: string;
    data: Partial<IAdmin>;
    expiresIn: StringValue;
  } {
    const jwtSecret = process.env.JWT_SECRET || 'your-secure-jwt-secret-min-32-chars';
    const expiresIn: StringValue =
      (process.env.JWT_EXPIRE_TIME as StringValue) || "15m";

    const token = sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn }
    );

    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = userObj;

    return {
      token,
      data: safeUser,
      expiresIn,
    };
  }

  async refreshToken(token: string): Promise<{
    token: string;
    data: Partial<IAdmin>;
    expiresIn: StringValue;
  }> {
    const jwtSecret = process.env.JWT_SECRET || 'your-secure-jwt-secret-min-32-chars';
    if (!jwtSecret) throw new Error("JWT_SECRET not defined");

    let decoded: any;

    try {
      decoded = verify(token, jwtSecret);
    } catch (err) {
      console.log("VERIFY ERROR:", err);
      throw new Error("Invalid or expired token");
    }

    const userId = decoded._id;

    const user = await AdminModel.findById(userId);

    if (!user) throw new Error("User not found");

    return this._generateToken(user);
  }

  async getAdmin(
    id: string | Types.ObjectId
  ): Promise<IAdmin | null> {
    return await AdminModel.findById(id).select("-password");
  }
}

export default new AdminRepository();


