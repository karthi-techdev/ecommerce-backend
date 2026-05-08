import { ENV } from "../config/env";
import Razorpay from 'razorpay';
import crypto from 'crypto';
const razorpay=new Razorpay({
    key_id:ENV.RAZORPAY_ID,
    key_secret:ENV.RAZORPAY_SECRET
})

export const createOrder=(totalAmount:number)=>{
    return razorpay.orders.create({
        amount:totalAmount*100,
        currency:"INR",
        receipt:`receipt_${Date.now()}`
    })
}
export const verifyPayment=(razorpayOrderId:string,razorpayPaymentId:string)=>{
    return crypto.createHmac('sha256',ENV.RAZORPAY_SECRET).update(razorpayOrderId+"|"+razorpayPaymentId).digest('hex');
}