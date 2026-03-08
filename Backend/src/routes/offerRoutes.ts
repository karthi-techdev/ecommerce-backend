import { Router } from "express";
import offerController from "../controllers/offerController";

const offerRoutes = Router();

offerRoutes.post("/", offerController.createOffer);
offerRoutes.get("/", offerController.getAllOffers);
offerRoutes.get("/:id", offerController.getOfferById);
offerRoutes.put("/:id", offerController.updateOffer);
offerRoutes.patch("/:id/toggle-status", offerController.toggleOfferStatus);
// offerRoutes.delete("/:id/soft", offerController.softDeleteOffer);
// offerRoutes.put("/:id/restore", offerController.restoreOffer);
offerRoutes.delete("/:id/permanent", offerController.deleteOfferPermanently);
offerRoutes.post("/check-duplicate", offerController.checkDuplicate);

export default offerRoutes; 