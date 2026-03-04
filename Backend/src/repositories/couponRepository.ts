import { CouponModel, ICoupon } from "../models/couponModel";
import { Types } from "mongoose";

class CouponRepository {

  // CREATE COUPON
  async createCoupon(data: ICoupon): Promise<ICoupon> {
    try {

      return await CouponModel.create(data);

    } catch (error: any) {

      if (error.code === 11000) {
        throw new Error("Coupon code already exists");
      }

      throw error;
    }
  }


  // GET ALL COUPONS
  async getAllCoupons(
    page = 1,
    limit = 10,
    filter?: string,
    includeDeleted = false
  ) {

    const query: any = {};

    query.isDeleted = includeDeleted ? true : false;

    if (filter === "active") query.isActive = true;
    else if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([

      CouponModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      CouponModel.countDocuments(query)

    ]);


    const totalPages = Math.ceil(total / limit) || 1;

    const totalCoupons =
      await CouponModel.countDocuments({ isDeleted: false });

    const totalActive =
      await CouponModel.countDocuments({ isDeleted: false, isActive: true });

    const totalInactive =
      await CouponModel.countDocuments({ isDeleted: false, isActive: false });


    return {

      data,

      meta: { total, totalPages, page, limit },

      counts: {
        totalCoupons,
        totalActive,
        totalInactive
      }

    };

  }


  // FIND BY ID
  async findById(id: string | Types.ObjectId) {

    return await CouponModel.findById(id);

  }


  // UPDATE
  async updateCoupon(id: string | Types.ObjectId, data: Partial<ICoupon>) {

    return await CouponModel.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

  }


  // SOFT DELETE
  async softDeleteCoupon(id: string | Types.ObjectId) {

    return await CouponModel.findByIdAndUpdate(

      id,

      { isDeleted: true },

      { new: true }

    );

  }


  // RESTORE
  async restoreCoupon(id: string | Types.ObjectId) {

    return await CouponModel.findByIdAndUpdate(

      id,

      { isDeleted: false, isActive: true },

      { new: true }

    );

  }


  // HARD DELETE
  async deleteCoupon(id: string | Types.ObjectId) {

    return await CouponModel.findByIdAndDelete(id);

  }


  // GET TRASH
  async getTrashCoupons(page: number, limit: number) {

    const skip = (page - 1) * limit;

    const data =
      await CouponModel.find({ isDeleted: true })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });


    const total =
      await CouponModel.countDocuments({ isDeleted: true });


    return {

      data,

      meta: {

        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)

      }

    };

  }

}

export default new CouponRepository();
