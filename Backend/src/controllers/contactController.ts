import { Request, Response, NextFunction } from "express";
import contactService from "../services/contactService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class ContactController {

  async createContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, phone, subject, message } = req.body;
      if (!name || !email || !phone || !subject || !message) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL,message: "Required fields are missing"});
        return;
      }
      const contact = await contactService.createContact(req.body);
      res.status(201).json({ status: HTTP_RESPONSE.SUCCESS, message: "Contact submitted successfully",data: contact});

    } catch (err: any) {
      next(err);
    }
  }

  async getAllContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await contactService.getAllContacts(page, limit);

    res.status(200).json({
      status: HTTP_RESPONSE.SUCCESS,
      data: {
        data: result.data,
        meta: result.meta,   // ✅ IMPORTANT LINE
      },
    });
  } catch (err) {
    next(err);
  }
}

  async getContactById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({status: HTTP_RESPONSE.FAIL, message: "ID is required"});
        return;
      }
      const contact = await contactService.getContactById(id);
      if (!contact) {
        res.status(404).json({status: HTTP_RESPONSE.FAIL, message: "Contact not found"});
        return;
      }
      res.status(200).json({status: HTTP_RESPONSE.SUCCESS, data: contact});

    } catch (err: any) {
      next(err);
    }
  }

  async updateContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({status: HTTP_RESPONSE.FAIL,message: "ID is required"});
        return;
      }
      const updatedContact = await contactService.updateContact(id, req.body);
      if (!updatedContact) {
        res.status(404).json({status: HTTP_RESPONSE.FAIL, message: "Contact not found" });
        return;
      }
      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Contact updated successfully",data: updatedContact});

    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({status: HTTP_RESPONSE.FAIL,message: "ID is required"});
        return;
      }
      const contact = await contactService.softDeleteContact(id);
      if (!contact) {
        res.status(404).json({status: HTTP_RESPONSE.FAIL, message: "Contact not found"});
        return;
      }
      res.status(200).json({status: HTTP_RESPONSE.SUCCESS,message: "Contact deleted successfully",data: contact});
    } catch (err: any) {
      next(err);
    }
  }
  async toggleStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({status: HTTP_RESPONSE.FAIL, message: "ID is required"});
      return;
    }
    const updated = await contactService.toggleStatus(id);
    if (!updated) {
      res.status(404).json({status: HTTP_RESPONSE.FAIL, message: "Contact not found"});
      return;
    }
    res.status(200).json({status: HTTP_RESPONSE.SUCCESS,message: "Status updated successfully",data: updated});
  } catch (error) {
    next(error);
  }
}

 async getAllTrashContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await contactService.getAllTrashContacts(page, limit);
      
      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            totalPages: result.meta.totalPages,
            page,
            limit,
          },
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async restoreContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Contact ID is required" });
        return;
      }

      const contact = await contactService.restoreContact(id);
      if (!contact) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Contact not found in trash" });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Contact restored successfully", data: contact });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteContactPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ status: HTTP_RESPONSE.FAIL, message: "Contact ID is required" });
        return;
      }

      const contact = await contactService.deleteContactPermanently(id);
      if (!contact) {
        res.status(404).json({ status: HTTP_RESPONSE.FAIL, message: "Contact not found" });
        return;
      }

      res.status(200).json({ status: HTTP_RESPONSE.SUCCESS, message: "Contact permanently deleted" });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new ContactController();