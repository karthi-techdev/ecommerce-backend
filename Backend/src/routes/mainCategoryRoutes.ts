import { Router } from "express";
import mainCategoryController from "../controllers/mainCategoryController";
import { upload } from "../utils/fileUpload";

const router = Router();

router.post( "/",  upload.single("image"),(req, res, next) => mainCategoryController.createMainCategory(req, res, next));
router.get("/", (req, res, next) => mainCategoryController.getAllMainCategories(req, res, next));
router.get("/:id", (req, res, next) =>  mainCategoryController.getMainCategoryById(req, res, next));
router.put("/:id", upload.single("image"), (req, res, next) => mainCategoryController.updateMainCategory(req, res, next));
router.delete("/soft-delete/:id", (req, res, next) =>  mainCategoryController.softDeleteMainCategory(req, res, next));
router.patch("/restore/:id", (req, res, next) =>  mainCategoryController.restoreMainCategory(req, res, next));
router.delete("/permanent-delete/:id", (req, res, next) =>  mainCategoryController.deleteMainCategoryPermanently(req, res, next));

export default router;
