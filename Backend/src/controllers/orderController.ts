

import { Response, Request, NextFunction } from "express";
import OrderService from "../services/orderService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";
import orderService from "../services/orderService";

class OrderController {
     async createOrder(req: Request, res: Response) {
    try {
      const orderData = req.body;

      const order = await OrderService.createOrder(orderData);

      res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order
      });

    } catch (error:any) {
       res.status(400).json({  
      success: false,
      message: error.message
      });
    }
  }
    
    async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = req.query.status as string | undefined;

            const result = await OrderService.listAllOrders(page, limit, status);
            
            res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_RESPONSE.SUCCESS,
                data: result.data,
                meta: result.meta
            });
        } catch (error: any) {
            res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                status: HTTP_RESPONSE.FAIL,
                message: error.message
            });
        }
    }

    async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_RESPONSE.FAIL,
                    message: "Order ID is required"
                });
                return;
            }

            const order = await OrderService.getOrderDetails(id);
            
            res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_RESPONSE.SUCCESS,
                data: order
            });
        } catch (error: any) {
            // Handle "Order not found" specifically if you have custom error types, 
            // otherwise check message content
            const statusCode = error.message === "Order not found" 
                ? HTTP_STATUS_CODE.NOT_FOUND 
                : HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;

            res.status(statusCode).json({
                status: HTTP_RESPONSE.FAIL,
                message: error.message
            });
        }
    }

    async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!id) {
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_RESPONSE.FAIL,
                    message: "Order ID is required"
                });
                return;
            }

            if (!status) {
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_RESPONSE.FAIL,
                    message: "Status is required in request body"
                });
                return;
            }

            const updatedOrder = await OrderService.updateOrderStatus(id, status);
            
            res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_RESPONSE.SUCCESS,
                data: updatedOrder,
                message: "Order status updated successfully"
            });
        } catch (error: any) {
            res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
                status: HTTP_RESPONSE.FAIL,
                message: error.message
            });
        }
    }
    async updateOrderNote(
        req: Request,
        res: Response
    ): Promise<void> {

        try {

            const { id } = req.params;
            const { notes } = req.body;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Order ID required"
                });
                return;
            }

            const updatedOrder = await OrderService.updateOrderNote(
                id,
                notes
            );

            res.status(200).json({
                success: true,
                message: "Note saved successfully",
                data: updatedOrder
            });

        } catch (error: any) {

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                    status: HTTP_RESPONSE.FAIL,
                    message: "Order ID is required"
                });
                return;
            }

            const deletedOrder = await OrderService.cancelOrder(id);

            res.status(HTTP_STATUS_CODE.OK).json({
                status: HTTP_RESPONSE.SUCCESS,
                data: deletedOrder,
                message: "Order cancelled/deleted successfully"
            });
        } catch (error: any) {
            // Check for business logic errors (e.g., "Cannot cancel an order...")
            res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
                status: HTTP_RESPONSE.FAIL,
                message: error.message
            });
        }
    }
    async createOrderCheckout(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const {totalAmount}=req.body;
            const result=await OrderService.createOrderCheckout(totalAmount);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:result})
        } catch (error:any) {
            next(error)
        }
    }
    async verifyPayment(req:Request,res:Response,next:NextFunction):Promise<void>{
        try {
            const data=req.body;
            const result=await orderService.verifyPayment(data);
            res.status(200).json({status:HTTP_RESPONSE.SUCCESS,data:result});
        } catch (error:any) {
            next(error);
        }
    }
}

export default new OrderController();