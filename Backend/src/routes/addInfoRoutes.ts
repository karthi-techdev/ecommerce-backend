import { Router } from "express";
import addInfoController from "../controllers/addInfoController";

const router = Router();
router.post("/", (req, res, next) => addInfoController.createAddInfo(req, res, next));
router.get("/", (req, res, next) => addInfoController.getAllAddInfos(req, res, next));
router.get("/getAddInfoById/:id", (req, res, next) => addInfoController.getAddInfoById(req, res, next));
router.get('/stats', (req, res, next) => addInfoController.getAddInfoStats(req, res, next));
router.put("/updateAddInfo/:id", (req, res, next) => addInfoController.updateAddInfo(req, res, next));
router.delete("/softDeleteAddInfo/:id", (req, res, next) => addInfoController.softDeleteAddInfo(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => addInfoController.toggleStatus(req, res, next));
router.get('/trash', (req, res, next) => addInfoController.getAllTrashAddInfos(req, res, next));
router.patch('/restore/:id', (req, res, next) => addInfoController.restoreAddInfo(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => addInfoController.deleteAddInfoPermanently(req, res, next));
router.post('/check-duplicate', (req, res, next) => addInfoController.checkDuplicate(req, res, next));

export default router;