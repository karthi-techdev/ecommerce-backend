import { Schema, model, Document } from "mongoose";

export interface ITestimonial extends Document {
    name: string;
    designation?: string;
    message?: string;
    image?: string;
    rating?: number;
    isActive?: boolean;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}

const TestimonialSchema = new Schema<ITestimonial>(

    {
        name: { type: String, required: true, unique: true },
        designation: { type: String },
        message: { type: String, },
        image: { type: String },
        rating: { type: Number },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },

    },
    {
        timestamps: true
    }
)

export const TestimonialModel = model<ITestimonial>("Testimonials", TestimonialSchema);
