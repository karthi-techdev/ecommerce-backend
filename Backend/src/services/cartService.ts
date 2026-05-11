import { ICart,CartModel } from '../models/cartModel';
import cartRepository from '../repositories/cartRepository';
import ValidationHelper from '../utils/validationHelper';
import { ObjectId, Types } from 'mongoose';
import { CommonRepository } from '../repositories/commonRepository';
import { CommonService } from './commonService';
import { IProduct } from '../models/productModel';
class cartService{
    private CommonService=new CommonService<ICart>(CartModel);
    private validateCartData(data:Partial<ICart>,isUpdate:boolean=false):void{
        const rules=[
             !isUpdate
      ? (ValidationHelper.isRequired(data.userId, "user Id")
      || (data.userId !== undefined ? ValidationHelper.isValidObjectId(data.userId, "user Id") : null)):null,
      !isUpdate?((ValidationHelper.isRequired(data.productId,'Product Id'))||(data.productId!==undefined?ValidationHelper.isValidObjectId(data.productId,'Product Id'):null)):null,
      !isUpdate?((ValidationHelper.isRequired(data.quantity,'Quantity'))||(data.quantity!==undefined?ValidationHelper.isNumber(data.quantity,'Quantity'):null)):null,
      !isUpdate?((ValidationHelper.isRequired(data.price,'Price'))||(data.price!==undefined?ValidationHelper.isNumber(data.price,'Price'):null)):null,
       !isUpdate?((data.color?.trim()!==undefined?ValidationHelper.isNonEmptyString(data.color,'color'):null)):null,
        !isUpdate?((data.size?.trim()!==undefined?ValidationHelper.isNonEmptyString(data.size,'size'):null)):null,
        ];
        const errors=ValidationHelper.validate(rules);
        if(errors.length>0){
                throw new Error(errors.map(e=>e.message).join(', '));
        }
    }
    async addToCart(data:Partial<ICart>){
        this.validateCartData(data);
        if(data.userId && data.productId){
        let isExistCartItem=await cartRepository.getCart(data.userId as any,data.productId as any);
            console.log(isExistCartItem,'in update mode ')
            if(isExistCartItem){
                let i=0;
                if(data.color)
                isExistCartItem=isExistCartItem.filter(item=>item.color==data.color);
            if(data.size)
                isExistCartItem=isExistCartItem.filter(item=>item.size==data.size);
                console.log(isExistCartItem,'check color');
         if (isExistCartItem.length === 1) {
  const existingItem = isExistCartItem[0];
  const product = existingItem.productId as IProduct;

  if (data.quantity && data.price) {
    const newQuantity = existingItem.quantity + data.quantity;
    if (product && newQuantity > product.stockQuantity) {
      throw new Error("Stock max reached!");
      return;
    }

    data.quantity = newQuantity;
    data.price = existingItem.price + data.price;
  }
  console.log(data, "present here")
  return await cartRepository.updateCart(existingItem._id as any, data);
}
            }
        }
         console.log(data, "new one here")
          return await cartRepository.addToCart(data);
    }
    async getAllCart(id:string|Types.ObjectId):Promise<ICart[]|null>{
        const isValidId=ValidationHelper.isValidObjectId(id,'id');
        if(isValidId){
            throw new Error(isValidId.message);
        }
        return await cartRepository.getAllCart(id);
    }
    async deleteCart(id:Types.ObjectId|string):Promise<ICart|null>{
        const isValidId=ValidationHelper.isValidObjectId(id,'id');
        if(isValidId){
            throw new Error(isValidId.message);
        }
        return await cartRepository.deleteCart(id);
    }
    async getStats(id:Types.ObjectId|string){
        const isValidId=ValidationHelper.isValidObjectId(id,'id');
        if(isValidId){
            throw new Error(isValidId.message);
        }
        return await cartRepository.getStats(id);
    }
    async updateCart(id:string|Types.ObjectId,data:Partial<ICart>){
        return await cartRepository.updateCart(id,data);
    }
}
export default new cartService();