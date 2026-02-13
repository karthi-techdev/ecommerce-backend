import { BrandModel, IBrand } from "../models/brandModel";
import { Types } from "mongoose";

class BrandRepository {
  //Create Brand
async createBrand(data: IBrand): Promise<IBrand> {
  try {
    return await BrandModel.create(data);
  } catch (error: any) {

    if (error.code === 11000) {
      throw new Error("Brand name already exists");
    }

    throw error;
  }
}

  // Get All Brands
  async getAllBrands(
    page = 1,
    limit = 10,
    filter?: string,        
    includeDeleted = false
  ) {
    const query: any = {};
    query.isDeleted = includeDeleted ? true : false;

    if (filter === "active") query.isActive = true;
    else if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

   const [data, total] = await Promise.all([
  BrandModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
  BrandModel.countDocuments(query).exec(),
]);


    const totalPages = Math.ceil(total / limit) || 1;
    const totalBrands = await BrandModel.countDocuments({ isDeleted: false });
    const totalActive = await BrandModel.countDocuments({ isDeleted: false, isActive: true });
    const totalInactive = await BrandModel.countDocuments({ isDeleted: false, isActive: false });

    return {
      data, 
      meta: { total, totalPages, page, limit }, 
      counts: { totalBrands, totalActive, totalInactive }, 
    };
  }

  // Update Brand
  async updateBrand(
    id: string | Types.ObjectId,
    data: Partial<IBrand>
  ): Promise<IBrand | null> {
    return await BrandModel.findByIdAndUpdate(id, data, { new: true });
  }

  //  Soft Delete Brand
 async softDeleteBrand(id: string | Types.ObjectId) {
  return await BrandModel.findByIdAndUpdate(
    id,
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );
}


  // Restore Brand
  async restoreBrand(id: string | Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findByIdAndUpdate(
      id,
      { isDeleted: false, isActive: true },
      { new: true }
    );
  }

  // Hard Delete Brand
  async deleteBrand(id: string | Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findByIdAndDelete(id);
  }

  //Find Brand by ID
  async findById(id: string | Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findById(id);
  }

  async getTrashBrands(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const data = await BrandModel.find({ isDeleted: true })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await BrandModel.countDocuments({ isDeleted: true });

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}

export default new BrandRepository();
