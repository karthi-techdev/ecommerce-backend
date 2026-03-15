import { Router } from "express";
import offerController from "../controllers/offerController";

const offerRoutes = Router();

offerRoutes.post("/", offerController.createOffer);
offerRoutes.get("/", offerController.getAllOffers);
offerRoutes.get("/:id", offerController.getOfferById);
offerRoutes.put("/:id", offerController.updateOffer);
// offerRoutes.delete("/:id/soft", offerController.softDeleteOffer);
// offerRoutes.put("/:id/restore", offerController.restoreOffer);
offerRoutes.post("/check-duplicate", offerController.checkDuplicate);
offerRoutes.patch("/toggle-status/:id", offerController.toggleOfferStatus); 
offerRoutes.delete("/permanent/:id", offerController.deleteOfferPermanently);

export default offerRoutes; 