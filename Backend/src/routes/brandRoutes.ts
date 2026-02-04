import { Router } from "express";
import brandController from "../controllers/brandController";
import { upload } from "../utils/fileUpload"; // multer instance

const router = Router();

// Create brand 
router.post("/", upload.single("image"), (req, res, next) =>
  brandController.createBrand(req, res, next)
);

// Get all brands
router.get("/", (req, res, next) =>
  brandController.getAllBrands(req, res, next)
);

// Update brand 
router.put("/:id", upload.single("image"), (req, res, next) =>
  brandController.updateBrand(req, res, next)
);

// Soft delete brand
router.patch("/soft-delete/:id", (req, res, next) =>
  brandController.softDeleteBrand(req, res, next)
);

// Restore brand
router.patch("/restore/:id", (req, res, next) =>
  brandController.restoreBrand(req, res, next)
);

// Hard delete brand
router.delete("/:id", (req, res, next) =>
  brandController.hardDeleteBrand(req, res, next)
);


export default router;
