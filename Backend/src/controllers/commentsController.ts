import { Request, Response, NextFunction } from "express";
import commentService from "../services/commentsService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class CommentController {

  // CREATE COMMENT
  async createComment(req: Request, res: Response) {
  try {
    const { comment, blogId, name, email, website, rating } = req.body;
    const userId = (req as any).user._id;

    let imagePath;

    if (req.file) {
      imagePath = req.file.path;
    }
    console.log("USER:", (req as any).user);
    console.log("FILE:", req.file);
console.log("BODY:", req.body);

    const newComment = await commentService.createComment({
      comment,
      blogId,
      userId,
      name,
      email,
      website,
      rating,
      image: imagePath
    });

    res.status(201).json({
      status: true,
      message: "Comment added successfully",
      data: newComment
    });

  } catch (error: any) {
  res.status(400).json({
    status: false,
    message: error.message || "Error creating comment"
  });
}
}


// GET ALL COMMENTS 
async getAllComments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string; 

    const { data, meta } = await commentService.getAllComments(page, limit, status);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      data,
      meta
    });

  } catch (err) {
    next(err);
  }
}

  

  // GET COMMENTS BY BLOG
  async getCommentsByBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const blogId = req.params.blogId;

      const comments = await commentService.getCommentsByBlog(blogId);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: comments
      });

    } catch (err) {
      next(err);
    }
  }

  // DELETE COMMENT 
  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;

      const comment = await commentService.deleteComment(id);

      if (!comment) {
        return res.status(404).json({
          status: "fail",
          message: "Comment not found"
        });
      }

      res.json({
        status: "success",
        message: "Comment deleted",
        data: comment
      });

    } catch (err) {
      next(err);
    }
  }


  // TOGGLE STATUS
async toggleStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const commentId = req.params.id;
    if (!commentId) throw new Error("Comment ID is required");

    console.log("[ToggleStatus] Request received for comment ID:", commentId);

    const comment = await commentService.toggleStatus(commentId);

    console.log("[ToggleStatus] Comment after toggle:", comment);

    if (!comment) {
      return res.status(404).json({
        status: "fail",
        message: "Comment not found"
      });
    }

    res.json({
      status: "success",
      message: `Comment status toggled to ${comment.isActive ? "active" : "inactive"}`,
      data: comment
    });

  } catch (err) {
    console.error("[ToggleStatus] Error:", err);
    next(err);
  }
}
}

export default new CommentController();