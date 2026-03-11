// import { Response , Request , NextFunction } from "express";
// import OrderService from "../services/orderService";
// import { HTTP_RESPONSE , HTTP_STATUS_CODE } from "../utils/httpResponse";

// class OrderController {
//     async createOrder(req: Request, res: Response, next: NextFunction): Promise<void>{
//         try {
//             const { products , customerEmail , customerId , shippingAddress , totalAmount , customerName , customerPhone} = req.body;
            
//             if(!customerId) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Customer ID is required"});
//                 return;
//             }
//             if(!customerEmail) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Customer Email is required"});
//                 return;
//             }
//             if(!products || products.length === 0) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "products is required"});
//                 return;
//             }
//             if(!customerName) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Customer Name is required"});
//                 return;
//             }
//             if(!totalAmount) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "TotalAmount is required"});
//                 return;
//             }
//             const order = await OrderService.createOrder(req.body)
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : order})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async getAllOrders(req: Request, res: Response, next: NextFunction){
//         try {
//             const page = parseInt(req.query.page as string) || 1;
//             const limit = parseInt(req.query.limit as string) || 10;
//             const filter = req.query.status as string | undefined;
//             const paymentFilter = req.query.paymentStatus as string | undefined;
//             const customerId = req.query.customerId as string | undefined;

//             const orders = await OrderService.getAllOrders(page , limit , filter , paymentFilter , customerId);
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : orders})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void>{
//         try {
//             const { id } = req.params
//             if(!id) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order id is required"});
//                 return;
//             }
//             const order = await OrderService.getOrderById(id);
//             if(!order) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order is not found"});
//                 return;
//             }
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : order})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void>{
//         try {
//             const { id } = req.params
//             if(!id) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order id is required"});
//                 return;
//             }
//             const updatedOrder = await OrderService.updateOrder(id , req.body);
//             if(!updatedOrder) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order is not found"});
//                 return;
//             }
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : updatedOrder})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>{
//         try {
//             const { id } = req.params
//             const { status } = req.body
//             if(!id) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order id is required"});
//                 return;
//             }
//             if(!status) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order status is required"});
//                 return;
//             }
//             const orderStatus = await OrderService.updateOrderStatus(id , status);
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : orderStatus , message: "Order status updated successfully"})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void>{
//         try {
//             const { id } = req.params;
//             const { paymentStatus } = req.body;
//             if(!id) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order id is required"});
//                 return;
//             }
//             if(!paymentStatus) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order status is required"});
//                 return;
//             }
//             const PaymentStatus = await OrderService.updatePaymentStatus(id , paymentStatus);
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : PaymentStatus , message: "Payment status updated successfully"})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async softDeleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {
//             const { id } = req.params;
//             if(!id) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order id is required"});
//                 return;
//             }
//             const deleted = await OrderService.softDeleteOrder(id);
//             if(!deleted) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order not found"});
//                 return;
//             }
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : deleted , message: "Order deleted successfully"})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }

//     async deleteOrderPermanently(req: Request, res: Response, next: NextFunction): Promise<void>{
//         try {
//             const { id } = req.params;
//             if(!id) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order id is required"});
//                 return;
//             }
//             const deleted = await OrderService.deleteOrderPermanently(id);
//             if(!deleted) {
//                 res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({status : HTTP_RESPONSE.FAIL , message : "Order not found"});
//                 return;
//             }
//             res.status(HTTP_STATUS_CODE.OK).json({status : HTTP_RESPONSE.SUCCESS , data : deleted , message: "Order deleted permanently"})
//         } catch (error : any) {
//             res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({status: HTTP_RESPONSE.FAIL , message: error.message});
//         }
//     }
// }

// export default new OrderController();

import { Response, Request, NextFunction } from "express";
import OrderService from "../services/orderService";
import { HTTP_RESPONSE, HTTP_STATUS_CODE } from "../utils/httpResponse";

class OrderController {
    
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
}

export default new OrderController();