import { Schema, model, Document } from "mongoose";

export interface ICoupon extends Document {

  code: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {type: String,required: true,unique: true,uppercase: true,trim: true,},
    description: {type: String,required: true},
    discountType: {type: String,enum: ["percentage", "flat"],required: true,},
    discountValue: {type: Number,required: true,},
    minOrderValue: {type: Number, default: 0,},
    maxDiscountAmount: { type: Number,},
    startDate: {type: Date,required: true, },
    endDate: {type: Date, required: true,}, usageLimit: {type: Number, default: 1, }, 
    isActive: {type: Boolean,default: true,},
    isDeleted: { type: Boolean,default: false,},
  },
  { timestamps: true }
);

export const CouponModel = model<ICoupon>("Coupon", couponSchema);
