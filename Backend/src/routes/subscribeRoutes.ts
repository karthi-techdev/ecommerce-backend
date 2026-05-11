import express from "express";
import subscribeController from "../controllers/subscribeController";

const router = express.Router();

router.post("/", subscribeController.subscribe);
router.get("/", subscribeController.getAll);
router.patch("/togglestatus/:id", (req, res, next) => subscribeController.toggleStatus(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => subscribeController.hardDelete(req, res, next));
export default router;