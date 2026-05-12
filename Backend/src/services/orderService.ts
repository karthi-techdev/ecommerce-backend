

import { Types } from "mongoose";
import OrderRepository from "../repositories/orderRepository";
import ValidationHelper from "../utils/validationHelper";
import { v4 as uuidv4 } from "uuid";
import { ProductModel } from "../models/productModel";

class OrderService {
    
async createOrder(data: any) {

    if (!data.customerId) throw new Error("customerId required");

    if (!data.products || data.products.length === 0)
        throw new Error("Products required");

    if (!data.totalAmount)
        throw new Error("Total amount required");

    if (!data.shippingMethod)
        throw new Error("Shipping method required");

    if (!data.paymentMethod)
        throw new Error("Payment method required");

    if (!data.shippingPrice && data.shippingPrice !== 0)
        throw new Error("Shipping price required");


    // CHECK STOCK
    for (const item of data.products) {

        const product = await ProductModel.findById(item.productId);

        if (!product) {
            throw new Error(`${item.productName} not found`);
        }

        // CHECK AVAILABLE STOCK
        if (product.stockQuantity < item.quantity) {
            throw new Error(
                `${product.name} only ${product.stockQuantity} items left in stock`
            );
        }
    }


    // REDUCE STOCK
    for (const item of data.products) {

        await ProductModel.findByIdAndUpdate(
            item.productId,
            {
                $inc: {
                    stockQuantity: -item.quantity
                }
            }
        );
    }


    // GENERATE ORDER NUMBER
    data.orderNumber = "ORD-aven" + uuidv4().slice(0, 4);


    // CREATE ORDER
    return await OrderRepository.create(data);
}

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