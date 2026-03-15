// import { Types } from "mongoose";
// import { OrderModel , IOrder } from "../models/orderModel";
// import { CommonRepository } from "./commonRepository";

// class OrderRepository {
//     private commonRepository : CommonRepository<IOrder>;
//     constructor(){
//         this.commonRepository = new CommonRepository(OrderModel)
//     }

//     async createOrder(data : IOrder): Promise<IOrder>{
//         return await OrderModel.create(data);
//     }

//     async getAllOrders(page = 1 , limit = 10 , filter?: string , paymentFilter?: string , customerId?: string){
//         try {
//             const listMatch : any = { isDeleted: false };
//             if(filter) listMatch.orderStatus = filter;
//             if(paymentFilter) listMatch.paymentStatus = paymentFilter;
//             if (customerId) listMatch.customerId = new Types.ObjectId(customerId);
            
//             const skip = (page - 1) * limit;
//             const data = await OrderModel.aggregate([
//                 {$match : listMatch},
//                 {$sort : {createdAt : -1}},
//                 {
//                     $lookup : {
//                         from : "users",
//                         localField : "customerId",
//                         foreignField : "_id",
//                         as : "customer"
//                     }
//                 },
//                 {
//                     $unwind : {
//                         path : "$customer",
//                         preserveNullAndEmptyArrays: true
//                     }
//                 },
//                 {
//                     $lookup : {
//                         from : "products",
//                         localField : "productId",
//                         foreignField : "_id",
//                         as : "productDetails"
//                     }
//                 },
//                 { $skip: skip },
//                 { $limit: limit },
//             ])
//             const [total, paid, unpaid] = await Promise.all([
//                 OrderModel.countDocuments({ isDeleted: false }),
//                 OrderModel.countDocuments({ isDeleted: false , paymentStatus : "Paid"}),
//                 OrderModel.countDocuments({ isDeleted: false , paymentStatus : "Unpaid"})
//             ])
//             const totalPages = Math.max(1, Math.ceil(total / limit));
//             return {
//                 data,
//                 meta : { total , paid , unpaid , totalPages , page , limit }
//             }

//         } catch (error) {
//             console.error("Error in getAllOrders:", error);
//             throw error;
//         }
//     }

//     async getOrderById(id: string | Types.ObjectId){
//         try {
//             const orderId = typeof id === "string"? new Types.ObjectId(id) : id;
//             const data = await OrderModel.aggregate([
//                 {
//                     $match : {
//                         _id : orderId,
//                         isDeleted : false
//                     }
//                 },
//                 {
//                     $lookup : {
//                         from : "users",
//                         localField : "customerId",
//                         foreignField : "_id",
//                         as : "customer"
//                     }
//                 },
//                 {
//                     $unwind : "$customer",
//                 },
//                 {
//                     $lookup : {
//                         from : "products",
//                         localField : "productId",
//                         foreignField : "_id",
//                         as : "productDetails"
//                     }
//                 },
//             ])

//             return data[0] || null;
//         } catch (error) {
//             console.error("Error in getOrderById:", error);
//             throw error;
//         }
//     }

//     async updateOrder(id: string | Types.ObjectId , data: Partial<IOrder>): Promise<IOrder | null> {
//         return await OrderModel.findByIdAndUpdate(id , data , { new: true })
//     }

//     async updateOrderStatus(id: string | Types.ObjectId , status : string ): Promise<IOrder | null>{
//         return await OrderModel.findByIdAndUpdate(id , { orderStatus : status } , { new: true })
//     }

//     async updatePaymentStatus( id: string | Types.ObjectId, paymentStatus: "Paid" | "Unpaid" | "Failed" ): Promise<IOrder | null> {
//         return await OrderModel.findByIdAndUpdate( id, { paymentStatus }, { new: true });
//     }

//     async softDeleteOrder( id: string | Types.ObjectId ): Promise<IOrder | null> {
//         return await OrderModel.findByIdAndUpdate(id , { isDeleted: true } , { new: true });
//     }

//     async deleteOrderPermanently( id: string | Types.ObjectId ): Promise<IOrder | null> {
//         return await OrderModel.findByIdAndDelete(id);
//     }
// }

// export default new OrderRepository()

import { Types } from "mongoose";
import { OrderModel, IOrder } from "../models/orderModel";
import { CommonRepository } from "./commonRepository";

class OrderRepository {
    private commonRepository: CommonRepository<IOrder>;

    constructor() {
        this.commonRepository = new CommonRepository(OrderModel);
    }

    // async getAllOrders(page = 1, limit = 10, filter?: string, customerId?: string) {
    //     try {
    //         const listMatch: any = { isDeleted: false };
    //         if (filter) listMatch.orderStatus = filter;
    //         if (customerId) listMatch.customerId = new Types.ObjectId(customerId);

    //         const skip = (page - 1) * limit;

    //         const data = await OrderModel.aggregate([
    //             { $match: listMatch },
    //             { $sort: { createdAt: -1 } },
    //             {
    //                 $lookup: {
    //                     from: "users",
    //                     localField: "customerId",
    //                     foreignField: "_id",
    //                     as: "customer"
    //                 }
    //             },
    //             { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
    //             { $skip: skip },
    //             { $limit: limit },
    //         ]);

    //         const total = await OrderModel.countDocuments(listMatch);
    //         const totalPages = Math.ceil(total / limit);

    //         return {
    //             data,
    //             meta: { total, totalPages, page, limit }
    //         };
    //     } catch (error) {
    //         throw error;
    //     }
    // }
    async getAllOrders(page = 1, limit = 10, filter?: string, customerId?: string) {
        try {
            // Base match criteria: only include non-deleted orders
            const listMatch: any = { isDeleted: false };
            
            // --- FIX APPLIED HERE ---
            if (filter) {
                // If filter is for payment, map to paymentStatus, else map to orderStatus
                if (['Paid', 'Unpaid'].includes(filter)) {
                    listMatch.paymentStatus = filter;
                } else {
                    listMatch.orderStatus = filter;
                }
            }
            // ------------------------

            if (customerId) listMatch.customerId = new Types.ObjectId(customerId);

            const skip = (page - 1) * limit;

            // Aggregation pipeline to fetch orders and join with users
            const data = await OrderModel.aggregate([
                { $match: listMatch },
                { $sort: { createdAt: -1 } },
                {
                    $lookup: {
                        from: "users",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customer"
                    }
                },
                { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
                { $skip: skip },
                { $limit: limit },
            ]);

            // Count total matching documents for pagination metadata
            const total = await OrderModel.countDocuments(listMatch);
            const totalPages = Math.ceil(total / limit);

            return {
                data,
                meta: { total, totalPages, page, limit }
            };
        } catch (error) {
            throw error;
        }
    }

    async getOrderById(id: string | Types.ObjectId) {
        const orderId = typeof id === "string" ? new Types.ObjectId(id) : id;
        const data = await OrderModel.aggregate([
            { $match: { _id: orderId, isDeleted: false } },
            {
                $lookup: {
                    from: "users",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetails"
                }
            }
        ]);
        return data[0] || null;
    }

    // --- Repository check ---
async updateStatus(id: string | Types.ObjectId, status: string): Promise<IOrder | null> {
    // Ensure 'id' is a valid Mongoose ObjectId if the model expects it
    return await OrderModel.findByIdAndUpdate(
        new Types.ObjectId(id), // Explicitly cast if necessary
        { orderStatus: status },
        { new: true, runValidators: true } // Add runValidators to catch schema errors
    );
}

    async softDelete(id: string | Types.ObjectId): Promise<IOrder | null> {
        return await OrderModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    }
}

export default new OrderRepository();