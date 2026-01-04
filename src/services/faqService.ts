import faqRepository from "../repositories/faqRepository";
import { IFaq } from "../models/faqModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { FaqModel } from "../models/faqModel";
import { CommonService } from "./commonService";

class FaqService {
  private commonService = new CommonService<IFaq>(FaqModel);
  private validateFaqData(data: Partial<IFaq>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.question, "question")
        : (data.question !== undefined ? ValidationHelper.isNonEmptyString(data.question, "question") : null),

      (data.question !== undefined ? ValidationHelper.maxLength(data.question, "question", 500) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.answer, "answer")
        : (data.answer !== undefined ? ValidationHelper.isNonEmptyString(data.answer, "answer") : null),

      (data.answer !== undefined ? ValidationHelper.maxLength(data.answer, "answer", 2000) : null),

      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }



  async createFaq(data: IFaq): Promise<IFaq> {
    this.validateFaqData(data);
    const exists = await this.commonService.existsByField("question", data.question);
    if (exists) {
      throw new Error("FAQ with this question already exists");
    }['k, ']
    return await faqRepository.createFaq(data);
  }

  async getAllFaqs(page = 1, limit = 10, filter?: string) {
    return await faqRepository.getAllFaqs(page, limit, filter);
  }

  async getFaqById(id: string | Types.ObjectId): Promise<IFaq | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await faqRepository.getFaqById(id);
  }

  async updateFaq(id: string | Types.ObjectId, data: Partial<IFaq>): Promise<IFaq | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateFaqData(data, true);
    return await faqRepository.updateFaq(id, data);
  }

  async softDeleteFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await faqRepository.softDeleteFaq(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IFaq | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await faqRepository.toggleStatus(id);
  }
  async getAllTrashFaqs(page = 1, limit = 10, filter?: string) {
    return await faqRepository.getAllTrashFaqs(page, limit, filter);
  }

    async restoreFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) {
        throw new Error(error.message);
      }
      return await faqRepository.restoreFaq(id);
    }

    async deleteFaqPermanently(id: string | Types.ObjectId): Promise<IFaq | null> {
      const error = ValidationHelper.isValidObjectId(id, "id");
      if (error) {
        throw new Error(error.message);
      }
      return await faqRepository.deleteFaqPermanently(id);
    }
}

export default new FaqService();