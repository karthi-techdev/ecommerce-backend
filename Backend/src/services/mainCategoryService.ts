import { IMainCategory } from "../models/mainCategoryModel";
import { IMainCategoryInput } from "../types/mainCategoryTypes";
import mainCategoryRepository from "../repositories/mainCategoryRepository";
import ValidationHelper from "../utils/validationHelper";
import {CustomError} from "../utils/customError";
import { Types } from "mongoose";

class MainCategoryService {

  private validateCategory(
    data: Partial<IMainCategoryInput>,
    isUpdate = false
  ): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : data.name !== undefined
        ? ValidationHelper.isNonEmptyString(data.name, "name")
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : data.slug !== undefined
        ? ValidationHelper.isNonEmptyString(data.slug, "slug")
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.description, "description")
        : data.description !== undefined
        ? ValidationHelper.isNonEmptyString(data.description, "description")
        : null,
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new CustomError(errors[0].message, 400);
    }
  }
  async checkCategoryNameExists(name: string, id?: string) {
  const category = await mainCategoryRepository.checkNameExists(name, id);
  return !!category;
}

  async createMainCategory(
    data: IMainCategoryInput
  ): Promise<IMainCategory> {
    this.validateCategory(data);

    
    const existingSlug = await mainCategoryRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new CustomError("Data already exists", 409);
    }

    return await mainCategoryRepository.createMainCategory({
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      isActive: data.isActive,
    });
  }

  async getAllMainCategories(
    page = 1,
    limit = 10,
    filter?: string
  ) {
    return await mainCategoryRepository.getAllMainCategories(
      page,
      limit,
      filter
    );
  }

  async getMainCategoryById(id: string | Types.ObjectId) {
    ValidationHelper.isValidObjectId(id, "id");
    return await mainCategoryRepository.getMainCategoryById(id);
  }

 
  async updateMainCategory(
    id: string | Types.ObjectId,
    data: Partial<IMainCategoryInput>
  ) {
    ValidationHelper.isValidObjectId(id, "id");
    this.validateCategory(data, true);

        if (data.name) {
          const nameExists = await mainCategoryRepository.findByName(data.name);
          if (nameExists) {
            throw new CustomError("Name already exists", 409);
          }
        }

    if (data.slug) {
      const slugExists =
        await mainCategoryRepository.findBySlugExceptId(data.slug, id);
      if (slugExists) {
        throw new CustomError("Data already exists", 409);
      }
    }

    return await mainCategoryRepository.updateMainCategory(id, data);
  }


  async softDeleteMainCategory(id: string | Types.ObjectId) {
    ValidationHelper.isValidObjectId(id, "id");
    return await mainCategoryRepository.softDeleteMainCategory(id);
  }


  async getAllTrashMainCategories(
    page = 1,
    limit = 10,
    filter?: string
  ) {
    return await mainCategoryRepository.getAllTrashMainCategories(
      page,
      limit,
      filter
    );
  }

 
 async restoreMainCategory(id: string) {
  ValidationHelper.isValidObjectId(id, "id");
  return await mainCategoryRepository.restoreMainCategory(id);
}



  async deleteMainCategoryPermanently(
    id: string | Types.ObjectId
  ) {
    ValidationHelper.isValidObjectId(id, "id");
    return await mainCategoryRepository.deleteMainCategoryPermanently(id);
  }

  async toggleMainCategoryStatus(id: string | Types.ObjectId) {
    ValidationHelper.isValidObjectId(id, "id");
    return await mainCategoryRepository.toggleStatus(id);
  }

}

export default new MainCategoryService();
