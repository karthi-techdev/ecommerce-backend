import { Document, Schema, Types, model } from "mongoose";

export interface IMenuPermission extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const menuPermissionSchema = new Schema<IMenuPermission>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MenuPermissionModel = model<IMenuPermission>("MenuPermission", menuPermissionSchema);