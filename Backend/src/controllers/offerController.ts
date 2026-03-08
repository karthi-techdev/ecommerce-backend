import { Request, Response, NextFunction } from "express";
import offerService from "../services/offerService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class OfferController {
  async createOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, buttonName, products } = req.body;
      
      if (!name || !buttonName || !products) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Required fields (name, buttonName, products) are missing",
        });
        return;
      }

      const offer = await offerService.createOffer(req.body);
      
      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Offer created successfully",
        data: offer
      });
    } catch (err: any) {
      if (err.message && (err.message.includes("limit") || err.message.includes("exists"))) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllOffers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await offerService.getAllOffers();
      
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            active: result.meta.active,
            inactive: result.meta.inactive,
          },
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getOfferById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer id is required" });
        return;
      }

      const offer = await offerService.getOfferById(id);
      if (!offer) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Offer not found" });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: offer });
    } catch (err: any) {
      next(err);
    }
  }

  async updateOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer id is required" });
        return;
      }

      const updatedOffer = await offerService.updateOffer(id, req.body);
      if (!updatedOffer) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Offer not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Offer updated successfully",
        data: updatedOffer,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleOfferStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer id is required" });
        return;
      }

      const updated = await offerService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Offer not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Offer status toggled",
        data: updated
      });
    } catch (err: any) {
      next(err);
    }
  }

  // async softDeleteOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const id = req.params.id;
  //     if (!id) {
  //       res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer id is required" });
  //       return;
  //     } 

  //     const offer = await offerService.softDeleteOffer(id);
  //     if (!offer) {
  //       res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Offer not found" });
  //       return;
  //     }

  //     res.status(200).json({
  //       status: HTTP_RESPONSE.SUCCESS,
  //       message: "Offer moved to trash",
  //       data: offer
  //     });
  //   } catch (err: any) {
  //     next(err);
  //   }
  // }

//   async restoreOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer id is required" });
//         return;
//       }

//       const offer = await offerService.restoreOffer(id);
//       if (!offer) {
//         res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Offer not found" });
//         return;
//       }

//       res.status(200).json({
//         status: HTTP_RESPONSE.SUCCESS,
//         message: "Offer restored successfully",
//         data: offer
//       });
//     } catch (err: any) {
//       if (err.message && err.message.includes("limit")) {
//         res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
//         return;
//       }
//       next(err);
//     }
//   }

  async deleteOfferPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer id is required" });
        return;
      }

      const offer = await offerService.deleteOfferPermanently(id);
      if (!offer) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Offer not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Offer permanently deleted"
      });
    } catch (err: any) {
      next(err);
    }
  }

  async checkDuplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, excludeId } = req.body;
      if (!name) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Offer name is required" });
        return;
      }
      const exists = await offerService.checkDuplicateName(name, excludeId);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, exists });
    } catch (err) {
      next(err);
    }
  }
}

export default new OfferController();