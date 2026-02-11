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




const categorySchema=new Schema<ICategory>({
    name:{type:String,required:true,trim:true},
    slug:{type:String,unique:true},
    description:{type:String,required:true,trim:true},
    image:{type:String},
    mainCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"MainCategory"},
    subCategoryId:{type:mongoose.Schema.Types.ObjectId,ref:"subcategories"},
    status:{type:String,enum:['active','inactive'],default:'active'},
    isDeleted:{type:Boolean,default:false}
},{
    timestamps:true
})
export const CategoryModel=model<ICategory>('category',categorySchema);