import { ReviewModel, IReview } from "../models/reviewModel";
import { Types } from "mongoose";

class ReviewRepository {
  async createReview(data: IReview): Promise<IReview> {
    console.log("Saving to DB:", data);
    return await ReviewModel.create(data);
  }

  async getAllReviews(
    page = 1,
    limit = 10,
    productId?: string,
    status?: string,
  ) {
    try {
      const query: any = { isDeleted: false };
      if (productId) {
        query.productId = productId;
      }
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        ReviewModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .exec(),
        ReviewModel.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;
      return {
        data,
        meta: {
          total,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error("Repository Error:", error);
      throw error;
    }
  }

  async getReviewById(id: string | Types.ObjectId): Promise<IReview | null> {
    return await ReviewModel.findOne({ _id: id, isDeleted: false });
  }

  async deleteReview(id: string | Types.ObjectId): Promise<IReview | null> {
    return await ReviewModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async updateReviewStatus(id: string, status: string) {
    return await ReviewModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getActiveReviews(productId: string) {
    return await ReviewModel.find({
      productId,
      status: "active",
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }

  async updateReview(
    id: string | Types.ObjectId,
    updateData: Partial<IReview>,
  ): Promise<IReview | null> {
    return await ReviewModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );
  }
}
export default new ReviewRepository();
