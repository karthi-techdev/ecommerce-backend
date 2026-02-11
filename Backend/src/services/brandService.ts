import brandRepository from "../repositories/brandRepository";
import { IBrand , BrandModel} from "../models/brandModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";

class BrandService {

  private validateBrandData(
    data: Partial<IBrand>,
    isUpdate: boolean = false
  ): void {

    if (!isUpdate) {
      if (!data.name) throw new Error("name is required");
      if (!data.slug) throw new Error("slug is required");
      if (!data.description) throw new Error("description is required");
      if (!data.image) throw new Error("image is required");
    }

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    if (data.slug !== undefined && data.slug.trim() === "") {
      throw new Error("slug cannot be empty");
    }

    if (data.description !== undefined && data.description.trim() === "") {
      throw new Error("description cannot be empty");
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


  // CREATE
  async createBrand(data: Partial<IBrand>): Promise<IBrand> {
    this.validateBrandData(data, false);
    return await brandRepository.createBrand(data as IBrand);
  }

  // GET ALL
async getAllBrands(
  page = 1,
  limit = 10,
  filter?: string,
  includeDeleted = false
) {
  return await brandRepository.getAllBrands(page, limit, filter, includeDeleted);
}



  // UPDATE
 async updateBrand(id: string, data: Partial<IBrand>): Promise<IBrand | null> {

  if (data.name) {
    data.name = data.name.trim();

    const existingBrand = await BrandModel.findOne({
      name: data.name,
      _id: { $ne: id }
    });

    if (existingBrand) {
      throw new Error('Brand name already exists');
    }
  }

  return await BrandModel.findByIdAndUpdate(id, data, { new: true });
}


  // SOFT DELETE
  async softDeleteBrand(
    id: string | Types.ObjectId
  ): Promise<IBrand | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    return await brandRepository.softDeleteBrand(id);
  }

  // RESTORE
  async restoreBrand(
    id: string | Types.ObjectId
  ): Promise<IBrand | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    return await brandRepository.restoreBrand(id);
  }

  // HARD DELETE
  async hardDeleteBrand(
    id: string | Types.ObjectId
  ): Promise<IBrand | null> {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    return await brandRepository.deleteBrand(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IBrand | null> {
  const error = ValidationHelper.isValidObjectId(id, "id");
  if (error) throw new Error(error.message);

  const brand = await brandRepository.findById(id);
  if (!brand) throw new Error("Brand not found");

  const updatedBrand = await brandRepository.updateBrand(id, {
    isActive: !brand.isActive
  });

  return updatedBrand;
}


async getBrandById(id: string | Types.ObjectId): Promise<IBrand | null> {

  const error = ValidationHelper.isValidObjectId(id, "id");
  if (error) throw new Error(error.message);

  const brand = await brandRepository.findById(id);

  if (!brand) throw new Error("Brand not found");

  return brand;
}

async getTrashBrands(page: number, limit: number) {
  return await brandRepository.getTrashBrands(page, limit);
}



}

export default new BrandService();
