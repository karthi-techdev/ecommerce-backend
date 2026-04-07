import { ICart,CartModel } from "../models/cartModel";
import { Types } from "mongoose";
class cartRepository{
    async addToCart(data:Partial<ICart>):Promise<ICart>{
        return await CartModel.create(data);
    }
    async getAllCart(id:string|Types.ObjectId):Promise<ICart[]|null>{
        return await CartModel.find({userId:id}).populate('userId').populate('productId').sort({createdAt:-1});
    }
    async getCart(userId:string|Types.ObjectId,productId:string|Types.ObjectId):Promise<ICart[]|null>{
        return await CartModel.find({userId,productId});
    }
    async updateCart(id:string|Types.ObjectId,data:Partial<ICart>):Promise<ICart|null>{
       return await CartModel.findByIdAndUpdate(id,data,{new:true}); 
    }
    async deleteCart(id:Types.ObjectId|string):Promise<ICart|null>{
        return await CartModel.findByIdAndDelete(id);
    }
    async getStats(id:Types.ObjectId|string){
        return await CartModel.find({userId:id}).countDocuments();
    }
    async clearCart(userId:string|Types.ObjectId){
        return await CartModel.deleteMany({userId})
    }
}
export default new cartRepository();