import { Router } from "express";
import addressController from "../controllers/addressController";

const router = Router();

router.post("/",(req, res, next) => addressController.createAddress(req, res, next));
router.get("/", (req, res, next) => addressController.getAllAddresses(req, res, next));
// router.get("/user/:userId",(req, res, next) => addressController.getAddressByUser(req, res, next));
router.get("/:id", (req, res, next) => addressController.getAddressById(req, res, next));
router.put("/update/:id",(req, res, next) => addressController.updateAddress(req, res, next));
router.delete("/softDelete/:id",(req, res, next) => addressController.softDeleteAddress(req, res, next));
// router.patch("/toggle-default/:id",(req, res, next) => addressController.toggleDefault(req, res, next));
router.get("/trash",(req, res, next) => addressController.getAllTrashAddresses(req, res, next));
router.patch("/restore/:id",(req, res, next) => addressController.restoreAddress(req, res, next));
router.delete("/permanentDelete/:id", (req, res, next) => addressController.deleteAddressPermanently(req, res, next));

export default router;