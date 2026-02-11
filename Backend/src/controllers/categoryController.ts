import { NextFunction, Request, Response } from "express";
import categoryService from '../services/categoryServices';
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { ICategory } from "../models/categoryModel";
import { MainCategoryModel } from "../models/mainCategoryModel";
import { SubCategoryModel } from "../models/subCategoryModel";
class categoryController {
    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data=req.body;
            let image='';
            if(req.file){
                image=`/uploads/categories/${req.file.filename}`;
            }
            else{
    image = '/uploads/default/preview-image.jpg.jpeg';
}
            const payload = {
      ...req.body,
      image,
    };
      const category = await categoryService.createCategory(payload);
            res.status(200).json({ message: "Category created", data: category });
        } catch (err: any) {
            if (err.message && err.message.includes("already exists")) {
                res.status(409).json({ message: err.message });
                return;
            }
            next(err);
        }
    }
    
    async getCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filter=req.query.status as string|undefined;
            const result = await categoryService.getAllCategory(page, limit,filter);
            res.status(200).json({
                status: HTTP_RESPONSE.SUCCESS,
                data: {
                    data: result.data,
                    meta: {
                        total: result.meta.total,
                        active: result.meta.active,
                        inactive: result.meta.inactive,
                        totalPages: result.meta.totalPages,
                        page: result.meta.page,
                        limit: result.meta.limit
                    }
                }
            });
        } catch (err: any) {
            next(err);
        }
    }
    async getCategoryById(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Category id is required"});
            }
            const category=await categoryService.getCategoryById(id as string);
            if(!category){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Category not found"});
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:category});
        } catch (err:any) {
            next(err);
        }
    }
    async getCategoryStats(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const category=await categoryService.getStats();
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:category});
        } catch (err:any) {
            next(err)
        }
    }
    async getCategoryBySlug(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
           const slug=req.params.slug;
        if(!slug){
            res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Slug is required"});
            return;
        } 
        const category=await categoryService.getCategoryBySlug(slug);
        if(!category){
            res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Category not found"});
            return;
        }
        res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:category});
        } catch (err:any) {
            next(err);
        }
    }
    async checkSlugExist(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { slug, subCategoryId, _id } = req.body;
    if (!slug || !subCategoryId) {
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS
      });
      return;
    }

    const existingCategoryData: any =
      await categoryService.isExistSlug(slug, subCategoryId);

    if (
      existingCategoryData &&
      _id &&
      existingCategoryData._id.toString() !== _id.toString()
    ) {
      res.status(400).json({
        status: HTTP_RESPONSE.FAIL,
        code: 'SLUG_EXISTS',
        message: 'Name already exists'
      });
      return;
    }

    if (existingCategoryData && !_id) {
      res.status(400).json({
        status: HTTP_RESPONSE.FAIL,
        code: 'SLUG_EXISTS',
        message: 'Name already exists'
      });
      return;
    }

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS
    });
  } catch (err) {
    next(err);
  }
}

    async getMainCategory(req:Request,res:Response,next:NextFunction):Promise<void>{
        const mainCategory=await MainCategoryModel.find();
        res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:mainCategory});
    }
    async getSubCategory(req:Request,res:Response,next:NextFunction):Promise<void>{
         const  mainId = req.params.mainCategoryId;
         console.log(mainId)
    const subCategory = await SubCategoryModel.find({mainCategoryId:mainId
    })
    res.status(200).json({
      status: true,
      data: subCategory
    });
  } 

    async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Category Id is required" });
                return;
            }
            let payload=req.body;
            let image='';
            const existingCategoryData=await categoryService.getCategoryById(id);
            if(req.file){
             image=`/uploads/categories/${req.file.filename}`;
             payload={...req.body,image}
            }
            else if (existingCategoryData?.image) {
  payload.image = existingCategoryData.image;
}
else{
    payload.image = '/uploads/default/preview-image.jpg.jpeg';
}
            const category = await categoryService.updateCateory(id as string,payload);
            if (!category) {
                res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
                return;
            }
            res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Category updated", data: category });
        } catch (err: any) {
            next(err);
        }
    }
    async softDeleteCategory(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({statu:HTTP_RESPONSE.FAIL,message:"Category id required"})
                return;
            }
            const category=await categoryService.softDeleteCategory(id as string);
            if(!category){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Category not found"})
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Category deleted successfully",data:category});
        } catch (err:any) {
            next(err)
        }
    }
    async deletePermanantly(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
            if(!id){
                res.status(400).json({statu:HTTP_RESPONSE.FAIL,message:"Category id required"})
                return;
            }
            const category=await categoryService.permanantDeleteCategory(id as string);
            if(!category){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Category not found"})
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Category deleted permanantly",data:category});
        } catch (err:any) {
            next(err)
        }
    }
    async restoreCategory(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const id=req.params.id;
        if(!id){
            res.status(400).json({status:HTTP_RESPONSE.FAIL,message:"Category id is required"});
            return;
        }
        const category=await categoryService.restoreCategory(id as string);
        if(!category){
            res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Category is not found"});
            return
        }
        res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Category restored successfully",data:category});
        return;
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
            const category=await categoryService.toggleStatus(id);
            if(!category){
                res.status(404).json({status:HTTP_RESPONSE.FAIL,message:"Category not found"});
                return;
            }
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,message:"Category status toggled successfully",data:category});
        } catch (err:any) {
            next(err);   
        }
    }
    async getAllTrash(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const page=parseInt(req.query.page as string)||1;
            const limit=parseInt(req.query.limit as string)||10;
            const filter=req.query.status as string||undefined;
            const result=await categoryService.getTrashCategory(page,limit,filter);
            console.log(result)
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,
                data:{
                    data:result.data,
                    meta:{
                        total:result.meta.total,
                        active:result.meta.active,
                        inactive:result.meta.inactive,
                        totalPages:result.meta.totalPages,
                        page:page,
                        limit:limit
                    }
                }
            })
        } catch (err:any) {
            next(err);
        }
    }
}
export default new categoryController;