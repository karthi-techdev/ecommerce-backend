// controllers/authenticationController.ts
import { Request, Response, NextFunction } from "express";
import authenticationService from "../services/authenticationService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";
import {UserModel} from "../models/userModel";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

class AuthenticationController {
  public async authLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log('authLogin called with:', { email, path: req.originalUrl });

      const { token, data, expiresIn, menus } = await authenticationService.authLogin(req.body);
      console.log('authLogin response from service:', { token, data, expiresIn, menus });

      const csrfToken = (req as any).csrfToken?.() || 'dummy-csrf-token'; 

      const response = {
        status: HTTP_RESPONSE.SUCCESS,
        message: "Logged in successfully",
        token,
        data,
        expiresIn,
        menus,
        csrfToken,
      };
      console.log('Sending login response:', response);
      res.status(200).json(response);
    } catch (err: any) {
      console.error('authLogin error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Invalid credentials",
      });
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers["authorization"];
      console.log('refreshToken called with authHeader:', authHeader);
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "No Bearer Token",
        });
        return;
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Token not found",
        });
        return;
      }

      const { token: newToken, data, expiresIn, menus } = await authenticationService.refreshToken(token);
      console.log('refreshToken response from service:', { newToken, data, expiresIn, menus });

      const response = {
        status: HTTP_RESPONSE.SUCCESS,
        message: "Token refreshed successfully",
        token: newToken,
        data,
        expiresIn,
        menus,
      };
      console.log('Sending refresh response:', response);
      res.status(200).json(response);
    } catch (err: any) {
      console.error('refreshToken error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.FORBIDDEN).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Invalid or expired token",
      });
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      console.log('forgotPassword called with:', { email });
      if (!email) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Email is required",
        });
        return;
      }

      // Call the service which returns a boolean indicating if the email exists and email was sent
      const emailSent = await authenticationService.forgotPassword(email);
      console.log('forgotPassword completed for:', { email, emailSent });

      if (!emailSent) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "The email address does not exist in our records",
          emailSent: false
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Password reset email sent successfully",
        emailSent: true
      });
    } catch (err: any) {
      console.error('forgotPassword error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Failed to process request",
      });
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      console.log('resetPassword called with:', { token });
      if (!token || !password) {
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Token and password are required",
        });
        return;
      }

      await authenticationService.resetPassword(token, password);
      console.log('resetPassword completed');
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Password has been reset successfully",
      });
    } catch (err: any) {
      console.error('resetPassword error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Failed to reset password",
      });
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name } = req.body;
      const userId = req.user?.id;
      console.log('updateProfile called with:', { userId, email, name });

      if (!userId) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found",
        });
        return;
      }

      await authenticationService.updateProfile(userId, { email, name });
      console.log('updateProfile completed for:', { userId });
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Profile updated successfully",
        data: { email, name },
      });
    } catch (err: any) {
      console.error('updateProfile error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Failed to update profile",
      });
    }
  }

  public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user?.id;
      console.log('changePassword called with:', { userId });

      if (!userId) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found",
        });
        return;
      }

      await authenticationService.changePassword(userId, oldPassword, newPassword);
      console.log('changePassword completed for:', { userId });
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Password changed successfully",
      });
    } catch (err: any) {
      console.error('changePassword error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Failed to change password",
      });
    }
  }

  public async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('getCurrentUser called with user:', req.user);
      const userId = req.user?.id;

      if (!userId) {
        console.log('No user ID in request');
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found",
        });
        return;
      }

      const user = await UserModel.findOne({ _id: userId })
        .select("_id email role status name")
        .lean();
      console.log('Found user:', user);

      if (!user) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User not found",
        });
        return;
      }

      const csrfToken = (req as any).csrfToken?.() || 'dummy-csrf-token';
      console.log('getCurrentUser response:', { user, csrfToken });

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: user,
        csrfToken,
      });
    } catch (err: any) {
      console.error('getCurrentUser error:', err.message, err.stack);
      res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Failed to fetch user data",
      });
    }
  }
}

export default new AuthenticationController();