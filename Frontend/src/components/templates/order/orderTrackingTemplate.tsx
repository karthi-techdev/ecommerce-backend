import React, { useState } from 'react';
import { ShoppingCart, Settings, Package, Truck, CheckCircle, Printer,Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useOrderStore } from "../../../stores/orderStore";


const OrderTrackingTemplate: React.FC = () => {
    const statusMessages: Record<string, string> = {
  "Confirmed Order": "Your order has been confirmed",
  "Processing Order": "Your order is being processed",
  "Quality Check": "Your order is under quality check",
  "Product Dispatched": "Your order has been dispatched",
  "Product Delivered": "Your order has been delivered",
};

    const navigate = useNavigate();

    const [currentStatus, setCurrentStatus] = useState("Confirmed Order");

    const [completedDates, setCompletedDates] = useState<Record<string, string>>({
    "Confirmed Order": new Date().toLocaleDateString(),
    });
    const handleStatusChange = (newStatus: string) => {
  setCurrentStatus(newStatus);

  setCompletedDates((prev) => ({
    ...prev,
    [newStatus]: new Date().toLocaleDateString(),
  }));
};
const { id } = useParams();

const { currentOrder, fetchOrderById, loading } = useOrderStore();

useEffect(() => {
  if (id) {
    fetchOrderById(id);
  }
}, [id]);

if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      Loading...
    </div>
  );
}
const orderDateTime = currentOrder?.createdAt
  ? new Date(currentOrder.createdAt).toLocaleString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  : "No Date";
    const statusFlow = [
    "Confirmed Order",
    "Processing Order",
    "Quality Check",
    "Product Dispatched",
    "Product Delivered"
];

    const timelineData = [
        { status: "Confirmed Order", date: "15 March 2026" },
        { status: "Processing Order", date: "16 March 2026" },
        { status: "Quality Check", date: "17 March 2026" },
        { status: "Product Dispatched", date: "18 March 2026" },
        { status: "Product Delivered", date: "20 March 2026" }
    ];
    const activeIndex = statusFlow.indexOf(currentStatus);

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
                <h1 className="text-xl font-bold text-gray-900">
                    Order Tracking
                </h1>

                    <p className="text-gray-500 text-sm">
                Details for Order ID: {currentOrder?.orderNumber}
                </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 p-3">

                    {/* Left Side */}
                  <div>
                    <p className="text-sm text-gray-600">
                        {orderDateTime}
                    </p>

                    <p className="text-sm text-gray-600">
                        Order ID: {currentOrder?.orderNumber}
                    </p>

                    <p className="text-sm text-gray-500 capitalize">
                        {statusMessages[currentStatus]}
                    </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 w-full md:w-auto">

                        <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                        >
                            {statusFlow.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>

                        <div className="flex flex-col gap-2 w-full sm:w-auto">

                            <button className="bg-amber-500 hover:bg-amber-600 transition text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto">
                                Screenshot
                            </button>

                            <button className="bg-gray-600 hover:bg-gray-700 transition text-white px-4 py-2 rounded-md text-sm flex items-center justify-center gap-2 w-full sm:w-auto">
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
                                        width: `${(activeIndex / (timelineData.length - 1)) * 100}%`,
                                        backgroundColor: "#FFB300"
                                    }}
                                />
                            </div>

                            {statusFlow.map((status, index) => {
                        const activeIndex = statusFlow.indexOf(currentStatus);
                        const isActive = index <= activeIndex;

                        const icons = [
                            <ShoppingCart size={24} />,
                            <Settings size={24} />,
                            <Package size={24} />,
                            <Truck size={24} />,
                            <CheckCircle size={24} />
                        ];

                        return (
                            <div
                            key={index}
                            className="relative z-10 flex flex-col items-center md:flex-1 text-center"
                            >
                            {/* Circle */}
                            <div
                                className={`w-18 h-18 mx-auto rounded-full flex items-center justify-center 
                                ${isActive ? "text-white" : "bg-gray-100 text-gray-400"}`}
                                style={isActive ? { backgroundColor: "#FFB300" } : {}}
                            >
                                {icons[index]}
                            </div>

                            {/* Status */}
                            <p className="mt-3 text-sm font-medium text-gray-800">
                                {status}
                            </p>

                            {/* Dynamic Date */}
                            <p className="text-xs text-gray-400">
                                {completedDates[status] || "Pending"}
                            </p>
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
                                <p className="font-medium text-gray-900">{currentOrder?.customerName}</p>
                                <p className="text-sm text-gray-500 mt-1">{currentOrder?.customerEmail}</p>
                                <p className="text-sm text-gray-500">{currentOrder?.customerPhone}</p>
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
                                    <span className="text-gray-800">{currentOrder?.shippingMethod}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-500">Pay method:</span>{" "}
                                    <span className="text-gray-800">{currentOrder?.paymentMethod}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-500">Status:</span>{" "}
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(currentOrder?.orderStatus || "")}`}>
                                        {currentOrder?.orderStatus}
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
                                <p className="text-sm text-gray-700">{currentOrder?.shippingAddress}</p>
                                {/* <p className="text-sm text-gray-700 mt-1">{currentOrder?.deliveryAddress}</p>
                                <p className="text-sm text-gray-700">{currentOrder?.deliveryPoBox}</p> */}
                            </div>
                            <button className="mt-3 text-blue-600 hover:text-blue-800 text-sm">
                                View profile
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center mt-10 md:mt-16">
                        <button
                            onClick={() => navigate(`/orders/view/${currentOrder?._id}`)}
                            className="bg-amber-500 text-white font-medium py-2 px-6 rounded-md text-sm transition-colors duration-200 shadow-sm"
                        >
                            View Order Details
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default OrderTrackingTemplate;