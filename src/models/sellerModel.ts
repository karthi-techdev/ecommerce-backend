import { Schema, model, Document } from "mongoose";
import mongoose from "mongoose";

export interface ISeller extends Document {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessType: "individual" | "company";
  gstNumber?: string;
  panNumber?: string;
  storeLogo?: string;
  storeBanner?: string;
  address: string;
  isVerified: boolean;
  status: "active" | "suspended" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

const SellerSchema = new Schema<ISeller>(
  {
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    businessType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },
    gstNumber: String,
    panNumber: String,
    storeLogo: String,
    storeBanner: String,
    address: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);


SellerSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    const { __v, ...rest } = ret; 
    return rest; 
  },
});


export default model<ISeller>("Seller", SellerSchema);
