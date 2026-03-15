import {Schema,model,Document} from "mongoose";
export interface ISLider extends Document{
    title:string;
    image:string;
    highlightsText:string;
    serialNumber:number;
    buttonName:string;
    buttonUrl:string;
    status:'active'|'inactive';
    createdAt:Date;
    updatedAt:Date;
}

const SliderSchema=new Schema<ISLider>({
    title:{type:String,trim:true},
    image:{type:String,trim:true},
    highlightsText:{type:String,trim:true},
    serialNumber:{type:Number,unique:true,trim:true},
    buttonName:{type:String,trim:true},
    buttonUrl:{type:String,trim:true},
    status:{type:String,enum:['active','inactive'],default:'active'}
},{timestamps:true}) 

export const SliderModel=model<ISLider>('slider',SliderSchema);