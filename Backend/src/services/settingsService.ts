import settingsRepository from "../repositories/settingsRepository";
import { ISettings } from "../models/settingsModel";
 
class SettingsService {
  async getSettings(): Promise<ISettings | null> {
    return await settingsRepository.getSettings();
  }

  async updateSettings(payload: any): Promise<ISettings | null> {
    if (payload.newPassword) {
      if (!payload.currentPassword) throw new Error("Current password is required");
      if (payload.newPassword !== payload.confirmPassword) throw new Error("Passwords do not match");
    }

    const dataToSave = { ...payload };
    delete dataToSave.currentPassword;
    delete dataToSave.newPassword;
    delete dataToSave.confirmPassword;

    return await settingsRepository.updateSettings(dataToSave);
  }
}

export default new SettingsService();