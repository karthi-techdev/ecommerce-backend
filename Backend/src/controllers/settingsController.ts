import { Request, Response, NextFunction } from "express";
import settingsService from "../services/settingsService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class SettingsController {

  // GET SETTINGS
  async getSettings(req: Request, res: Response, next: NextFunction) {

    try {

      const settings = await settingsService.getSettings();

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: settings
      });

    } catch (error) {
      next(error);
    }

  }

  // UPDATE SETTINGS
  async updateSettings(req: Request, res: Response, next: NextFunction) {

    try {

      const settings = await settingsService.updateSettings(req.body);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Settings updated successfully",
        data: settings
      });

    } catch (error) {
      next(error);
    }

  }

}

export default new SettingsController();