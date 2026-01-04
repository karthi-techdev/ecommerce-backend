import { Document, Schema, Types, model } from "mongoose";

export interface IPopulatedMenuPermission {
  _id: string; 
  name: string;
  slug: string;
}

export interface IPopulatedSubmenu {
  _id: string;
  name: string;
  slug: string;
  mainMenuId: Types.ObjectId;
}

export interface ILeanGroup {
  _id: string; 
  submenuId?: IPopulatedSubmenu | null; 
  menuPermissionId?: IPopulatedMenuPermission | null; 
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroup extends Document {
  submenuId: Types.ObjectId | IPopulatedSubmenu | null;
  menuPermissionId: Types.ObjectId | IPopulatedMenuPermission | null;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const menuGroupSchema = new Schema<IGroup>(
  {
    submenuId: { type: Schema.Types.ObjectId, ref: "Submenu", default: null },
    menuPermissionId: { type: Schema.Types.ObjectId, ref: "MenuPermission", default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const GroupModel = model<IGroup>("MenuGroup", menuGroupSchema);