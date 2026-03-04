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
  async checkNameExists(name: string, id?: string) {
  const query: any = {
    name: { $regex: `^${name}$`, $options: 'i' },
    isDeleted: false,
  };

  if (id) {
    query._id = { $ne: id };
  }

  return await MainCategoryModel.findOne(query);
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
      MainCategoryModel.find(query).sort({createdAt: -1}).skip(skip).limit(limit).exec(),
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
 async getAllActiveMainCategories(page = 1,limit = 5, search?: string) {
  const skip = (page - 1) * limit;
  const matchStage: any = {isDeleted: false, isActive: true,};
  if (search && search.trim() !== "") {
    matchStage.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }
  const pipeline = [
    { $match: matchStage },
    { $sort: { createdAt: -1 as -1 } },
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await MainCategoryModel.aggregate(pipeline);
  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;
  return {
    data,
    meta: {
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
      hasMore: skip + data.length < total,
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

  async restoreMainCategory(id: string) {
    return await MainCategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
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
      MainCategoryModel.find(query).sort({ updatedAt: -1}).skip(skip).limit(limit).exec(),
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

  async toggleStatus(id: string | Types.ObjectId) {
    const category = await MainCategoryModel.findById(id);

    if (!category || category.isDeleted) {
      return null;
    }

    category.isActive = !category.isActive;
    await category.save();

    return category;
  }

}

export default new MainCategoryRepository();
