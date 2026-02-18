import { SubCategoryModel, ISubCategory } from "../models/subCategoryModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";
import { MainCategoryModel } from "../models/mainCategoryModel";
import { CategoryModel } from "../models/categoryModel";

class SubCategoryRepository {
  private commonRepository: CommonRepository<ISubCategory>;
  constructor() {
    this.commonRepository = new CommonRepository(SubCategoryModel);
  }
  async createSubCategory(data: ISubCategory): Promise<ISubCategory> {
    return await SubCategoryModel.create(data);
  }
 async getAllSubCategories(page = 1,limit = 10,filter?: string,mainCategoryId?: string) {
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
          from: "main_categories",
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
    return { data, meta: {total,active,inactive,totalPages, page,limit,},};
  } catch (error) {
    console.error("Error in getAllSubCategories:", error);
    throw error;
  }
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
  async getSubCategoryById(id: string | Types.ObjectId): Promise<ISubCategory | null> {
    return await SubCategoryModel.findById(id);
  }
  async updateSubCategory( id: string | Types.ObjectId, data: Partial<ISubCategory>): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndUpdate(id, data, { new: true });
  }
 async softDeleteSubCategory(id: string | Types.ObjectId): Promise<ISubCategory | null> {
  const subcategory = await SubCategoryModel.findById(id);
  if (!subcategory) return null;
  const associatedCategories = await CategoryModel.find({ subCategoryId: id,  isDeleted: false }).select('name'); 
  if (associatedCategories.length > 0) {
    const categoryNames = associatedCategories.map(cat => cat.name).join(", ");
    throw new Error( `${subcategory.name} is associated with some category`);
  }
  return await SubCategoryModel.findByIdAndUpdate( id, { isDeleted: true },{ new: true });
}
 async toggleActive(id: string | Types.ObjectId): Promise<ISubCategory | null> {
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) return null;
  if (subCategory.isActive === true) {
    const associatedCategories = await CategoryModel.find({ subCategoryId: id, isDeleted: false,status: 'active' }).select('name');
    if (associatedCategories.length > 0) {
      const categoryNames = associatedCategories.map(cat => cat.name).join(", ");
      throw new Error(`${subCategory.name} is associated with some category`);
    }
  }

  subCategory.isActive = !subCategory.isActive;
  return await subCategory.save();
}
  async restoreSubCategory( id: string | Types.ObjectId): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndUpdate(id,{ isDeleted: false, isActive: true },{ new: true });
  }
  async deleteSubCategoryPermanently( id: string | Types.ObjectId): Promise<ISubCategory | null> {
    return await SubCategoryModel.findByIdAndDelete(id);
  }
async getAllTrashSubCategories(page = 1,limit = 10,filter?: string
) {
  try {
    const listMatch: any = { isDeleted: true };
    if (filter === "active") listMatch.isActive = true;
    if (filter === "inactive") listMatch.isActive = false;
    const skip = (page - 1) * limit;
    const rawData = await SubCategoryModel.find(listMatch).populate({path: "mainCategoryId", model: "MainCategory",    }).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean()
    const data = rawData.map((item: any) => ({...item, mainCategory: item.mainCategoryId, }));
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
  async existsBySlug( slug: string, mainCategoryId: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
  const query: any = {slug: { $regex: new RegExp(`^${slug.trim()}$`, 'i') },mainCategoryId,isDeleted: false,};
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
