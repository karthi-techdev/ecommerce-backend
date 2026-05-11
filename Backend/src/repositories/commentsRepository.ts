import { CommentModel, IComment } from "../models/commentsModel";
import { Types } from "mongoose";

class CommentRepository {

  //  CREATE COMMENT
  async createComment(data: IComment): Promise<IComment> {
    try {
      return await CommentModel.create(data);
    } catch (error: any) {
      throw error;
    }
  }

  //  GET ALL COMMENTS 
async getAllComments(page = 1, limit = 10, status?: string) {
  const skip = (page - 1) * limit;

  const query: any = { isDeleted: false };

  if (status === "active") query.isActive = true;
  if (status === "inactive") query.isActive = false;

  const [data, total, totalActive, totalInactive] = await Promise.all([
    CommentModel.find(query)
      
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

  CommentModel.countDocuments({ isDeleted: false }),
  CommentModel.countDocuments({ isDeleted: false, isActive: true }),
  CommentModel.countDocuments({ isDeleted: false, isActive: false }),
  ]);

  return {
    data,
    meta: {
      total,
      totalActive,
      totalInactive,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  //  GET COMMENTS BY BLOG
  async getCommentsByBlog(blogId: string | Types.ObjectId) {
    return await CommentModel.find({
      blogId,
      isDeleted: false,
    })
      
      .sort({ createdAt: -1 });
  }

  //  DELETE COMMENT 
async deleteComment(id: string | Types.ObjectId) {
  return await CommentModel.findByIdAndDelete(id);
}



  //  FIND BY ID
  async findById(id: string | Types.ObjectId) {
    return await CommentModel.findById(id);
  }

  //toggle

  async updateComment(id: string | Types.ObjectId, data: Partial<IComment>): Promise<IComment | null> {
  return await CommentModel.findByIdAndUpdate(id, data, { new: true });
}
  

}

export default new CommentRepository();