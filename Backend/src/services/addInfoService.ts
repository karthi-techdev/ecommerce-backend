import addInfoRepository from "../repositories/addInfoRepository";
import { IAddInfo, AddInfoModel } from "../models/addInfoModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "./commonService";

class AddInfoService {
  private commonService = new CommonService<IAddInfo>(AddInfoModel);

  private validateAddInfoData(data: Partial<IAddInfo>, isUpdate: boolean = false): void {
    const rules = [
      // Validation for Key
      !isUpdate
        ? (
            ValidationHelper.isRequired(data.key, 'key')
            || (data.key !== undefined ? ValidationHelper.isNonEmptyString(data.key?.trim(), 'key') : null)
            || (data.key !== undefined ? ValidationHelper.minLength(data.key.trim(), 'key', 2) : null)
            || (data.key !== undefined ? ValidationHelper.maxLength(data.key.trim(), 'key', 100) : null)
          )
        : null,

      // Validation for Value
      !isUpdate
        ? (
            ValidationHelper.isRequired(data.value, 'value')
            || (data.value !== undefined ? ValidationHelper.isNonEmptyString(data.value?.trim(), 'value') : null)
            || (data.value !== undefined ? ValidationHelper.minLength(data.value.trim(), 'value', 1) : null)
            || (data.value !== undefined ? ValidationHelper.maxLength(data.value.trim(), 'value', 2000) : null)
          )
        : null,

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];

    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createAddInfo(data: IAddInfo): Promise<IAddInfo> {
    this.validateAddInfoData(data);

    // Check for duplicate key
    const exists = await addInfoRepository.existsByKey(data.key);
    if (exists) {
      throw new Error("Additional Info with this key already exists");
    }

    // Capitalize first letters for consistency
    data.key = data.key.trim();
    data.value = data.value[0].toUpperCase() + data.value.slice(1);

    return await addInfoRepository.createAddInfo(data);
  }

  async getAllAddInfos(
  page = 1,
  limit = 10,
  filter: 'total' | 'active' | 'inactive' = 'total'
) {
  const allowedFilters = ['total', 'active', 'inactive'];

  if (!allowedFilters.includes(filter)) {
    throw new Error('Invalid filter type');
  }

  return await addInfoRepository.getAllAddInfos(page, limit, filter);
}

  async getAddInfoById(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await addInfoRepository.getAddInfoById(id);
  }

  async updateAddInfo(id: string | Types.ObjectId, data: Partial<IAddInfo>): Promise<IAddInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    this.validateAddInfoData(data, true);

    if (data.key) {
      const exists = await addInfoRepository.existsByKey(data.key, id as string);
      if (exists) {
        throw new Error("Additional Info with this key already exists");
      }
      data.key = data.key.trim();
    }

    if (data.value) {
      data.value = data.value[0].toUpperCase() + data.value.slice(1);
    }

    return await addInfoRepository.updateAddInfo(id, data);
  }

  async softDeleteAddInfo(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await addInfoRepository.softDeleteAddInfo(id);
  }

 async getStats() {
  const total = await AddInfoModel.countDocuments({ isDeleted: false });

  const active = await AddInfoModel.countDocuments({
    isDeleted: false,
    isActive: true
  });

  const inactive = await AddInfoModel.countDocuments({
    isDeleted: false,
    isActive: false
  });

  return { total, active, inactive };
}

  async getAllTrashAddInfos(page = 1, limit = 10) {
    return await addInfoRepository.getAllTrashAddInfos(page, limit);
  }

  async restoreAddInfo(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await addInfoRepository.restoreAddInfo(id);
  }

  async deleteAddInfoPermanently(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await addInfoRepository.deleteAddInfoPermanently(id);
  }
  
    async toggleStatus(id: string | Types.ObjectId): Promise<IAddInfo | null> {
  const item = await AddInfoModel.findById(id);
  if (!item) return null;

  item.isActive = !item.isActive; 
  return await item.save();
}

  async checkDuplicateKey(key: string, excludeId?: string): Promise<boolean> {
    return await addInfoRepository.existsByKey(key, excludeId);
  }
}

export default new AddInfoService();