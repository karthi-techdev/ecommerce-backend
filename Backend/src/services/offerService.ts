// import offerRepository from "../repositories/offerRepository";
// import { IOffer, OfferModel } from "../models/offerModel";
// import { Types } from "mongoose";
// import ValidationHelper from "../utils/validationHelper";
// import { CommonService } from "./commonService";

// class OfferService {
//   private commonService = new CommonService<IOffer>(OfferModel);

//   /**
//    * Private validation logic following your specific helper pattern
//    */
//   private validateOfferData(data: Partial<IOffer>, isUpdate: boolean = false): void {
//     const rules = [
//       !isUpdate
//         ? ValidationHelper.isRequired(data.name, "name")
//         : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

//       (data.name !== undefined ? ValidationHelper.minLength(data.name, "name", 3) : null),

//       !isUpdate
//         ? ValidationHelper.isRequired(data.buttonName, "buttonName")
//         : (data.buttonName !== undefined ? ValidationHelper.isNonEmptyString(data.buttonName, "buttonName") : null),

//       !isUpdate
//         ? ValidationHelper.isRequired(data.products, "products")
//         : (data.products !== undefined ? ValidationHelper.isArray(data.products, "products") : null),

//       ValidationHelper.isBoolean(data.isActive, "isActive"),
//       ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
//     ];

//     const errors = ValidationHelper.validate(rules.filter(r => r !== null));
//     if (errors.length > 0) {
//       throw new Error(errors.map(e => e.message).join(", "));
//     }
//   }

//   async createOffer(data: IOffer): Promise<IOffer> {
//     const activeStats = await offerRepository.getStats();
//     if (activeStats.total >= 3) {
//       throw new Error("Maximum limit of 3 offers reached. Please delete an existing offer before adding a new one.");
//     }

//     this.validateOfferData(data);

//     const capitalizedName = data.name.trim().charAt(0).toUpperCase() + data.name.slice(1);
//     data.name = capitalizedName;

//     if (data.description) {
//         data.description = data.description.trim().charAt(0).toUpperCase() + data.description.slice(1);
//     }

//     const exists = await offerRepository.existsByName(data.name);
//     if (exists) {
//       throw new Error(`Offer with name "${data.name}" already exists.`);
//     }

//     return await offerRepository.createOffer(data);
//   }

//   async getAllOffers() {
//     return await offerRepository.getAllOffers();
//   }

//   async getOfferById(id: string | Types.ObjectId): Promise<IOffer | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await offerRepository.getOfferById(id);
//   }

//   async updateOffer(id: string | Types.ObjectId, data: Partial<IOffer>): Promise<IOffer | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }

//     this.validateOfferData(data, true);

//     if (data.name) {
//       const exists = await offerRepository.existsByName(data.name, id);
//       if (exists) throw new Error(`Another offer with name "${data.name}" already exists.`);
//     }

//     return await offerRepository.updateOffer(id, data);
//   }

//   async toggleStatus(id: string | Types.ObjectId): Promise<IOffer | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }

//     const updatedOffer = await offerRepository.toggleStatus(id);
//     if (!updatedOffer) {
//       throw new Error("Offer not found");
//     }

//     return updatedOffer;
//   }

//   // async softDeleteOffer(id: string | Types.ObjectId): Promise<IOffer | null> {
//   //   const error = ValidationHelper.isValidObjectId(id, "id");
//   //   if (error) {
//   //     throw new Error(error.message);
//   //   }
//   //   return await offerRepository.softDeleteOffer(id);
//   // }

//   async deleteOfferPermanently(id: string | Types.ObjectId): Promise<IOffer | null> {
//     const error = ValidationHelper.isValidObjectId(id, "id");
//     if (error) {
//       throw new Error(error.message);
//     }
//     return await offerRepository.deleteOfferPermanently(id);
//   }

//   async getOfferStats() {
//     return await offerRepository.getStats();
//   }

//   async checkDuplicateName(name: string, excludeId?: string): Promise<boolean> {
//     return await offerRepository.existsByName(name, excludeId);
//   }
// }

// export default new OfferService();

// offerService.ts
import offerRepository from "../repositories/offerRepository";
import { IOffer, OfferModel } from "../models/offerModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";

class OfferService {
  /**
   * Validation logic for Offer Data
   */
  private validateOfferData(
    data: Partial<IOffer>,
    isUpdate: boolean = false,
  ): void {
    // 1. Manual check for Banner Enum (Since helper might not have isInArray)
    if (data.banner && !["Banner 1", "Banner 2"].includes(data.banner)) {
      throw new Error("Banner must be either 'Banner 1' or 'Banner 2'");
    }

    const rules = [
      // Banner Required Check
      !isUpdate
        ? ValidationHelper.isRequired(data.banner, "banner")
        : data.banner !== undefined
          ? ValidationHelper.isNonEmptyString(data.banner, "banner")
          : null,

      // Name Validation
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : data.name !== undefined
          ? ValidationHelper.isNonEmptyString(data.name, "name")
          : null,
      data.name !== undefined
        ? ValidationHelper.minLength(data.name, "name", 3)
        : null,

      // Button Validation
      !isUpdate
        ? ValidationHelper.isRequired(data.buttonName, "buttonName")
        : data.buttonName !== undefined
          ? ValidationHelper.isNonEmptyString(data.buttonName, "buttonName")
          : null,

      // Products Validation (Strictly 2 arguments)
      !isUpdate
        ? ValidationHelper.isRequired(data.products, "products")
        : data.products !== undefined
          ? ValidationHelper.isArray(data.products, "products")
          : null,
    ];

    const errors = ValidationHelper.validate(rules.filter((r) => r !== null));
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
  }

  async createOffer(data: IOffer): Promise<IOffer> {
    this.validateOfferData(data);

    // ENUM LIMIT CHECK: 3 offers per specific banner type
    const bannerUsage = await offerRepository.countByBannerType(data.banner);
    if (bannerUsage >= 3) {
      throw new Error(
        `Maximum offers reached for ${data.banner}. This slot allows only 3 offers.`,
      );
    }

    const capitalizedName =
      data.name.trim().charAt(0).toUpperCase() + data.name.slice(1);
    data.name = capitalizedName;

    if (data.description) {
      data.description =
        data.description.trim().charAt(0).toUpperCase() +
        data.description.slice(1);
    }

    const exists = await offerRepository.existsByName(data.name);
    if (exists) {
      throw new Error(`Offer with name "${data.name}" already exists.`);
    }

    return await offerRepository.createOffer(data);
  }

  async updateOffer(
    id: string | Types.ObjectId,
    data: Partial<IOffer>,
  ): Promise<IOffer | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    this.validateOfferData(data, true);

    // If banner is being updated, check usage of the new banner slot
    if (data.banner) {
      const bannerUsage = await offerRepository.countByBannerType(
        data.banner,
        id,
      );
      if (bannerUsage >= 3) {
        throw new Error(
          `Cannot move offer to ${data.banner}. That slot is already full (3/3).`,
        );
      }
    }

    if (data.name) {
      const exists = await offerRepository.existsByName(data.name, id);
      if (exists)
        throw new Error(
          `Another offer with name "${data.name}" already exists.`,
        );
    }

    return await offerRepository.updateOffer(id, data);
  }

  async getAllOffers() {
    return await offerRepository.getAllOffers();
  }

  async getOfferById(id: string | Types.ObjectId): Promise<IOffer | null> {
    return await offerRepository.getOfferById(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IOffer | null> {
    const updatedOffer = await offerRepository.toggleStatus(id);
    if (!updatedOffer) throw new Error("Offer not found");
    return updatedOffer;
  }

  async deleteOfferPermanently(
    id: string | Types.ObjectId,
  ): Promise<IOffer | null> {
    return await offerRepository.deleteOfferPermanently(id);
  }

  async getOfferStats() {
    return await offerRepository.getStats();
  }

  async checkDuplicateName(name: string, excludeId?: string): Promise<boolean> {
    return await offerRepository.existsByName(name, excludeId);
  }
}

export default new OfferService();
