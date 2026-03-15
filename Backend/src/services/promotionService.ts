import promotionRepository from "../repositories/promotionRepository";
import { IPromotion } from "../models/promotionModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { PromotionModel } from "../models/promotionModel";
import { CommonService } from "./commonService";

class PromotionService {
  private commonService = new CommonService<IPromotion>(PromotionModel);
  private validatePromotionsData(
    data: Partial<IPromotion>,
    isUpdate: boolean = false,
  ): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name") ||
          (data.name !== undefined
            ? ValidationHelper.isNonEmptyString(data.name?.trim(), "name")
            : null) ||
          (data.name !== undefined
            ? ValidationHelper.minLength(data.name.trim(), "name", 3)
            : null) ||
          (data.name !== undefined
            ? ValidationHelper.maxLength(data.name.trim(), "name", 200)
            : null)
        : null,
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
  }

  async createPromotions(data: IPromotion): Promise<IPromotion> {
    this.validatePromotionsData(data);
    const exists = await promotionRepository.existsByName(data.name);
    if (exists) {
      throw new Error("Promotions with this name already exists");
    }

    data.name = data.name[0].toUpperCase() + data.name.slice(1);
    console.log("daaa", data);
    return await promotionRepository.createPromotions(data);
  }

  async getAllPromotions(page = 1, limit = 10, filter?: string) {
    return await promotionRepository.getAllPromotions(page, limit, filter);
  }

  async getPromotionsById(
    id: string | Types.ObjectId,
  ): Promise<IPromotion | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await promotionRepository.getPromotionsById(id);
  }

  async updatePromotions(
    id: string | Types.ObjectId,
    data: Partial<IPromotion>,
  ): Promise<IPromotion | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validatePromotionsData(data, true);
    if (data.name) {
      const exists = await promotionRepository.existsByName(
        data.name,
        id as string,
      );
      if (exists) {
        throw new Error("Promotions with this question already exists");
      }
      data.name = data.name[0].toUpperCase() + data.name.slice(1);
    }

    return await promotionRepository.updatePromotions(id, data);
  }

  async softDeletePromotions(
    id: string | Types.ObjectId,
  ): Promise<IPromotion | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await promotionRepository.softDeletePromotions(id);
  }
  async getStats() {
    return await promotionRepository.getStats();
  }
  //   async toggleStatus(id: string | Types.ObjectId): Promise<IFaq | null> {
  //     const error = ValidationHelper.isValidObjectId(id, "id");
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //     return await faqRepository.toggleStatus(id);
  //   }
  //   async getAllTrashFaqs(page = 1, limit = 10, filter?: string) {
  //     return await faqRepository.getAllTrashFaqs(page, limit, filter);
  //   }

  //   async restoreFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
  //     const error = ValidationHelper.isValidObjectId(id, "id");
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //     return await faqRepository.restoreFaq(id);
  //   }

  //   async deleteFaqPermanently(id: string | Types.ObjectId): Promise<IFaq | null> {
  //     const error = ValidationHelper.isValidObjectId(id, "id");
  //     if (error) {
  //       throw new Error(error.message);
  //     }
  //     return await faqRepository.deleteFaqPermanently(id);
  //   }
  //   async checkDuplicateFaq(question: string, excludeId?: string): Promise<boolean> {
  //     return await faqRepository.existsByQuestion(question, excludeId);
  //   }
}

export default new PromotionService();
