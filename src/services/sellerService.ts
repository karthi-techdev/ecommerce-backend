import Seller, { ISeller } from "../models/sellerModel";

class SellerService {
  async registerSeller(data: Partial<ISeller>) {
    const seller = new Seller(data);
    return seller.save();
  }

  async getSellerById(id: string) {
    return Seller.findById(id);
  }

  async updateSeller(id: string, data: Partial<ISeller>) {
    return Seller.findByIdAndUpdate(id, data, { new: true });
  }

  async updateStatus(id: string, status: "active" | "suspended" | "pending") {
    return Seller.findByIdAndUpdate(id, { status }, { new: true });
  }

  async getAllSellers() {
    return Seller.find();
  }
}

export default new SellerService();
