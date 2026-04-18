import { Schema,  Document, model } from "mongoose";

export interface ISubscribe extends Document {
    email: string;
    isActive: boolean;
    createdAt: Date;
}

const subcribeSchema = new Schema<ISubscribe>(
    {
        email:{
            type: String,
            required: true,
            unique: true
        },
        isActive:{
            type: Boolean,
            default: true,
        }
    },
    { timestamps: true }
);

export const subscribeModel = model<ISubscribe>(
 "subcribers",
 subcribeSchema
);