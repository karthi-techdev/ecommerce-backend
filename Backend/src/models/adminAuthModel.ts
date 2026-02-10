import { Schema , Document , model } from "mongoose";

export interface IAdmin extends Document {
    name : string,
    email : string,
    password : string,
    role : string,
    isActive : boolean,
    lastLoginAt : Date,
    createdAt : Date
} 

const AdminSchema = new Schema<IAdmin>(
    {
        name : { type : String , required : true },
        email : { type : String , required : true , lowercase : true },
        password : { type : String , required : true },
        role : { type : String , default: "SuperAdmin" },
        isActive : { type : Boolean },
        lastLoginAt : { type : Date }
    },
    {
        timestamps : true
    }
)

export const AdminModel = model<IAdmin>("admins",AdminSchema);