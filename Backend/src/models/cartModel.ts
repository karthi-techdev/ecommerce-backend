import mongoose, {model,Document,Schema} from 'mongoose';
import { IProduct } from './productModel';
export interface ICart extends Document{
    userId:Schema.Types.ObjectId;
    productId:Schema.Types.ObjectId| IProduct;
    quantity:number;
    color:string;
    size:string;
    price:number;
    createdAt:Date;
    updatedAt:Date;
}
const cartSchema=new Schema<ICart>({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
productId:{type:mongoose.Schema.Types.ObjectId,ref:'product',required:true},
quantity:{type:Number,required:true},
color:{type:String},
size:{type:String},
price:{type:Number,required:true}
},{
    timestamps:true
});
export const CartModel=model<ICart>('cart',cartSchema);