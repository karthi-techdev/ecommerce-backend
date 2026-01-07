import { Request, Response } from "express";
import sellerService from "../services/sellerService";

class SellerController {
  async register(req: Request, res: Response) {
    try {
      const data = { ...req.body };
      if (req.files) {
        const files = req.files as any;
        if (files.storeLogo) data.storeLogo = `/uploads/${files.storeLogo[0].filename}`;
        if (files.storeBanner) data.storeBanner = `/uploads/${files.storeBanner[0].filename}`;
      }

      const seller = await sellerService.registerSeller(data);

      res.status(201).json({ success: true, data: seller.toJSON() });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const seller = await sellerService.getSellerById(req.params.id);

      if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

      res.json({ success: true, data: seller.toJSON() });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const data = { ...req.body };
      if (req.files) {
        const files = req.files as any;
        if (files.storeLogo) data.storeLogo = `/uploads/${files.storeLogo[0].filename}`;
        if (files.storeBanner) data.storeBanner = `/uploads/${files.storeBanner[0].filename}`;
      }

      const seller = await sellerService.updateSeller(req.params.id, data);

      if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

      res.json({ success: true, data: seller.toJSON() });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const seller = await sellerService.updateStatus(req.params.id, req.body.status);

      if (!seller) return res.status(404).json({ success: false, message: "Seller not found" });

      res.json({ success: true, data: seller.toJSON() });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const sellers = await sellerService.getAllSellers();
      res.json({ success: true, data: sellers });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

export default new SellerController();
