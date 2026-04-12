import { Router } from "express";
import commentController from "../controllers/commentsController";
import { upload } from "../utils/fileUpload";
import { setCommentUpload } from "../middleware/setManagementName";
const router = Router();

// CREATE COMMENT
router.post(
  "/",
  setCommentUpload,          
  upload.single("image"),
  commentController.createComment
);

// GET ALL COMMENTS
router.get("/", commentController.getAllComments);

// GET COMMENTS BY BLOG
router.get("/:blogId", (req, res, next) =>
  commentController.getCommentsByBlog(req, res, next)
);

// DELETE COMMENT
router.delete("/:id", (req, res, next) =>
  commentController.deleteComment(req, res, next)
);

router.patch("/togglestatus/:id", (req, res, next) =>
  commentController.toggleStatus(req, res, next)
);

export default router;