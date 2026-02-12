import { NewsLetterModel, INewsLetter } from "../models/newsLetterModel";
import { Types } from "mongoose";
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
      if (filter === 'active') query.status = 'active';
      if (filter === 'inactive') query.status = 'inactive';

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
          limit
        }
      };
    } catch (error) {
      console.error('Error in getAllNewsLetters:', error);
      throw error;
    }
  }

  async getNewsLetterById(id: string | Types.ObjectId): Promise<INewsLetter | null> {
     return await NewsLetterModel.findById(id);
   }

 async updateNewsLetter(id: string | Types.ObjectId, data: Partial<INewsLetter>): Promise<INewsLetter | null> {
   return await NewsLetterModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteNewsLetter(id: string | Types.ObjectId): Promise<INewsLetter | null> {
    return await NewsLetterModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

//   async toggleStatus(id: string | Types.ObjectId): Promise<INewsLetter | null> {
//     // Ensure id is a string for CommonRepository
//     const stringId = typeof id === "string" ? id : id.toString();
//     return await this.commonRepository.toggleStatus(stringId);
//   }

//   async restoreNewsLetter(id: string | Types.ObjectId): Promise<INewsLetter | null> {
//     return await NewsLetterModel.findByIdAndUpdate(
//       id,
//       { isDeleted: false, status: "active" },
//       { new: true }
//     );
//   }

//   async deleteNewsLetterPermanently(id: string | Types.ObjectId): Promise<INewsLetter | null> {
//     return await NewsLetterModel.findByIdAndDelete(id);
//   }
//   async getAllTrashNewsLetters(page = 1, limit = 10, filter?: string) {
//     try {
//       const query: any = { isDeleted: true };
//       if (filter === 'active') query.status = 'active';
//       if (filter === 'inactive') query.status = 'inactive';

//       const skip = (page - 1) * limit;
//       const [data, count, stats] = await Promise.all([
//         NewsLetterModel.find(query).skip(skip).limit(limit).exec(),
//         NewsLetterModel.countDocuments(query).exec(),
//         this.commonRepository.getStats(),
//       ]);

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
//       console.error('Error in getAllTrashNewsLetters:', error);
//       throw error;
//     }
//   }
//   async existsByQuestion(question: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
//     const query: any = {
//       question: { $regex: new RegExp(`^${question.trim()}$`, "i") },
//       isDeleted: false
//     };
//     if (excludeId) {
//       query._id = { $ne: typeof excludeId === "string" ? new Types.ObjectId(excludeId) : excludeId };
//     }
//     const count = await NewsLetterModel.countDocuments(query);
//     return count > 0;
//   }
}

export default new NewsLetterRepository();