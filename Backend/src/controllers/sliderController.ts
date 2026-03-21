import { Request,Response,NextFunction } from "express";
import sliderService from '../services/sliderService';
import { HTTP_RESPONSE } from "../utils/httpResponse";

class sliderController{
    async createSlider(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data=req.body;
            if(req.file){
                data.image=`/uploads/sliders/${req.file.filename}`;
            }
            const slider=await sliderService.createSlider(data);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:slider});
        } catch (err:any) {
            if(err.message && err.message.includes("already exists")){
                res.status(409).json({message:err.message})
            }
            next(err);
        }
    }
    async getAllSlider(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const page=parseInt(req.query.page as string)||1;
            const limit=parseInt(req.query.limit as string)||10;
            const filter=req.query.status as string||undefined;
            const sliders=await sliderService.getAllSlider(page,limit,filter);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,
                data:{
                    data:sliders.data,
                    meta:{
                        total:sliders.meta.total,
                        totalPages:sliders.meta.totalPages,
                        page:sliders.meta.page,
                        limit:sliders.meta.limit
                    }
                }
            })
        } catch (err:any) {
            next(err);
        }
    }
    async getSliderById(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"ID is required"});
                return;
            }
            const slider=await sliderService.getSliderById(id);
            if(!slider){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Slider not found"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:slider});
        } catch (err:any) {
            next(err);
        }
    }
     async getSliderStats(req:Request,res:Response,next:NextFunction):Promise<void>{
            try {
                const slider=await sliderService.getStats();
                res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:slider});
            } catch (err:any) {
                next(err)
            }
        }
    async updateSlider(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"ID is required"});
                return;
            }
            const data=req.body;
            if(req.file){
                data.image=`/uploads/sliders/${req.file.filename}`;
            }
            const slider=await sliderService.updateSlider(id,data);
            if(!slider){
                 res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Slider not found"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:slider})
        } catch (err:any) {
            next(err);
        }
    }
    async deleteSlider(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                 res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"ID is required"});
                return;
            }
            const slider=await sliderService.deleteSlider(id);
            if(!slider){
                 res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Slider not found"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Slider deleted successfully"});
        } catch (err:any) {
            next(err);
        }
    }
    async toggleStatus(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                 res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"ID is required"});
                return;
            }
            const slider=await sliderService.toggleStatus(id);
            if(!slider){
                 res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Slider not found"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Slider status toggled successfully",data:slider});
        } catch (err:any) {
            next(err);
        }
    }
}
export default new sliderController;