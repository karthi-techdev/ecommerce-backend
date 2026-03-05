import { BlogCategoryModel, IBlogCategory } from "../models/blogCategoryModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class BlogCategoryRepository {
  private commonRepository: CommonRepository<IBlogCategory>;

  constructor() {
    this.commonRepository = new CommonRepository(BlogCategoryModel);
  }

  async createBlogCategory(data: IBlogCategory): Promise<IBlogCategory> {
    return await BlogCategoryModel.create(data);
  }

  async getAllBlogCategories(page = 1, limit = 10, filter?: string) {
    const match: any = { isDeleted: false };
    if (filter === "active") match.isActive = true;
    if (filter === "inactive") match.isActive = false;

    const skip = (page - 1) * limit;
    const data = await BlogCategoryModel.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await BlogCategoryModel.countDocuments(match);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { data, meta: { total, totalPages, page, limit } };
  }

  async getBlogCategoryById(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findById(id);
  }

  async updateBlogCategory(id: string | Types.ObjectId, data: Partial<IBlogCategory>): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

 async softDeleteBlogCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
  return await BlogCategoryModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
}

  async restoreBlogCategory(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndUpdate(id, { isDeleted: false, isActive: true }, { new: true });
  }

  async toggleActive(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    const cat = await BlogCategoryModel.findById(id);
    if (!cat) return null;
    cat.isActive = !cat.isActive;
    return await cat.save();
  }

  async deleteBlogCategoryPermanently(id: string | Types.ObjectId): Promise<IBlogCategory | null> {
    return await BlogCategoryModel.findByIdAndDelete(id);
  }

async getTrashBlogCategories(skip = 0, limit = 10) {
  return await BlogCategoryModel.find({ isDeleted: true })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
}

async countTrashBlogCategories() {
  return await BlogCategoryModel.countDocuments({ isDeleted: true });
}


  async existsByName(name: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const query: any = { name: { $regex: new RegExp(`^${name.trim()}$`, "i") }, isDeleted: false };
    if (excludeId) query._id = { $ne: excludeId };
    return (await BlogCategoryModel.countDocuments(query)) > 0;
  }
}

export default new BlogCategoryRepository();