import shipmentMethodRepository from "../repositories/shipmentMethodsRepository";
import { IShipmentMethod, ShipmentMethodModel } from "../models/shipmentMethodsModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";
import { CommonService } from "./commonService";

class ShipmentMethodService {
  private commonService = new CommonService<IShipmentMethod>(ShipmentMethodModel);
  private validateShipmentMethodData(data: Partial<IShipmentMethod>, isUpdate: boolean = false): void {
    const rules = [
      !isUpdate
        ? ValidationHelper.isRequired(data.name, "name")
        : (data.name !== undefined ? ValidationHelper.isNonEmptyString(data.name, "name") 
        : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.slug, "slug")
        : (data.slug !== undefined ? ValidationHelper.isNonEmptyString(data.slug, "slug") : null),
      !isUpdate
        ? ValidationHelper.isRequired(data.price, "price")
        : (data.price !== undefined ? ValidationHelper.isNumber(data.price, "price") : null),
      ValidationHelper.isValidEnum(data.status, "status", ["active", "inactive"]),
      ValidationHelper.isBoolean(data.isDeleted, "isDeleted"),
    ];
    const errors = ValidationHelper.validate(rules);
    if (errors.length > 0) {
      throw new Error(errors.map(e => e.message).join(", "));
    }
  }

  async createShipmentMethod(data: IShipmentMethod): Promise<IShipmentMethod> {
    this.validateShipmentMethodData(data);
    const { name , description } = data;
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
    data.name = capitalizedName;
    data.description = capitalizedDescription;
    const exists = await this.commonService.existsByField("slug", data.slug);
    if (exists) {
      throw new Error(`Shipment ${data.slug} already exists`);
    }
    return await shipmentMethodRepository.createShipmentMethod(data);
  }
  async getAllShipmentMethods(page = 1, limit = 10, filter?: string) {
    return await shipmentMethodRepository.getAllShipmentMethods(page, limit, filter);
  }
  async getShipmentMethodById(id: string | Types.ObjectId): Promise<IShipmentMethod | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await shipmentMethodRepository.getShipmentMethodById(id);
  }
  async updateShipmentMethod(id: string | Types.ObjectId, data: Partial<IShipmentMethod>): Promise<IShipmentMethod | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    this.validateShipmentMethodData(data, true);
    return await shipmentMethodRepository.updateShipmentMethod(id, data);
  }

  async softDeleteShipmentMethod(id: string | Types.ObjectId): Promise<IShipmentMethod | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await shipmentMethodRepository.softDeleteShipmentMethod(id);
  }

  async toggleStatus(id: string | Types.ObjectId): Promise<IShipmentMethod | null> {
    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) {
      throw new Error(error.message);
    }
    return await shipmentMethodRepository.toggleStatus(id);
  }

  async checkDuplicateSlug(slug: string): Promise<boolean> {
    return await shipmentMethodRepository.existsBySlug(slug);
  }
}

export default new ShipmentMethodService();