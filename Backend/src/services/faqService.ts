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
  ? (
      ValidationHelper.isRequired(data.question, 'question')
      ||(data.question !== undefined? ValidationHelper.isNonEmptyString(data.question?.trim(), 'question'):null)
      ||( data.question !== undefined?ValidationHelper.minLength(data.question.trim(), 'question', 5):null)
      || (data.question !== undefined?ValidationHelper.maxLength(data.question.trim(), 'question', 500):null)
    )
  : null,
  !isUpdate
  ? (
      ValidationHelper.isRequired(data.answer, 'answer')
      ||(data.answer !== undefined? ValidationHelper.isNonEmptyString(data.answer?.trim(), 'answer'):null)
      ||( data.answer !== undefined?ValidationHelper.minLength(data.answer.trim(), 'answer', 5):null)
      || (data.answer !== undefined?ValidationHelper.maxLength(data.answer.trim(), 'answer', 2000):null)
    )
  : null,

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
   const exists = await faqRepository.existsByQuestion(data.question);
    if (exists) {
      throw new Error("FAQ with this question already exists");
    }
     data.question=data.question[0].toUpperCase()+data.question.slice(1);
    data.answer=data.answer[0].toUpperCase()+data.answer.slice(1);
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
    if(data.question){
      const exists = await faqRepository.existsByQuestion(data.question, id as string);
    if (exists) {
      throw new Error("FAQ with this question already exists");
    }
       data.question=data.question[0].toUpperCase()+data.question.slice(1);
    
    }
    if(data.answer){
      data.answer=data.answer[0].toUpperCase()+data.answer.slice(1);
    }
    return await faqRepository.updateFaq(id, data);
  }

  async softDeleteFaq(id: string | Types.ObjectId): Promise<IFaq | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await faqRepository.softDeleteFaq(id);
  }
 async getStats(){
    return await faqRepository.getStats();
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
  async checkDuplicateFaq(question: string, excludeId?: string): Promise<boolean> {
    return await faqRepository.existsByQuestion(question, excludeId);
  }
}

export default new FaqService();