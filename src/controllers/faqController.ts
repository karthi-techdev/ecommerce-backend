import { Request, Response, NextFunction } from "express";
import faqService from "../services/faqService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class FaqController {
  async createFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { question, answer, status } = req.body;
      if (!question || !answer || !status) {
        // Return 400 for missing required fields
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Required fields are missing" });
        return;
      }
      const faq = await faqService.createFaq(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "FAQ created", data: faq });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await faqService.getAllFaqs(page, limit, filter);
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
            limit: result.meta.limit
          }
        }
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getFaqById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
        return;
      }
      const faq = await faqService.getFaqById(id);
      if (!faq) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: faq });
    } catch (err: any) {
      next(err);
    }
  }

  async updateFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
        return;
      }
      const faq = await faqService.updateFaq(id, req.body);
      if (!faq) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "FAQ updated", data: faq });
    } catch (err: any) {
      next(err);
    }
  }

   async softDeleteFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
        return;
      }

      const faq = await faqService.softDeleteFaq(id);
      if (!faq) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ not found" });
        return;
      }

      // Include updated FAQ document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "FAQ deleted successfully", data: faq });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleFaqStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
        return;
      }
      const updated = await faqService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "FAQ status toggled", data: updated });
    } catch (error) {
      next(error);
    }
  }
    async getAllTrashFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await faqService.getAllTrashFaqs(page, limit, filter);
      res.status(200).json({ 
        status: true, 
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            active: result.meta.active,
            inactive: result.meta.inactive,
            totalPages: result.meta.totalPages,
            page: page,
            limit: limit
          }
        }
      });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreFaq(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
        return;
      }

      const faq = await faqService.restoreFaq(id);
      if (!faq) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ not found" });
        return;
      }

      // Include updated FAQ document in response data
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "FAQ restored successfully", data: faq });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteFaqPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ id is required" });
        return;
      }
      const faq = await faqService.deleteFaqPermanently(id);
      if (!faq) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "FAQ not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "FAQ permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new FaqController();