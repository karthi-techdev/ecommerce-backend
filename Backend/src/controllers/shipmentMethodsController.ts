import { Request, Response, NextFunction } from "express";
import shipmentMethodService from "../services/shipmentMethodsService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class ShipmentMethodController {
  async createShipmentMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, slug, price, status } = req.body;    
      if (!name || !slug || price === undefined || !status) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Required fields are missing" });
        return;
      }
      const shipmentMethod = await shipmentMethodService.createShipmentMethod(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Shipment method created successfully", data:shipmentMethod});
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllShipmentMethods(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;     
      const result = await shipmentMethodService.getAllShipmentMethods(page, limit, filter);
     
      res.status(200).json({status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            active: result.meta.active,
            inactive: result.meta.inactive,
            totalPages: result.meta.totalPages,
            page: result.meta.page,
            limit: result.meta.limit
          }
        }
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getShipmentMethodById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const method = await shipmentMethodService.getShipmentMethodById(id);
      if (!method) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Shipment method not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: method });
    } catch (err: any) {
      next(err);
    }
  }

  async updateShipmentMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const updatedMethod = await shipmentMethodService.updateShipmentMethod(id, req.body);
      if (!updatedMethod) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Shipment method not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Shipment method updated successfully",  data: updatedMethod  });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteShipmentMethod(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const method = await shipmentMethodService.softDeleteShipmentMethod(id);
      if (!method) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Shipment method not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS,  message: "Shipment method deleted successfully", data: method  });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const updated = await shipmentMethodService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Shipment method not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS,  message: "Status updated successfully",  data: updated });
    } catch (error) {
      next(error);
    }
  }

  async checkDuplicateSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.body;
      if (!slug) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Slug is required" });
        return;
      }
      const exists = await shipmentMethodService.checkDuplicateSlug(slug);
      if (exists) {
      throw new Error(`Name already exists`);
    }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, exists });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new ShipmentMethodController();