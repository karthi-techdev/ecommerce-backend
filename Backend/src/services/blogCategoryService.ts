import { IBlogCategory } from "../models/blogCategoryModel";
import blogCategoryRepository from "../repositories/blogCategoryRepository";
import { Types } from "mongoose";
import slugify from "slugify";
import ValidationHelper from "../utils/validationHelper";

class BlogCategoryService {
  private validate(data: Partial<IBlogCategory>, isUpdate = false) {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : data.name !== undefined
        ? ValidationHelper.isNonEmptyString(data.name, "name")
        : null,
      data.name !== undefined
        ? ValidationHelper.minLength(data.name, "name", 3)
        : null,
      data.isActive !== undefined ? ValidationHelper.isBoolean(data.isActive, "isActive") : null,
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length) throw new Error(errors.map(e => e.message).join(", "));
  }

  async createBlogCategory(data: Partial<IBlogCategory>): Promise<IBlogCategory> {
    this.validate(data);

    data.name = data.name!.charAt(0).toUpperCase() + data.name!.slice(1);
    data.slug = slugify(data.name, { lower: true, strict: true });

    if (data.isActive === undefined) data.isActive = true;
    if (data.isDeleted === undefined) data.isDeleted = false;

    const exists = await blogCategoryRepository.existsByName(data.name);
    if (exists) throw new Error("Blog category name already exists");

    return await blogCategoryRepository.createBlogCategory(data as IBlogCategory);
  }

  async getAllBlogCategories(page = 1, limit = 10, filter?: string) {
    return await blogCategoryRepository.getAllBlogCategories(page, limit, filter);
  }

  async getTrashBlogCategories(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const data = await blogCategoryRepository.getTrashBlogCategories(skip, limit);
    const total = await blogCategoryRepository.countTrashBlogCategories();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBlogCategoryById(id: string | Types.ObjectId) {
    return await blogCategoryRepository.getBlogCategoryById(id);
  }

  async updateBlogCategory(id: string | Types.ObjectId, data: Partial<IBlogCategory>) {
    if (data.name) {
      const exists = await blogCategoryRepository.existsByName(data.name, id);
      if (exists) throw new Error("Blog category name already exists");
      data.slug = slugify(data.name, { lower: true, strict: true });
    }
    return await blogCategoryRepository.updateBlogCategory(id, data);
  }

  async softDeleteBlogCategory(id: string | Types.ObjectId) {
    return await blogCategoryRepository.softDeleteBlogCategory(id);
  }

  async restoreBlogCategory(id: string | Types.ObjectId) {
    return await blogCategoryRepository.restoreBlogCategory(id);
  }

  async toggleActive(id: string | Types.ObjectId) {
    return await blogCategoryRepository.toggleActive(id);
  }

  async deleteBlogCategoryPermanently(id: string | Types.ObjectId) {
    return await blogCategoryRepository.deleteBlogCategoryPermanently(id);
  }

  async checkDuplicate(name: string, excludeId?: string) {
    return await blogCategoryRepository.existsByName(name, excludeId);
  }
}

export default new BlogCategoryService();