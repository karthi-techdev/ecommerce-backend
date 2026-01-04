import { Schema, model, Document, Types } from "mongoose";

export interface IMenu extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const menuSchema = new Schema<IMenu>(
  {
    name: { type: String, required: true },    
    slug: { type: String, required: true },
    sortOrder: { type: Number, required: true, default: 0 },
    icon: { type: String, required: true },  
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MenuModel = model<IMenu>("Menu", menuSchema);