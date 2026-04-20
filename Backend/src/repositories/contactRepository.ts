import { ContactModel, IContact } from "../models/contactModal";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class ContactRepository {
  private commonRepository: CommonRepository<IContact>;

  constructor() {
    this.commonRepository = new CommonRepository(ContactModel);
  }

  async createContact(data: Partial<IContact>): Promise<IContact> {
    return await ContactModel.create({ ...data, isDeleted: false });
  }

  async getAllContacts(page = 1, limit = 10) {
  try {
    const query: any = { isDeleted: false };

    const skip = (page - 1) * limit;

    const [data, total, active, inactive] = await Promise.all([
      ContactModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),

      ContactModel.countDocuments(query),

      ContactModel.countDocuments({ ...query, status: 'active' }),

      ContactModel.countDocuments({ ...query, status: 'inactive' }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data,
      meta: {
        total,
        active,
        inactive,
        totalPages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error('Error in getAllContacts:', error);
    throw error;
  }
}

  async getContactById(id: string | Types.ObjectId): Promise<IContact | null> {
    return await ContactModel.findOne({ _id: id, isDeleted: false });
  }

  async updateContact( id: string | Types.ObjectId, data: Partial<IContact>): Promise<IContact | null> {
    return await ContactModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteContact(id: string | Types.ObjectId ): Promise<IContact | null> {
    return await ContactModel.findByIdAndUpdate(id,{ isDeleted: true },{ new: true });
  }
  async toggleStatus(id: string | Types.ObjectId): Promise<IContact | null> {
  const stringId = typeof id === "string" ? id : id.toString();
  return await this.commonRepository.toggleStatus(stringId);
  }
  async getAllTrashContacts(page = 1, limit = 10) {
    try {
      const query = { isDeleted: true };
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        ContactModel.find(query)
          .sort({ updatedAt: -1 }) 
          .skip(skip)
          .limit(limit)
          .lean(),
        ContactModel.countDocuments(query),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        data,
        meta: {
          total,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error("Error in getAllTrashContacts:", error);
      throw error;
    }
  }

  async restoreContact(id: string | Types.ObjectId): Promise<IContact | null> {
    return await ContactModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
  }

  async deleteContactPermanently(id: string | Types.ObjectId): Promise<IContact | null> {
    return await ContactModel.findByIdAndDelete(id);
  }
}

export default new ContactRepository();