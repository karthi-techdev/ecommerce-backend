import { Request, Response, NextFunction } from "express";
import subCategoryService from "../services/subCategoryService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class SubCategoryController {
  async createSubCategory( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {  name, slug, mainCategoryId } = req.body;
      if ( !name || !slug || !mainCategoryId) {
        res
          .status(400)
          .json({status: HTTP_RESPONSE.FAIL,  message: "Required fields are missing",
          });
        return;
      }
       const image = req.file
      ? `/uploads/subcategories/${req.file.filename}`
      : "";

    const payload = {
      ...req.body,
      image,
    };
      const subCategory = await subCategoryService.createSubCategory(payload);
      res
        .status(201)
        .json({  status: HTTP_RESPONSE.SUCCESS,  message: "SubCategory created"});
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res
          .status(409)
          .json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllSubCategories( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const mainCategoryId = req.query.mainCategoryId as string | undefined;

      const result = await subCategoryService.getAllSubCategories( page, limit,filter, mainCategoryId
      );

      res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      data: {
        data: result.data,
        meta: {
          total: result.meta.total,
          active: result.meta.active,    
          inactive: result.meta.inactive,
          totalPages: result.meta.totalPages,
          page: result.meta.page,
          limit: result.meta.limit,
        },
      },
    });
    } catch (err: any) {
      next(err);
    }
  }

  async getSubCategoryById( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({status: HTTP_RESPONSE.FAIL, message: "SubCategory id is required",});
        return;
      }

      const subCategory = await subCategoryService.getSubCategoryById(id);
      if (!subCategory) {
        res
          .status(404)
          .json({status: HTTP_RESPONSE.FAIL, message: "SubCategory not found", });
        return;
      }

      res
        .status(200)
        .json({ status: HTTP_RESPONSE.SUCCESS, data: subCategory });
    } catch (err: any) {
      next(err);
    }
  }

  async updateSubCategory(req: Request,res: Response, next: NextFunction ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ status: HTTP_RESPONSE.FAIL,  message: "SubCategory id is required",
          });
        return;
      }
      const updateData: any = {
      name: req.body.name,
      slug: req.body.slug,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = `/uploads/subcategories/${req.file.filename}`;
    }
      const subCategory = await subCategoryService.updateSubCategory(id, updateData);
      if (!subCategory) {
        res
          .status(404)
          .json({ status: HTTP_RESPONSE.FAIL,  message: "SubCategory not found",
          });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "SubCategory updated",data: subCategory,});
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteSubCategory( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ status: HTTP_RESPONSE.FAIL, message: "SubCategory id is required",});
        return;
      }

      const subCategory = await subCategoryService.softDeleteSubCategory(id);
      if (!subCategory) {
        res
          .status(404)
          .json({ status: HTTP_RESPONSE.FAIL, message: "SubCategory not found",});
        return;
      }

      res
        .status(200)
        .json({status: HTTP_RESPONSE.SUCCESS, message: "SubCategory deleted successfully", data: subCategory, });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleSubCategoryStatus( req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ status: HTTP_RESPONSE.FAIL,  message: "SubCategory id is required",
          });
        return;
      }

      const updated = await subCategoryService.toggleActive(id);
      if (!updated) {
        res
          .status(404)
          .json({ status: HTTP_RESPONSE.FAIL, message: "SubCategory not found",  });
        return;
      }

      res
        .status(200)
        .json({ status: HTTP_RESPONSE.SUCCESS,  message: "SubCategory status toggled", data: updated, });
    } catch (error) {
      next(error);
    }
  }

  async getAllTrashSubCategories( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      console.log("2222")
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      console.log("333")

      const result = await subCategoryService.getAllTrashSubCategories(
        page,
        limit,
        filter
      );
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            totalPages: result.meta.totalPages,
            page,
            limit,
          },
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreSubCategory(  req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ status: HTTP_RESPONSE.FAIL, message: "SubCategory id is required", });
        return;
      }

      const subCategory = await subCategoryService.restoreSubCategory(id);
      if (!subCategory) {
        res
          .status(404)
          .json({ status: HTTP_RESPONSE.FAIL, message: "SubCategory not found",});
        return;
      }

      res
        .status(200)
        .json({ status: HTTP_RESPONSE.SUCCESS,  message: "SubCategory restored successfully",  data: subCategory, });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteSubCategoryPermanently( req: Request, res: Response, next: NextFunction ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ status: HTTP_RESPONSE.FAIL, message: "SubCategory id is required", });
        return;
      }

      const subCategory = await subCategoryService.deleteSubCategoryPermanently(id);
      if (!subCategory) {
        res
          .status(404)
          .json({  status: HTTP_RESPONSE.FAIL, message: "SubCategory not found",
          });
        return;
      }

      res
        .status(200)
        .json({ status: HTTP_RESPONSE.SUCCESS, message: "SubCategory permanently deleted",  });
    } catch (err: any) {
      next(err);
    }
  }

  async checkDuplicate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { slug, mainCategoryId, excludeId } = req.body;

    if (!slug || !mainCategoryId) {
      res.status(400).json({
        status: HTTP_RESPONSE.FAIL,
        message: 'Slug and mainCategoryId are required',
      });
      return;
    }

    const exists =
      await subCategoryService.checkDuplicateSubCategory(
        slug,
        mainCategoryId,
        excludeId
      );
if (exists) {
  throw new Error(`Name already exists`);
}

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      exists,
    });
  } catch (err) {
    next(err);
  }
}

}

export default new SubCategoryController();
