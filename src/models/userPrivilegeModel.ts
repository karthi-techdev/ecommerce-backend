import { Schema, model, Document, Types } from "mongoose";


export interface IUserPrivilge extends Document {
  userId: Types.ObjectId;
  menuGroupId: Types.ObjectId; 
  status:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userPrivilegeSchema = new Schema<IUserPrivilge>(
  {
    userId:{ type: Schema.Types.ObjectId, ref: "User", required: true },
    menuGroupId: { type:Schema.Types.ObjectId, ref: "Group", required: true },
    status: { type: Boolean, default: false },    
  },
  { timestamps: true }
);

export const RoleModel = model<IUserPrivilge>("UserPrivileges", userPrivilegeSchema);