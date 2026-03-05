import { Types } from "mongoose";
import { ITestimonial, TestimonialModel } from "../models/testimonialModel";



class TestimonialRepository {

  async createTestimonial(data: ITestimonial): Promise<ITestimonial> {
    try {
      return await TestimonialModel.create(data);
    } catch (error: any) {

      if (error.code === 11000) {
        throw new Error("Testimonial name already exists");
      }

      throw error;
    }
  }
  async getAllTestimonial(
    page = 1,
    limit = 10,
    filter?: string,
    includeDeleted = false
  ) {
    const query: any = {};
    query.isDeleted = includeDeleted ? true : false;

    if (filter === "active") query.isActive = true;
    else if (filter === "inactive") query.isActive = false;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      TestimonialModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      TestimonialModel.countDocuments(query).exec(),
    ]);


    const totalPages = Math.ceil(total / limit) || 1;
    const totalTestimonial = await TestimonialModel.countDocuments({ isDeleted: false });
    const totalActive = await TestimonialModel.countDocuments({ isDeleted: false, isActive: true });
    const totalInactive = await TestimonialModel.countDocuments({ isDeleted: false, isActive: false });

    return {
      data,
      meta: { total, totalPages, page, limit },
      counts: { totalTestimonial, totalActive, totalInactive },
    };
  }


  async updateTestimonial(
    id: string | Types.ObjectId,
    data: Partial<ITestimonial>
  ): Promise<ITestimonial | null> {
    return await TestimonialModel.findByIdAndUpdate(id, data, { new: true });
  }
  async softDeleteTestimonial(id: string | Types.ObjectId) {
    return await TestimonialModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
  }

  async deleteTestimonial(id: string | Types.ObjectId): Promise<ITestimonial | null> {
    return await TestimonialModel.findByIdAndDelete(id);
  }


  async findById(id: string | Types.ObjectId): Promise<ITestimonial | null> {
    return await TestimonialModel.findById(id);
  }


  async toggleActive(
    id: string | Types.ObjectId
  ): Promise<ITestimonial | null> {
    const subCategory = await TestimonialModel.findById(id);
    if (!subCategory) return null;

    subCategory.isActive = !subCategory.isActive;
    return await subCategory.save();
  }

  async deleteTestimonialPermanently(id: string | Types.ObjectId): Promise<ITestimonial | null> {
    return await TestimonialModel.findByIdAndDelete(id);
  }

  async existsByname(name: string, excludeId?: string | Types.ObjectId): Promise<boolean> {
    const query: any = {
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      isDeleted: false
    };
    if (excludeId) {
      query._id = { $ne: typeof excludeId === "string" ? new Types.ObjectId(excludeId) : excludeId };
    }
    const count = await TestimonialModel.countDocuments(query);
    return count > 0;
  }


}

export default new TestimonialRepository();