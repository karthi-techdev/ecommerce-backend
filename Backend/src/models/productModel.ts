import mongoose, { model, Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  title: string;
  shortDescription?: string;
  longDescription?: string;
  sku?: string;
  colors?: string[];
  sizes?: string;
  highlights?: string;
  relatedTags?: string[]; 
  images: string[];
  thumbnail: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  brandId: Types.ObjectId;
  mainCategoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  categoryId: Types.ObjectId;
  status: 'active' | 'inactive';  
  isDeleted: boolean;
  isFeatured?: boolean;
  isPopular?: boolean;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const productSchema = new Schema<IProduct>(
  {   
    name: { type: String, required: true, trim: true  },
    slug: { type: String ,required: true },
    title: { type: String,required: true,minlength: 30,trim: true},
    shortDescription: {type: String,trim: true},
    longDescription: {type: String,trim: true},
    sku: {type: String},
    colors: {type: [String],default: []},
    sizes: {type: String},
    highlights: {type: String},
    relatedTags: { type: [String], default: [] },
    images: {type: [String],default: []},
    thumbnail: {type: String,required: true},
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    stockQuantity: { type: Number, default: 1, required: true },
    brandId: {type: mongoose.Schema.Types.ObjectId,ref: "Brand",required: true},
    mainCategoryId: {type: mongoose.Schema.Types.ObjectId,ref: "MainCategory",required: true},
    subCategoryId: {type: mongoose.Schema.Types.ObjectId,ref: "subcategories"},
    categoryId: {type: mongoose.Schema.Types.ObjectId,ref: "category"},
    status: {type: String,enum: ['active', 'inactive'],default: 'active'},
    isDeleted: {type: Boolean,default: false},
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    deletedAt: {type: Date,default: null}
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
