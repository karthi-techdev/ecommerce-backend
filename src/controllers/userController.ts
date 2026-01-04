import { Request, Response, NextFunction } from "express";
import userService from "../services/userService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, role, userType, phone, status,password } = req.body;
      if (!username) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Username is required" });
        return;
      }
      const user = await userService.createUser(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "User created", data: user });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.role as string | undefined;
      const result = await userService.getAllUsers(page, limit, filter);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,           
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

  async getAllTrashUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.role as string | undefined;
      const result = await userService.getAllTrashUsers(page, limit, filter);
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,           
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

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "User id is required" });
        return;
      }
      const user = await userService.getUserById(id);
      if (!user) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "User not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: user });
    } catch (err: any) {
      next(err);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "User id is required" });
        return;
      }
      const user = await userService.updateUser(id, req.body);
      if (!user) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "User not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "User updated", data: user });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "User id is required" });
        return;
      }
      const user = await userService.softDeleteUser(id);
      if (!user) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "User not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "User deleted successfully", data: user });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "User id is required" });
        return;
      }
      const updated = await userService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "User not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "User status toggled", data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "User id is required" });
        return;
      }
      const user = await userService.restoreUser(id);
      if (!user) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "User not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "User restored successfully", data: user });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteUserPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "User id is required" });
        return;
      }
      const user = await userService.deleteUserPermanently(id);
      if (!user) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "User not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "User permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new UserController();