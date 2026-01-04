import { Router } from "express";
import faqController from "../controllers/faqController";
const router = Router();

router.post("/", (req, res, next) => faqController.createFaq(req, res, next));
router.get("/", (req, res, next) => faqController.getAllFaqs(req, res, next));
router.get("/getFaqById/:id", (req, res, next) => faqController.getFaqById(req, res, next));
router.put("/updateFaq/:id", (req, res, next) => faqController.updateFaq(req, res, next));
router.delete("/softDeleteFaq/:id", (req, res, next) => faqController.softDeleteFaq(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => faqController.toggleFaqStatus(req, res, next));
router.get('/trash', (req, res, next) => faqController.getAllTrashFaqs(req, res, next));
router.patch('/restore/:id', (req, res, next) => faqController.restoreFaq(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => faqController.deleteFaqPermanently(req, res, next));
export default router;