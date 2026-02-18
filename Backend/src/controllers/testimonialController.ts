import testimonialService from "../services/testimonialService";
import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import { processUpload } from "../utils/fileUpload";

class TestimonialController {

  async createTestimonial(req: Request, res: Response, next: NextFunction) {
    try {



      const { name, message, designation, rating } = req.body;

      let imagePath;

      if (req.file) {
        const result = await processUpload(req as any, req.file);
        imagePath = `uploads/testimonial/${result.filename}`;
      }

      const testimonial = await testimonialService.createTestimonial({
        name,
        message,
        designation,
        rating,
        image: imagePath
      });

      res.status(201).json({
        success: true,
        message: "Testimonial created successfully",
        data: testimonial
      });

    } catch (error: any) {

      res.status(400).json({
        success: false,
        message: error.message || "Something went wrong"
      });
    }
  }
  async getAllTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const filter = req.query.filter as string;

      const result = await testimonialService.getAllTestimonial(page, limit, filter, false);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }
  async updateTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const { name, message, designation, rating } = req.body;

      let isActive;
      if (req.body.isActive !== undefined) {
        isActive = req.body.isActive === "true";
      }

      let imageFilename;
      if (req.file) {
        const result = await processUpload(req, req.file);
        imageFilename = `uploads/testimonial/${result.filename}`;;
      }

      const updatedData: any = { name, message, designation, rating };
      if (isActive !== undefined) updatedData.isActive = isActive;
      if (imageFilename) updatedData.image = imageFilename;

      const testimonial = await testimonialService.updateTestimonial(id, updatedData);

      if (!testimonial) throw new Error("Testimonial not found");

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Testimonial updated",
        data: testimonial
      });
    } catch (err) {
      next(err);
    }
  }

  async softDeleteTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const testimonial = await testimonialService.softDeleteTestimonial(req.params.id);

      if (!testimonial) {
        return res.status(404).json({
          status: "fail",
          message: "Testimonial not found",
        });
      }

      res.json({
        status: "success",
        message: "Testimonial moved to trash successfully",
        data: testimonial,
      });
    } catch (err: any) {
      console.error("SoftDeleteTestimonial Error:", err.message);
      res.status(500).json({
        status: "error",
        message: err.message || "Failed to move Testimonial to trash",
      });
    }
  }

  async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const testimonialId = req.params.id;
      if (!testimonialId) throw new Error("Testimonial ID is required");

      console.log("[ToggleStatus] Request received for Testimonial ID:", testimonialId);

      const testimonial = await testimonialService.toggleStatus(testimonialId);

      console.log("[ToggleStatus] Testimonial after toggle:", testimonial);

      if (!testimonial) {
        return res.status(404).json({
          status: "fail",
          message: "Testimonial not found"
        });
      }

      res.json({
        status: "success",
        message: `Testimonial status toggled to ${testimonial.isActive ? "active" : "inactive"}`,
        data: testimonial
      });
    } catch (err) {
      console.error("[ToggleStatus] Error:", err);
      next(err);
    }
  }

  async hardDeleteTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      await testimonialService.hardDeleteTestimonial(req.params.id);

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Testimonial permanently deleted"
      });
    } catch (err) {
      next(err);
    }
  }

  async getTestimonialById(req: Request, res: Response, next: NextFunction) {
    try {
      const brand = await testimonialService.getTestimonialById(req.params.id);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: brand
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new TestimonialController();