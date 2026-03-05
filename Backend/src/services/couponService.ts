import couponRepository from "../repositories/couponRepository";
import { ICoupon, CouponModel } from "../models/couponModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";



class CouponService {

  private validateCouponData(
    data: Partial<ICoupon>,
    isUpdate: boolean = false
  ): void {

    if (!isUpdate) {

      if (!data.code)
        throw new Error("code is required");

      if (!data.description)
        throw new Error("description is required");

      if (!data.discountType)
        throw new Error("discountType is required");

      if (data.discountValue === undefined)
        throw new Error("discountValue is required");

      if (!data.startDate)
        throw new Error("startDate is required");

      if (!data.endDate)
        throw new Error("endDate is required");

    }


    if (data.code !== undefined && data.code.trim() === "")
      throw new Error("code cannot be empty");


    if (data.description !== undefined && data.description.trim() === "")
      throw new Error("description cannot be empty");


    if (
      data.discountType !== undefined &&
      !["percentage", "flat"].includes(data.discountType)
    )
      throw new Error("discountType must be percentage or flat");


    if (
      data.discountValue !== undefined &&
      data.discountValue <= 0
    )
      throw new Error("discountValue must be greater than 0");


    if (
      data.isActive !== undefined &&
      typeof data.isActive !== "boolean"
    )
      throw new Error("isActive must be boolean");

  }



  // CREATE COUPON

  async createCoupon(data: Partial<ICoupon>): Promise<ICoupon> {

    this.validateCouponData(data, false);

    return await couponRepository.createCoupon(data as ICoupon);

  }



  // GET ALL COUPONS

  async getAllCoupons(
    page = 1,
    limit = 10,
    filter?: string,
    includeDeleted = false
  ) {

    return await couponRepository.getAllCoupons(
      page,
      limit,
      filter,
      includeDeleted
    );

  }



  // UPDATE COUPON

  async updateCoupon(
    id: string,
    data: Partial<ICoupon>
  ): Promise<ICoupon | null> {


    const error = ValidationHelper.isValidObjectId(id, "id");

    if (error) throw new Error(error.message);


    if (data.code) {

      const existing = await CouponModel.findOne({
        code: data.code,
        _id: { $ne: id }
      });

      if (existing)
        throw new Error("Coupon code already exists");

    }


    return await CouponModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

  }




  // SOFT DELETE

  async softDeleteCoupon(
    id: string | Types.ObjectId
  ): Promise<ICoupon | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");

    if (error) throw new Error(error.message);

    return await couponRepository.softDeleteCoupon(id);

  }




  // RESTORE

  async restoreCoupon(
    id: string | Types.ObjectId
  ): Promise<ICoupon | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");

    if (error) throw new Error(error.message);

    return await couponRepository.restoreCoupon(id);

  }




  // HARD DELETE

  async hardDeleteCoupon(
    id: string | Types.ObjectId
  ): Promise<ICoupon | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");

    if (error) throw new Error(error.message);

    return await couponRepository.deleteCoupon(id);

  }




  // TOGGLE STATUS

  async toggleStatus(
    id: string | Types.ObjectId
  ): Promise<ICoupon | null> {


    const error = ValidationHelper.isValidObjectId(id, "id");

    if (error) throw new Error(error.message);


    const coupon = await couponRepository.findById(id);


    if (!coupon)
      throw new Error("Coupon not found");


    return await couponRepository.updateCoupon(id, {

      isActive: !coupon.isActive

    });

  }




  // GET BY ID

  async getCouponById(
    id: string | Types.ObjectId
  ): Promise<ICoupon | null> {


    const error = ValidationHelper.isValidObjectId(id, "id");

    if (error) throw new Error(error.message);


    const coupon = await couponRepository.findById(id);


    if (!coupon)
      throw new Error("Coupon not found");


    return coupon;

  }



  // GET TRASH

  async getTrashCoupons(
    page: number,
    limit: number
  ) {

    return await couponRepository.getTrashCoupons(page, limit);

  }

async isCodeExists(code: string, excludeId?: string): Promise<boolean> {
  const query: any = { code: code.trim() };

  if (excludeId) {
    query._id = { $ne: excludeId }; 
  }

  const existingCoupon = await CouponModel.findOne(query);
  return !!existingCoupon;
}



}

export default new CouponService();
