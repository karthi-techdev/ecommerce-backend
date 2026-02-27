import { ShipmentMethodModel, IShipmentMethod } from "../models/shipmentMethodsModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class ShipmentMethodRepository {
  private commonRepository: CommonRepository<IShipmentMethod>;
  constructor() {
    this.commonRepository = new CommonRepository(ShipmentMethodModel);
  }

  async createShipmentMethod(data: Partial<IShipmentMethod>): Promise<IShipmentMethod> {
    return await ShipmentMethodModel.create({ ...data, isDeleted: false });
  }
  async getAllShipmentMethods(page = 1, limit = 10, filter?: string) {
    try {
      const query: any = { isDeleted: false };
      if (filter === 'active') query.status = 'active';
      if (filter === 'inactive') query.status = 'inactive';
      const skip = (page - 1) * limit;
      const [data, stats] = await Promise.all([
        ShipmentMethodModel.find(query).sort({  createdAt: -1  }).skip(skip).limit(limit).exec(),
        this.commonRepository.getStats(),
      ]);
      const totalPages = Math.ceil(stats.total / limit) || 1;
      return {data, meta: {...stats,totalPages,page,limit}};
    } catch (error) {
      console.error('Error in getAllShipmentMethods:', error);
      throw error;
    }
  }
  async toggleStatus(id: string | Types.ObjectId): Promise<IShipmentMethod | null> {
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }
  async existsBySlug(slug: string): Promise<boolean> {
    return await this.commonRepository.existsByField("slug", slug.trim());
  }
  async getShipmentMethodById(id: string | Types.ObjectId): Promise<IShipmentMethod | null> {
    return await ShipmentMethodModel.findOne({ _id: id, isDeleted: false });
  }
  async updateShipmentMethod(id: string | Types.ObjectId, data: Partial<IShipmentMethod>): Promise<IShipmentMethod | null> {
    return await ShipmentMethodModel.findByIdAndUpdate(id, data, { new: true });
  }
  async softDeleteShipmentMethod(id: string | Types.ObjectId): Promise<IShipmentMethod | null> {
    return await ShipmentMethodModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }
}

export default new ShipmentMethodRepository();