import { NewsLetterModel, INewsLetter } from "../models/newsLetterModel";
import { DeleteResult, Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class NewsLetterRepository {
  private commonRepository: CommonRepository<INewsLetter>;

  constructor() {
    this.commonRepository = new CommonRepository(NewsLetterModel);
  }

  async createNewsLetter(data: INewsLetter): Promise<INewsLetter> {
    return await NewsLetterModel.create(data);
  }

  async getAllNewsLetters(page = 1, limit = 10, filter?: string) {
    try {
      const query: any = {};
      if (filter === "active") query.status = "active";
      if (filter === "inactive") query.status = "inactive";

      const skip = (page - 1) * limit;
      const [data, stats] = await Promise.all([
        NewsLetterModel.find(query).skip(skip).limit(limit).exec(),
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
      console.error("Error in getAllNewsLetters:", error);
      throw error;
    }
  }

  async getNewsLetterById(
    id: string | Types.ObjectId,
  ): Promise<INewsLetter | null> {
    return await NewsLetterModel.findById(id);
  }

  async updateNewsLetter(
    id: string | Types.ObjectId,
    data: Partial<INewsLetter>,
  ): Promise<INewsLetter | null> {
    return await NewsLetterModel.findByIdAndUpdate(id, data, { new: true });
  }

  // async deleteNewsLetter(
  //   id: string | Types.ObjectId,
  // ): Promise<DeleteResult | null> {
  //   return await NewsLetterModel.deleteOne({ _id: id });
  // }

  async softDeleteNewsLetter(
    id: string | Types.ObjectId,
  ): Promise<INewsLetter | null> {
    return await NewsLetterModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}

export default new NewsLetterRepository();
