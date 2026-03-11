import mongoose from "mongoose";
import { OrderModel } from "../models/orderModel"; 

interface IOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Unpaid" | "Failed";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  products: {
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

const seedOrders = async (): Promise<void> => {
  try {
    await OrderModel.deleteMany();

const orders: IOrder[] = [
  {
    orderNumber: "ORD1001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul.s@outlook.com",
    customerPhone: "+91 9876543210",
    shippingAddress: "123, MG Road, Bangalore, Karnataka",
    totalAmount: 4999,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: "Sony WH-1000XM4 Headphones",
        quantity: 1,
        price: 4999,
      },
    ],
  },
  {
    orderNumber: "ORD1002",
    customerName: "Priya Singh",
    customerEmail: "priya.singh@gmail.com",
    customerPhone: "+91 9822113344",
    shippingAddress: "Flat 402, Sector 45, Gurgaon, Haryana",
    totalAmount: 2199,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: "Fitbit Charge 5 Band",
        quantity: 1,
        price: 2199,
      },
    ],
  },
  {
    orderNumber: "ORD1003",
    customerName: "Arjun Mehta",
    customerEmail: "arjun.m@yahoo.com",
    customerPhone: "+91 9000110022",
    shippingAddress: "Sea View Towers, Marine Drive, Mumbai",
    totalAmount: 1299,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Unpaid",
    orderStatus: "Pending",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: "Logitech G305 Gaming Mouse",
        quantity: 1,
        price: 1299,
      },
    ],
  },
  {
    orderNumber: "ORD1004",
    customerName: "Sneha Kapoor",
    customerEmail: "sneha.k@icloud.com",
    customerPhone: "+91 9988776655",
    shippingAddress: "High Street Phoenix, Lower Parel, Mumbai",
    totalAmount: 8500,
    paymentMethod: "Net Banking",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: "Mechanical Keyboard RGB",
        quantity: 1,
        price: 8500,
      },
    ],
  },
  {
    orderNumber: "ORD1005",
    customerName: "Vikram Rathore",
    customerEmail: "v.rathore@company.in",
    customerPhone: "+91 9122334455",
    shippingAddress: "Villa 12, Jubilee Hills, Hyderabad",
    totalAmount: 15499,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    orderStatus: "Processing",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: "Dell UltraSharp 27 Monitor",
        quantity: 1,
        price: 15499,
      },
    ],
  },
  {
    orderNumber: "ORD1006",
    customerName: "Ananya Iyer",
    customerEmail: "iyer.ananya@protonmail.com",
    customerPhone: "+91 9555667788",
    shippingAddress: "Anna Salai Road, Teynampet, Chennai",
    totalAmount: 3450,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    orderStatus: "Pending",
    products: [
      {
        productId: new mongoose.Types.ObjectId(),
        productName: "Laptop Cooling Pad + USB Hub",
        quantity: 2,
        price: 1725,
      },
    ],
  },
];

    await OrderModel.insertMany(orders);
    console.log("📦 Order management data seeded successfully");
  } catch (error) {
    console.error("Seeding Orders failed:", error);
  }
};

export default seedOrders;