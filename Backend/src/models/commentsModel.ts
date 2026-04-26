import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  comment: string;
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  email: string;
  website?: string;
  image?: string;
  rating: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    comment: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
    image: { type: String }, 
    rating: { type: Number, min: 1, max: 5, required: true },
    
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const CommentModel = model<IComment>("Comment", commentSchema);