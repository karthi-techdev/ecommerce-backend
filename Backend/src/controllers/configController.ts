import { Request,Response,NextFunction } from 'express';
import configService from '../services/configService';
import { HTTP_RESPONSE } from '../utils/httpResponse';
import { ObjectId } from 'mongoose';

class configController{
    async createConfig(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
           const data=req.body;
        const config=await configService.createConfig(data);
        res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:config}) 
        } catch (err:any) {
            next(err);
        }
    }
    async getAllConfig(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const filter = req.query.status as string || undefined;

        const result = await configService.getAllConfig(page,limit,filter);

        res.status(200).json({
            status: HTTP_RESPONSE.SUCCESS,
            data: {
                data: result.data,
                total: result.total,
                totalPages: result.totalPages,
                page,
                limit
            }
        })
    } catch (err:any) {
        next(err)
    }
}

    async getConfigById(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {id}=req.params;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Config id is required"})
                return;
            }
            const config=await configService.getConfigById(id as string);
            if(!config){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Config not found"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:config});
        } catch (err:any) {
            next(err);
        }
    }
    async getConfigStats(req:Request,res:Response,next:NextFunction):Promise<void>{
            try {
                const config=await configService.getStats();
                res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:config});
            } catch (err:any) {
                next(err)
            }
        }
    async updateConfig(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {id}=req.params;
            const {options}=req.body;
           
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Config id is required"});
            }
            const config=await configService.updateConfig(id as string,{options});
             console.log(config,'options here')
            if(!config){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Config not foung"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:config,message:"Config is updated"});
        } catch (err:any) {
            next(err);
        }
    }
     async toggleStatus(req:Request,res:Response,next:NextFunction):Promise<void>{
            try {
                const id=req.params.id;
                if(!id){
                    res.status(400).json({status:HTTP_RESPONSE.FAIL,message:'Category id is required'});
                    return ;
                }
                const config=await configService.toggleStatus(id);
                if(!config){
                    res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Config not found"});
                    return;
                }
                res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Config status toggled successfully",data:config});
            } catch (err:any) {
                next(err);   
            }
        }
    async deleteConfig(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {id}=req.params;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Config id is required"});
                return;
            }
            const config=await configService.deleteConfig(id as string);
            if(!config){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Config is not found"});
                 return;   
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Config data deleted successfully"});
        } catch (err:any) {
            next(err)
        }
    }
}
export default new configController;