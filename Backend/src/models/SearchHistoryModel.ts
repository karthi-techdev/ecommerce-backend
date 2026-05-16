 import mongoose, { Document, Schema } from "mongoose";

export interface ISearchHistory extends Document {
  userId: mongoose.Types.ObjectId;
  query: string;
  createdAt: Date;
}

const searchHistorySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const searchHistoryModel = mongoose.model<ISearchHistory>(
  "SearchHistory",
  searchHistorySchema
);

export default searchHistoryModel;