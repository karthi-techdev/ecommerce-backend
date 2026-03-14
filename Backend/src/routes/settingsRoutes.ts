import { Router } from "express";
import settingsController from "../controllers/settingsController";

const router = Router();

// GET SETTINGS
router.get("/", (req, res, next) =>
  settingsController.getSettings(req, res, next)
);

// UPDATE SETTINGS
router.put("/", (req, res, next) =>
  settingsController.updateSettings(req, res, next)
);

export default router;