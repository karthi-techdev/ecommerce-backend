import { Router } from "express";
import settingsController from "../controllers/settingsController";
import { upload } from "../utils/fileUpload";
import { authenticate } from "../middleware/authentication"; 
import { setSettingsUpload } from "../middleware/setManagementName";

const router = Router();

router.get("/", (req, res, next) => 
  settingsController.getSettings(req, res, next)
);

router.put("/", 
  authenticate, 
  setSettingsUpload, 
  upload.fields([
    { name: 'siteLogo', maxCount: 1 },
    { name: 'adminLogo', maxCount: 1 },
    { name: 'favicon', maxCount: 1 }
  ]), 
  (req, res, next) => settingsController.updateSettings(req, res, next)
);

export default router;