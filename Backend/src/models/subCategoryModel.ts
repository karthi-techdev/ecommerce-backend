import {  Schema, Document, model , Types } from "mongoose";

export interface ISubCategory extends Document {
    name: string;
    slug: string;
    description: string;
    image: string;
    mainCategoryId: Types.ObjectId;
    isActive: boolean;
    isDeleted?: boolean;
    createdAt?: Date
}
const subCategorySchema = new Schema<ISubCategory>(
    {
        name: {type: String, required: true },
        slug: {type: String, required: true, unique: true},
        description: {type: String },
        image: {type: String },
        mainCategoryId: {type: Schema.Types.ObjectId,required: true},
        // ref: "maincategories", 
        isActive: {type: Boolean, default: true },
        isDeleted: {type:Boolean, default: false }
    },
    {timestamps: true}
)
export const SubCategoryModel = model<ISubCategory>("subcategories", subCategorySchema); 