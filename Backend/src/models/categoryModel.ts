import mongoose, { model,Schema,Document } from "mongoose";

export interface ICategory extends Document{
    name:string;
    slug:string;
    description:string;
    image:string;
    mainCategoryId:Schema.Types.ObjectId;
    subCategoryId:Schema.Types.ObjectId;
    status:'active'|'inactive';
    isDeleted:boolean;
    createdAt:Date;
    updatedAt:Date;
}

const mainCategorySchema = new Schema({ name: { type: String, required: true,}, slug: { type: String, required: true, unique: true }, description: { type: String },image:{type:String} }, { timestamps: true });
 export const MainCategoryModel = model("mainCategory", mainCategorySchema);
const subCategorySchema = new Schema({ name: { type: String, required: true,}, slug: { type: String, required: true, unique: true }, description: { type: String },image:{type:String}, mainCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "mainCategory" } }, { timestamps: true });
 export const SubCategoryModel = model("subCategory", subCategorySchema);



const categorySchema=new Schema<ICategory>({
    name:{type:String,required:true,trim:true},
    slug:{type:String,unique:true},
    description:{type:String,required:true,trim:true},
    image:{type:String},
    mainCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"mainCategory"},
    subCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"subCategory"},
    status:{type:String,enum:['active','inactive'],default:'active'},
    isDeleted:{type:Boolean,default:false}
},{
    timestamps:true
})
export const CategoryModel=model<ICategory>('category',categorySchema);