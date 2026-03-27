import bannerController from "../controllers/bannerController";
import { Router } from "express";
import { setbannerUpload } from "../middleware/setManagementName";
import { upload } from "../utils/fileUpload";

const router = Router();

router.get("/", (req, res, next) =>
  bannerController.getBanner(req, res, next));

router.put(
  "/:id?", setbannerUpload,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imageone", maxCount: 1 },
    { name: "imagetwo", maxCount: 1 },
    { name: "imagethree", maxCount: 1 }
  ]),
  (req, res, next) =>
    bannerController.updateBanner(req, res, next)
);

export default router;