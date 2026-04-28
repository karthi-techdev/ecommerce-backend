import express from "express";
import { register, login,updateProfile, changePassword} from "../controllers/usersController";
import { protectAdmin } from "../middleware/adminAuthMiddleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.put("/update-profile", protectAdmin, updateProfile);

router.post("/change-password", protectAdmin, changePassword);
export default router;