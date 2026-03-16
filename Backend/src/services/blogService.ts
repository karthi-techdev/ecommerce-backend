import BlogRepository from "../repositories/blogRepository";

class BlogService {
  private repo = BlogRepository;

  private slugGenerate(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }

  async create(data: any) {
    if (!data.name) throw new Error("Name is required");
    if (!data.categoryId) throw new Error("Category is required");

    if (data.isActive !== undefined) {
      const val = String(data.isActive).toLowerCase();
      if (val !== "true" && val !== "false") {
        throw new Error("isActive must be boolean (true or false)");
      }
      data.isActive = val === "true";
    }

    const slug = this.slugGenerate(data.name);

    const slugExists = await this.repo.existsBySlug(slug);
    if (slugExists) {
      throw new Error("A blog with this name already exists");
    }

    data.slug = slug;

    return this.repo.createBlog(data);
  }

  async update(id: string, data: any) {
    const existingBlog = await this.repo.getBlogById(id);
    if (!existingBlog) throw new Error("Blog not found");

    if (data.name) {
      const newSlug = this.slugGenerate(data.name);
      const isDuplicate = await this.repo.existsBySlug(newSlug, id);
      if (isDuplicate) {
        throw new Error("Another blog already uses this name");
      }
      data.slug = newSlug;
    }

    if (data.isActive !== undefined) {
      const val = String(data.isActive).toLowerCase();
      if (val !== "true" && val !== "false") {
        throw new Error("isActive must be boolean (true or false)");
      }
      data.isActive = val === "true";
    }

    return this.repo.updateBlog(id, data);
  }

  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { isDeleted: false };
    const [blogs, total] = await Promise.all([
      this.repo.getAllBlogs(query, skip, limit),
      this.repo.countBlogs(query),
    ]);
    return { blogs, total };
  }

  getById(id: string) {
    return this.repo.getBlogById(id);
  }

  softDelete(id: string) {
    return this.repo.updateBlog(id, { isDeleted: true });
  }

  restore(id: string) {
    return this.repo.updateBlog(id, { isDeleted: false });
  }

  deletePermanent(id: string) {
    return this.repo.deleteBlog(id);
  }

  async toggleStatus(id: string) {
    const blog = await this.repo.getBlogById(id);
    if (!blog) throw new Error("Blog not found");
    return this.repo.updateBlog(id, { isActive: !blog.isActive });
  }

  async getTrashBlogs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      this.repo.getAllBlogs({ isDeleted: true }, skip, limit),
      this.repo.countBlogs({ isDeleted: true }),
    ]);
    return { blogs, total };
  }

  async checkDuplicate(name: string, excludeId?: string) {
    const slug = this.slugGenerate(name);
    const exists = await this.repo.existsBySlug(slug, excludeId);
    return exists;
  }
}

export default new BlogService();