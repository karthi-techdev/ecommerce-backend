import { Schema, model, Document } from "mongoose";

export interface INewsLetter extends Document {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  isPublished: boolean;
  isDeleted: boolean;
  publishedAt?: Date;
  createdAt?: Date;
}

const newsLetterSchema = new Schema<INewsLetter>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    isPublished: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
    publishedAt: { type: Date },
    createdAt: { type: Date },
  },
  { timestamps: true },
);

export const NewsLetterModel = model<INewsLetter>(
  "NewsLetter",
  newsLetterSchema,
);
