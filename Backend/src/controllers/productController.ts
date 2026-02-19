import { NextFunction, Request, Response } from "express";
import productService from "../services/productService";
import { HTTP_RESPONSE } from "../utils/httpResponse";


class productController {

  async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let images: string[] = [];

      if (req.files && Array.isArray(req.files)) {
        images = req.files.map(
          (file: any) => `/uploads/products/${file.filename}`
        );
      }

      const payload = {
        ...req.body,
        images,
      };

      const product = await productService.createProduct(payload);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product created",
        data: product
      });   

    }catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name already exists"
        });
        return;
      }

  if (err.code === 11000) {
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
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product Id is required"
        });
        return;
      }

      let payload = req.body;

      if (req.files && Array.isArray(req.files)) {
        const images = req.files.map(
          (file: any) => `/uploads/products/${file.filename}`
        );
        payload = { ...payload, images };
      }

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

  if (err.message && err.message.includes("already exists")) {
    res.status(409).json({
      status: HTTP_RESPONSE.FAIL,
      message: "Name already exists"
    });
    return;
  }

  if (err.code === 11000) {
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

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product id required"
        });
        return;
      }

      const product = await productService.softDeleteProduct(id);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product deleted successfully",
        data: product
      });

    } catch (err: any) {
      next(err);
    }
  }

  async deleteProductPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product id required"   
        });
        return;
      }

      const product = await productService.permanantDeleteProduct(id);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product deleted permanently",
        data: product
      });

    } catch (err: any) {
      next(err);
    }
  }

  async restoreProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product id is required"
        });
        return;
      }

      const product = await productService.restoreProduct(id);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product restored successfully",
        data: product
      });

    } catch (err: any) {
      next(err);
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product id is required"
        });
        return;
      }

      const product = await productService.toggleStatus(id);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found"
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product status toggled successfully",
        data: product
      });

    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrash(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await productService.getTrashProducts(page, limit);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        ...result
      });

    } catch (err: any) {
      next(err);
    }
  }
}

export default new productController();
