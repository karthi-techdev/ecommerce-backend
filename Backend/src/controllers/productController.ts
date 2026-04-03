import { NextFunction, Request, Response } from "express";
import productService from "../services/productService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";
import { ProductModel } from "../models/productModel";
import { ConfigModel } from "../models/configModel";
class productController {
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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

      let relatedTags = req.body.relatedTags;

      if (relatedTags && !Array.isArray(relatedTags)) {
        relatedTags = [relatedTags];
      }

      const payload = {
        ...req.body,
        relatedTags,
        images,
        thumbnail,
      };

      const product = await productService.createProduct(payload);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product created",
        data: product,
      });
    } catch (err: any) {
      if (err.message?.includes("already exists") || err.code === 11000) {
        res.status(409).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name already exists",
        });
        return;
      }

      next(err);
    }
  }
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;

      const result = await productService.getAllProducts(page, limit, filter);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result.data,
        meta: result.meta,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product id is required",
        });
        return;
      }

      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: product,
      });
    } catch (err: any) {
      next(err);
    }
  }

  // NEW METHOD (SLUG)
  async getProductBySlug(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const slug = req.params.slug;

      if (!slug) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product slug is required",
        });
        return;
      }

      const product = await productService.getProductBySlug(slug);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: product,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async checkSlugExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { slug, _id } = req.body;

      if (!slug) {
        res.status(200).json({
          status: HTTP_RESPONSE.SUCCESS,
        });
        return;
      }

      const existingProduct: any = await productService.isExistSlug(slug);

      if (
        existingProduct &&
        _id &&
        existingProduct._id.toString() !== _id.toString()
      ) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          code: "SLUG_EXISTS",
          message: "Name already exists",
        });
        return;
      }

      if (existingProduct && !_id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          code: "SLUG_EXISTS",
          message: "Name already exists",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      (req as any).managementName = "products";
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product Id is required",
        });
        return;
      }

      let payload: any = { ...req.body };
      if (payload.relatedTags && !Array.isArray(payload.relatedTags)) {
        payload.relatedTags = [payload.relatedTags];
      }
      let existingImages = req.body.existingImages || [];

      if (!Array.isArray(existingImages)) {
        existingImages = [existingImages];
      }

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

      payload.images = [...existingImages, ...newImages];

      const product = await productService.updateProduct(id, payload);

      if (!product) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Product not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product updated",
        data: product,
      });
    } catch (err: any) {
      if (err.message?.includes("already exists") || err.code === 11000) {
        res.status(409).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name already exists",
        });
        return;
      }

      next(err);
    }
  }

  async softDeleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const product = await productService.softDeleteProduct(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product moved to trash",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProductPermanently(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      await productService.permanantDeleteProduct(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product permanently deleted",
      });
    } catch (err) {
      next(err);
    }
  }

  async restoreProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const product = await productService.restoreProduct(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Product restored",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async toggleStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      const product = await productService.toggleStatus(id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Status updated",
        data: product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllTrash(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await productService.getTrashProducts(page, limit);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            totalPages: result.meta.totalPages,
            page: result.meta.page,
            limit: result.meta.limit,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async getFilteredProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const type = req.query.type as string | undefined;
      console.log("🔥 TYPE:", type);
      let filter: any = {
        status: "active",
        isDeleted: false,
      };

      let sort: any = { createdAt: -1 };

      const configs = await ConfigModel.find({ status: "active" });

      const relatedTagsConfig = configs.find((c) => c.slug === "related-tags");
      let featuredIds: string[] = [];
      let popularIds: string[] = [];
      if (relatedTagsConfig) {
        featuredIds = relatedTagsConfig.options
          .filter((opt) => opt.key === "Featured")
          .map((opt) => opt._id.toString());

        popularIds = relatedTagsConfig.options
          .filter((opt) => opt.key === "Popular")
          .map((opt) => opt._id.toString());
      }

      console.log("🔥 featuredIds:", featuredIds);
      console.log("🔥 popularIds:", popularIds);

      if (type === "featured" && featuredIds.length > 0) {
        filter.relatedTags = { $in: featuredIds };
      }

      if (type === "popular" && popularIds.length > 0) {
        filter.relatedTags = { $in: popularIds };
      }

      if (type === "new") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filter.createdAt = { $gte: sevenDaysAgo };
      }
      console.log("🔥 FILTER:", filter);

      const products = await ProductModel.find(filter)
        .populate("categoryId", "name")
        .sort(sort);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: products,
      });
    } catch (err) {
      console.log("❌ FILTER ERROR:", err);
      next(err);
    }
  }

  async getNewProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let filter: any = {
        status: "active",
        isDeleted: false,
      };

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      filter.createdAt = { $gte: sevenDaysAgo };

      const products = await ProductModel.find(filter)
        .populate("categoryId", "name")
        .sort({ createdAt: -1 });

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: products,
      });
    } catch (err) {
      next(err);
    }
  }
}
export default new productController();
