// middleware/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUS_CODE, HTTP_RESPONSE } from "../utils/httpResponse";
import { UserModel } from "../models/userModel";
import { RoleModel } from "../models/roleModel";

interface DecodedToken extends JwtPayload {
  _id: string;
  id: string;
  email: string;
  role: "super-admin" | "admin" | "user";
}

const excludedPaths: string[] = [
  'auth/login',
  'auth/forgotPassword',
  'auth/resetPassword'
];

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Request path:', req.path);
    console.log('Incoming headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);

    let apiPath = req.path
      .replace(/^\/+|\/+$/g, '')
      .replace(/^api\/v1\//, '');
    console.log('Normalized API Path:', apiPath);

    if (excludedPaths.includes(apiPath)) {
      console.log('Path excluded from auth:', apiPath);
      return next();
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('Missing or invalid bearer token:', authHeader);
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Bearer token missing",
      });
      return;
    }


    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (error: any) {
      console.error("JWT Verification Error:", error.message, error.stack);
      if (apiPath === 'auth/refresh') {
        // Allow expired token for refresh
        decoded = jwt.decode(token) as DecodedToken;
        if (!decoded) {
          res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
            status: HTTP_RESPONSE.FAIL,
            message: "Invalid token",
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

    console.log('Decoded token:', decoded);

    const userId = decoded._id || decoded.id;
    console.log('User ID from token:', userId);

    let user;
    try {
      user = await UserModel.findOne({ _id: userId })
        .select("_id roleId status isDeleted email")
        .lean();
      console.log('Found user:', user);
    } catch (dbErr: any) {
      console.error("Authentication Error:", dbErr.message, dbErr.stack);
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: HTTP_RESPONSE.FAIL,
        message: dbErr.message && dbErr.message.includes("connection")
          ? "Database connection failed"
          : "Database query failed",
      });
      return;
    }

    if (!user) {
      console.log('No user found for ID:', userId);
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: "User not found. Contact admin.",
      });
      return;
    }

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

    // Fetch role name
    const roleDoc = await RoleModel.findById(user.roleId).select("name").lean();
    const roleName = roleDoc?.name || "unknown";

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: roleName
    };

    next();
  } catch (error: any) {
    console.error('Authentication error:', error.message);
    res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
      status: HTTP_RESPONSE.FAIL,
      message: "Invalid or expired token",
    });
  }
};