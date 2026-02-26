import { NextFunction, Request, Response } from "express";
import productService from "../services/productService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";
class productController {

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    (req as any).managementName = "products";

    let images: string[] = [];
    let thumbnail: string = "";

    if (req.files && typeof req.files === "object") {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      if (files.images) {
        images = files.images.map((file) => {
          return `/uploads/products/${file.filename}`;
        });
      }
      if (files.thumbnail && files.thumbnail[0]) {
        const thumbFile = files.thumbnail[0];
        const result = await processUpload(req as any, thumbFile);
        thumbnail = `/uploads/products/thumbnails/thumb_${result.filename}`;
      }
    }

    const payload = {
      ...req.body,
      images,
      thumbnail
    };

    const product = await productService.createProduct(payload);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Product created",
      data: product
    });

  } catch (err: any) {
    if (err.message?.includes("already exists") || err.code === 11000) {
      res.status(409).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Name already exists"
      });
      return;
    }

    next(err);
  }
}
  async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;

      const result = await productService.getAllProducts(page, limit, filter);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result.data,
        meta: result.meta
      });


    } catch (err: any) {
      next(err);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product id is required"
        });
        return;
      }

      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: product
      });

    } catch (err: any) {
      next(err);
    }
  }

  async checkSlugExist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug, categoryId, _id } = req.body;

      if (!slug || !categoryId) {
        res.status(200).json({
          status: HTTP_RESPONSE.SUCCESS
        });
        return;
      }

      const existingProduct: any =
        await productService.isExistSlug(slug, categoryId);

      if (
        existingProduct &&
        _id &&
        existingProduct._id.toString() !== _id.toString()
      ) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          code: "SLUG_EXISTS",
          message: "Name already exists"
        });
        return;
      }

      if (existingProduct && !_id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          code: "SLUG_EXISTS",
          message: "Name already exists"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS
      });

    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      (req as any).managementName = "products";
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product Id is required"
        });
        return;
      }

      let payload: any = { ...req.body };

      /* --------------------------
        ✅ 1. HANDLE EXISTING IMAGES
      ---------------------------*/

      let existingImages = req.body.existingImages || [];

      if (!Array.isArray(existingImages)) {
        existingImages = [existingImages];
      }

      /* --------------------------
        ✅ 2. HANDLE NEW IMAGES
      ---------------------------*/

      let newImages: string[] = [];

      if (req.files && typeof req.files === "object") {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (files.images) {
          for (const file of files.images) {
            const result = await processUpload(req as any, file);
            newImages.push(`/uploads/products/${result.filename}`);
          }
        }

        if (files.thumbnail && files.thumbnail[0]) {
          const result = await processUpload(req as any, files.thumbnail[0]);
          payload.thumbnail = `/uploads/products/thumbnails/thumb_${result.filename}`;
        }
      }

      /* --------------------------
        ✅ 3. MERGE BOTH
      ---------------------------*/

      payload.images = [...existingImages, ...newImages];

      const product = await productService.updateProduct(id, payload);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product updated",
        data: product
      });

    } catch (err: any) {
      if (err.message?.includes("already exists") || err.code === 11000) {
        res.status(409).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name already exists"
        });
        return;
      }

      next(err);
    }
  }

  async softDeleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const product = await productService.softDeleteProduct(id);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Product moved to trash",
      data: product
    });
  } catch (err) {
    next(err);
  }
}

async deleteProductPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    await productService.permanantDeleteProduct(id);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Product permanently deleted"
    });
  } catch (err) {
    next(err);
  }
}

async restoreProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const product = await productService.restoreProduct(id);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Product restored",
      data: product
    });
  } catch (err) {
    next(err);
  }
}

async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    const product = await productService.toggleStatus(id);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: "Status updated",
      data: product
    });
  } catch (err) {
    next(err);
  }
}

async getAllTrash(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const products = await productService.getTrashProducts();

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      data: products
    });
  } catch (err) {
    next(err);
  }
}
}
export default new productController();
