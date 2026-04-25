import React from 'react';
import { ShoppingCart, Settings, Package, Truck, CheckCircle, Printer,Calendar } from "lucide-react";


const OrderTrackingTemplate: React.FC = () => {
    const orderData = {
        orderId: "3453012",
        shipping: "Fargo express",
        payMethod: "card",
        status: "new",
        customerName: "John Alexander",
        customerEmail: "alex@example.com",
        customerPhone: "+998 99 22123456",
        deliveryCity: "Tashkent, Uzbekistan",
        deliveryAddress: "Block A, House 123, Floor 2",
        deliveryPoBox: "Po Box 10000"
    };

    const timelineData = [
        { status: "Confirmed Order", date: "15 March 2026" },
        { status: "Processing Order", date: "16 March 2026" },
        { status: "Quality Check", date: "17 March 2026" },
        { status: "Product Dispatched", date: "18 March 2026" },
        { status: "Product Delivered", date: "20 March 2026" }
    ];

    const getStatusBadgeClass = (status: string) => {
        const statusClasses: Record<string, string> = {
            new: "bg-green-100 text-green-800",
            processing: "bg-blue-100 text-blue-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-gray-100 text-gray-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return statusClasses[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6">

                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
                    <p className="text-gray-500 text-sm">Details for Order ID: {orderData.orderId}</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-3">

                    {/* Left side */}
                    <div>
                        <p className="text-sm text-gray-600">
                        
                            Wed, Aug 13, 2026, 4:34PM
                        </p>
                        <p className="text-sm text-gray-600">
                            Order ID: {orderData.orderId}
                        </p>
                        <p className="text-sm text-gray-500">
                            Your order has been delivered
                        </p>
                    </div>
                    
                    {/* Right side */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 w-full md:w-auto">

                        {/* Dropdown */}
                        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full sm:w-auto">
                            <option>Change status</option>
                            <option>Awaiting payment</option>
                            <option>Confirmed</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                        </select>

                        {/* Buttons column */}
                        <div className="flex flex-col gap-2 w-full sm:w-auto">

                            {/* Screenshot */}
                           <button className="bg-amber-500 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto">
                                Screenshot
                            </button>

                            {/* Print */}
                            <button className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
                                <Printer size={16} />
                                Print
                            </button>

                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">

                    {/* Timeline - Horizontal Row */}
                    <div className=" p-6 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between relative gap-6 md:gap-0">

                            {/* Line */}
                            <div className="hidden md:block absolute top-8 left-[8%] w-[84%]  h-1 bg-gray-200 z-0">
                                <div
                                    className="h-1"
                                    style={{
                                        width: `${(2 / (timelineData.length - 1)) * 100}%`,
                                        backgroundColor: "#FFC107"
                                    }}
                                />
                            </div>

                            {timelineData.map((item, index) => {
                                const isActive = index <= 2;

                                const icons = [
                                    <ShoppingCart size={24} />,
                                    <Settings size={24} />,
                                    <Package size={24} />,
                                    <Truck size={24} />,
                                    <CheckCircle size={24} />
                                ];

                                return (
                                    <div key={index} className="relative z-10 flex flex-col items-center md:flex-1 text-center">

                                        {/* Circle */}
                                        <div
                                            className={`w-18 h-18 mx-auto rounded-full flex items-center justify-center 
  ${isActive ? "text-white" : "bg-gray-100 text-gray-400"}`}
                                            style={isActive ? { backgroundColor: "#FFC107"} : {}}
                                        >
                                            {icons[index]}
                                        </div>

                                        {/* Title */}
                                        <p className="mt-3 text-sm font-medium text-gray-800">
                                            {item.status}
                                        </p>

                                        {/* Date */}
                                        <p className="text-xs text-gray-400">{item.date}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Three Column Row - Customer, Order Info, Deliver to */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 md:mt-20 place-items-center">

                        {/* Customer Card */}
                        <div className="p-5 w-full max-w-[280px] mx-auto text-center">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Customer</h3>
                            <div>
                                <p className="font-medium text-gray-900">{orderData.customerName}</p>
                                <p className="text-sm text-gray-500 mt-1">{orderData.customerEmail}</p>
                                <p className="text-sm text-gray-500">{orderData.customerPhone}</p>
                            </div>
                            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                                View profile
                            </button>
                        </div>

                        {/* Order Info Card */}
                        <div className="p-5 w-full max-w-[280px] mx-auto text-center">
                            <h2 className="text-base font-semibold text-gray-900 mb-3">Order info</h2>
                            <div className="space-y-2">
                                <p className="text-sm">
                                    <span className="text-gray-500">Shipping:</span>{" "}
                                    <span className="text-gray-800">{orderData.shipping}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-500">Pay method:</span>{" "}
                                    <span className="text-gray-800">{orderData.payMethod}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-500">Status:</span>{" "}
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(orderData.status)}`}>
                                        {orderData.status}
                                    </span>
                                </p>
                            </div>
                            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                                Download info
                            </button>
                        </div>

                        {/* Deliver To Card */}
                        <div className="p-5 w-full max-w-[280px] mx-auto text-center">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Deliver to</h3>
                            <div>
                                <p className="text-sm text-gray-700">City: {orderData.deliveryCity}</p>
                                <p className="text-sm text-gray-700 mt-1">{orderData.deliveryAddress}</p>
                                <p className="text-sm text-gray-700">{orderData.deliveryPoBox}</p>
                            </div>
                            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                                View profile
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-10 md:mt-16">
                        <button className="bg-amber-500  text-white font-medium py-2 px-6 rounded-md text-sm transition-colors duration-200 shadow-sm">
                            View Order Details
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default OrderTrackingTemplate;