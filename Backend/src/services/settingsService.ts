import settingsRepository from "../repositories/settingsRepository";
import { ISettings } from "../models/settingsModel";

class SettingsService {

  private validateSettingsData(data: Partial<ISettings>) {

  if (
    data.generalSettings?.siteName !== undefined &&
    data.generalSettings.siteName.trim() === ""
  ) {
    throw new Error("siteName cannot be empty");
  }

  if (
    data.generalSettings?.email !== undefined &&
    data.generalSettings.email.trim() === ""
  ) {
    throw new Error("email cannot be empty");
  }

  if (
    data.mailConfiguration?.mailHost !== undefined &&
    data.mailConfiguration.mailHost.trim() === ""
  ) {
    throw new Error("mailHost cannot be empty");
  }

}

  // GET SETTINGS
  async getSettings(): Promise<ISettings | null> {

    return await settingsRepository.getSettings();

  }

  // UPDATE SETTINGS
  async updateSettings(data: Partial<ISettings>): Promise<ISettings | null> {

    this.validateSettingsData(data);

    return await settingsRepository.updateSettings(data);

  }

}

export default new SettingsService();