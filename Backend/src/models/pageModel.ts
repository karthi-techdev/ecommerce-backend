import mongoose, { model, Schema , Document } from "mongoose";

export interface IPage extends Document{
    name : string,
    slug : string,
    type : "content" | "url",
    description : string,
    url : string,
    isActive : boolean,
    createdAt : Date
}

const PageSchema = new Schema<IPage>(
    {
        name : { type : String , required : true },
        slug : { type : String , required : true , unique : true },
        type : { type : String , enum : ["content", "url"] , required : true },
        description : { type : String },
        url : { type : String },
        isActive : { type : Boolean , default : true }
    },
    {
        timestamps : { createdAt: true, updatedAt: true }
    }
);

export const PageModel = model<IPage>("pages",PageSchema);