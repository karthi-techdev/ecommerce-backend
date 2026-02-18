import { Router } from "express";
import shipmentMethodController from "../controllers/shipmentMethodsController";

const router = Router();
router.post("/", (req, res, next) => shipmentMethodController.createShipmentMethod(req, res, next));
router.get("/", (req, res, next) => shipmentMethodController.getAllShipmentMethods(req, res, next));
router.get("/getShipmentMethodById/:id", (req, res, next) => shipmentMethodController.getShipmentMethodById(req, res, next));
router.put("/updateShipmentMethod/:id", (req, res, next) => shipmentMethodController.updateShipmentMethod(req, res, next));
router.delete("/softDeleteShipmentMethod/:id", (req, res, next) => shipmentMethodController.softDeleteShipmentMethod(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => shipmentMethodController.toggleStatus(req, res, next));
router.post('/check-duplicate', (req, res, next) => shipmentMethodController.checkDuplicateSlug(req, res, next));

export default router;