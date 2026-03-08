import { OfferModel, IOffer } from "../models/offerModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class OfferRepository {
  private commonRepository: CommonRepository<IOffer>;

  constructor() {
    this.commonRepository = new CommonRepository(OfferModel);
  }

  async createOffer(data: Partial<IOffer>): Promise<IOffer> {
    return await OfferModel.create(data);
  }

  async getAllOffers() {
    try {
      const pipeline: any[] = [
        { $match: { isDeleted: false } }, 
        {
          $lookup: {
            from: "products",       
            localField: "products",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $addFields: {
            productCount: { $size: "$products" },
          },
        },
        { $sort: { createdAt: -1 } },
      ];

      const [data, stats] = await Promise.all([
        OfferModel.aggregate(pipeline).exec(),
        this.getStats(),
      ]);

      return {
        data,
        meta: {
          ...stats,
        },
      };
    } catch (error) {
      console.error("Error in getAllOffers:", error);
      throw error;
    }
  }

  async getOfferById(id: string | Types.ObjectId): Promise<any | null> {
    const objectId = typeof id === "string" ? new Types.ObjectId(id) : id;
    
    const results = await OfferModel.aggregate([
      { $match: { _id: objectId, isDeleted: false } },
      {
        $lookup: {
          from: "products",
          localField: "products",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
        },
      },
    ]);

    return results.length > 0 ? results[0] : null;
  }

  async updateOffer(id: string | Types.ObjectId, data: Partial<IOffer>): Promise<IOffer | null> {
    return await OfferModel.findByIdAndUpdate(id, data, { new: true });
  }

  // async softDeleteOffer(id: string | Types.ObjectId): Promise<IOffer | null> {
  //   return await OfferModel.findByIdAndUpdate(
  //     id,
  //     { isDeleted: true },
  //     { new: true }
  //   );
  // }

  async deleteOfferPermanently(id: string | Types.ObjectId): Promise<IOffer | null> {
    return await OfferModel.findByIdAndDelete(id);
  }


  async toggleStatus(id: string | Types.ObjectId): Promise<IOffer | null> {
    const offer = await OfferModel.findById(id);
    if (!offer) return null;

    return await OfferModel.findByIdAndUpdate(
      id,
      { $set: { isActive: !offer.isActive } },
      { new: true }
    );
  }

  async countActiveOffers(): Promise<number> {
    return await OfferModel.countDocuments({ isDeleted: false, isActive: true });
  }

  async getStats() {
    const total = await OfferModel.countDocuments({ isDeleted: false });
    const active = await OfferModel.countDocuments({ isDeleted: false, isActive: true });
    const inactive = total - active;
    return { total, active, inactive };
  }

  async existsByName(name: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const query: any = {
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      isDeleted: false
    };
    if (excludeId) {
      query._id = { $ne: typeof excludeId === "string" ? new Types.ObjectId(excludeId) : excludeId };
    }
    const count = await OfferModel.countDocuments(query);
    return count > 0;
  }
}

export default new OfferRepository(); 