import { model , Schema , Document, Types } from "mongoose";

export interface IProductDetail extends Document {
    productId :  Types.ObjectId,
    productName : string,
    quantity : number,
    price : number
}

export interface IOrder extends Document {
    orderNumber : string,
    customerId : Types.ObjectId,
    customerName : string,
    customerEmail : string,
    customerPhone : string,
    shippingAddress : string,
    products : IProductDetail[],
    totalAmount : number,
    paymentMethod : string,
    paymentStatus : "Paid" | "Unpaid" | "Failed",
    orderStatus : "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled",
    isDeleted : boolean,
    createdAt : Date
}

const OrderProductSchema = new Schema<IProductDetail>({
    productId : { type : Schema.Types.ObjectId , required : true , ref : "products"},
    productName : { type : String , required : true },
    quantity : { type : Number , required : true },
    price : { type : Number , required : true },
})

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber : { type : String , required : true , unique : true },
        customerId : { type : Schema.Types.ObjectId , ref : "users"},
        customerName : { type : String , required : true , trim : true },
        customerEmail : { type : String , required : true , lowercase : true , trim : true },
        customerPhone : { type : String , required : true },
        shippingAddress : { type : String , required : true },
        products: { type: [OrderProductSchema] , required: true },
        totalAmount : { type : Number , required : true , min : 0 },
        paymentMethod : { type : String , required : true , trim : true },
        paymentStatus : { type : String , enum : ["Paid", "Unpaid", "Failed"] ,  default: "Unpaid" },
        orderStatus : { type : String , enum : ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] ,  default: "Pending" },
        isDeleted: {type:Boolean, default: false }

    },
    {
        timestamps : { createdAt: true, updatedAt: false }
    }
);

export const OrderModel = model<IOrder>("orders",OrderSchema);