import { Request, Response, NextFunction } from "express";
import couponService from "../services/couponService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class CouponController {

  // CREATE COUPON
  async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {

      const coupon = await couponService.createCoupon(req.body);

      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Coupon created successfully",
        data: coupon
      });

    } catch (error) {
      next(error);
    }
  }


  // GET ALL COUPONS
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {

    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const filter = req.query.status as string;
      const result = await couponService.getAllCoupons( page, limit,filter,false );
      res.status(200).json({
         status: HTTP_RESPONSE.SUCCESS,
         ...result
        });
       } catch (error) {
        next(error);
      }
  }


  // GET COUPON BY ID
  async getCouponById(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const coupon = await couponService.getCouponById(id);
       res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
         data: coupon
         });

    } catch (error) {
       next(error);
      }

  }


  // UPDATE COUPON
  async updateCoupon(req: Request, res: Response, next: NextFunction) {

    try {
      const { id } = req.params;
      const coupon = await couponService.updateCoupon(id, req.body);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Coupon updated successfully",
        data: coupon
       });

    } catch (error) {
       next(error);
      }
    }

  // TOGGLE STATUS
  async toggleStatus(req: Request, res: Response, next: NextFunction) {

    try {

      const { id } = req.params;
      const coupon = await couponService.toggleStatus(id);

      res.status(200).json({
         status: HTTP_RESPONSE.SUCCESS,
          message: "Coupon status updated",
          data: coupon
         });

    } catch (error) {
       next(error);

    }

  }

  // SOFT DELETE
  async softDeleteCoupon(req: Request, res: Response, next: NextFunction) {

    try {

      const { id } = req.params;
      await couponService.softDeleteCoupon(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
         message: "Coupon moved to trash"
        });

    } catch (error) {
       next(error);
      }

  }

  // RESTORE
  async restoreCoupon(req: Request, res: Response, next: NextFunction) {

    try {

      const { id } = req.params;
      await couponService.restoreCoupon(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Coupon restored successfully"

      });

    } catch (error) {
      next(error);
    }

  }

  // HARD DELETE
  async hardDeleteCoupon(req: Request, res: Response, next: NextFunction) {

    try {

      const { id } = req.params;
      await couponService.hardDeleteCoupon(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Coupon deleted permanently"

      });

    } catch (error) {
       next(error);

    }

  }

  // GET TRASH
  async getTrashCoupons(req: Request, res: Response, next: NextFunction) {

    try {
      const page = Number(req.query.page) || 1;
       const limit = Number(req.query.limit) || 10;
       const result = await couponService.getTrashCoupons(page, limit);


      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        ...result

      });

    } catch (error) {
       next(error);

    }

  }
  // CHECK IF COUPON CODE EXISTS
async checkCodeExists(req: Request, res: Response, next: NextFunction) {
  try {
    const { code, excludeId } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Code is required",
      });
    }

    const exists = await couponService.isCodeExists(code as string, excludeId as string | undefined);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      exists, // true if code exists, false otherwise
    });
  } catch (error) {
    next(error);
  }
}

  

}

export default new CouponController();
