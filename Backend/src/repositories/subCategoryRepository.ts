import { SubCategoryModel, ISubCategory } from "../models/subCategoryModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class SubCategoryRepository {
  private commonRepository: CommonRepository<ISubCategory>;

  constructor() {
    this.commonRepository = new CommonRepository(SubCategoryModel);
  }

  async createSubCategory(data: ISubCategory): Promise<ISubCategory> {
    return await SubCategoryModel.create(data);
  }

 async getAllSubCategories(
  page = 1,
  limit = 10,
  filter?: string,
  mainCategoryId?: string
) {
  try {
    
    const listMatch: any = { isDeleted: false };

    if (filter === "active") listMatch.isActive = true;
    if (filter === "inactive") listMatch.isActive = false;
    if (mainCategoryId) listMatch.mainCategoryId = mainCategoryId;

    const skip = (page - 1) * limit;

    const data = await SubCategoryModel.aggregate([
      { $match: listMatch },
       { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "maincategories",
          localField: "mainCategoryId",
          foreignField: "_id",
          as: "mainCategory",
        },
      },
      {
        $unwind: {
          path: "$mainCategory",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);


    const [total, active, inactive] = await Promise.all([
      SubCategoryModel.countDocuments({ isDeleted: false }),
      SubCategoryModel.countDocuments({ isDeleted: false, isActive: true }),
      SubCategoryModel.countDocuments({ isDeleted: false, isActive: false }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      meta: {
        total,
        active,
        inactive,
        totalPages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error in getAllSubCategories:", error);
    throw error;
  }
}


  async getSubCategoryById(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    return await SubCategoryModel.findById(id);
  }
async getAllSubCategoriesByMainCategoryId(
  mainCategoryId: string,
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const query: any = {
    mainCategoryId,
    isDeleted: false,
  };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    SubCategoryModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean(),
    SubCategoryModel.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      hasMore: skip + data.length < total,
    },
  };
}

  async updateSubCategory(
    id: string | Types.ObjectId,
    data: Partial<ISubCategory>
  ): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteSubCategory(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleActive(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    const subCategory = await SubCategoryModel.findById(id);
    if (!subCategory) return null;

    subCategory.isActive = !subCategory.isActive;
    return await subCategory.save();
  }

  async restoreSubCategory(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndUpdate(
      id,
      { isDeleted: false, isActive: true },
      { new: true }
    );
  }

  async deleteSubCategoryPermanently(
    id: string | Types.ObjectId
  ): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndDelete(id);
  }

async getAllTrashSubCategories(
  page = 1,
  limit = 10,
  filter?: string
) {
  try {
    const listMatch: any = { isDeleted: true };

    if (filter === "active") listMatch.isActive = true;
    if (filter === "inactive") listMatch.isActive = false;

    const skip = (page - 1) * limit;

    const data = await SubCategoryModel.aggregate([
      { $match: listMatch },

      { $sort: { updatedAt: -1 } },

      {
        $lookup: {
          from: "maincategories",     
          localField: "mainCategoryId",
          foreignField: "_id",
          as: "mainCategory",
        },
      },
      {
        $unwind: {
          path: "$mainCategory",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $skip: skip },
      { $limit: limit },
    ]);

    const count = await SubCategoryModel.countDocuments(listMatch);

    const totalPages = Math.max(1, Math.ceil(count / limit));

    return {
      data,
      meta: {
        total: count,
        totalPages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error("Error in getAllTrashSubCategories:", error);
    throw error;
  }
}

  async existsBySlug(
  slug: string,
  mainCategoryId: string,
  excludeId?: string | Types.ObjectId
): Promise<boolean> {
  const query: any = {
    slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') },
    mainCategoryId,
    isDeleted: false,
  };

  if (excludeId) {
    query._id = {
      $ne:
        typeof excludeId === 'string'
          ? new Types.ObjectId(excludeId)
          : excludeId,
    };
  }

  const count = await SubCategoryModel.countDocuments(query);
  return count > 0;
}

}

export default new SubCategoryRepository();
