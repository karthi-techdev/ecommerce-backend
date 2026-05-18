

import { Types } from "mongoose";
import OrderRepository from "../repositories/orderRepository";
import ValidationHelper from "../utils/validationHelper";
import { IOrder } from "../models/orderModel";
import { createOrder,verifyPayment } from "../utils/razorpay";
import { v4 as uuidv4 } from "uuid";
import { ProductModel } from "../models/productModel";
import { CouponModel } from "../models/couponModel";
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

    if (data.shippingPrice == null)
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
        const order = await OrderRepository.create(data);

        if (data.couponCode) {

            await CouponModel.findOneAndUpdate(
                {
                    code: data.couponCode.toUpperCase()
                },
                {
                    $inc: {
                        usageLimit: -1
                    }
                }
            );
        }

        return order;

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
        async updateOrderNote(id: string, notes: string) {

        const error = ValidationHelper.isValidObjectId(id, "id");

        if (error) {
            throw new Error(error.message);
        }

        const updatedOrder = await OrderRepository.updateNote(id, notes);

        if (!updatedOrder) {
            throw new Error("Order not found");
        }

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

    async createOrderCheckout(totalAmount:number){
        const createRazorpayOrder=await createOrder(totalAmount);
        return createRazorpayOrder.id
    }
    async verifyPayment(data:IOrder){
            const generateSignature=verifyPayment(data.razorpayOrderId,data.razorpayPaymentId);
            if(generateSignature!=data.razorpaySignature){
                throw new Error("Payment verification failed");
                return;
            }
            data.paymentStatus = "Paid";

            data.orderNumber = "ORD-" + uuidv4().slice(0, 8);

            // CREATE ORDER
            const order = await this.createOrder(data);


            return order;
                }
}

export default new OrderService();