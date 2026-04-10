import bannerRepository from "../repositories/bannerRepository";
import { Types } from "mongoose";

class BannerService {
    async getBanner() {

        const banner = await bannerRepository.getBanner();

        if (!banner) {
            throw new Error("Banner data not found");
        }

        return banner;
    }

    async updateBanner(
        id: string | Types.ObjectId | undefined,
        type: "banner_one" | "banner_two",
        data: any
    ) {
        return bannerRepository.updateBanner(id, type, data);
    }
}

export default new BannerService();