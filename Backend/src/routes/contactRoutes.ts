import { Router } from "express";
import contactController from "../controllers/contactController";

const router = Router();
router.post("/", (req, res, next) =>contactController.createContact(req, res, next));
router.get("/", (req, res, next) =>contactController.getAllContacts(req, res, next));
router.get("/getContactById/:id", (req, res, next) =>contactController.getContactById(req, res, next));
router.put("/updateContact/:id", (req, res, next) =>contactController.updateContact(req, res, next));
router.delete("/softDeleteContact/:id", (req, res, next) =>contactController.softDeleteContact(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) =>contactController.toggleStatus(req, res, next));
router.get("/trash", (req, res, next) => contactController.getAllTrashContacts(req, res, next));
router.patch("/restore/:id", (req, res, next) => contactController.restoreContact(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => contactController.deleteContactPermanently(req, res, next));

export default router;