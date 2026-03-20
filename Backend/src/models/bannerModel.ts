import { Schema, model, Document } from "mongoose";

export interface IBannerone {
    title: string,
    subtitle: string,
    description: string;
    image: string;
    buttonName: string;
    buttonUrl: string;

};

export interface IBannertwo {
    title: string,
    subtitle: string,
    description: string;
    imageone: string;
    imagetwo: string;
    imagethree: string;
    buttonName: string;
    buttonUrl: string;

};

export interface IBanner extends Document {
    home_page: {
        banner_one: IBannerone;
        banner_two: IBannertwo;
    };
    updatedAt: Date;
};

const BannerSchema = new Schema<IBanner>({
    home_page: {
        banner_one: {
            title: {
                type: String, required: [true, "Title is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Title cannot be empty"
                }
            },
            subtitle: {
                type: String, required: [true, "Subtitle is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Subtitle cannot be empty"
                }
            },
            description: {
                type: String, required: [true, "Description is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Description cannot be empty"
                }
            },
            image: { type: String },
            buttonName: {
                type: String, required: [true, "Buttonname is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Buttonname cannot be empty"
                }
            },
            buttonUrl: {
                type: String, required: [true, "Buttonurl is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Buttonurl cannot be empty"
                }
            }
        },
        banner_two: {
            title: {
                type: String, required: [true, "Title is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Title cannot be empty"
                }
            },
            subtitle: {
                type: String, required: [true, "Subtitle is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Subtitle cannot be empty"
                }
            },
            description: {
                type: String, required: [true, "Description is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Description cannot be empty"
                }
            },
            imageone: { type: String },
            imagetwo: { type: String },
            imagethree: { type: String },
            buttonName: {
                type: String, required: [true, "Buttonname is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Buttonname cannot be empty"
                }
            },
            buttonUrl: {
                type: String, required: [true, "Buttonurl is required"],
                trim: true,
                validate: {
                    validator: (v: string) => v.trim().length > 0,
                    message: "Buttonurl cannot be empty"
                }
            }
        },
    }, updatedAt: {
        type: Date,
        default: Date.now
    }
});

export const BannerModel = model<IBanner>("banners", BannerSchema);