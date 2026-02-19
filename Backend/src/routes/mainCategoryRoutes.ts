import express from "express";
import mainCategoryController from "../controllers/mainCategoryController";
import { upload } from "../utils/fileUpload";
const router = express.Router();

router.post("/",(req, res, next) => {(req as any).managementName = "main-categories";
    next();
  },
  upload.single("image"),
  (req, res, next) => mainCategoryController.createMainCategory(req, res, next)
);
router.get("/", (req, res, next) =>mainCategoryController.getAllMainCategories(req, res, next));
router.get("/list", (req, res, next) =>mainCategoryController.getAllListMainCategories(req, res, next));
router.get("/trash", (req, res, next) =>mainCategoryController.getAllTrashMainCategories(req, res, next));
router.get("/activeMainCategories",(req,res,next)=>{mainCategoryController.getActiveMainCategories(req,res,next)});
router.delete("/soft-delete/:id", (req, res, next) =>mainCategoryController.softDeleteMainCategory(req, res, next));
router.patch("/restore/:id", (req, res, next) =>mainCategoryController.restoreMainCategory(req, res, next));
router.delete("/permanent-delete/:id", (req, res, next) =>mainCategoryController.deleteMainCategoryPermanently(req, res, next));
router.patch("/toggle-status/:id", (req, res, next) =>mainCategoryController.toggleMainCategoryStatus(req, res, next));
router.get(
  "/check-name",
  (req, res) => mainCategoryController.checkMainCategoryName(req, res)
);
router.get("/:id", (req, res, next) =>mainCategoryController.getMainCategoryById(req, res, next));
router.put("/:id",(req, res, next) => {(req as any).managementName = "main-categories";
  next();
  },
  upload.single("image"),
  (req, res, next) =>
    mainCategoryController.updateMainCategory(req, res, next)
);

export default router;
