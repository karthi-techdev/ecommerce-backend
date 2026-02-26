import { Request, Response, NextFunction } from "express";
import newsLetterService from "../services/newsLetterService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

class NewsLetterController {
  async createNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      //const { name, slug } = req.body;

      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: "Name is required" });
        return;
      }

      const slug = generateSlug(name);

      console.log("bb_new", req.body);
      if (!name || !slug) {
        // Return 400 for missing required fields
        res
          .status(400)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Required fields are missing",
          });
        return;
      }
      //    const newsLetter = await newsLetterService.createNewsLetter(req.body);
      const newsLetter = await newsLetterService.createNewsLetter({
        ...req.body,
        slug,
      });

      console.log("new", newsLetter);
      res
        .status(201)
        .json({
          status: HTTP_RESPONSE.SUCCESS,
          message: "NewsLetter created",
          data: newsLetter,
        });
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

  async getAllNewsLetters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      // const filter = req.query.status as string | undefined;
      const result = await newsLetterService.getAllNewsLetters(page, limit);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getNewsLetterById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res
          .status(400)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Newsletter id is required",
          });
        return;
      }
      const newsLetter = await newsLetterService.getNewsLetterById(id);
      if (!newsLetter) {
        res
          .status(404)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Newsletter not found",
          });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: newsLetter });
    } catch (err: any) {
      next(err);
    }
  }

  async updateNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res
          .status(400)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Newsletter id is required",
          });
        return;
      }
      const newsLetter = await newsLetterService.updateNewsLetter(id, req.body);
      if (!newsLetter) {
        res
          .status(404)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Newsletter not found",
          });
        return;
      }
      res
        .status(200)
        .json({
          status: HTTP_RESPONSE.SUCCESS,
          message: "Newsletter updated",
          data: newsLetter,
        });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res
          .status(400)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Newsletter id is required",
          });
        return;
      }

      const newsLetter = await newsLetterService.softDeleteNewsLetter(id);
      if (!newsLetter) {
        res
          .status(404)
          .json({
            status: HTTP_RESPONSE.FAIL,
            message: "Newsletter not found",
          });
        return;
      }

      // Include updated Newsletter document in response data
      res
        .status(200)
        .json({
          status: HTTP_RESPONSE.SUCCESS,
          message: "Newsletter deleted successfully",
          data: newsLetter,
        });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new NewsLetterController();
