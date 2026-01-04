import { IUser,UserModel} from "../models/userModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class UserRepository {
    private commonRepository: CommonRepository<IUser>;
  
    constructor() {
      this.commonRepository = new CommonRepository(UserModel);
    }
  
   async createUser(data: IUser): Promise<IUser> {
    return await UserModel.create(data);
  }
  
    async getAllUsers(page = 1, limit = 10, filter?: string) {
      try {
        const query: any = { isDeleted: false };
        if (filter === 'admin') query.role = 'admin';
        if (filter === 'editor') query.role = 'editor';
        if (filter === 'viewer') query.role = 'viewer';
  
        const skip = (page - 1) * limit;
        const [data, stats] = await Promise.all([
          UserModel.find(query).skip(skip).limit(limit).exec(),
          this.commonRepository.getStats(),
        ]);
  
        const totalPages = Math.ceil(stats.total / limit) || 1;
        return {
          data,
          meta: {
            total: stats.total,           
            totalPages,
            page,
            limit
          }
        };
      } catch (error) {
        console.error('Error in getAllUsers:', error);
        throw error;
      }
    }
  
    async getAllTrashUsers(page = 1, limit = 10, filter?: string) {
      try {
        const query: any = { isDeleted: true };
        if (filter === 'admin') query.role = 'admin';
        if (filter === 'editor') query.role = 'editor';
        if (filter === 'viewer') query.role = 'viewer';
  
        const skip = (page - 1) * limit;
        const [data, count, stats] = await Promise.all([
          UserModel.find(query).skip(skip).limit(limit).exec(),
          UserModel.countDocuments(query).exec(),
          this.commonRepository.getStats(),
        ]);
  
        const totalPages = Math.max(1, Math.ceil(count / limit));
        return {
          data,
          meta: {
            total: count,
            totalPages,
            page,
            limit
          }
        };
      } catch (error) {
        console.error('Error in getAllTrashUsers:', error);
        throw error;
      }
    }
  
    async getUserById(id: string | Types.ObjectId): Promise<IUser | null> {
      return await UserModel.findById(id);
    }
  
    async updateUser(id: string | Types.ObjectId, data: Partial<IUser>): Promise<IUser | null> {
      return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }
  
    async softDeleteUser(id: string | Types.ObjectId): Promise<IUser | null> {
      return await UserModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true }
      );
    }
  
    async toggleStatus(id: string | Types.ObjectId): Promise<IUser | null> {
      const stringId = typeof id === "string" ? id : id.toString();
      return await this.commonRepository.toggleStatus(stringId);
    }
  
    async restoreUser(id: string | Types.ObjectId): Promise<IUser | null> {
      return await UserModel.findByIdAndUpdate(
        id,
        { isDeleted: false, status: "active" },
        { new: true }
      );
    }
  
    async deleteUserPermanently(id: string | Types.ObjectId): Promise<IUser | null> {
      return await UserModel.findByIdAndDelete(id);
    }
  }
  
  export default new UserRepository();