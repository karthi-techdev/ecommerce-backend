import { Types } from "mongoose";
import { ITestimonial, TestimonialModel } from "../models/testimonialModel";
import testimonialRepository from "../repositories/testimonialRepository";
import ValidationHelper from "../utils/validationHelper";


class TestimonialService {
  private validateTestimonialData(
    data: Partial<ITestimonial>,
    isUpdate: boolean = false
  ): void {

    if (!isUpdate) {
      if (!data.name) throw new Error("name is required");
      if (!data.message) throw new Error("message is required");
      if (!data.image) throw new Error("image is required");
    }

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    if (data.message !== undefined && data.message.trim() === "") {
      throw new Error("message cannot be empty");
    }


    if (data.image !== undefined && data.image.trim() === "") {
      throw new Error("image cannot be empty");
    }

    if (
      data.isActive !== undefined &&
      typeof data.isActive !== "boolean"
    ) {
      throw new Error("isActive must be boolean");
    }
  }

  async createTestimonial(data: Partial<ITestimonial>): Promise<ITestimonial> {
    this.validateTestimonialData(data, false);

    if (!data.name) {
      throw new Error("Name is required");
    }

    const trimmedName = data.name.trim();

    const exists = await TestimonialModel.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
      isDeleted: false
    });

    if (exists) {
      throw new Error("Testimonial name already exists");
    }

    return await testimonialRepository.createTestimonial({
      ...data,
      name: trimmedName
    } as ITestimonial);
  }


  async getAllTestimonial(
    page = 1,
    limit = 10,
    filter?: string,
    includeDeleted = false
  ) {
    return await testimonialRepository.getAllTestimonial(page, limit, filter, includeDeleted);
  }

  async updateTestimonial(id: string, data: Partial<ITestimonial>): Promise<ITestimonial | null> {

    if (data.name) {
      data.name = data.name.trim();

      const existingTestimonial = await TestimonialModel.findOne({
        name: data.name,
        _id: { $ne: id }
      });

      if (existingTestimonial) {
        throw new Error(' name already exists');
      }
    }

    return await TestimonialModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteTestimonial(
    id: string | Types.ObjectId
  ): Promise<ITestimonial | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    return await testimonialRepository.softDeleteTestimonial(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<ITestimonial | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    const testimonial = await testimonialRepository.findById(id);
    if (!testimonial) throw new Error("Testimonial not found");

    const updatedTestimonial = await testimonialRepository.updateTestimonial(id, {
      isActive: !testimonial.isActive
    });

    return updatedTestimonial;
  }

  async hardDeleteTestimonial(
    id: string | Types.ObjectId
  ): Promise<ITestimonial | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    return await testimonialRepository.deleteTestimonial(id);
  }

  async getTestimonialById(id: string | Types.ObjectId): Promise<ITestimonial | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    const testimonial = await testimonialRepository.findById(id);

    if (!testimonial) throw new Error("Testimonial not found");

    return testimonial;
  }

}

export default new TestimonialService();