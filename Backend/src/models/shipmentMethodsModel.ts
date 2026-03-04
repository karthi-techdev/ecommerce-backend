import { Schema, Document, model } from "mongoose";

export interface IShipmentMethod extends Document{
    name: string;
    slug: string;
    description: string;
    price: number;
    estimatedDeliveryTime: string;
    status?: "active" | "inactive";
    isDeleted?:boolean;
    createdAt?: Date;
}
const shipmentMethodSchema = new Schema<IShipmentMethod>(
    {
        name: {type:String, required:true},
        slug: {type:String, unique:true, required:true},
        description: {type:String},
        price: {type:Number,  required:true},
        estimatedDeliveryTime: {type:String},
        status: { type: String, enum: ["active", "inactive"], default: "active" },
        isDeleted:{type:Boolean, default:false},
    },
    { timestamps:true }
)
export const ShipmentMethodModel = model<IShipmentMethod>("ShipmentMethod", shipmentMethodSchema);
