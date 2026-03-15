import { SettingsModel, ISettings } from "../models/settingsModel";

class SettingsRepository {

  // GET SETTINGS
  async getSettings(): Promise<ISettings | null> {

    return await SettingsModel.findOne();

  }

  // UPDATE SETTINGS
  async updateSettings(data: Partial<ISettings>): Promise<ISettings | null> {

    return await SettingsModel.findOneAndUpdate( 
      {},      //find the first document in the collection
      data,    //new data you want to update.
      { new: true }  //Return the updated document.
    );

  }

}

export default new SettingsRepository();