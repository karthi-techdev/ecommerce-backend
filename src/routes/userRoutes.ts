

import { Router } from "express";
import userController from "../controllers/userController";
const router = Router();// User Router


router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.get("/", (req, res, next) => userController.getAllUsers(req, res, next));
router.get("/getUserById/:id", (req, res, next) => userController.getUserById(req, res, next));
router.put("/updateUser/:id", (req, res, next) => userController.updateUser(req, res, next));
router.delete("/softDeleteUser/:id", (req, res, next) => userController.softDeleteUser(req, res, next));
router.patch('/togglestatus/:id', (req, res, next) => userController.toggleUserStatus(req, res, next));
router.get('/trash', (req, res, next) => userController.getAllTrashUsers(req, res, next));
router.patch('/restore/:id', (req, res, next) => userController.restoreUser(req, res, next));
router.delete('/permanentDelete/:id', (req, res, next) => userController.deleteUserPermanently(req, res, next));

export default router;