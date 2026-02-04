import { BrandModel, IBrand } from "../models/brandModel";
import { Types } from "mongoose";

class BrandRepository {
  async createBrand(data: IBrand): Promise<IBrand> {
    return await BrandModel.create(data);
  }

  async getAllBrands(
    page = 1,
    limit = 10,
    filter?: string,
    includeDeleted = false
  ) {
    const query: any = {};
    if (!includeDeleted) query.isDeleted = false;

    if (filter === "active") query.isActive = true;
    if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      BrandModel.find(query).skip(skip).limit(limit).exec(),
      BrandModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      meta: { total, totalPages, page, limit },
    };
  }

  async updateBrand(
    id: string | Types.ObjectId,
    data: Partial<IBrand>
  ): Promise<IBrand | null> {
    return await BrandModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteBrand(id: string | Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true }
    );
  }

  async restoreBrand(id: string | Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findByIdAndUpdate(
      id,
      { isDeleted: false, isActive: true },
      { new: true }
    );
  }

  async deleteBrand(id: string | Types.ObjectId): Promise<IBrand | null> {
    return await BrandModel.findByIdAndDelete(id);
  }
}

export default new BrandRepository();
