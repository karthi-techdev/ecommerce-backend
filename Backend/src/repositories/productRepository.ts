import { ProductModel, IProduct } from "../models/productModel";
import { Types } from "mongoose";
import { CommonRepository } from "./commonRepository";

class productRepository {
  private commonRepository: CommonRepository<IProduct>;

  constructor() {
    this.commonRepository = new CommonRepository(ProductModel);
  }

  async createProduct(data: IProduct): Promise<IProduct> {
    return await ProductModel.create(data);
  }

  async getAllProducts(page = 1, limit = 10, filter?: string) {
    try {
      const query: any = { isDeleted: false };

      if (filter === "active") query.status = "active";
      if (filter === "inactive") query.status = "inactive";

      const skip = (page - 1) * limit;

      const [data, stats, total] = await Promise.all([
        ProductModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate("mainCategoryId", "name")
          .populate("subCategoryId", "name")
          .populate("categoryId", "name")
          .populate("brandId", "name")
          .exec(),

        this.commonRepository.getStats(),

        ProductModel.find({ isDeleted: false }).countDocuments()
      ]);

      const totalPages = Math.ceil(stats.total / limit) || 1;

      return {
        data,
        meta: {
          ...stats,
          totalPages,
          page,
          limit,
          total
        }
      };

    } catch (error) {
      console.error("Error in getAllProducts:", error);
      throw error;
    }
  }

  async getProductById(id: string | Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findById(id)
      .populate("mainCategoryId", "name")
      .populate("subCategoryId", "name")
      .populate("categoryId", "name")
      .populate("brandId", "name");
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    return await ProductModel.findOne({ slug, isDeleted: false });
  }

  async getStats() {
    const total = await ProductModel.find({ isDeleted: false }).countDocuments();
    const active = await ProductModel.find({ isDeleted: false, status: "active" }).countDocuments();
    const inactive = await ProductModel.find({ isDeleted: false, status: "inactive" }).countDocuments();

    return { total, active, inactive };
  }

  async updateProduct(
    id: string | Types.ObjectId,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  async softDeleteProduct(id: string | Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async permanantDeleteProduct(id: string | Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findByIdAndDelete(id);
  }

  async restoreProduct(id: string | Types.ObjectId): Promise<IProduct | null> {
    return await ProductModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
  }

  async toggleStatus(id: string): Promise<IProduct | null> {
    return await this.commonRepository.toggleStatus(id);
  }

  async isExistSlug(
    slug: string,
    categoryId: Types.ObjectId
  ): Promise<IProduct | null> {
    return await ProductModel.findOne({ slug, categoryId });
  }

  async getTrashProducts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const data = await ProductModel.find({ isDeleted: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("mainCategoryId", "name")
      .populate("subCategoryId", "name")
      .populate("categoryId", "name")
      .populate("brandId", "name");

    const total = await ProductModel.countDocuments({ isDeleted: true });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export default new productRepository();
