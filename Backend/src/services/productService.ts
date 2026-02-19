import { IProduct, ProductModel } from "../models/productModel";
import ValidationHelper from "../utils/validationHelper";
import { Types } from "mongoose";
import { CommonService } from "./commonService";
import productRepository from "../repositories/productRepository";

class productService {
  private commonService = new CommonService<IProduct>(ProductModel);

  private validateProductData(
    data: Partial<IProduct>,
    isUpdate: boolean = false
  ): void { 
      Object.keys(data).forEach((key) => {
        if ((data as any)[key] === "") {
          delete (data as any)[key];
        }
      });
    const rules = [
      !isUpdate
        ? (
            ValidationHelper.isRequired(data.name, "name") ||
            (data.name !== undefined
              ? ValidationHelper.isNonEmptyString(data.name?.trim(), "name")
              : null) ||
            (data.name !== undefined
              ? ValidationHelper.minLength(data.name.trim(), "name", 3)
              : null) ||
            (data.name !== undefined
              ? ValidationHelper.maxLength(data.name.trim(), "name", 300)
              : null)
          )
        : null,

      !isUpdate
        ? (
            ValidationHelper.isRequired(data.description, "description") ||
            (data.description !== undefined
              ? ValidationHelper.isNonEmptyString(
                  data.description?.trim(),
                  "description"
                )
              : null) ||
            (data.description !== undefined
              ? ValidationHelper.minLength(
                  data.description.trim(),
                  "description",
                  5
                )
              : null) ||
            (data.description !== undefined
              ? ValidationHelper.maxLength(
                  data.description.trim(),
                  "description",
                  5000
                )
              : null)
          )
        : null,

      !isUpdate
        ? (
            ValidationHelper.isRequired(data.images, "images") ||
            (Array.isArray(data.images) && data.images.length === 0
              ? { field: "images", message: "images is required" }
              : null)
          )
        : null,

      !isUpdate
        ? (
            ValidationHelper.isRequired(data.price, "price") ||
            (data.price !== undefined
              ? ValidationHelper.isNumber(data.price, "price")
              : null)
          )
        : (
            data.price !== undefined
              ? ValidationHelper.isNumber(data.price, "price")
              : null
          ),


      !isUpdate
        ? (
            ValidationHelper.isRequired(data.discountPrice, "discountPrice") ||
            (data.discountPrice !== undefined
              ? ValidationHelper.isNumber(data.discountPrice, "discountPrice")
              : null)
          )
        : (
            data.discountPrice !== undefined
              ? ValidationHelper.isNumber(data.discountPrice, "discountPrice")
              : null
          ),


      !isUpdate
        ? (
            ValidationHelper.isRequired(data.stockQuantity, "stockQuantity") ||
            (data.stockQuantity !== undefined
              ? ValidationHelper.isNumber(data.stockQuantity, "stockQuantity")
              : null)
          )
        : (
            data.stockQuantity !== undefined
              ? ValidationHelper.isNumber(data.stockQuantity, "stockQuantity")
              : null
          ),


      !isUpdate
        ? (
            ValidationHelper.isRequired(data.brandId, "brandId") ||
            (data.brandId !== undefined
              ? ValidationHelper.isValidObjectId(data.brandId, "brandId")
              : null)
          )
        : null,

      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),

      ValidationHelper.isValidEnum(data.status, "status", [
        "active",
        "inactive",
      ]),

      !isUpdate
        ? (
            ValidationHelper.isRequired(data.mainCategoryId, "mainCategoryId") ||
            (data.mainCategoryId !== undefined
              ? ValidationHelper.isValidObjectId(
                  data.mainCategoryId,
                  "mainCategoryId"
                )
              : null)
          )
        : null,

        (data.subCategoryId !== undefined
          ? ValidationHelper.isValidObjectId(
              data.subCategoryId,
              "subCategoryId"
            )
          : null),

        (data.categoryId !== undefined
          ? ValidationHelper.isValidObjectId(
              data.categoryId,
              "categoryId"
            )
          : null),

      
    ];

    const errors = ValidationHelper.validate(rules);

    if (errors.length > 0) {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
  }

  async validateSlug(slug: string) {
    const regex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    return regex.test(slug);
  }

  async slugGenerete(name: string) {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  async createProduct(data: IProduct) {
      if (data.price !== undefined) {
        data.price = Number(data.price as any);
      }
      if (data.discountPrice !== undefined) {
        data.discountPrice = Number(data.discountPrice as any);
      }
      if (data.stockQuantity !== undefined) {
        data.stockQuantity = Number(data.stockQuantity as any);
      }

      this.validateProductData(data);
      

  if (!data.slug) {
    data.slug = await this.slugGenerete(data.name);
  }

  if (!(await this.validateSlug(data.slug))) {
    throw new Error("Invalid slug");
  }

  const existingProduct = await productRepository.isExistSlug(
    data.slug,
    data.categoryId
  );

  if (existingProduct) {
    throw new Error("Name already exists");
  }

  data.name = data.name[0].toUpperCase() + data.name.slice(1);
  data.description =
    data.description[0].toUpperCase() + data.description.slice(1);

  return await productRepository.createProduct(data);
}


  async getAllProducts(page = 1, limit = 10, filter?: string) {
    return await productRepository.getAllProducts(page, limit, filter);
  }

  async getProductById(
    id: string | Types.ObjectId
  ): Promise<IProduct | null> {
    const isProduct = await productRepository.getProductById(id);
    if (isProduct?.isDeleted) {
      return null;
    }
    return isProduct;
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    return await productRepository.getProductBySlug(slug);
  }

  async getStats() {
    return await productRepository.getStats();
  }

  async updateProduct(
  id: string | Types.ObjectId,
  data: Partial<IProduct>
): Promise<IProduct | null> {

  const error = ValidationHelper.isValidObjectId(id, "id");
  if (error) {
    throw new Error(error.message);
  }

  const existingProduct = await productRepository.getProductById(id);
  if (!existingProduct) {
    return null;
  }

  if (data.name && !data.slug) {
    data.slug = await this.slugGenerete(data.name);
  }

  if (data.slug) {
    if (!(await this.validateSlug(data.slug))) {
      throw new Error("Invalid slug");
    }
  }

  if (data.slug || data.categoryId) {

    const slugToCheck = data.slug ?? existingProduct.slug;
    const categoryToCheck = data.categoryId ?? existingProduct.categoryId;

    const duplicate = await productRepository.isExistSlug(
      slugToCheck,
      categoryToCheck
    );

    if (duplicate && duplicate._id.toString() !== id.toString()) {
      throw new Error("Name already exists");
    }
  }
   
  if (data.name) {
    data.name = data.name[0].toUpperCase() + data.name.slice(1);
  }

  if (data.description) {
    data.description =
      data.description[0].toUpperCase() + data.description.slice(1);
  }
  if (data.price !== undefined) {
    data.price = Number(data.price as any);
  }
  if (data.discountPrice !== undefined) {
    data.discountPrice = Number(data.discountPrice as any);
  }
  if (data.stockQuantity !== undefined) {
    data.stockQuantity = Number(data.stockQuantity as any);
  }

  this.validateProductData(data, true);

  return await productRepository.updateProduct(id, data);
}


  async softDeleteProduct(
    id: string | Types.ObjectId
  ): Promise<IProduct | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await productRepository.softDeleteProduct(id);
  }

  async permanantDeleteProduct(
    id: string | Types.ObjectId
  ): Promise<IProduct | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }

    return await productRepository.permanantDeleteProduct(id);
  }

  async restoreProduct(id: string | Types.ObjectId) {
    return await productRepository.restoreProduct(id);
  }

  async getTrashProducts(page = 1, limit = 10) {
    return await productRepository.getTrashProducts(page, limit);
  }

  async toggleStatus(id: string): Promise<IProduct | null> {
    return await productRepository.toggleStatus(id);
  }

  async isExistSlug(
    slug: string,
    categoryId: Types.ObjectId
  ): Promise<IProduct | null> {
    return await productRepository.isExistSlug(slug, categoryId);
  }
}

export default new productService();
