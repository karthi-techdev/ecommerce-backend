import { ISubscribe, subscribeModel } from "../models/subscribeModel";
import { Types } from "mongoose";

class SubscribeRepository{
  
     async findByEmail(email: string): Promise<ISubscribe | null> {
    return await subscribeModel.findOne({ email });
  }

  async create(email: string): Promise<ISubscribe> {
    return await subscribeModel.create({ email });
  }

  
    async findById(id: string | Types.ObjectId): Promise<ISubscribe | null> {
      return await subscribeModel.findById(id);
    }

     async updateSubscribe(
        id: string | Types.ObjectId,
        data: Partial<ISubscribe>
      ): Promise<ISubscribe | null> {
        return await subscribeModel.findByIdAndUpdate(id, data, { new: true });
      }

async getAll(page: number, limit: number, filter: string) {
  const skip = (page - 1) * limit;

  let query: any = {};

  if (filter === "active") query.isActive = true;
  if (filter === "inactive") query.isActive = false;

  const data = await subscribeModel
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await subscribeModel.countDocuments(query);

 
  const totalSubscriber = await subscribeModel.countDocuments();
  const totalActive = await subscribeModel.countDocuments({ isActive: true });
  const totalInactive = await subscribeModel.countDocuments({ isActive: false });

  return {
    data,
    total,
    counts: {
      totalSubscriber,
      totalActive,
      totalInactive,
    },
  };
}

 async permanantDelete(id: string | Types.ObjectId): Promise<ISubscribe | null> {
    return await subscribeModel.findByIdAndDelete(id);
  }

  async toggleActive(
      id: string | Types.ObjectId
    ): Promise<ISubscribe | null> {
      const sub= await subscribeModel.findById(id);
      if (!sub) return null;
  
      sub.isActive = !sub.isActive;
      return await sub.save();
    }
}

export default new SubscribeRepository();
