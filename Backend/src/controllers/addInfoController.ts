import { Request, Response, NextFunction } from "express";
import addInfoService from "../services/addInfoService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class AddInfoController {
  async createAddInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key, value } = req.body;
      if (!key || !value) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Required fields (key and value) are missing" });
        return;
      }
      const addInfo = await addInfoService.createAddInfo(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Additional Info created", data: addInfo });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

 async getAllAddInfos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter = (req.query.filter as string) || 'total';

    const result = await addInfoService.getAllAddInfos(
  page,
  limit,
  filter as 'total' | 'active' | 'inactive'
);

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

  async getAddInfoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const addInfo = await addInfoService.getAddInfoById(id);
      if (!addInfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Additional Info not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: addInfo });
    } catch (err: any) {
      next(err);
    }
  }

  async updateAddInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const addInfo = await addInfoService.updateAddInfo(id, req.body);
      if (!addInfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Additional Info not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Additional Info updated", data: addInfo });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async softDeleteAddInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }

      const addInfo = await addInfoService.softDeleteAddInfo(id);
      if (!addInfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Additional Info not found" });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Additional Info moved to trash", data: addInfo });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashAddInfos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await addInfoService.getAllTrashAddInfos(page, limit);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            totalTrash: result.meta.totalTrash,
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

  async restoreAddInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }

      const addInfo = await addInfoService.restoreAddInfo(id);
      if (!addInfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Additional Info not found" });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Additional Info restored successfully", data: addInfo });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteAddInfoPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "ID is required" });
        return;
      }
      const addInfo = await addInfoService.deleteAddInfoPermanently(id);
      if (!addInfo) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Additional Info not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Additional Info permanently deleted" });
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
        message: "ID is required"
      });
      return;
    }

    const updated = await addInfoService.toggleStatus(id);

    if (!updated) {
      res.status(404).json({
        status: HTTP_RESPONSE.FAIL,
        message: "Additional Info not found"
      });
      return;
    }

    const action = updated.isActive ? "activated" : "deactivated";

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      message: `Additional Info ${action} successfully`,
      data: updated
    });

  } catch (error) {
    next(error);
  }
}

 async getAddInfoStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const stats = await addInfoService.getStats();
    res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: stats });
  } catch (err: any) {
    next(err);
  }
}

  async checkDuplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { key, excludeId } = req.body;
      if (!key) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Key is required" });
        return;
      }
      const exists = await addInfoService.checkDuplicateKey(key, excludeId);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, exists });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AddInfoController();