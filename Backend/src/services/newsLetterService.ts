import newsLetterRepository from "../repositories/newsLetterRepository";
import { INewsLetter } from "../models/newsLetterModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { NewsLetterModel } from "../models/newsLetterModel";
import { CommonService } from "./commonService";

class NewsLetterService {
  private commonService = new CommonService<INewsLetter>(NewsLetterModel);
  private validateNewsLetterData(data: Partial<INewsLetter>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") : null),

      (data.name !== undefined ? ValidationHelper.maxLength(data.name, "name", 500) : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),

      (data.slug !== undefined ? ValidationHelper.maxLength(data.slug, "slug", 2000) : null),

    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }



  async createNewsLetter(data: INewsLetter): Promise<INewsLetter> {
    this.validateNewsLetterData(data);
    // const exists = await this.commonService.existsByField("question", dat );
    // if (exists) {
    //   throw new Error("NewsLetter with this question already exists");
    // }
    return await newsLetterRepository.createNewsLetter(data);
  }

  async getAllNewsLetters(page = 1, limit = 10, filter?: string) {
    return await newsLetterRepository.getAllNewsLetters(page, limit);
  }

   async getNewsLetterById(id: string | Types.ObjectId): Promise<INewsLetter | null> {
     const error = ValidationHelper.isValidObjectId(id, "id");
     if (error) {
       throw new Error(error.message);
     }
     return await newsLetterRepository.getNewsLetterById(id);
   }

  async updateNewsLetter(id: string | Types.ObjectId, data: Partial<INewsLetter>): Promise<INewsLetter | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateNewsLetterData(data, true);
    return await newsLetterRepository.updateNewsLetter(id, data);
  }

  async softDeleteNewsLetter(id: string | Types.ObjectId): Promise<INewsLetter | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await newsLetterRepository.softDeleteNewsLetter(id);
  }


}

export default new NewsLetterService();