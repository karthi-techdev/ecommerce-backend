import { Router } from "express";
import {roleController} from "../controllers/roleController";
const router = Router();

router.get("/createprivilegetable", (req, res, next) => roleController.createPrivilegeTable(req, res, next));
router.post("/", (req, res, next) => roleController.createRole(req, res, next));
router.get("/listuserrole", (req, res, next) => roleController.getAllRoles(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => roleController.toggleRoleStatus(req, res, next));
router.delete("/softDeleteuserrole/:id", (req, res, next) => roleController.softDeleteRole(req, res, next));
router.put("/updateuserrole/:id", (req, res, next) => roleController.updateRole(req, res, next));
router.get("/getuserroleById/:id", (req, res, next) => roleController.getRoleById(req, res, next));



export default router;