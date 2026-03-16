import { Request, Response, NextFunction } from "express";
import BlogService from "../services/blogService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class BlogController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body };
      if (req.file) data.image = req.file.filename;
      const blog = await BlogService.create(data);
      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Blog created successfully",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { blogs, total } = await BlogService.getAll(page, limit);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: blogs,
          meta: {
            page,
            totalPages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await BlogService.getById(req.params.id);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: blog });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = { ...req.body };
      if (req.file) data.image = req.file.filename;
      const blog = await BlogService.update(req.params.id, data);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Blog updated",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await BlogService.softDelete(req.params.id);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Blog moved to trash",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  };

  restore = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await BlogService.restore(req.params.id);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Blog restored",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  };

  deletePermanent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await BlogService.deletePermanent(req.params.id);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Blog permanently deleted",
      });
    } catch (err) {
      next(err);
    }
  };

  toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const blog = await BlogService.toggleStatus(req.params.id);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Status updated",
        data: blog,
      });
    } catch (err) {
      next(err);
    }
  };

  getTrashBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { blogs, total } = await BlogService.getTrashBlogs(page, limit);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: blogs,
          meta: {
            page,
            totalPages: Math.ceil(total / limit),
            total,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  };

  checkDuplicate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, excludeId } = req.body;
      const exists = await BlogService.checkDuplicate(name, excludeId);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: { exists } });
    } catch (err) {
      next(err);
    }
  };
}

export default new BlogController();