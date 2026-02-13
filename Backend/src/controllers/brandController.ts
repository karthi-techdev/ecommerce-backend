import { Request, Response, NextFunction } from "express";
import brandService from "../services/brandService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";

class BrandController {
  //CREATE BRAND
async createBrand(req: Request, res: Response, next: NextFunction) {
  try {
    

    const { name, slug, description } = req.body;

    let imagePath;

    if (req.file) {
      const result = await processUpload(req as any, req.file);
      imagePath = `uploads/brands/${result.filename}`;
    }

    const brand = await brandService.createBrand({
      name,
      slug,
      description,
      image: imagePath
    });

    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: brand
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
}



  //GET ALL BRANDS
  async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const filter = req.query.status as string;

      const result = await brandService.getAllBrands(page, limit, filter, false);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        ...result 
      });
    } catch (err) {
      next(err);
    }
  }

  //GET TRASH BRANDS
 async getTrashBrands(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await brandService.getTrashBrands(page, limit);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      ...result,
    });
  } catch (err) {
    next(err);
  }
}


  // UPDATE BRAND
  async updateBrand(req: Request, res: Response, next: NextFunction) {
    try {
    

      const id = req.params.id;
      const { name, slug, description } = req.body;

      let isActive;
      if (req.body.isActive !== undefined) {
        isActive = req.body.isActive === "true";
      }

      let imageFilename;
     if (req.file) {
  const result = await processUpload(req as any, req.file);
  imageFilename = `uploads/brands/${result.filename}`;
}


      const updatedData: any = { name, slug, description };
      if (isActive !== undefined) updatedData.isActive = isActive;
      if (imageFilename) updatedData.image = imageFilename;

      const brand = await brandService.updateBrand(id, updatedData);

      if (!brand) throw new Error("Brand not found");

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Brand updated",
        data: brand
      });
    } catch (err) {
      next(err);
    }
  }

  // SOFT DELETE BRAND
 async softDeleteBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const brand = await brandService.softDeleteBrand(req.params.id);

    if (!brand) {
      return res.status(404).json({
        status: "fail",
        message: "Brand not found",
      });
    }

    res.json({
      status: "success",
      message: "Brand moved to trash successfully",
      data: brand,
    });
  } catch (err: any) {
    console.error("SoftDeleteBrand Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message || "Failed to move brand to trash",
    });
  }
}


  //RESTORE BRAND 
  async restoreBrand(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.restoreBrand(req.params.id);

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Brand restored",
        data: brand
      });
    } catch (err) {
      next(err);
    }
  }

 //TOGGLE STATUS
async toggleStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const brandId = req.params.id;
    if (!brandId) throw new Error("Brand ID is required");

    console.log("[ToggleStatus] Request received for brand ID:", brandId);

    const brand = await brandService.toggleStatus(brandId);

    console.log("[ToggleStatus] Brand after toggle:", brand);

    if (!brand) {
      return res.status(404).json({
        status: "fail",
        message: "Brand not found"
      });
    }

    res.json({
      status: "success",
      message: `Brand status toggled to ${brand.isActive ? "active" : "inactive"}`,
      data: brand
    });
  } catch (err) {
    console.error("[ToggleStatus] Error:", err);
    next(err);
  }
}


  //  HARD DELETE BRAND
  async hardDeleteBrand(req: Request, res: Response, next: NextFunction) {
    try {
      await brandService.hardDeleteBrand(req.params.id);

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Brand permanently deleted"
      });
    } catch (err) {
      next(err);
    }
  }

  //  GET BRAND BY ID
  async getBrandById(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await brandService.getBrandById(req.params.id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: brand
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new BrandController();
