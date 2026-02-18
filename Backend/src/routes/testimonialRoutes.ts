import { Router } from "express";
import testimonialController from "../controllers/testimonialController";
import { setTestimonialUpload } from "../middleware/setManagementName";
import { upload } from "../utils/fileUpload";

const router = Router();

router.post("/", setTestimonialUpload, upload.single("image"), (req, res, next) => testimonialController.createTestimonial(req, res, next));
router.get("/", (req, res, next) => testimonialController.getAllTestimonial(req, res, next));
router.get("/getTestimonialById/:id", (req, res, next) => testimonialController.getTestimonialById(req, res, next));
router.put("/updateTestimonial/:id", setTestimonialUpload, upload.single("image"), (req, res, next) => testimonialController.updateTestimonial(req, res, next));
router.delete("/softDelete/:id", (req, res, next) => testimonialController.softDeleteTestimonial(req, res, next));
router.patch("/togglestatus/:id", (req, res, next) => testimonialController.toggleStatus(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => testimonialController.hardDeleteTestimonial(req, res, next));

export default router;