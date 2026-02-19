import { Request, Response, NextFunction } from "express";
import mainCategoryService from "../services/mainCategoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";
import { CustomError } from "../utils/customError";


class MainCategoryController {

  
  async createMainCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, slug, description } = req.body;
      if (!name) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "name is required" });
        return;
      }
      if (!slug) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "slug is required" });
        return;
      }
      if (!description) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "description is required" });
        return;
      }
      (req as any).managementName = "main-categories";
      if (!req.file) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "image is required",
        });
        return;
      }
      const uploaded = await processUpload(req as any, req.file);
      const imagePath = `/uploads/main-categories/${uploaded.filename}`;
      const category = await mainCategoryService.createMainCategory({
          name,
          slug,
          description,
          image: imagePath, 
        });
        res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Main category created successfully",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  async checkMainCategoryName(
  req: Request,
  res: Response
): Promise<void> {
  const { name, id } = req.query;

  if (!name) {
    res.status(200).json({ exists: false });
    return;
  }

  const exists = await mainCategoryService.checkCategoryNameExists(
    String(name),
    id ? String(id) : undefined
  );

  res.status(200).json({
    status: HTTP_RESPONSE.SUCCESS,
    exists,
  });
}

  async getAllMainCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await mainCategoryService.getAllMainCategories(page, limit);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }
  async getAllListMainCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter = req.query.filter as string;

      const result = await mainCategoryService.getAllListMainCategories(filter);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result.data,
        total: result.total
      });
    } catch (err) {
      next(err);
    }
  }

  async getMainCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { id } = req.params;

      const category = await mainCategoryService.getMainCategoryById(id);

      if (!category) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMainCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      (req as any).managementName = "main-categories";

      if (req.file) {
        const uploaded = await processUpload(req as any, req.file);
        req.body.image = `/uploads/main-categories/${uploaded.filename}`;
      }

      delete req.body.isActive;
      delete req.body.isDeleted;

      const updated = await mainCategoryService.updateMainCategory(id, req.body);

      if (!updated) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Main category updated successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async softDeleteMainCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { id } = req.params;
     
      const category = await mainCategoryService.softDeleteMainCategory(id);
      
      if (!category) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Main category deleted successfully",

      });
    } catch (err) {
      next(err);
    }
  }

  async restoreMainCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const category = await mainCategoryService.restoreMainCategory(id);

    if (!category) {
      res.status(404).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Main category not found",
      });
      return;
    }

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Main category restored successfully",
      data: category, 
    });
  } catch (err) {
    next(err);
  }
}

  async deleteMainCategoryPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const { id } = req.params;
      const deleted = await mainCategoryService.deleteMainCategoryPermanently(id);

      if (!deleted) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Main category permanently deleted",
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleMainCategoryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const category = await mainCategoryService.toggleMainCategoryStatus(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Status updated successfully",
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllTrashMainCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await mainCategoryService.getAllTrashMainCategories(
      page,
      limit
    );

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
}


}

export default new MainCategoryController();
