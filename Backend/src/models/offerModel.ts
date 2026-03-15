// import { model , Document , Schema, Types } from "mongoose";

// export interface IOffer extends Document{
//     name : string,
//     description : string,
//     buttonName : string,
//     products : Types.ObjectId[],
//     isActive : boolean,
//     isDeleted : boolean,
//     createdAt : Date
// };

// const OfferSchema = new Schema<IOffer>(
//     {
//         name : { type : String , required : true },
//         description : { type : String , required : true },
//         buttonName : { type : String , required : true },
//         products : [{ type: Schema.Types.ObjectId, ref: 'products' }],
//         isActive : { type : Boolean , default: true},
//         isDeleted : { type : Boolean , default: false},
//         createdAt: { type: Date, default: Date.now }
//     }
// );

// export const OfferModel = model<IOffer>("offers",OfferSchema);

import { model, Document, Schema, Types } from "mongoose";

export interface IOffer extends Document {
    name: string;
    banner: 'Banner 1' | 'Banner 2';
    description: string;
    buttonName: string;
    products: Types.ObjectId[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
}

const OfferSchema = new Schema<IOffer>(
    {
        name: { type: String, required: true },
        banner: { 
            type: String, 
            required: true, 
            enum: ['Banner 1', 'Banner 2'] 
        },
        description: { type: String, required: true },
        buttonName: { type: String, required: true },
        products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }
);

OfferSchema.index({ banner: 1, isDeleted: 1 });

export const OfferModel = model<IOffer>("offers", OfferSchema);