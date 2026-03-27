import {  IBanner, BannerModel } from "../models/bannerModel";
import { Types } from "mongoose";

class BannerRespository {

    async getBanner() {
        return await BannerModel.findOne();
    }

    async updateBanner(
        id: string | Types.ObjectId | undefined,
        type: "banner_one" | "banner_two",
        data: any
    ): Promise<IBanner | null> {

        const updateData: any = {};

        Object.keys(data).forEach((key) => {

            if (key === "type") return;

            updateData[`home_page.${type}.${key}`] = data[key];

        });
        if (id) {
            return BannerModel.findByIdAndUpdate(
                id,
                { $set: { ...updateData, updatedAt: new Date() } },
                { new: true, runValidators: true }
            );
        } else {
            return BannerModel.findOneAndUpdate(
                {},
                { $set: { ...updateData, updatedAt: new Date() } },
                { new: true, upsert: true, runValidators: true }
            );
        }
    }
}

export default new BannerRespository();