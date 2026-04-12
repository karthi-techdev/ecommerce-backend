import commentRepository from "../repositories/commentsRepository";
import { IComment } from "../models/commentsModel";
import { Types } from "mongoose";
import ValidationHelper from "../utils/validationHelper";

class CommentService {

  //  VALIDATION
  private validateCommentData(
    data: Partial<IComment>,
    isUpdate: boolean = false
  ): void {

    if (!isUpdate) {
      if (!data.comment) throw new Error("comment is required");
      if (!data.name) throw new Error("name is required");
      if (!data.email) throw new Error("email is required");
      if (!data.blogId) throw new Error("blogId is required");
      if (!data.userId) throw new Error("userId is required");
      if (!data.rating) throw new Error("rating is required");
    }

    if (data.comment !== undefined && data.comment.trim() === "") {
      throw new Error("comment cannot be empty");
    }

    if (data.name !== undefined && data.name.trim() === "") {
      throw new Error("name cannot be empty");
    }

    if (data.email !== undefined && data.email.trim() === "") {
      throw new Error("email cannot be empty");
    }

    if (
      data.rating !== undefined &&
      (data.rating < 1 || data.rating > 5)
    ) {
      throw new Error("rating must be between 1 and 5");
    }
  }

  //  CREATE COMMENT
  async createComment(data: Partial<IComment>): Promise<IComment> {

    this.validateCommentData(data, false);

    

    return await commentRepository.createComment(data as IComment);
  }

  //  GET ALL COMMENTS
async getAllComments(page = 1, limit = 10, status?: string) {
  return await commentRepository.getAllComments(page, limit, status);
}
  //  GET COMMENTS BY BLOG
  async getCommentsByBlog(blogId: string | Types.ObjectId) {

    const error = ValidationHelper.isValidObjectId(blogId, "blogId");
    if (error) throw new Error(error.message);

    return await commentRepository.getCommentsByBlog(blogId);
  }

  //  DELETE COMMENT
  async deleteComment(id: string | Types.ObjectId) {

    const error = ValidationHelper.isValidObjectId(id, "id");
    if (error) throw new Error(error.message);

    const comment = await commentRepository.findById(id);

    if (!comment) throw new Error("Comment not found");

    return await commentRepository.deleteComment(id);
  }
//toggleStatus
async toggleStatus(id: string | Types.ObjectId): Promise<IComment | null> {

  const error = ValidationHelper.isValidObjectId(id, "id");
  if (error) throw new Error(error.message);

  const comment = await commentRepository.findById(id);

  if (!comment) throw new Error("Comment not found");

  const updatedComment = await commentRepository.updateComment(id, {
    isActive: !comment.isActive
  });

  return updatedComment;
}

}

export default new CommentService();