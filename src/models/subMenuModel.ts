import { Document, Schema, Types, model } from "mongoose";

export interface ISubmenu {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  path: string;
  mainMenuId: Types.ObjectId;
  sortOrder: number;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const submenuSchema = new Schema<ISubmenu>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    mainMenuId: { type: Schema.Types.ObjectId, ref: "Menu", required: true },
    sortOrder: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SubmenuModel = model<ISubmenu>("Submenu", submenuSchema);