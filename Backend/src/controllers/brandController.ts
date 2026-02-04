import { Request, Response, NextFunction } from "express";
import brandService from "../services/brandService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";

class BrandController {
  // Create Brand
  async createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, slug, description } = req.body;

    if (!req.file) {
      throw new Error("image is required");
    }

    let isActive: boolean | undefined;
    if (req.body.isActive !== undefined) {
      isActive = req.body.isActive === "true";
    }

    const result = await processUpload(req, req.file);
    const imageFilename = result.filename;

    const brand = await brandService.createBrand({
      name,
      slug,
      description,
      isActive,
      image: imageFilename
    });

    res.status(201).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Brand created",
      data: brand
    });
  } catch (err: any) {
    next(err);
  }
}



  // Get All Brands
  async getAllBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await brandService.getAllBrands(page, limit, filter);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result.data,
        meta: result.meta
      });
    } catch (err: any) {
      next(err);
    }
  }

  // Update Brand
  async updateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Brand id is required" });
        return;
      }

      const { name, slug, description } = req.body;
      let isActive: boolean | undefined = undefined;
      if (req.body.isActive !== undefined) {
        if (req.body.isActive === "true") isActive = true;
        else if (req.body.isActive === "false") isActive = false;
      }

      let imageFilename: string | undefined;
      if (req.file) {
        const result = await processUpload(req, req.file);
        imageFilename = result.filename;
      }

      const updatedData: any = { name, slug, description };
      if (isActive !== undefined) updatedData.isActive = isActive;
      if (imageFilename) updatedData.image = imageFilename;

      const brand = await brandService.updateBrand(id, updatedData);
      if (!brand) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Brand not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Brand updated",
        data: brand
      });
    } catch (err: any) {
      next(err);
    }
  }

  // Soft Delete Brand
  async softDeleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Brand id is required" });
        return;
      }

      const brand = await brandService.softDeleteBrand(id);
      if (!brand) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Brand not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Brand soft deleted successfully",
        data: brand
      });
    } catch (err: any) {
      next(err);
    }
  }

  // Restore Brand
  async restoreBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Brand id is required" });
        return;
      }

      const brand = await brandService.restoreBrand(id);
      if (!brand) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Brand not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Brand restored successfully",
        data: brand
      });
    } catch (err: any) {
      next(err);
    }
  }

  // Hard Delete Brand
async hardDeleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Brand id is required" });
      return;
    }

    const brand = await brandService.hardDeleteBrand(id);
    if (!brand) {
      res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Brand not found" });
      return;
    }

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Brand permanently deleted",
    });
  } catch (err: any) {
    next(err);
  }
}

}

export default new BrandController();
