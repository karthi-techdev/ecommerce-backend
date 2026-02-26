import { Router } from "express";
import brandController from "../controllers/brandController";
import { upload } from "../utils/fileUpload";
import { setBrandUpload } from "../middleware/setManagementName";


const router = Router();

router.post(
  "/",
  setBrandUpload,
  upload.single("image"),
  brandController.createBrand
);

router.get("/", (req, res, next) =>
  brandController.getAllBrands(req, res, next)
);

router.get("/getBrandById/:id", (req, res, next) =>
  brandController.getBrandById(req, res, next)
);


router.put(
  "/updateBrand/:id",
  setBrandUpload,
  upload.single("image"),
  brandController.updateBrand
);

router.delete("/softDeleteBrand/:id", (req, res, next) =>
  brandController.softDeleteBrand(req, res, next)
);


router.patch("/togglestatus/:id", (req, res, next) =>
  brandController.toggleStatus(req, res, next)
);

router.get("/trash", (req, res, next) =>
  brandController.getTrashBrands(req, res, next)
);

router.patch("/restore/:id", (req, res, next) =>
  brandController.restoreBrand(req, res, next)
);

router.delete("/permanentDelete/:id", (req, res, next) =>
  brandController.hardDeleteBrand(req, res, next)
);

export default router;
