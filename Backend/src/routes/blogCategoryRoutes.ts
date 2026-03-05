import { Router } from "express";
import blogCategoryController from "../controllers/blogCategoryController";

const router = Router();

router.post("/", (req, res, next) => blogCategoryController.create(req, res, next));
router.get("/", (req, res, next) => blogCategoryController.getAll(req, res, next));
router.put("/updateBlogCategory/:id", (req, res, next) => blogCategoryController.update(req, res, next));
router.delete("/softDeleteBlogCategory/:id", blogCategoryController.softDelete);
router.patch("/toggleStatus/:id", (req, res, next) => blogCategoryController.toggleStatus(req, res, next));
router.get("/trash", (req, res, next) => blogCategoryController.getTrash?.(req, res, next));
router.get("/:id", (req, res, next) => blogCategoryController.getById(req, res, next));
router.patch("/restore/:id", (req, res, next) => blogCategoryController.restore(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => blogCategoryController.deletePermanent(req, res, next));
router.post("/check-duplicate", (req, res, next) => blogCategoryController.checkDuplicate(req, res, next));

export default router;