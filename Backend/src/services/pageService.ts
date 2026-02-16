// import PageRepository from "../repositories/pageRepository";
// import { CommonService } from "./commonService";
// import { Types } from "mongoose";
// import ValidationHelper from "../utils/validationHelper";
// import { IPage , PageModel } from "../models/pageModel";
// class PageService{
//     private commonService = new CommonService<IPage>(PageModel);
//     private ValidatePageData(data: Partial<IPage>, isUpdate: boolean = false): void {
//         const rules = [
//             !isUpdate ? ValidationHelper.isRequired(data.name, "name") : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name,"name") : null),
//             (data.name != undefined ? ValidationHelper.minLength(data.name, "name", 3) : null),

//             !isUpdate ? ValidationHelper.isRequired(data.slug,"slug") : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug,"slug") : null),

//             ValidationHelper.isValidEnum(data.type, "type", ["content", "url"]),
//             ValidationHelper.isBoolean(data.isActive, "isActive"),
//         ]
        
//         const errors = ValidationHelper.validate(rules);
//         if (errors.length > 0) {
//         throw new Error(errors.map(e => e.message).join(", "));
//         }
//     }

//     async createPages(data : IPage): Promise<IPage>{
//         this.ValidatePageData(data);
//         const { name , description } = data;
//         const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
//         const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
//         data.name = capitalizedName;
//         data.description = capitalizedDescription;
//         const exist = await PageRepository.existBySlug(data.slug);
//         if (exist) {
//             throw new Error(
//                 `Pages ${data.slug} already exists`
//             );
//         }
//         console.log("data")
//         return await PageRepository.createPages(data);
//     }

//     async getAllPages(page = 1 , limit = 10 , filter?: string) {
//         return await PageRepository.getAllPages(page , limit , filter)
//     }

//     async getPagesById(id: string | Types.ObjectId) : Promise<IPage | null>{
//         const error = ValidationHelper.isValidObjectId(id , "id");
//         if(error){
//             throw new Error(error.message);
//         }
//         return await PageRepository.getPagesById(id);
//     }

//     async updatePages(id: string | Types.ObjectId , data : Partial<IPage>) : Promise<IPage | null> {
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) {
//             throw new Error(error.message);
//         }
//         this.ValidatePageData(data , true);
//         return await PageRepository.updatePages(id , data);
//     }

//     async softDeletePages(id: string | Types.ObjectId): Promise<IPage | null>{
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) {
//             throw new Error(error.message);
//         }
//         return await PageRepository.softDeletePages(id);
//     } 

//     async toggleActive(id: string | Types.ObjectId): Promise<IPage | null> {
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) {
//             throw new Error(error.message);
//         }
//         return await PageRepository.toggleActive(id);
//     }

//     async existBySlug(slug: string , excludeId? : string | Types.ObjectId ) : Promise<boolean>{
//         return await PageRepository.existBySlug(slug , excludeId)
//     }

//     async restorePages(id: string | Types.ObjectId): Promise<IPage | null>{
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) {
//             throw new Error(error.message);
//         }
//         return await PageRepository.restorePages(id)
//     }

//     async getAllTrashPages(page = 1, limit = 10, filter?: string){
//         return await PageRepository.getAllTrashPages(page , limit , filter)
//     }

//     async deletePagesPermanently(id: string | Types.ObjectId): Promise<IPage | null> {
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) {
//             throw new Error(error.message);
//         }
//         return await PageRepository.deletePagesPermanently(id)
//     }
// }

// export default new PageService();

import PageRepository from "../repositories/pageRepository";
import ValidationHelper from "../utils/validationHelper";
import { IPage, PageModel } from "../models/pageModel";
import { Types } from "mongoose";
import { CommonService } from "./commonService";

class PageService {
  private commonService = new CommonService<IPage>(PageModel);
  private ValidatePageData(data: Partial<IPage>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate ? ValidationHelper.isRequired(data.name, "name") : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),
      (data.name !== undefined ? ValidationHelper.minLength(data.name, "name", 3) : null),
      !isUpdate ? ValidationHelper.isRequired(data.slug, "slug") : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),
      ValidationHelper.isValidEnum(data.type, "type", ["content", "url"]),
    ];

    const errors = ValidationHelper.validate(rules.filter(r => r !== null));
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createPages(data: IPage): Promise<IPage> {
    this.ValidatePageData(data);
    
    if (data.name) {
      data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    }
    if (data.description) {
      data.description = data.description.charAt(0).toUpperCase() + data.description.slice(1);
    }

    const exist = await PageRepository.existBySlug(data.slug);
    if (exist) {
      throw new Error(`Page with slug ${data.slug} already exists`);
    }
    return await PageRepository.createPages(data);
  }

  async updatePages(id: string | Types.ObjectId, data: Partial<IPage>): Promise<IPage | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    this.ValidatePageData(data, true);

    if (data.name) data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    if (data.description) data.description = data.description.charAt(0).toUpperCase() + data.description.slice(1);

    return await PageRepository.updatePages(id, data);
  }

  async getAllPages(page = 1, limit = 10, filter?: string) { 
    return await PageRepository.getAllPages(page, limit, filter); 
  }

  async getPagesById(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
        throw new Error(error.message);
    } 
    return await PageRepository.getPagesById(id); 
  }

  async softDeletePages(id: string | Types.ObjectId) { 
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
        throw new Error(error.message);
    } 
    return await PageRepository.softDeletePages(id); 
  }

  async toggleActive(id: string | Types.ObjectId) { 
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
        throw new Error(error.message);
    } 
    return await PageRepository.toggleActive(id); 
  }

  async existBySlug(slug: string, excludeId?: string | Types.ObjectId) { 
    return await PageRepository.existBySlug(slug, excludeId); 
  }

  async restorePages(id: string | Types.ObjectId) { 

    return await PageRepository.restorePages(id); 
  }

  async getAllTrashPages(page = 1, limit = 10, filter?: string) { 
    return await PageRepository.getAllTrashPages(page, limit, filter); 
  }

  async deletePagesPermanently(id: string | Types.ObjectId) { 
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
        throw new Error(error.message);
    } 
    return await PageRepository.deletePagesPermanently(id); 
  }
}

export default new PageService();