import { Request, Response, NextFunction } from "express";
import promotionService from "../services/promotionService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class PromotionController {
  async createPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, isActive } = req.body;
      console.log("rewqq", req);

      if (!name) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Required fields are missing",
        });
        return;
      }

      let image = "";
      if (req.file) {
        image = `uploads/promotions/${req.file.filename}`;
      }

      const promotions = await promotionService.createPromotions({
        ...req.body,
        image,
      });
      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Promotions created",
        data: promotions,
      });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res
          .status(409)
          .json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await promotionService.getAllPromotions(
        page,
        limit,
        filter,
      );
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            active: result.meta.active,
            inactive: result.meta.inactive,
            totalPages: result.meta.totalPages,
            page: result.meta.page,
            limit: result.meta.limit,
          },
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getpromotionsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions id is required",
        });
        return;
      }
      const promotions = await promotionService.getPromotionsById(id);
      if (!promotions) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions not found",
        });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: promotions });
    } catch (err: any) {
      next(err);
    }
  }

  async updatePromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions id is required",
        });
        return;
      }

      const existingPromotionsData =
        await promotionService.getPromotionsById(id);
      if (!existingPromotionsData) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions not found",
        });
        return;
      }
      let payload = req.body;

      if (req.file) {
        let image = `uploads/promotions/${req.file.filename}`;
        payload = { ...req.body, image: image };
      } else if (existingPromotionsData?.image) {
        payload.image = existingPromotionsData.image;
      }

      const promotions = await promotionService.updatePromotions(id, payload);
      if (!promotions) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions not found",
        });
        return;
      }
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Promotions updated",
        data: promotions,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeletePromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions id is required",
        });
        return;
      }

      const promotions = await promotionService.softDeletePromotions(id);
      if (!promotions) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Promotions not found",
        });
        return;
      }

      // Include updated Promotions document in response data
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Promotions deleted successfully",
        data: promotions,
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new PromotionController();
