import { IPage , PageModel } from "../models/pageModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class PageRepository{
    private commonRepository : CommonRepository<IPage>;
    constructor(){
        this.commonRepository = new CommonRepository(PageModel);
    }

    async createPages(data : IPage): Promise<IPage>{
        return await PageModel.create(data);
    }
    
    async getStats() {
        const total = await PageModel.countDocuments();
        const active = await PageModel.countDocuments({ isActive: true });
        const inactive = await PageModel.countDocuments({ isActive: false });
        return { total, active, inactive };
    }

    async getAllPages(page = 1, limit = 10, filter?: string){
        try {
            const query: any = {};
            if (filter === 'active') query.isActive = true;
            if (filter === 'inactive') query.isActive = false;
    
            const skip = (page - 1) * limit;
            const [data, stats] = await Promise.all([
            PageModel.find(query).sort({ createdAt : -1 }).skip(skip).limit(limit).exec(),
            this.getStats(),
           
            ]);
            const totalPages = Math.ceil(stats.total / limit) || 1;
            return {
                data,
                meta: {
                ...stats,
                totalPages,
                page,
                limit
                }
            };
        } catch (error) {
            console.error('Error in getAllPages:', error);
            throw error;
        }
    }

    async getPagesById(id: string | Types.ObjectId): Promise<IPage | null> {
        return await PageModel.findById(id);
    }

    async updatePages(id: string | Types.ObjectId , data : Partial<IPage>): Promise<IPage | null>{
        return await PageModel.findByIdAndUpdate(id , data , { new: true })
    }

    async deletePagesPermanently(id: string | Types.ObjectId): Promise<IPage | null>{
        return await PageModel.findByIdAndDelete(id)
    }

    async toggleActive(id: string | Types.ObjectId): Promise<IPage | null> {
        const Pages = await PageModel.findById(id);
        if(!Pages) return null;
        Pages.isActive = !Pages.isActive;
        return await Pages.save();
    }

    async softDeletePages(id: string | Types.ObjectId): Promise<IPage | null>{
        return await PageModel.findByIdAndUpdate( id , {isDeleted : true} , { new : true })
    }

    async restorePages(id: string | Types.ObjectId): Promise<IPage | null>{
        return await PageModel.findByIdAndUpdate( id , { isDeleted : false , isActive: true } , { new : true } )
    }

    async existBySlug(slug: string , excludeId? : string | Types.ObjectId ) : Promise<boolean>{
        const query : any = {
            slug: { $regex: new RegExp(`^${slug.trim()}$`, "i") },
            isDeleted: false,
        }

        if(excludeId && Types.ObjectId.isValid(excludeId)) {
            query._id = {
                $ne : typeof excludeId === 'string'
                ? new Types.ObjectId(excludeId)
                : excludeId,
            }
        }
        const count = await PageModel.countDocuments(query);
        return count > 0;
    }

    async getAllTrashPages(page = 1, limit = 10, filter?: string) {
        try {
          const query: any = { isDeleted: true };
          if (filter === 'active') query.status = 'active';
          if (filter === 'inactive') query.status = 'inactive';
    
          const skip = (page - 1) * limit;
          const [data, count, stats] = await Promise.all([
            PageModel.find(query).skip(skip).limit(limit).exec(),
            PageModel.countDocuments(query).exec(),
            this.commonRepository.getStats(),
          ]);
    
          const totalPages = Math.max(1, Math.ceil(count / limit));
          return {
            data,
            meta: {
              ...stats,
              total: count,
              totalPages,
              page,
              limit
            }
          };
        } catch (error) {
          console.error('Error in getAllTrashPages:', error);
          throw error;
        }
    }
}

export default new PageRepository();