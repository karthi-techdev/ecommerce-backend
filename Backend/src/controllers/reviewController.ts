import { Request, Response, NextFunction } from "express";
import reviewService from "../services/reviewService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class ReviewController {
  // 1. Create Review
  async createReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, email, rating, comment, productId, userId } = req.body;

      if (!name || !email || !rating || !comment || !productId || !userId) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message:
            "Name, Email, Rating, comment, Product ID and User ID are required",
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "User ID is required",
        });
        return;
      }

      const reviewPayload = {
        ...req.body,
        productId: productId,
        userId: userId,
      };

      const review = await reviewService.createReview(reviewPayload);
      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Review submitted successfully",
        data: review,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      //const result = await reviewService.getAllReviews(page, limit);

      // Filter logic-ai add pannunga
      const productId = req.query.productId as string;
      const status = req.query.status as string | undefined;
      const result = await reviewService.getAllReviews(
        page,
        limit,
        productId,
        status,
      );

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: result.meta,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getReviewById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const review = await reviewService.getReviewById(id);
      if (!review) {
        res
          .status(404)
          .json({ status: HTTP_RESPONSE.FAIL, message: "Review not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: review });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteReview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const { userId } = req.body;

      if (!id || !userId) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Review ID and User ID are required",
        });
        return;
      }

      const review = await reviewService.getReviewById(id);

      if (!review) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Review not found",
        });
        return;
      }

      // //  MAIN SECURITY CHECK
      // if (review.userId !== userId) {
      //   res.status(403).json({
      //     status: HTTP_RESPONSE.FAIL,
      //     message: "You can only delete your own review!",
      //   });
      //   return;
      // }

      await reviewService.deleteReview(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Review deleted successfully",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async updateReviewStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updated = await reviewService.updateReviewStatus(id, status);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Status updated",
        data: updated,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getActiveReviews(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { productId } = req.params;

      const reviews = await reviewService.getActiveReviews(productId);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: reviews,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getRatingSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await reviewService.getRatingSummary(req.params.productId);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data,
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new ReviewController();
