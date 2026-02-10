import subCategoryRepository from "../repositories/subCategoryRepository";
import { ISubCategory } from "../models/subCategoryModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { SubCategoryModel } from "../models/subCategoryModel";
import { CommonService } from "./commonService";

class SubCategoryService {
  private commonService = new CommonService<ISubCategory>(SubCategoryModel);

  private validateSubCategoryData( data: Partial<ISubCategory>, isUpdate: boolean = false
  ): void {
    const rules = [
      
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined
            ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined
        ? ValidationHelper.minLength(data.name, "name", 3): null),

      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined
            ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      !isUpdate
        ? ValidationHelper.isRequired(data.mainCategoryId, "mainCategoryId")
        : (data.mainCategoryId !== undefined
            ? ValidationHelper.isValidObjectId(data.mainCategoryId, "mainCategoryId") : null),

      ValidationHelper.isBoolean(data.isActive, "isActive"),
      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

    async createSubCategory(data: ISubCategory): Promise<ISubCategory> {
    this.validateSubCategoryData(data);
    const { name , description } = data;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
    data.name = capitalizedName;
    data.description = capitalizedDescription;
    const exists = await subCategoryRepository.existsBySlug(
      data.slug,
      data.mainCategoryId.toString()
    );

    if (exists) {
      throw new Error(
        `Subcategory ${data.slug} already exists under this main category`
      );
    }

  return await subCategoryRepository.createSubCategory(data);
}


  async getAllSubCategories(
    page = 1,
    limit = 10,
    filter?: string,
    mainCategoryId?: string
  ) {
    return await subCategoryRepository.getAllSubCategories(
      page,
      limit,
      filter,
      mainCategoryId
    );
  }

  async getSubCategoryById(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await subCategoryRepository.getSubCategoryById(id);
  }

  async updateSubCategory(
    id: string | Types.ObjectId,
    data: Partial<ISubCategory>
  ): Promise<ISubCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    this.validateSubCategoryData(data, true);

    return await subCategoryRepository.updateSubCategory(id, data);
  }

  async softDeleteSubCategory(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await subCategoryRepository.softDeleteSubCategory(id);
  }

  async toggleActive(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await subCategoryRepository.toggleActive(id);
  }

  async getAllTrashSubCategories(
    page = 1,
    limit = 10,
    filter?: string
  ) {
    return await subCategoryRepository.getAllTrashSubCategories(
      page,
      limit,
      filter
    );
  }

  async restoreSubCategory(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await subCategoryRepository.restoreSubCategory(id);
  }

  async deleteSubCategoryPermanently(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await subCategoryRepository.deleteSubCategoryPermanently(id);
  }

  async checkDuplicateSubCategory(
    slug: string,
    mainCategoryId: string,
    excludeId?: string
  ): Promise<boolean> {
    return await subCategoryRepository.existsBySlug(
      slug,
      mainCategoryId,
      excludeId
    );
  }
}

export default new SubCategoryService();
