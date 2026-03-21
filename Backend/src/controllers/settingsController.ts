import { Request, Response, NextFunction } from "express";
import settingsRepository from "../repositories/settingsRepository";
import { adminAuthService } from "../services/adminAuthService";
import { processUpload } from "../utils/fileUpload";

class SettingsController {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await settingsRepository.getSettings();
      res.status(200).json({ status: "success", data: settings || {} });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const data = { ...req.body };
      const adminId = (req as any).user?._id; 

      if (data.currentPassword || data.newPassword) {
        if (!adminId) throw new Error("Authentication required for security changes");
        await adminAuthService.changePassword(adminId, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        });
      }

      delete data.currentPassword;
      delete data.newPassword;
      delete data.confirmPassword;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files) {
        if (!data.branding) data.branding = {};
        const imageFields = ['siteLogo', 'adminLogo', 'favicon'];
        
        for (const field of imageFields) {
          if (files[field]) {
            const file = files[field][0];
            await processUpload(req as any, file); 
            data.branding[field] = file.path.replace(/\\/g, '/');
          }
        }
      }

      const settings = await settingsRepository.updateSettings(data);
      
      res.status(200).json({
        status: "success",
        message: "Settings updated successfully",
        data: settings,
      });
    } catch (error: any) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }
}

export default new SettingsController();