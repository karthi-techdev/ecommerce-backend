import { IMainCategory } from "../models/mainCategoryModel";
import { IMainCategoryInput } from "../types/mainCategoryTypes";
import mainCategoryRepository from "../repositories/mainCategoryRepository";
import ValidationHelper from "../utils/validationHelper";
import { Types } from "mongoose";

class MainCategoryService {

  private validateCategory(data: Partial<IMainCategoryInput>, isUpdate = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.mainCategoryId, "mainCategoryId")
        : data.mainCategoryId !== undefined
          ? ValidationHelper.isNonEmptyString(data.mainCategoryId, "mainCategoryId")
          : null,

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

      data.isActive !== undefined
        ? ValidationHelper.isBoolean(data.isActive, "isActive")
        : null,

      data.isDeleted !== undefined
        ? ValidationHelper.isBoolean(data.isDeleted, "isDeleted")
        : null,
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createMainCategory(data: IMainCategoryInput): Promise<IMainCategory> {
    this.validateCategory(data);
    return await mainCategoryRepository.createMainCategory(data);
  }

  async getAllMainCategories(page = 1, limit = 10, filter?: string) {
    return await mainCategoryRepository.getAllMainCategories(page, limit, filter);
  }

  async getMainCategoryById(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await mainCategoryRepository.getMainCategoryById(id);
  }

  async updateMainCategory(id: string | Types.ObjectId, data: Partial<IMainCategoryInput>) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateCategory(data, true);
    return await mainCategoryRepository.updateMainCategory(id, data);
  }

  async softDeleteMainCategory(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await mainCategoryRepository.softDeleteMainCategory(id);
  }

  async getAllTrashMainCategories(page = 1, limit = 10, filter?: string) {
    return await mainCategoryRepository.getAllTrashMainCategories(page, limit, filter);
  }

  async restoreMainCategory(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await mainCategoryRepository.restoreMainCategory(id);
  }

  async deleteMainCategoryPermanently(id: string | Types.ObjectId) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await mainCategoryRepository.deleteMainCategoryPermanently(id);
  }
}

export default new MainCategoryService();
