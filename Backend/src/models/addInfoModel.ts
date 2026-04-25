import { Schema, model, Document } from "mongoose";

export interface IAddInfo extends Document {
  key: string;
  value: string;
  isDeleted?: boolean;
   isActive?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}

const addInfoSchema = new Schema<IAddInfo>(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { 
    timestamps: true 
  }
);

export const AddInfoModel = model<IAddInfo>("AddInfo", addInfoSchema);