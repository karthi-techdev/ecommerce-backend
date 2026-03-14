import { Router } from "express";
import promotionController from "../controllers/promotionController";
import { upload } from "../utils/fileUpload";

const router = Router();

router.post(
  "/",
  (req, res, next) => {
    (req as any).managementName = "promotions";
    next();
  },
  upload.single("image"),
  (req, res, next) => promotionController.createPromotions(req, res, next),
);
router.get("/", (req, res, next) =>
  promotionController.getAllPromotions(req, res, next),
);
router.get("/getPromotionsById/:id", (req, res, next) =>
  promotionController.getpromotionsById(req, res, next),
);
// router.get('/faqStats',(req,res,next)=>{faqController.getFaqStats(req,res,next)});
router.put(
  "/updatePromotions/:id",
  (req, res, next) => {
    (req as any).managementName = "promotions";
    next();
  },
  upload.single("image"),
  (req, res, next) => promotionController.updatePromotions(req, res, next),
);
router.delete("/softDeletePromotions/:id", (req, res, next) =>
  promotionController.softDeletePromotions(req, res, next),
);

// router.patch('/togglestatus/:id', (req, res, next) => faqController.toggleFaqStatus(req, res, next));
// router.get('/trash', (req, res, next) => faqController.getAllTrashFaqs(req, res, next));
// router.patch('/restore/:id', (req, res, next) => faqController.restoreFaq(req, res, next));
// router.delete('/permanentDelete/:id', (req, res, next) => faqController.deleteFaqPermanently(req, res, next));
// router.post('/check-duplicate', (req, res, next) => faqController.checkDuplicate(req, res, next));
export default router;
