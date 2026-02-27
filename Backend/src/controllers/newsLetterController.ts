import { Request, Response, NextFunction } from "express";
import newsLetterService from "../services/newsLetterService";
import { HTTP_RESPONSE } from "../utils/httpResponse";
import path from "path";
import fs from "fs"; // 👈 File create panna ithu mukkiyam

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

class NewsLetterController {
  // ✅ CREATE
  async createNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Name is required",
        });
        return;
      }

      const slug = generateSlug(name);

      // --- FILE CREATION LOGIC STARTS ---
      try {
        const templateDir = path.join(__dirname, "../templates/newsletters");

        if (!fs.existsSync(templateDir)) {
          fs.mkdirSync(templateDir, { recursive: true });
        }

        const fileName = `${slug}.html`;
        const filePath = path.join(templateDir, fileName);

        fs.writeFileSync(filePath, description || "");

        console.log(`✅ File created: ${filePath}`);
      } catch (fileErr) {
        console.error("❌ File creation failed:", fileErr);
      }
      // --- FILE CREATION LOGIC ENDS ---

      let image = "";
      if (req.file) {
        image = `uploads/newsletters/${req.file.filename}`;
      }

      const newsLetter = await newsLetterService.createNewsLetter({
        ...req.body,
        slug,
        coverImage: image,
      });

      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Newsletter and HTML Template created successfully",
        data: newsLetter,
      });
    } catch (err: any) {
      if (err.message?.includes("already exists")) {
        res.status(409).json({
          status: HTTP_RESPONSE.FAIL,
          message: err.message,
        });
        return;
      }
      next(err);
    }
  }

  // ✅ GET ALL
  async getAllNewsLetters(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await newsLetterService.getAllNewsLetters(page, limit);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result,
      });
    } catch (err: any) {
      next(err);
    }
  }

  // ✅ GET BY ID
  async getNewsLetterById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Newsletter id is required",
        });
        return;
      }

      const newsLetter = await newsLetterService.getNewsLetterById(id);

      if (!newsLetter) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Newsletter not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: newsLetter,
      });
    } catch (err: any) {
      next(err);
    }
  }

  // ✅ UPDATE
  async updateNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Newsletter id is required",
        });
        return;
      }

      const existingNewsLetterData =
        await newsLetterService.getNewsLetterById(id);

      if (!existingNewsLetterData) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Newsletter not found",
        });
        return;
      }

      const slug = name ? generateSlug(name) : existingNewsLetterData.slug;

      // --- UPDATE FILE CONTENT ---
      if (description || name) {
        const templateDir = path.join(__dirname, "../templates/newsletters");
        const filePath = path.join(templateDir, `${slug}.html`);
        fs.writeFileSync(filePath, description || "");
      }

      let payload = req.body;

      if (req.file) {
        let image = `uploads/newsletters/${req.file.filename}`;
        payload = { ...req.body, coverImage: image };
      } else if (existingNewsLetterData?.coverImage) {
        payload.coverImage = existingNewsLetterData.coverImage;
      }

      const newsLetter = await newsLetterService.updateNewsLetter(id, payload);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Newsletter updated successfully",
        data: newsLetter,
      });
    } catch (err: any) {
      next(err);
    }
  }

  // ✅Hard DELETE
  // async deleteNewsLetter(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> {
  //   try {
  //     const { id } = req.params;

  //     if (!id) {
  //       res.status(400).json({
  //         status: HTTP_RESPONSE.FAIL,
  //         message: "Newsletter id is required",
  //       });
  //       return;
  //     }

  //     // First, get the slug to delete the file too (Optional but good practice)
  //     const existing = await newsLetterService.getNewsLetterById(id);

  //     const newsLetter = await newsLetterService.deleteNewsLetter(id);

  //     if (!newsLetter) {
  //       res.status(404).json({
  //         status: HTTP_RESPONSE.FAIL,
  //         message: "Newsletter not found",
  //       });
  //       return;
  //     }

  //     // --- DELETE FILE (Optional) ---
  //     if (existing) {
  //       const filePath = path.join(
  //         __dirname,
  //         "../templates/newsletters",
  //         `${existing.slug}.html`,
  //       );
  //       if (fs.existsSync(filePath)) {
  //         fs.unlinkSync(filePath); // File-ah delete pannidum
  //       }
  //     }

  //     res.status(200).json({
  //       status: HTTP_RESPONSE.SUCCESS,
  //       message: "Newsletter deleted successfully",
  //       data: newsLetter,
  //     });
  //   } catch (err: any) {
  //     next(err);
  //   }
  // }

  async softDeleteNewsLetter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Newsletter id is required",
        });
        return;
      }

      const newsLetter = await newsLetterService.softDeleteNewsLetter(id);
      if (!newsLetter) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Newsletter not found",
        });
        return;
      }

      // Include updated Newsletter document in response data
      res.status(200).json({
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
