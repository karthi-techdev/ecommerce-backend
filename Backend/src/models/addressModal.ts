import { Schema, Document, model, Types } from "mongoose";

export interface IAddress extends Document {
  addressType: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  country: string;
  state?: string;
  city?: string;
  pincode: string;
  // userId?: Types.ObjectId; 
  isDefault?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    addressType: { type: String,}, 
    fullName: { type: String},
    phoneNumber: { type: String},
    streetAddress: { type: String},
    country: { type: String},
    state: { type: String },
    city: { type: String },
    pincode: { type: String },
    // userId: { type: Schema.Types.ObjectId, ref: "User" }, 
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AddressModel = model<IAddress>("addresses", addressSchema);