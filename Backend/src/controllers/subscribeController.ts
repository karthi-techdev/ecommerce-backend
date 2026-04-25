import { Request, Response, NextFunction } from "express";
import subscribeService from "../services/subscribeService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";

class SubscribeController {

  async subscribe(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const result = await subscribeService.subscribe(email);

      res.status(HTTP_STATUS_CODE.OK).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: result
      });


    } catch (error: any) {

      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json({
        status: HTTP_RESPONSE.FAIL,
        message: error.message,
      });
    }
  }

async getAll(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = (req.query.filter as string) || "total";

    const { data, total, counts } =
      await subscribeService.getAllSubscribers(page, limit, filter);

    res.status(200).json({
      status: "SUCCESS",
      data,
      meta: {
        total,
        totalPages: Math.ceil(total / limit),
      },
      counts,
    });

  } catch (error: any) {
    res.status(500).json({
      status: "FAIL",
      message: error.message,
    });
  }
}

async toggleStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const SubscribeId = req.params.id;
      if (!SubscribeId) throw new Error("SubScriber ID is required");

      console.log("[ToggleStatus] Request received for Subscribe ID:", SubscribeId);

      const subcriber = await subscribeService.toggleStatus(SubscribeId);

      console.log("[ToggleStatus] subcriber after toggle:", subcriber);

      if (!subcriber) {
        return res.status(404).json({
          status: "fail",
          message: "Testimonial not found"
        });
      }

      res.json({
        status: "success",
        message: `Testimonial status toggled to ${subcriber.isActive ? "active" : "inactive"}`,
        data: subcriber
      });
    } catch (err) {
      console.error("[ToggleStatus] Error:", err);
      next(err);
    }
  }

   async hardDelete(req: Request, res: Response, next: NextFunction) {
      try {
        await subscribeService.hardDeleteSubscriber(req.params.id);
  
        res.json({
          status: HTTP_RESPONSE.SUCCESS,
          message: "Subscriber permanently deleted"
        });
      } catch (err) {
        next(err);
      }
    }
}
export default new SubscribeController();