import { AddInfoModel, IAddInfo } from "../models/addInfoModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class AddInfoRepository {
  private commonRepository: CommonRepository<IAddInfo>;

  constructor() {
    this.commonRepository = new CommonRepository(AddInfoModel);
  }

  async createAddInfo(data: IAddInfo): Promise<IAddInfo> {
    return await AddInfoModel.create(data);
  }

 async getAllAddInfos(page = 1, limit = 10, filter = 'total') {
  try {
    let query: any = {
      isDeleted: false, // ✅ FIX HERE
    };

    if (filter === 'active') {
      query.isActive = true;
    } else if (filter === 'inactive') {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;

    const [data, stats] = await Promise.all([
      AddInfoModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec(),
      this.getStats(),
    ]);

    const totalCount = await AddInfoModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit) || 1;

    return {
      data,
      meta: {
        ...stats,
        totalPages,
        page,
        limit,
      },
    };
  } catch (error) {
    console.error('Error in getAllAddInfos:', error);
    throw error;
  }
}

  async getAddInfoById(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    return await AddInfoModel.findOne({ _id: id, isDeleted: false });
  }

  async updateAddInfo(id: string | Types.ObjectId, data: Partial<IAddInfo>): Promise<IAddInfo | null> {
    return await AddInfoModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteAddInfo(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    return await AddInfoModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
  }

  async restoreAddInfo(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    return await AddInfoModel.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
  }

  async deleteAddInfoPermanently(id: string | Types.ObjectId): Promise<IAddInfo | null> {
    return await AddInfoModel.findByIdAndDelete(id);
  }

  async getAllTrashAddInfos(page = 1, limit = 10) {
    try {
      const query: any = { isDeleted: true };

      const skip = (page - 1) * limit;
      const [data, count, stats] = await Promise.all([
        AddInfoModel.find(query).skip(skip).limit(limit).sort({ updatedAt: -1 }).exec(),
        AddInfoModel.countDocuments(query).exec(),
        this.getStats(),
      ]);

      const totalPages = Math.max(1, Math.ceil(count / limit));
      return {
        data,
        meta: {
          ...stats,
          totalTrash: count,
          totalPages,
          page,
          limit
        }
      };
    } catch (error) {
      console.error('Error in getAllTrashAddInfos:', error);
      throw error;
    }
  }

 async getStats() {
  const total = await AddInfoModel.countDocuments({ isDeleted: false });
const active = await AddInfoModel.countDocuments({ isDeleted: false, isActive: true });
const inactive = await AddInfoModel.countDocuments({ isDeleted: false, isActive: false });

  return { total, active, inactive };
}

  async toggleStatus(id: string | Types.ObjectId): Promise<IAddInfo | null> {
  const addInfo = await AddInfoModel.findById(id);
  if (!addInfo) return null;
  addInfo.isActive = !addInfo.isActive;

  return await addInfo.save();
}
  async existsByKey(key: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const query: any = {
      key: { $regex: new RegExp(`^${key.trim()}$`, "i") },
      isDeleted: false
    };
    if (excludeId) {
      query._id = { $ne: typeof excludeId === "string" ? new Types.ObjectId(excludeId) : excludeId };
    }
    const count = await AddInfoModel.countDocuments(query);
    return count > 0;
  }
}

export default new AddInfoRepository();