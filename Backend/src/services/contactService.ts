import contactRepository from "../repositories/contactRepository";
import { IContact, ContactModel } from "../models/contactModal";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "./commonService";

class ContactService {
  private commonService = new CommonService<IContact>(ContactModel);

  // Validation
  private validateContactData(
    data: Partial<IContact>,
    isUpdate: boolean = false
  ): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name") : data.name !== undefined
        ? ValidationHelper.isNonEmptyString(data.name, "name"): null,
      !isUpdate
        ? ValidationHelper.isRequired(data.email, "email"): data.email !== undefined
        ? ValidationHelper.isNonEmptyString(data.email, "email"): null,
      !isUpdate
        ? ValidationHelper.isRequired(data.phone, "phone") : data.phone !== undefined
        ? ValidationHelper.isNonEmptyString(data.phone, "phone"): null,
      !isUpdate
        ? ValidationHelper.isRequired(data.subject, "subject") : data.subject !== undefined
        ? ValidationHelper.isNonEmptyString(data.subject, "subject"): null,
      !isUpdate
        ? ValidationHelper.isRequired(data.message, "message"): data.message !== undefined
        ? ValidationHelper.isNonEmptyString(data.message, "message"): null,
      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
  }

  async createContact(data: IContact): Promise<IContact> {
    this.validateContactData(data);
    if (data.name) {
      data.name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
    }
    if (data.subject) {
      data.subject = data.subject.charAt(0).toUpperCase() + data.subject.slice(1);
    }
    return await contactRepository.createContact(data);
  }

  async getAllContacts(page = 1, limit = 10) {
    return await contactRepository.getAllContacts(page, limit);
  }

  async getContactById(id: string | Types.ObjectId): Promise<IContact | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await contactRepository.getContactById(id);
  }

  async updateContact(id: string | Types.ObjectId, data: Partial<IContact>): Promise<IContact | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateContactData(data, true);
    return await contactRepository.updateContact(id, data);
  }

  async softDeleteContact(id: string | Types.ObjectId): Promise<IContact | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await contactRepository.softDeleteContact(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IContact | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await contactRepository.toggleStatus(id);
  }

  // --- NEW METHODS ---

  async getAllTrashContacts(page = 1, limit = 10) {
    return await contactRepository.getAllTrashContacts(page, limit);
  }

  async restoreContact(id: string | Types.ObjectId): Promise<IContact | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await contactRepository.restoreContact(id);
  }

  async deleteContactPermanently(id: string | Types.ObjectId): Promise<IContact | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await contactRepository.deleteContactPermanently(id);
  }
}

export default new ContactService();