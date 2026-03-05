// import { Types } from "mongoose";
// import OrderRepository from "../repositories/orderRepository";
// import { OrderModel , IOrder } from "../models/orderModel";
// import { CommonService } from "./commonService";
// import ValidationHelper from "../utils/validationHelper";

// class OrderService {
//     private commonService = new CommonService<IOrder>(OrderModel);

//     private validateOrderData( data: Partial<IOrder>, isUpdate: boolean = false): void {
//         const rules = [
//             !isUpdate ? ValidationHelper.isRequired(data.customerId, "customerId") : (data.customerId !== undefined ? ValidationHelper.isValidObjectId(data.customerId, "customerId") : null),
            
//             !isUpdate ? ValidationHelper.isRequired(data.customerName, "customerName") : (data.customerName !== undefined ? ValidationHelper.isNonEmptyString(data.customerName, "customerName") : null),

//             !isUpdate ? ValidationHelper.isRequired(data.customerEmail, "customerEmail") : (data.customerEmail !== undefined ? ValidationHelper.isValidEmail(data.customerEmail, "customerEmail") : null),

//             !isUpdate ? ValidationHelper.isRequired(data.customerPhone, "customerPhone") : null,

//             !isUpdate ? ValidationHelper.isRequired(data.shippingAddress, "shippingAddress") : null,

//             !isUpdate ? ValidationHelper.isRequired(data.products, "products") : null,

//             ValidationHelper.isArray(data.products, "products"),

//             !isUpdate ? ValidationHelper.isRequired(data.totalAmount, "totalAmount") : null,

//             ValidationHelper.isNumber(data.totalAmount, "totalAmount"),

//             ValidationHelper.isValidEnum(data.paymentStatus,"paymentStatus",["Paid", "Unpaid", "Failed"]),

//             ValidationHelper.isValidEnum( data.orderStatus, "orderStatus", ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]),

//             ValidationHelper.isBoolean(data.isDeleted, "isDeleted")
//         ];

//         const errors = ValidationHelper.validate(rules);

//         if (errors.length > 0) {
//             throw new Error(errors.map(e => e.message).join(", "));
//         }
//     }
    
//     async createOrder(data: IOrder): Promise<IOrder> {
//         this.validateOrderData(data);
//         return await OrderRepository.createOrder(data);
//     }

//     async getAllOrders(page = 1 , limit = 10 , filter?: string , paymentFilter?: string , customerId?: string) {
//         return await OrderRepository.getAllOrders(page , limit , filter , paymentFilter , customerId);
//     }

//     async getOrderById(id: string | Types.ObjectId): Promise<IOrder | null>{

//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) throw new Error(error.message);

//         return await OrderRepository.getOrderById(id);
//     }

//     async updateOrder(id: string | Types.ObjectId , data: Partial<IOrder>): Promise<IOrder | null>{

//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) throw new Error(error.message);
//         this.validateOrderData(data, true);

//         return await OrderRepository.updateOrder(id , data);
//     }

//     async updateOrderStatus(id: string | Types.ObjectId , status : string ): Promise<IOrder | null>{
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) throw new Error(error.message);

//         const enumError = ValidationHelper.isValidEnum(status, "orderStatus", ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]);
//         if (enumError) throw new Error(enumError.message);

//         return await OrderRepository.updateOrderStatus(id , status)
//     }

//     async updatePaymentStatus(id: string | Types.ObjectId , paymentStatus: "Paid" | "Unpaid" | "Failed" ): Promise<IOrder | null>{
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) throw new Error(error.message);

//         const enumError = ValidationHelper.isValidEnum(paymentStatus, "paymentStatus", ["Paid", "Unpaid", "Failed"]);
//         if (enumError) throw new Error(enumError.message);

//         return await OrderRepository.updatePaymentStatus(id , paymentStatus)
//     }

//     async softDeleteOrder( id: string | Types.ObjectId ): Promise<IOrder | null>{
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) throw new Error(error.message);

//         return await OrderRepository.softDeleteOrder(id); 
//     }

//     async deleteOrderPermanently( id: string | Types.ObjectId ): Promise<IOrder | null>{
//         const error = ValidationHelper.isValidObjectId(id, "id");
//         if (error) throw new Error(error.message);

//         return await OrderRepository.deleteOrderPermanently(id);
//     }
// }

// export default new OrderService();

import { Types } from "mongoose";
import OrderRepository from "../repositories/orderRepository";
import ValidationHelper from "../utils/validationHelper";

class OrderService {

    async listAllOrders(page?: number, limit?: number, status?: string) {
        return await OrderRepository.getAllOrders(page, limit, status);
    }

    async getOrderDetails(id: string) {
        const error = ValidationHelper.isValidObjectId(id, "id");
        if (error) throw new Error(error.message);

        const order = await OrderRepository.getOrderById(id);
        if (!order) throw new Error("Order not found");
        
        return order;
    }

    async updateOrderStatus(id: string, status: string) {
        const idError = ValidationHelper.isValidObjectId(id, "id");
        if (idError) throw new Error(idError.message);

        const statusError = ValidationHelper.isValidEnum(status, "orderStatus", ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]);
        if (statusError) throw new Error(statusError.message);

        const updatedOrder = await OrderRepository.updateStatus(id, status);
        if (!updatedOrder) throw new Error("Order not found or update failed");

        return updatedOrder;
    }

    async cancelOrder(id: string) {
        const error = ValidationHelper.isValidObjectId(id, "id");
        if (error) throw new Error(error.message);

        const order = await OrderRepository.getOrderById(id);
        if (!order) throw new Error("Order not found");

        if (["Shipped", "Delivered"].includes(order.orderStatus)) {
            throw new Error(`Cannot cancel an order that has already been ${order.orderStatus.toLowerCase()}.`);
        }

        return await OrderRepository.softDelete(id);
    }
}

export default new OrderService();