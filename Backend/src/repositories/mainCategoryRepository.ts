import { MainCategoryModel, IMainCategory } from "../models/mainCategoryModel";
import { IMainCategoryInput } from "../types/mainCategoryTypes";
import { Types } from "mongoose";

class MainCategoryRepository {
  async createMainCategory(data: IMainCategoryInput): Promise<IMainCategory> {
    return await MainCategoryModel.create(data);
  }

  async findByName(name: string): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOne({
      name,
      isDeleted: false,
    });
  }

  async findBySlug(slug: string): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOne({
      slug,
      isDeleted: false,
    });
  }

  async findByNameExceptId(
    name: string,
    id: string | Types.ObjectId
  ): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOne({
      name,
      _id: { $ne: id },
      isDeleted: false,
    });
  }

  async findBySlugExceptId(
    slug: string,
    id: string | Types.ObjectId
  ): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOne({
      slug,
      _id: { $ne: id },
      isDeleted: false,
    });
  }

  async getAllMainCategories(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MainCategoryModel.find(query).skip(skip).limit(limit),
      MainCategoryModel.countDocuments(query),
    ]);
    return {
      data,
      meta: {
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        page,
        limit,
      },
    };
  }

  async getMainCategoryById(id: string | Types.ObjectId) {
    return await MainCategoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async updateMainCategory(
    id: string | Types.ObjectId,
    data: Partial<IMainCategory>
  ) {
    return await MainCategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    );
  }

  async softDeleteMainCategory(id: string | Types.ObjectId) {
    return await MainCategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreMainCategory(id: string | Types.ObjectId) {
    return await MainCategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, isActive: true },
      { new: true }
    );
  }

  async deleteMainCategoryPermanently(id: string | Types.ObjectId) {
    return await MainCategoryModel.findByIdAndDelete(id);
  }

  async getAllTrashMainCategories(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MainCategoryModel.find(query).skip(skip).limit(limit),
      MainCategoryModel.countDocuments(query),
    ]);

    return {
      data,
      meta: {
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        page,
        limit,
      },
    };
  }
}

export default new MainCategoryRepository();
