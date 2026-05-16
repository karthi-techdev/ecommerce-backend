import { Request, Response, NextFunction } from "express";
import addressService from "../services/addressService";
import { HTTP_RESPONSE } from "../utils/httpResponse";

class AddressController {

  async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        addressType,
        fullName,
        phoneNumber,
        streetAddress,
        country,
        pincode,
      } = req.body;

      if (!addressType || !fullName || !phoneNumber || !streetAddress || !country || !pincode) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Required fields are missing",
        });
        return;
      }

      const payload = { ...req.body };
console.log("REQ BODY:", req.body);
      await addressService.createAddress(payload);

      res.status(201).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Address created",
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getAllAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const filter = req.query.filter as string | undefined;
      // const userId = req.query.userId as string | undefined;

      const result = await addressService.getAllAddresses(page, limit, filter);

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: {
          data: result.data,
          meta: {
            total: result.meta.total,
            default: result.meta.default,
            nonDefault: result.meta.nonDefault,
            totalPages: result.meta.totalPages,
            page: result.meta.page,
            limit: result.meta.limit,
          },
        },
      });
    } catch (err: any) {
      next(err);
    }
  }

  async getAddressById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address id is required",
        });
        return;
      }

      const address = await addressService.getAddressById(id);

      if (!address) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        data: address,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address id is required",
        });
        return;
      }

      const updateData: any = {
        addressType: req.body.addressType,
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        streetAddress: req.body.streetAddress,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pincode: req.body.pincode,
      };

      const address = await addressService.updateAddress(id, updateData);

      if (!address) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Address updated",
        data: address,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async softDeleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address id is required",
        });
        return;
      }

      const address = await addressService.softDeleteAddress(id);

      if (!address) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Address deleted successfully",
        data: address,
      });
    } catch (err: any) {
      next(err);
    }
  }

  // async toggleDefault(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const id = req.params.id;
  //     // const { userId } = req.body;

  //     if (!id ) {
  //       res.status(400).json({
  //         status: HTTP_RESPONSE.FAIL,
  //         message: "Address id and userId are required",
  //       });
  //       return;
  //     }

  //     const updated = await addressService.toggleDefault(id);

  //     if (!updated) {
  //       res.status(404).json({
  //         status: HTTP_RESPONSE.FAIL,
  //         message: "Address not found",
  //       });
  //       return;
  //     }

  //     res.status(200).json({
  //       status: HTTP_RESPONSE.SUCCESS,
  //       message: "Default address toggled",
  //       data: updated,
  //     });
  //   } catch (err: any) {
  //     next(err);
  //   }
  // }

  async getAllTrashAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await addressService.getAllTrashAddresses(page, limit);

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

  async restoreAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address id is required",
        });
        return;
      }

      const address = await addressService.restoreAddress(id);

      if (!address) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Address restored successfully",
        data: address,
      });
    } catch (err: any) {
      next(err);
    }
  }

  async deleteAddressPermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address id is required",
        });
        return;
      }

      const address = await addressService.deleteAddressPermanently(id);

      if (!address) {
        res.status(404).json({
          status: HTTP_RESPONSE.FAIL,
          message: "Address not found",
        });
        return;
      }

      res.status(200).json({
        status: HTTP_RESPONSE.SUCCESS,
        message: "Address permanently deleted",
      });
    } catch (err: any) {
      next(err);
    }
  }
}

export default new AddressController();