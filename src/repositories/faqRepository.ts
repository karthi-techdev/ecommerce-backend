import { FaqModel, IFaq } from "../models/faqModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class FaqRepository {
  private commonRepository: CommonRepository<IFaq>;

  constructor() {
    this.commonRepository = new CommonRepository(FaqModel);
  }

  async createFaq(data: IFaq): Promise<IFaq> {
    return await FaqModel.create(data);
  }

  async getAllFaqs(page = 1, limit = 10, filter?: string) {
    try {
      const query: any = { isDeleted: false };
      if (filter === 'active') query.status = 'active';
      if (filter === 'inactive') query.status = 'inactive';

      const skip = (page - 1) * limit;
      const [data, stats] = await Promise.all([
        FaqModel.find(query).skip(skip).limit(limit).exec(),
        this.commonRepository.getStats(),
      ]);

      const totalPages = Math.ceil(stats.total / limit) || 1;
      return {
        data,
        meta: {
          ...stats,
          totalPages,
          page,
          limit
        }
      };
    } catch (error) {
      console.error('Error in getAllFaqs:', error);
      throw error;
    }
  }

  async getFaqById(id: string | Types.ObjectId): Promise<IFaq | null> {
    return await FaqModel.findById(id);
  }

  async updateFaq(id: string | Types.ObjectId, data: Partial<IFaq>): Promise<IFaq | null> {
    return await FaqModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
    return await FaqModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IFaq | null> {
    // Ensure id is a string for CommonRepository
    const stringId = typeof id === "string" ? id : id.toString();
    return await this.commonRepository.toggleStatus(stringId);
  }

  async restoreFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
    return await FaqModel.findByIdAndUpdate(
      id,
      { isDeleted: false, status: "active" },
      { new: true }
    );
  }

  async deleteFaqPermanently(id: string | Types.ObjectId): Promise<IFaq | null> {
    return await FaqModel.findByIdAndDelete(id);
  }
  async getAllTrashFaqs(page = 1, limit = 10, filter?: string) {
    try {
      const query: any = { isDeleted: true };
      if (filter === 'active') query.status = 'active';
      if (filter === 'inactive') query.status = 'inactive';

      const skip = (page - 1) * limit;
      const [data, count, stats] = await Promise.all([
        FaqModel.find(query).skip(skip).limit(limit).exec(),
        FaqModel.countDocuments(query).exec(),
        this.commonRepository.getStats(),
      ]);

      const totalPages = Math.max(1, Math.ceil(count / limit));
      return {
        data,
        meta: {
          ...stats,
          total: count,
          totalPages,
          page,
          limit
        }
      };
    } catch (error) {
      console.error('Error in getAllTrashFaqs:', error);
      throw error;
    }
  }
}

export default new FaqRepository();