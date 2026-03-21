import { Schema, model, Document } from "mongoose";

export interface ISettings extends Document {
  generalSettings: {
    siteName: string;
    siteDescription: string;
    address: string;
    phone: string;
    email: string;
    currency: string;
    workingHours: string;
  };
  branding: {
    adminLogo: string;
    siteLogo: string;
    favicon: string;
  };
  mailConfiguration: {
    mailHost: string;
    mailPort: number;
    mailUsername: string;
    mailPassword: string;
    mailEncryption: string;
    mailFromAddress: string;
    mailFromName: string;
  };
}

const settingsSchema = new Schema<ISettings>(
  {
    generalSettings: {
      siteName: { type: String, default: "My Website" },
      siteDescription: { type: String },
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      currency: { type: String, default: "$" },
      workingHours: { type: String },
    },
    branding: {
      adminLogo: { type: String },
      siteLogo: { type: String },
      favicon: { type: String },
    },
    mailConfiguration: {
      mailHost: { type: String },
      mailPort: { type: Number },
      mailUsername: { type: String },
      mailPassword: { type: String },
      mailEncryption: { type: String },
      mailFromAddress: { type: String },
      mailFromName: { type: String },
    },
  },
  { timestamps: true }
);

export const SettingsModel = model<ISettings>("Settings", settingsSchema);