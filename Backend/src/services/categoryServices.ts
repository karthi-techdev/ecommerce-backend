import { ICategory,CategoryModel } from '../models/categoryModel';
import ValidationHelper from '../utils/validationHelper';
import { Types } from 'mongoose';
import { CommonService } from './commonService';
import categoryRepository from '../repositories/categoryRepository';

class categoryService {
  private commonService = new CommonService<ICategory>(CategoryModel);
 private validateCategoryData(data: Partial<ICategory>, isUpdate: boolean = false): void {
  const rules = [
  !isUpdate
  ? (
      ValidationHelper.isRequired(data.name, 'name')
      ||(data.name !== undefined? ValidationHelper.isNonEmptyString(data.name?.trim(), 'name'):null)
      ||( data.name !== undefined?ValidationHelper.minLength(data.name.trim(), 'name', 5):null)
      || (data.name !== undefined?ValidationHelper.maxLength(data.name.trim(), 'name', 300):null)
    )
  : null,
  !isUpdate
  ? (
      ValidationHelper.isRequired(data.description, 'description')
      ||(data.description !== undefined? ValidationHelper.isNonEmptyString(data.description?.trim(), 'description'):null)
      ||( data.description !== undefined?ValidationHelper.minLength(data.description.trim(), 'description', 5):null)
      || (data.description !== undefined?ValidationHelper.maxLength(data.description.trim(), 'description', 2000):null)
    )
  : null,
    ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),
    !isUpdate
      ?( ValidationHelper.isRequired(data.mainCategoryId, "mainCategoryId")
      || (data.mainCategoryId !== undefined ? ValidationHelper.isValidObjectId(data.mainCategoryId, "mainCategoryId") : null)):null,
    !isUpdate
      ? (ValidationHelper.isRequired(data.subCategoryId, "subCategoryId")
      || (data.subCategoryId !== undefined ? ValidationHelper.isValidObjectId(data.subCategoryId, "subCategoryId") : null)):null,
    ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
  ];

  const errors = ValidationHelper.validate(rules);
  console.log(errors)
  if (errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(", "));
  }
}
  async validateSlug(name:string){
   const regex=/^[a-z0-9]+(-[a-z0-9]+)*$/
   return regex.test(name);
  }
  async slugGenerete(name: string) {
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").trim().toLowerCase().replace(/\s+/g, "-");
  }
  async createCategory(data: ICategory) {
    this.validateCategoryData(data);
    if(!await this.validateSlug(data.slug)){
      throw new Error('Invalid slug');
    }
    data.name=data.name[0].toUpperCase()+data.name.slice(1);
    data.description=data.description[0].toUpperCase()+data.description.slice(1);
     return await categoryRepository.createCategory(data);
  }
  async getAllCategory(page = 1, limit = 10,filter?:string) {
    return await categoryRepository.getAllCategory(page, limit,filter);
  }
  async getCategoryById(id: string | Types.ObjectId): Promise<ICategory | null> {
   const isCategory= await categoryRepository.getCategoryById(id);
   if(isCategory?.isDeleted){
    return null;
   }
    return isCategory;
  }
  async getCategoryBySlug(slug:string):Promise<ICategory|null>{
    return await categoryRepository.getCategoryBySlug(slug);
  }
  async getStats(){
    return await categoryRepository.getStats();
  }
  async updateCateory(id: string | Types.ObjectId, data: Partial<ICategory>): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    if(data.image){
      console.log(data.image)
    }
    if(data.name){
      data.name=data.name[0].toUpperCase()+data.name.slice(1);
    }
    if(data.description){
      data.description=data.description[0].toUpperCase()+data.description.slice(1)
    }
    if (data.slug) {
      if(!await this.validateSlug(data.slug)){
        throw new Error("Invalid slug")
      }
    }
    this.validateCategoryData(data, true);
    return await categoryRepository.updateCategory(id, data);
  }
  async softDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.softDeleteCategory(id);
  }
  async permanantDeleteCategory(id: string | Types.ObjectId): Promise<ICategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await categoryRepository.permanantDeleteCategory(id);
  }
  async restoreCategory(id:string|Types.ObjectId):Promise<ICategory|null>{
    return await categoryRepository.restoreCategory(id);
  }
  async getTrashCategory(page=1,limit=10,filter?:string){
    return await categoryRepository.getTrashCategory(page,limit,filter);
  }
  async toggleStatus(id:string):Promise<ICategory|null>{
    return  await categoryRepository.toggleStatus(id);
  }
  async isExistSlug(slug:string,subCategoryId:Types.ObjectId):Promise<ICategory|null>{
    return await categoryRepository.isExistSlug(slug,subCategoryId);
  }
}
export default new categoryService;