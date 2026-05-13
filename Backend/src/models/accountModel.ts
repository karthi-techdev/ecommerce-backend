
import mongoose, { Schema, Document } from "mongoose";

export interface Account extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const accountSchema = new Schema<Account>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model<Account>("Account", accountSchema);