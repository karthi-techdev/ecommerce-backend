
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS_CODE, HTTP_RESPONSE } from "../utils/httpResponse";
import { UserModel } from "../models/userModel";
import { AdminModel } from "../models/adminAuthModel"; 
import { RoleModel } from "../models/roleModel";

interface DecodedToken extends JwtPayload {
  _id: string;
  id: string;
  email: string;
  role: string;
}

const excludedPaths: string[] = [
  'auth/login',
  'auth/forgotPassword',
  'auth/resetPassword',
  'faqs/check-duplicate'
];

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let apiPath = req.path
      .replace(/^\/+|\/+$/g, '')
      .replace(/^api\/v1\//, '');

    if (excludedPaths.includes(apiPath)) {
      return next();
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    let decoded: DecodedToken;

    try {
      const secret = process.env.JWT_SECRET || 'your-secure-jwt-secret-min-32-chars';
      decoded = jwt.verify(token, secret) as DecodedToken;
    } catch (error: any) {
      if (apiPath === 'auth/refresh') {
        decoded = jwt.decode(token) as DecodedToken;
        if (!decoded) {
          res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Invalid token format",
          });
          return;
        }
      } else {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Invalid or expired token",
        });
        return;
      }
    }

    const userId = decoded._id || decoded.id;
    let finalUser = null;
    let roleName = "unknown";

    // 4. STEP A: Check if the user is an ADMIN
    const admin = await AdminModel.findById(userId).lean();

    if (admin) {
      if (!admin.isActive) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Admin account is inactive",
        });
        return;
      }
      finalUser = admin;
      roleName = admin.role; 
    } 
    
    if (!finalUser) {
      const user: any = await UserModel.findOne({ _id: userId }).lean();

      if (user) {
        if (user.isDeleted) {
          res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Account has been deleted",
          });
          return;
        }

        if (user.status === "inactive") {
          res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Account is blocked",
          });
          return;
        }

        const roleDoc = await RoleModel.findById(user.roleId).select("name").lean();
        roleName = roleDoc?.name || "user";
        finalUser = user;
      }
    }

    if (!finalUser) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "User/Admin not found. Contact system administrator.",
      });
      return;
    }

    (req as any).user = {
      _id: finalUser._id.toString(),
      id: finalUser._id.toString(), 
      email: finalUser.email,
      role: roleName
    };

    next();
  } catch (error: any) {
    console.error('CRITICAL AUTH ERROR:', error.message);
    res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
      status: HTTP_RESPONSE.FAIL,
      message: "Authentication processing failed",
    });
  }
};