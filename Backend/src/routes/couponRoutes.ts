import { Router } from "express";
import couponController from "../controllers/couponController";

const router = Router();

router.post("/", (req, res, next) =>
  couponController.createCoupon(req, res, next)
);

router.get("/", (req, res, next) =>
  couponController.getAllCoupons(req, res, next)
);
router.get("/trash", (req, res, next) =>
  couponController.getTrashCoupons(req, res, next)
);



router.patch("/togglestatus/:id", (req, res, next) =>
  couponController.toggleStatus(req, res, next)
);

router.delete("/softDelete/:id", (req, res, next) =>
  couponController.softDeleteCoupon(req, res, next)
);

router.put("/:id", (req, res, next) =>
  couponController.updateCoupon(req, res, next)
);

router.patch("/restore/:id", (req, res, next) =>
  couponController.restoreCoupon(req, res, next)
);

router.delete("/permanentDelete/:id", (req, res, next) =>
  couponController.hardDeleteCoupon(req, res, next)
);

router.get("/check-code", (req, res, next) =>
  couponController.checkCodeExists(req, res, next)
);
router.get("/:id", (req, res, next) =>
  couponController.getCouponById(req, res, next)
);



export default router;
