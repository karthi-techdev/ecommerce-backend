import { Schema, model, Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status:'active'|'inactive';
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true},
    email: { type: String, required: true},
    phone: { type: String, required: true},
    subject: { type: String, required: true},
    message: { type: String, required: true},
    isDeleted: { type: Boolean, default: false},
    status: { type: String,  enum: ["active", "inactive"],  default: "active" },
  },
  { timestamps: true }
);

export const ContactModel = model<IContact>("Contact", contactSchema);