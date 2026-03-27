import { Router } from "express";
import offerController from "../controllers/offerController";
import { upload } from "../utils/fileUpload";

const offerRoutes = Router();

offerRoutes.post(
  "/",
  (req, res, next) => {
    (req as any).managementName = "offers";
    next();
  },
  upload.single("image"),
  (req, res, next) => offerController.createOffer(req, res, next),
);
offerRoutes.get("/", offerController.getAllOffers);
offerRoutes.get("/:id", offerController.getOfferById);
offerRoutes.put(
  "/:id",
  (req, res, next) => {
    (req as any).managementName = "offers";
    next();
  },
  upload.single("image"),
  (req, res, next) => offerController.updateOffer(req, res, next),
);
// offerRoutes.delete("/:id/soft", offerController.softDeleteOffer);
// offerRoutes.put("/:id/restore", offerController.restoreOffer);
offerRoutes.post("/check-duplicate", offerController.checkDuplicate);
offerRoutes.patch("/toggle-status/:id", offerController.toggleOfferStatus);
offerRoutes.delete("/permanent/:id", offerController.deleteOfferPermanently);

export default offerRoutes;
