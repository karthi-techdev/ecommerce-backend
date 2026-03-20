import { Request, Response, NextFunction } from "express";
import bannerService from "../services/bannerService";
import { processUpload } from "../utils/fileUpload";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class BannerController {

  async getBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await bannerService.getBanner();

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          _id: data._id,
          home_page: data.home_page,
          updatedAt: data.updatedAt
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBanner(req: Request, res: Response, next: NextFunction) {

    try {

      const id = req.params.id || undefined;
      const { type } = req.body;

      if (!["banner_one", "banner_two"].includes(type)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid banner type"
        });
      }

      const files = req.files as any;
      const updateData: any = { ...req.body };


      if (type === "banner_one") {

        if (files?.image) {
          const upload = await processUpload(req as any, files.image[0]);
          updateData.image = `uploads/banner/${upload.filename}`;
        }

      }

      if (type === "banner_two") {

        if (files?.imageone) {
          const upload = await processUpload(req as any, files.imageone[0]);
          updateData.imageone = `uploads/banner/${upload.filename}`;
        }

        if (files?.imagetwo) {
          const upload = await processUpload(req as any, files.imagetwo[0]);
          updateData.imagetwo = `uploads/banner/${upload.filename}`;
        }

        if (files?.imagethree) {
          const upload = await processUpload(req as any, files.imagethree[0]);
          updateData.imagethree = `uploads/banner/${upload.filename}`;
        }

      }

      const result = await bannerService.updateBanner(id, type, updateData);

      res.json({
        status: HTTP_RESPONSE.SUCCESS,
        message: `${type} updated`,
        data: result
      });

    } catch (error) {
      next(error);
    }
  }
}

export default new BannerController();