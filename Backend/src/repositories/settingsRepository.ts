import { SettingsModel, ISettings } from "../models/settingsModel";

class SettingsRepository {
  private flattenObject(obj: any, prefix = "") {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + "." : "";
      if (
        typeof obj[k] === "object" && 
        obj[k] !== null && 
        !Array.isArray(obj[k]) &&
        !(obj[k] instanceof Date)
      ) {
        Object.assign(acc, this.flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  }

  async getSettings(): Promise<ISettings | null> {
    return await SettingsModel.findOne();
  }

  async updateSettings(data: any): Promise<ISettings | null> {
    const flattenedData = this.flattenObject(data);
    return await SettingsModel.findOneAndUpdate(
      {},
      { $set: flattenedData },
      { new: true, upsert: true, runValidators: true }
    );
  }
}

export default new SettingsRepository();