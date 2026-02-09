import { Request, Response, NextFunction } from "express";
import { adminAuthService } from "../services/adminAuthService";
import { HTTP_STATUS_CODE, HTTP_RESPONSE } from "../utils/httpResponse";

class AdminAuthController {

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await adminAuthService.login(
        email,
        password
      );
      console.log(result," udhs")
      res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Login successful",
        data: result,
      });

    } catch (error: any) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_RESPONSE.FAIL,
        message: error.message,
      });
      next(error);
    }
  }

  async logout(req: Request, res: Response) {
      res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS , message: "Logged out successfully. Please clear your token." });
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const id = req.params.id;
          if (!id) {
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ status: HTTP_RESPONSE.FAIL, message: "Admin id is required" });
            return;
          }
          const admin = await adminAuthService.getAdmin(id);
          if (!admin) {
            res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ status: HTTP_RESPONSE.FAIL, message: "Admin not found" });
            return;
          }
          res.status(HTTP_STATUS_CODE.OK).json({ status: HTTP_RESPONSE.SUCCESS, data: admin });
        } catch (err: any) {
          next(err);
        }
      }

  async refresh(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "No Bearer Token",
        });
      }

      const token = authHeader.split(" ")[1];

      const { token: newToken, data, expiresIn } =
        await adminAuthService.refreshAccessToken(token);

      res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Token refreshed successfully",
        token: newToken,
        data,
        expiresIn,
      });

    } catch (err: any) {
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Invalid or expired token",
      });
    }
  }
}

export default new AdminAuthController(); 
