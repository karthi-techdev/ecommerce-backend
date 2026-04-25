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

  async getRatingSummary(productId: string) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const reviews = await reviewRepository.getActiveReviews(productId);

    const totalReviews = reviews.length;

    const totalRating = reviews.reduce((sum, review: IReview) => {
      return sum + (review.rating || 0);
    }, 0);

    const avgRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    const percentage = Math.round((avgRating / 5) * 100);

    return {
      avgRating: Number(avgRating.toFixed(1)),
      percentage,
      totalReviews,
    };
  }
}

export default new ReviewService();
