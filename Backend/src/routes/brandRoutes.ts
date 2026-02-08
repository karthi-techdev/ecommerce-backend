import { Router } from "express";
import brandController from "../controllers/brandController";
import { upload } from "../utils/fileUpload";

const router = Router();

// Create Brand
router.post("/", upload.single("image"), (req, res, next) =>
  brandController.createBrand(req, res, next)
);

// Get All Brands
router.get("/", (req, res, next) =>
  brandController.getAllBrands(req, res, next)
);

// Get Brand By Id
router.get("/getBrandById/:id", (req, res, next) =>
  brandController.getBrandById(req, res, next)
);

// Update Brand
router.put("/updateBrand/:id", upload.single("image"), (req, res, next) =>
  brandController.updateBrand(req, res, next)
);

// Soft Delete Brand
router.delete("/softDeleteBrand/:id", (req, res, next) =>
  brandController.softDeleteBrand(req, res, next)
);

// Toggle Status
router.patch("/togglestatus/:id", (req, res, next) =>
  brandController.toggleStatus(req, res, next)
);

// Trash Brands
router.get("/trash", (req, res, next) =>
  brandController.getTrashBrands(req, res, next)
);

// Restore Brand
router.patch("/restore/:id", (req, res, next) =>
  brandController.restoreBrand(req, res, next)
);

// Permanent Delete
router.delete("/permanentDelete/:id", (req, res, next) =>
  brandController.hardDeleteBrand(req, res, next)
);

export default router;
