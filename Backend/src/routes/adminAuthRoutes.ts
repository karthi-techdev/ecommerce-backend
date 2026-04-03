import { Router } from "express";
import adminAuthController from "../controllers/adminAuthController";
import { authenticate } from "../middleware/authentication";

const adminAuthRoutes = Router();

adminAuthRoutes.post("/login",  (req, res, next) => adminAuthController.login(req, res, next));
adminAuthRoutes.post("/logout" ,(req, res) => adminAuthController.logout(req, res));
adminAuthRoutes.post("/refresh", (req, res) => adminAuthController.refresh(req, res));
adminAuthRoutes.get("/me/:id",  (req, res ,next) => adminAuthController.getMe(req, res , next));
adminAuthRoutes.post('/forgetPassword',(req,res,next)=>adminAuthController.forgetPassword(req,res,next));
adminAuthRoutes.post('/resetPassword',(req,res,next)=>adminAuthController.resetPassword(req,res,next));
export default adminAuthRoutes;