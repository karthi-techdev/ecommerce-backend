import addressRepository from "../repositories/addressRepository";
import { IAddress } from "../models/addressModal";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { AddressModel } from "../models/addressModal";
import { CommonService } from "./commonService";

class AddressService {
  private commonService = new CommonService<IAddress>(AddressModel);

  private validateAddressData(
    data: Partial<IAddress>,
    isUpdate: boolean = false
  ): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.addressType, "addressType")
        : data.addressType !== undefined
        ? ValidationHelper.isNonEmptyString(data.addressType, "addressType")
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.fullName, "fullName")
        : data.fullName !== undefined
        ? ValidationHelper.isNonEmptyString(data.fullName, "fullName")
        : null,

      data.fullName !== undefined
        ? ValidationHelper.minLength(data.fullName, "fullName", 3)
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.phoneNumber, "phoneNumber")
        : data.phoneNumber !== undefined
        ? ValidationHelper.isNonEmptyString(data.phoneNumber, "phoneNumber")
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.streetAddress, "streetAddress")
        : data.streetAddress !== undefined
        ? ValidationHelper.isNonEmptyString(data.streetAddress, "streetAddress")
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.country, "country")
        : data.country !== undefined
        ? ValidationHelper.isNonEmptyString(data.country, "country")
        : null,

      data.state !== undefined
        ? ValidationHelper.isNonEmptyString(data.state, "state")
        : null,

      data.city !== undefined
        ? ValidationHelper.isNonEmptyString(data.city, "city")
        : null,

      !isUpdate
        ? ValidationHelper.isRequired(data.pincode, "pincode")
        : data.pincode !== undefined
        ? ValidationHelper.isNonEmptyString(data.pincode, "pincode")
        : null,

      // data.userId !== undefined
      //   ? ValidationHelper.isValidObjectId(data.userId, "userId")
      //   : null,

      ValidationHelper.isBoolean(data.isDefault, "isDefault"),
      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
  }

  async createAddress(data: IAddress): Promise<IAddress> {
    this.validateAddressData(data);

    // Capitalize name (same pattern you used)
    if (data.fullName) {
      data.fullName =
        data.fullName.charAt(0).toUpperCase() +
        data.fullName.slice(1);
    }

    return await addressRepository.createAddress(data);
  }

  async getAllAddresses(
    page = 1,
    limit = 10,
    filter?: string,
    // userId?: string
  ) {
    return await addressRepository.getAllAddresses(
      page,
      limit,
      filter,
    );
  }

  async getAddressById(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await addressRepository.getAddressById(id);
  }

  async updateAddress(
    id: string | Types.ObjectId,
    data: Partial<IAddress>
  ): Promise<IAddress | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    this.validateAddressData(data, true);

    return await addressRepository.updateAddress(id, data);
  }

  async softDeleteAddress(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await addressRepository.softDeleteAddress(id);
  }

  async restoreAddress(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await addressRepository.restoreAddress(id);
  }

  async deleteAddressPermanently(
    id: string | Types.ObjectId
  ): Promise<IAddress | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await addressRepository.deleteAddressPermanently(id);
  }

  // async toggleDefault(
  //   id: string | Types.ObjectId,
  //   userId: string
  // ): Promise<IAddress | null> {
  //   const error = ValidationHelper.isValidObjectId(id, "id");
  //   if (error) {
  //     throw new Error(error.message);
  //   }

  //   return await addressRepository.toggleDefault(id, userId);
  // }

  async getAllTrashAddresses(page = 1, limit = 10) {
    return await addressRepository.getAllTrashAddresses(page, limit);
  }
}

export default new AddressService();