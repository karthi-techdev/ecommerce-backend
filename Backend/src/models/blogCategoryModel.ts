import { Schema, Document, model } from "mongoose";

export interface IBlogCategory extends Document {
  name: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogCategoryModel = model<IBlogCategory>(
  "blog_categories", 
  blogCategorySchema
);