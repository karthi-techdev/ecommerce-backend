import { Schema, model, Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true  },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BrandModel = model<IBrand>("Brand", brandSchema);
