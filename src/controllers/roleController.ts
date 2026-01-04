import { Request, Response, NextFunction } from "express";
import RoleService from "../services/roleService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

// Role Controller
class RoleController {
  async createRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const role = await RoleService.createRole(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Role created", data: role });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await RoleService.getAllRoles(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async getRoleById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Role id is required" });
        return;
      }

      const roleData = await RoleService.getRoleById(id);

      if (!roleData) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Role not found" });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Role fetched successfully",
        data: roleData,
      });
    } catch (err: any) {
      res.status(500).json({
        status: HTTP_RESPONSE.FAIL,
        message: err.message || "Internal server error",
      });
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Role id is required" });
        return;
      }
      const roleData = req.body;
      const updatedRole = await RoleService.updateRole(id, roleData);
      if (!updatedRole) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Role not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Role updated successfully", data: updatedRole });
    } catch (err: any) {
      if (err.message && err.message.includes("already exists")) {
        res.status(409).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
        return;
      }
      next(err);
    }
  }

  async softDeleteRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Role id is required" });
        return;
      }
      const role = await RoleService.softDeleteRole(id);
      if (!role) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Role not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Role deleted successfully", data: role });
    } catch (err: any) {
      next(err);
    }
  }

  async toggleRoleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Role id is required" });
        return;
      }
      const updated = await RoleService.toggleStatus(id);
      if (!updated) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Role not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Role status toggled", data: updated });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllTrashRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.status as string | undefined;
      const result = await RoleService.getAllTrashRoles(page, limit, filter);
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, ...result });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Role id is required" });
        return;
      }
      const role = await RoleService.restoreRole(id);
      if (!role) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Role not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Role restored successfully", data: role });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteRolePermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Role id is required" });
        return;
      }
      const role = await RoleService.deleteRolePermanently(id);
      if (!role) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Role not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Role permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }

  async createPrivilegeTable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const privilegeData = await RoleService.createPrivilegeTable();
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, data: privilegeData });
    } catch (err: any) {
      res.status(500).json({ status: HTTP_RESPONSE.FAIL, message: err.message });
    }
  }
}

export const roleController = new RoleController();
