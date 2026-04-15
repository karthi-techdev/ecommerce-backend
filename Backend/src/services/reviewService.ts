import reviewRepository from "../repositories/reviewRepository";
import { IReview } from "../models/reviewModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";

class ReviewService {
  async createReview(data: IReview): Promise<IReview> {
    if (!data.name || !data.email || !data.rating || !data.comment) {
      throw new Error(
        "Missing required fields: Name, Email, Rating, or Comment",
      );
    }
    if (!data.userId || data.userId.trim() === "") {
      throw new Error("User ID is required");
    }
    if (!data.productId) {
      throw new Error("Product ID is required for database storage");
    }
    data.name = data.name[0].toUpperCase() + data.name.slice(1);
    return await reviewRepository.createReview(data);
  }

  async getAllReviews(
    page = 1,
    limit = 10,
    productId?: string,
    status?: string,
  ) {
    return await reviewRepository.getAllReviews(page, limit, productId, status);
  }

  async getReviewById(id: string | Types.ObjectId): Promise<IReview | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await reviewRepository.getReviewById(id);
  }

  async deleteReview(id: string | Types.ObjectId): Promise<IReview | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await reviewRepository.deleteReview(id);
  }

  async updateReviewStatus(id: string, status: string) {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await reviewRepository.updateReviewStatus(id, status);
  }

  async getActiveReviews(productId: string) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    return await reviewRepository.getActiveReviews(productId);
  }
}

export default new ReviewService();
