import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

const usersSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

  // ✅ ADD THESE
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
});

const usersModel = mongoose.model<IUser>("Users", usersSchema);

export default usersModel;