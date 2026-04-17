import { Schema, model, Document } from "mongoose";

export interface IReview extends Document {
  name: string;
  email: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  website?: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },

    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ReviewModel = model<IReview>("Review", reviewSchema);
