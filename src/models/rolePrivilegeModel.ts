import { Schema, model, Document, Types } from "mongoose";

export interface IRolePrivilge extends Document {
  roleId: Types.ObjectId;
  menuGroupId: Types.ObjectId;
  status: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const rolePrivilegeSchema = new Schema<IRolePrivilge>(
  {
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    menuGroupId: { type: Schema.Types.ObjectId, ref: "MenuGroup", required: true },
    status: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const RolePrivilgeModel = model<IRolePrivilge>("RolePrivilege", rolePrivilegeSchema);