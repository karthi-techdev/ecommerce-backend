import {Schema,Document,model,Types} from 'mongoose';

export interface IConfig extends Document{
    name:string;
    slug:string;
    options:{
        _id: Types.ObjectId; 
        key:string,
        value:string
    }[];
     status:'active'|'inactive';
    createdAt:Date;
    updatedAt:Date;
}

const ConfigSchema=new Schema<IConfig>({
    name:{type:String,required:true},
    slug:{type:String,unique:true},
    options:[
        {key:{type:String},
    value:{type:String}}
    ],
    status:{type:String,enum:['active','inactive'],default:'active'},
},{
    timestamps:true
});

export const ConfigModel=model<IConfig>('config',ConfigSchema);