import SellerModel, { ISeller } from "../models/sellerModel";
import { Types } from "mongoose";

class SellerRepository {
  create(data: Partial<ISeller>) {
    return SellerModel.create(data);
  }

  findByEmail(email: string) {
    return SellerModel.findOne({ email });
  }

  findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid seller ID");
    return SellerModel.findById(id);
  }

  updateById(id: string, data: Partial<ISeller>) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid seller ID");
    return SellerModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new SellerRepository();
