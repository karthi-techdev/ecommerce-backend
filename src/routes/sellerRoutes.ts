import { Router } from "express";
import sellerController from "../controllers/sellerController";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "storeLogo", maxCount: 1 },
    { name: "storeBanner", maxCount: 1 },
  ]),
  sellerController.register
);


router.get("/profile", sellerController.getProfile);
router.put(
  "/profile",
  upload.fields([
    { name: "storeLogo", maxCount: 1 },
    { name: "storeBanner", maxCount: 1 },
  ]),
  sellerController.updateProfile
);

router.patch("/status", sellerController.updateStatus);

export default router;
