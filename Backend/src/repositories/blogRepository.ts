import { BlogModel } from "../models/blogModel";

class BlogRepository {

  async createBlog(data: any) {
    return BlogModel.create(data);
  }

  async getAllBlogs(query: Record<string, any>, skip: number, limit: number) {
    return BlogModel.find(query)
      .populate("categoryId", "name isActive")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  async countBlogs(query: Record<string, any>) {
    return BlogModel.countDocuments(query);
  }

 async getBlogBySlug(slug: string) {
  return BlogModel.findOne({ slug, isDeleted: false }) 
    .populate("categoryId", "name isActive");
}

  async getBlogById(id: string) {
  return BlogModel
    .findById(id)
    .populate("categoryId", "name isActive");
}

  async updateBlog(id: string, data: any) {
    return BlogModel.findByIdAndUpdate(id, data, { new: true })
      .populate("categoryId", "name isActive");
  }

  async deleteBlog(id: string) {
    return BlogModel.findByIdAndDelete(id);
  }

  async existsBySlug(slug: string, excludeId?: string) {
    const query: Record<string, any> = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    return BlogModel.countDocuments(query);
  }

}

export default new BlogRepository();