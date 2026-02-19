import { Schema, model, Document } from "mongoose";

export interface IMainCategory extends Document {
  
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const mainCategorySchema = new Schema<IMainCategory>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "description is required"],
    },

    image: {
      type: String,
      required: [true, "image is required"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MainCategoryModel = model<IMainCategory>("MainCategory",mainCategorySchema, "main_categories");
