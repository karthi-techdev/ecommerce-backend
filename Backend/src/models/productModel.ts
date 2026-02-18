import mongoose, { model, Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  brandId: Types.ObjectId;
  mainCategoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  categoryId: Types.ObjectId;
  status: 'active' | 'inactive';  
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {   
    name: { type: String, required: true, trim: true  },
    slug: { type: String ,required: true },
    description: { type: String, required: true, trim: true },
    images: [{ type: String, required: true }],
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0, required: true },
    brandId: {type: mongoose.Schema.Types.ObjectId,ref: "Brand",required: true},
    mainCategoryId: {type: mongoose.Schema.Types.ObjectId,ref: "MainCategory",required: true},
    subCategoryId: {type: mongoose.Schema.Types.ObjectId,ref: "subcategories"},
    categoryId: {type: mongoose.Schema.Types.ObjectId,ref: "category"},
    status: {type: String,enum: ['active', 'inactive'],default: 'active'},
    isDeleted: {type: Boolean,default: false}
  },
  {
    timestamps: true
  }
);

productSchema.index(
  { slug: 1, categoryId: 1 },
  { unique: true }
);

export const ProductModel = model<IProduct>('product', productSchema);
