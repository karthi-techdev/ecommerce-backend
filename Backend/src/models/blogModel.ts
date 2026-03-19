import { Schema, model, Document, Types } from "mongoose";

export interface IBlog extends Document {

  name: string;
  slug: string;
  description?: string;
  image?: string;

  categoryId: Types.ObjectId;

  isActive: boolean;
  isDeleted: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
{
  name: { type: String, required: true },

  slug: { type: String, required: true, unique: true },

  description: { type: String },

  image: { type: String },

  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "blog_categories",
    required: true
  },

  isActive: { type: Boolean, default: true },

  isDeleted: { type: Boolean, default: false }

},
{ timestamps: true }
);

export const BlogModel =
  model<IBlog>("Blog", blogSchema, "blogs");