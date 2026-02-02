import { Request, Response, NextFunction } from "express";
import mainCategoryService from "../services/mainCategoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";

class MainCategoryController {

  async createMainCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let { mainCategoryId, name, slug, description, isActive } = req.body;

    if (!mainCategoryId || !name || !slug || !description) {
      res.status(400).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Required fields are missing",
      });
      return;
    }
    if (isActive !== undefined) {
      isActive = isActive === "true";
    }

    (req as any).managementName = "main-categories";

    let imageUrl = "";
    if (req.file) {
      const uploaded = await processUpload(req as any, req.file);
      imageUrl = `/uploads/main-categories/${uploaded.filename}`;
    }

    const category = await mainCategoryService.createMainCategory({
      mainCategoryId,
      name,
      slug,
      description,
      image: imageUrl,
      isActive,
    });

    res.status(201).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Main category created",
      data: category,
    });
  } catch (err) {
    next(err);
  }
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

  async getMainCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category id is required",
        });
        return;
      }

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

    if (!id) {
      res.status(400).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Main category id is required",
      });
      return;
    }

    // 🔑 multer folder
    (req as any).managementName = "main-categories";

    // ✅ FIX: convert isActive to boolean
    if (req.body.isActive !== undefined) {
      req.body.isActive = req.body.isActive === "true";
    }

    // ✅ image upload
    if (req.file) {
      const uploaded = await processUpload(req as any, req.file);
      req.body.image = `/uploads/main-categories/${uploaded.filename}`;
    }

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
      message: "Main category updated",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
}

  async softDeleteMainCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category id is required",
        });
        return;
      }

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
        data: category,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllTrashMainCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await mainCategoryService.getAllTrashMainCategories(page, limit);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: result.meta,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async restoreMainCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category id is required",
        });
        return;
      }

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

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Main category id is required",
        });
        return;
      }

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
}

export default new MainCategoryController();
