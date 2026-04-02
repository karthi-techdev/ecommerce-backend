import { Router } from "express";
import productController from "../controllers/productController";
import { upload } from "../utils/fileUpload";
import { setProductUpload } from "../middleware/setManagementName";

const router = Router();

router.post(
  "/",
  (req, res, next) => {
    (req as any).managementName = "products";
    next();
  },
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.createProduct,
);
router.get("/", (req, res, next) =>
  productController.getProducts(req, res, next),
);
router.post("/checkSlugExist", (req, res, next) =>
  productController.checkSlugExist(req, res, next),
);
// Slug
router.get("/getProductBySlug/:slug", (req, res, next) =>
  productController.getProductBySlug(req, res, next),
);
router.get("/getProductById/:id", (req, res, next) =>
  productController.getProductById(req, res, next),
);
router.put(
  "/updateProduct/:id",
  (req, res, next) => {
    (req as any).managementName = "products";
    next();
  },
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  productController.updateProduct,
);
router.patch("/softDelete/:id", (req, res, next) =>
  productController.softDeleteProduct(req, res, next),
);
router.delete("/permanentDelete/:id", (req, res, next) =>
  productController.deleteProductPermanently(req, res, next),
);
router.patch("/restore/:id", (req, res, next) =>
  productController.restoreProduct(req, res, next),
);
router.patch("/toggleStatus/:id", (req, res, next) =>
  productController.toggleStatus(req, res, next),
);
router.get("/trash", (req, res, next) =>
  productController.getAllTrash(req, res, next),
);

export default router;
