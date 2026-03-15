import { Request, Response, NextFunction } from "express";
import blogCategoryService from "../services/blogCategoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { isValidObjectId } from "mongoose";

class BlogCategoryController {

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await blogCategoryService.createBlogCategory(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Blog category created", data: category });
    } catch (err: any) { next(err); }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;

      const result = await blogCategoryService.getAllBlogCategories(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: result });
    } catch (err: any) { next(err); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await blogCategoryService.getBlogCategoryById(req.params.id);
      if (!category) return res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Not found" });
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: category });
    } catch (err: any) { next(err); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await blogCategoryService.updateBlogCategory(req.params.id, req.body);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Updated successfully", data: category });
    } catch (err: any) { next(err); }
  }

async softDelete(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Invalid category ID" });
  }

  try {
    const category = await blogCategoryService.softDeleteBlogCategory(id);

    if (!category) {
      return res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Category not found" });
    }

    res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Moved to trash", data: category });
  } catch (err) {
    next(err);
  }
}

  async restore(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await blogCategoryService.restoreBlogCategory(req.params.id);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Restored", data: category });
    } catch (err: any) { next(err); }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await blogCategoryService.toggleActive(req.params.id);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Status toggled", data: category });
    } catch (err: any) { next(err); }
  }

  async deletePermanent(req: Request, res: Response, next: NextFunction) {
    try {
      await blogCategoryService.deleteBlogCategoryPermanently(req.params.id);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Permanently deleted" });
    } catch (err: any) { next(err); }
  }

async getTrash(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const trash = await blogCategoryService.getTrashBlogCategories(page, limit);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      data: trash,
    });
  } catch (err) {
    next(err);
  }
}

  async checkDuplicate(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, excludeId } = req.body;
      const exists = await blogCategoryService.checkDuplicate(name, excludeId);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, exists });
    } catch (err: any) { next(err); }
  }
}

export default new BlogCategoryController();