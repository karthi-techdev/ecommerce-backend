import { CategoryModel,ICategory } from "../models/categoryModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class categoryRepository{
    private commonRepository:CommonRepository<ICategory>;
    constructor(){
        this.commonRepository=new CommonRepository(CategoryModel);
    }
    async createCategory(data:ICategory):Promise<ICategory>{
        return await CategoryModel.create(data);
    }
      async getAllCategory(page = 1, limit = 10, filter?: string) {
        try {
          const query: any = { isDeleted: false };
          if (filter === 'active') query.status = 'active';
          if (filter === 'inactive') query.status = 'inactive';
    
          const skip = (page - 1) * limit;
          const [data, stats,total] = await Promise.all([
            CategoryModel.find(query).skip(skip).limit(limit).populate('mainCategoryId','name').populate('subCategoryId','name').exec(),
            this.commonRepository.getStats(),CategoryModel.find({isDeleted:false}).countDocuments()
          ]);
    
          const totalPages = Math.ceil(stats.total / limit) || 1;
          return {
            data,
            meta: {
              ...stats,
              totalPages,
              page,
              limit,
              total
            }

          };
          
        } catch (error) {
          console.error('Error in getAllCategories:', error);
          throw error;
        }
      }
    async getCategoryById(id:string|Types.ObjectId):Promise<ICategory|null>{
      return await CategoryModel.findById(id);
    }
    async getCategoryBySlug(slug:string):Promise<ICategory|null>{
      return await CategoryModel.findOne({slug});
    }
    async getStats(){
      const total=await CategoryModel.find({isDeleted:false}).countDocuments();
      const active=await CategoryModel.find({isDeleted:false,status:'active'}).countDocuments();
      const inactive=await CategoryModel.find({isDeleted:false,status:'inactive'}).countDocuments();
      return {total,active,inactive};
    }
    async updateCategory(id:string|Types.ObjectId,data:Partial<ICategory>):Promise<ICategory|null>{
        return await CategoryModel.findByIdAndUpdate(id,data,{new:true})
    }
    async softDeleteCategory(id:string|Types.ObjectId):Promise<ICategory|null>{
        return await CategoryModel.findByIdAndUpdate(id,{isDeleted:true},{new:true})
    }
    async permanantDeleteCategory(id:string|Types.ObjectId):Promise<ICategory|null>{
        return await CategoryModel.findByIdAndDelete(id);
    }
    async restoreCategory(id:string|Types.ObjectId):Promise<ICategory|null>{
      return await CategoryModel.findByIdAndUpdate(id,{isDeleted:false},{new:true});
    }
    async toggleStatus(id:string):Promise<ICategory|null>{
      return await this.commonRepository.toggleStatus(id);
    }
    async isExistSlug(slug:string,subCategoryId:Types.ObjectId):Promise<ICategory|null>{
      return await CategoryModel.findOne({slug,subCategoryId});
    }
    async getTrashCategory(page=1,limit=10,filter?:string){
      try {
        const query:any={isDeleted:true,};
        if(filter==='active')query.status='active';
        if(filter==='inactive')query.status='inactive';
        const skip=(page-1)*limit;
        const [data,count,stats]=await Promise.all([
          CategoryModel.find(query).skip(skip).limit(limit).populate('mainCategoryId','name').populate('subCategoryId','name').exec(),
          CategoryModel.countDocuments(query).exec(),
          this.commonRepository.getStats(),
        ]);
        const totalPages=Math.max(1,Math.ceil(count/limit));
        return {
          data,meta:{
            ...stats,
            totalPages,
            page,limit
          }
        }
      } catch (error) {
        console.log("Error in getAllTrashCategories",error)
        throw error;
      }
    }
}

export default new categoryRepository;