import { Schema, model, Document } from "mongoose";

export interface IPromotion extends Document {
  name: string;
  image: string;
  isActive: boolean;
  isDeleted?: boolean;
}

const promotionSchema = new Schema<IPromotion>(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
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

export const PromotionModel = model<IPromotion>("Promotion", promotionSchema);
