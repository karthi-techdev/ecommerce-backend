import { MainCategoryModel, IMainCategory } from "../models/mainCategoryModel";
import { IMainCategoryInput } from "../types/mainCategoryTypes";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class MainCategoryRepository {
  private commonRepository: CommonRepository<IMainCategory>;

  constructor() {
    this.commonRepository = new CommonRepository(MainCategoryModel);
  }

  async createMainCategory(data: IMainCategoryInput): Promise<IMainCategory> {
    return await MainCategoryModel.create(data);
  }

  async getAllMainCategories(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: false };

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MainCategoryModel.find(query).skip(skip).limit(limit).exec(),
      MainCategoryModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  }

  async getMainCategoryById(id: string | Types.ObjectId): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async updateMainCategory(
    id: string | Types.ObjectId,
    data: Partial<IMainCategory>
  ): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    );
  }

  async softDeleteMainCategory(id: string | Types.ObjectId): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreMainCategory(id: string | Types.ObjectId): Promise<IMainCategory | null> {
    return await MainCategoryModel.findOneAndUpdate(
      { _id: id, isDeleted: true },
      { isDeleted: false, isActive: true },
      { new: true }
    );
  }

  async deleteMainCategoryPermanently(id: string | Types.ObjectId): Promise<IMainCategory | null> {
    return await MainCategoryModel.findByIdAndDelete(id);
  }

  async getAllTrashMainCategories(page = 1, limit = 10, filter?: string) {
    const query: any = { isDeleted: true };

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      MainCategoryModel.find(query).skip(skip).limit(limit).exec(),
      MainCategoryModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      meta: {
        total,
        totalPages,
        page,
        limit,
      },
    };
  }
}

export default new MainCategoryRepository();
