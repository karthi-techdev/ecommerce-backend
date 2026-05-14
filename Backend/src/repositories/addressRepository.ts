import { AddressModel, IAddress } from "../models/addressModal";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class AddressRepository {
  private commonRepository: CommonRepository<IAddress>;

  constructor() {
    this.commonRepository = new CommonRepository(AddressModel);
  }

  async createAddress(data: IAddress): Promise<IAddress> {
    return await AddressModel.create(data);
  }

  async getAllAddresses(
    page = 1,
    limit = 10,
    filter?: string,
    // userId?: string
  ) {
    try {
      const listMatch: any = { isDeleted: false };

      if (filter === "default") listMatch.isDefault = true;
      if (filter === "non-default") listMatch.isDefault = false;
      // if (userId) listMatch.userId = new Types.ObjectId(userId);

      const skip = (page - 1) * limit;

      const data = await AddressModel.find(listMatch)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const [total, defaultCount, nonDefaultCount] = await Promise.all([
        AddressModel.countDocuments({ isDeleted: false }),
        AddressModel.countDocuments({ isDeleted: false, isDefault: true }),
        AddressModel.countDocuments({ isDeleted: false, isDefault: false }),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));

      return {
        data,
        meta: {
          total,
          default: defaultCount,
          nonDefault: nonDefaultCount,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error("Error in getAllAddresses:", error);
      throw error;
    }
  }

  async getAddressById(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    return await AddressModel.findById(id);
  }

  async updateAddress(
    id: string | Types.ObjectId,
    data: Partial<IAddress>
  ): Promise<IAddress | null> {
    return await AddressModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteAddress(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    return await AddressModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreAddress(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    return await AddressModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
  }

  async deleteAddressPermanently(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    return await AddressModel.findByIdAndDelete(id);
  }

  // async toggleDefault(
  //   id: string | Types.ObjectId,
  //   userId: string
  // ): Promise<IAddress | null> {
  //   const address = await AddressModel.findById(id);
  //   if (!address) return null;

  //   // Remove default from other addresses of same user
  //   if (!address.isDefault) {
  //     await AddressModel.updateMany(
  //       { userId: new Types.ObjectId(userId), isDefault: true },
  //       { isDefault: false }
  //     );
  //   }

  //   address.isDefault = !address.isDefault;
  //   return await address.save();
  // }

  async getAllTrashAddresses(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const data = await AddressModel.find({ isDeleted: true })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const count = await AddressModel.countDocuments({
        isDeleted: true,
      });

      const totalPages = Math.max(1, Math.ceil(count / limit));

      return {
        data,
        meta: {
          total: count,
          totalPages,
          page,
          limit,
        },
      };
    } catch (error) {
      console.error("Error in getAllTrashAddresses:", error);
      throw error;
    }
  }
}

export default new AddressRepository();