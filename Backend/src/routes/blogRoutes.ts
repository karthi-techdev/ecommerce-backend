import { Router } from "express";
import BlogController from "../controllers/blogController";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadPath = path.join(__dirname, "../../uploads/blog");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), BlogController.create);
router.get("/", BlogController.getAll);
router.get("/get/:id", BlogController.getById);
router.put("/update/:id", upload.single("image"), BlogController.update);
router.delete("/delete/:id", BlogController.softDelete);
router.delete("/permanentDelete/:id", BlogController.deletePermanent);
router.get("/trash", BlogController.getTrashBlogs);
router.post("/check-duplicate", BlogController.checkDuplicate);
router.patch("/status/:id", BlogController.toggleStatus);
router.patch("/restore/:id", BlogController.restore);

export default router;