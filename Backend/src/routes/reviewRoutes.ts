import { Router } from "express";
import reviewController from "../controllers/reviewController";

const router = Router();
router.post("/", (req, res, next) =>
  reviewController.createReview(req, res, next),
);
router.get("/", (req, res, next) =>
  reviewController.getAllReviews(req, res, next),
);
router.get("/getReviewById/:id", (req, res, next) =>
  reviewController.getReviewById(req, res, next),
);
router.delete("/:id", (req, res, next) =>
  reviewController.deleteReview(req, res, next),
);
router.put("/updateStatus/:id", (req, res, next) =>
  reviewController.updateReviewStatus(req, res, next),
);
router.get("/active/:productId", (req, res, next) =>
  reviewController.getActiveReviews(req, res, next),
);

export default router;
