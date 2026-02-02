import { Schema, model, Document } from "mongoose";

export interface IMainCategory extends Document {
  mainCategoryId: string;
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
    mainCategoryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true }, 
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const MainCategoryModel = model<IMainCategory>(
  "MainCategory",
  mainCategorySchema,
  "main_categories" 
);
