import { PromotionModel, IPromotion } from "../models/promotionModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class PromotionRepository {
  private commonRepository: CommonRepository<IPromotion>;

  constructor() {
    this.commonRepository = new CommonRepository(PromotionModel);
  }

  async createPromotions(data: IPromotion): Promise<IPromotion> {
    return await PromotionModel.create(data);
  }

  async getAllPromotions(page = 1, limit = 10, filter?: string) {
    try {
      const query: any = { isDeleted: false };
      if (filter === "active") query.isActive = true;
      if (filter === "inactive") query.isActive = false;

      const skip = (page - 1) * limit;
      const [data, stats] = await Promise.all([
        PromotionModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        this.commonRepository.getStats(),
      ]);

      const totalPages = Math.ceil(stats.total / limit) || 1;
      return {
        data,
        meta: {
          ...stats,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error("Error in getAllPromotions:", error);
      throw error;
    }
  }

  async getPromotionsById(
    id: string | Types.ObjectId,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findOne({ _id: id, isDeleted: false });
  }

  async updatePromotions(
    id: string | Types.ObjectId,
    data: Partial<IPromotion>,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeletePromotions(
    id: string | Types.ObjectId,
  ): Promise<IPromotion | null> {
    return await PromotionModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  //   async toggleStatus(id: string | Types.ObjectId): Promise<IFaq | null> {
  //     // Ensure id is a string for CommonRepository
  //     const stringId = typeof id === "string" ? id : id.toString();
  //     return await this.commonRepository.toggleStatus(stringId);
  //   }

  //   async restoreFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
  //     return await FaqModel.findByIdAndUpdate(
  //       id,
  //       { isDeleted: false, status: "active" },
  //       { new: true }
  //     );
  //   }

  //   async deleteFaqPermanently(id: string | Types.ObjectId): Promise<IFaq | null> {
  //     return await FaqModel.findByIdAndDelete(id);
  //   }
  //   async getAllTrashFaqs(page = 1, limit = 10, filter?: string) {
  //     try {
  //       const query: any = { isDeleted: true };
  //       if (filter === 'active') query.status = 'active';
  //       if (filter === 'inactive') query.status = 'inactive';

  // //       const skip = (page - 1) * limit;
  // //       const [data, count, stats] = await Promise.all([
  // //         FaqModel.find(query).skip(skip).limit(limit).exec(),
  // //         FaqModel.countDocuments(query).exec(),
  // //         this.commonRepository.getStats(),
  // //       ]);

  //       const totalPages = Math.max(1, Math.ceil(count / limit));
  //       return {
  //         data,
  //         meta: {
  //           ...stats,
  //           total: count,
  //           totalPages,
  //           page,
  //           limit
  //         }
  //       };
  //     } catch (error) {
  //       console.error('Error in getAllTrashFaqs:', error);
  //       throw error;
  //     }
  //   }
  async getStats() {
    const total = await PromotionModel.find({
      isDeleted: false,
    }).countDocuments();
    const active = await PromotionModel.find({
      isDeleted: false,
      isActive: true,
    }).countDocuments();
    const inactive = total - active;
    return { total, active, inactive };
  }
  async existsByName(
    name: string,
    excludeId?: string | Types.ObjectId,
  ): Promise<boolean> {
    const query: any = {
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      isDeleted: false,
    };

    if (excludeId) {
      query._id = {
        $ne:
          typeof excludeId === "string"
            ? new Types.ObjectId(excludeId)
            : excludeId,
      };
    }

    const count = await PromotionModel.countDocuments(query);
    return count > 0;
  }
}

export default new PromotionRepository();
