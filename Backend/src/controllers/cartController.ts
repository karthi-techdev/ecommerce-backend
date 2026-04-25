import { Request,Response,NextFunction } from "express";
import cartService from '../services/cartService';
import { HTTP_RESPONSE } from "../utils/httpResponse";

class cartController{
    async addToCart(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data=req.body;
            const cartData=await cartService.addToCart(data);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Product added to cart",data:cartData});
        } catch (err:any) {
            next(err);
        }
    }
    async getAllCart(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            const cartData=await cartService.getAllCart(id);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:cartData});
        } catch (err:any) {
           next(err) 
        }
    }
    async deleteCart(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Cart id is required"});
            }
            const deleteCartData=await cartService.deleteCart(id);
            if(!deleteCartData){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Cart item not found"});
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Cart item removed"});
        } catch (err:any) {
            next(err);
        }
    }
    async getStats(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Cart id is required"});
            }
            const cartSize=await cartService.getStats(id);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,count:cartSize});
        } catch (err:any) {
           next(err); 
        }
    }
    async updateCart(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            const data=req.body
            const updateCart=await cartService.updateCart(id,data);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Cart item updates successfully"});
        } catch (err:any) {
            next(err)
        }
    }
}
export default  new cartController();