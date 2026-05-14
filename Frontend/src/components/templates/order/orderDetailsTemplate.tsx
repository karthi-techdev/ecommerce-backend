
import React, { useRef } from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, PlusCircle, 
  Wallet, UserCircle, Star, Award, Printer, Download, MapPin, 
  Truck, CreditCard, ChevronDown, Calendar, User, Search
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useOrderStore } from '../../../stores/orderStore';
import { useEffect } from 'react';
import { useState } from 'react';
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

const OrderDetailTemplate: React.FC = () => {
  const { id } = useParams();

const { currentOrder, fetchOrderById, loading } = useOrderStore();
const [note, setNote] = useState("");
const pdfRef = useRef<HTMLDivElement>(null);
const [isDownloading, setIsDownloading] = useState(false);

useEffect(() => {
  if (currentOrder?.notes) {
    setNote(currentOrder.notes);
  }
}, [currentOrder]);

const handleSaveNote = async () => {
  try {
    const response = await fetch(
        `http://localhost:5000/api/v1/admin/orders/${id}/note`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: note,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Note saved successfully");
    } else {
      alert("Failed to save note");
    }

  } catch (error) {
    console.error(error);
  }
};

const replaceOklchColors = () => {
  const allElements = document.querySelectorAll("*");

  allElements.forEach((el: any) => {

    if (el.tagName === "TEXTAREA") return;

    const style = window.getComputedStyle(el);

    if (style.color.includes("oklch")) {
      el.style.color = "#000000";
    }

    if (style.backgroundColor.includes("oklch")) {
      el.style.backgroundColor = "#ffffff";
    }

    if (style.borderColor.includes("oklch")) {
      el.style.borderColor = "#d1d5db";
    }
  });
};

const handleDownloadPDF = async () => {
  if (!pdfRef.current) {
    toast.error("PDF section not found");
    return;
  }

  try {
    replaceOklchColors();
    const noPrintEls = document.querySelectorAll(".no-print");
    noPrintEls.forEach((el: any) => (el.style.display = "none"));
    const options = {
      margin: 10,
      filename: `Order-${currentOrder?.orderNumber}.pdf`,
      image: {
        type: "jpeg"as const,
        quality: 1,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm"as const,
        format: "a4"as const,
        orientation: "portrait"as const,
      },
    };

    await html2pdf()
      .set(options)
      .from(pdfRef.current)
      .save();
       noPrintEls.forEach((el: any) => (el.style.display = ""));
    toast.success("Order downloaded successfully");
  } catch (error) {
    console.error(error);
    toast.error("Failed to download PDF");
  }
};

useEffect(() => {
  if (id) {
    fetchOrderById(id);
  }
}, [id, fetchOrderById]);
if (loading) {
  return (
    <div className="flex justify-center items-center h-screen">
      Loading...
    </div>
  );
}
  const products = currentOrder?.products || [];
  console.log(products);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans text-[#495057]">
      
      <div className="flex-1 flex flex-col">
        <main   className="p-8 flex-1">
        <div ref={pdfRef}>
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-[#253d4e]">Order detail</h2>
            <p className="text-sm text-gray-400 mt-1">Details for Order ID: {currentOrder?.orderNumber}</p>
          </header>
        
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="font-bold text-[15px] text-[#253d4e]">
                  {currentOrder?.createdAt
                    ? new Date(currentOrder.createdAt).toLocaleString()
                    : "No Date"}
                </p>

                <p className="text-xs text-gray-400">
                  Order ID: {currentOrder?.orderNumber}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 no-print">
              <select className="bg-gray-100 border-none rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500">
              <option>Change status</option>
              <option>Awaiting payment</option>
              <option>Confirmed</option>
              <option>Shipped</option>
          </select>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-[#077068] transition font-medium text-sm">
                Save
              </button>
              <button   onClick={handleDownloadPDF} className="p-2 bg-gray-600 border border-radius-5 rounded-md text-gray-600 hover:bg-gray-300 transition">
                <Printer size={18} className='text-white'  />
              </button>
            </div>
          </div>
          {/* //to stor data details */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoCard 
              icon={<User size={22} className="text-amber-600 " />}
              title="Customer"
              content={
                <div className="text-[14px]">
                  <p className="font-bold text-[#253d4e]">{currentOrder?.customerName}</p>
                  <p className="text-gray-500">{currentOrder?.customerEmail}</p>
                  <p className="text-gray-500">{currentOrder?.customerPhone}</p>
                  <button className="text-amber-600 font-medium mt-2 hover:underline">View profile</button>
                </div>
              }
            />
            <InfoCard 
              icon={<Truck size={22} className="text-amber-600" />}
              title="Order info"
              content={
                <div className="text-[14px]">
                  <p className="text-gray-500">Shipping: {currentOrder?.shippingMethod || "Not Available"}</p>
                  <p className="text-gray-500"> Pay method: {currentOrder?.paymentMethod || "Not Available"}</p>
                  <p className="text-gray-500">   Status: {currentOrder?.orderStatus || "Pending"}</p>
                  <button className="text-amber-600 font-medium mt-2 flex items-center gap-1 hover:underline">
                    Download info
                  </button>
                </div>
              }
            />
            <InfoCard 
              icon={<MapPin size={22} className="text-amber-600" />}
              title="Deliver to"
              content={
                <div className="text-[14px]">
                  <p className="text-gray-500">{currentOrder?.shippingAddress}</p>
                </div>
              }
            />
          </div>

          <div
            className={`grid gap-8 ${
              isDownloading
                ? "grid-cols-1"
                : "grid-cols-1 xl:grid-cols-3"
            }`}
          >
        
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#f8f9fa] text-[12px] uppercase text-gray-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Unit Price</th>
                      <th className="px-6 py-4">Quantity</th>
                      <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                  {products.map((item: any, index: number) => {

                    const matchedProduct = currentOrder?.productDetails?.find(
                      (product: any) => product._id === item.productId
                    );

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 flex items-center gap-4">

                          <img
                            src={
                              matchedProduct?.images?.length
                                ? `http://localhost:5000${matchedProduct.images[0]}`
                                : "/no-image.png"
                            }
                            alt={item.productName}
                            className="w-10 h-10 rounded border object-cover"
                          />

                          <span className="text-[14px] font-medium text-[#253d4e]">
                            {item.productName}
                          </span>

                        </td>

                        <td className="px-6 py-4 text-[14px]">
                          ₹{item.price}
                        </td>

                        <td className="px-6 py-4 text-[14px]">
                          {item.quantity}
                        </td>

                        <td className="px-6 py-4 text-[14px] font-bold text-right text-[#253d4e]">
                          ₹{item.price * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col items-end">
                <div className="w-full max-w-[240px] text-sm space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                      <span>
                        ₹
                        {products.reduce(
                          (total: number, item: any) =>
                            total + item.price * item.quantity,
                          0
                        )}
                      </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping cost:</span>
                    <span>₹{currentOrder?.shippingPrice || 0}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#253d4e] pt-1">
                    <span>Grand total:</span>
                    <span>₹{currentOrder?.grandTotal || currentOrder?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Status:</span>
                    <span
                      className={`font-medium text-xs ${
                        currentOrder?.paymentStatus === "Paid"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {currentOrder?.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="bg-amber-600 text-white px-8 py-2.5 rounded-md hover:bg-[#077068] transition font-medium text-sm">
                  View Order Tracking
                </button>
              </div>
            </div>


            <div className="space-y-8">
              {/* <div className="bg-[#f0f4f8] p-6 rounded-lg border border-blue-50">
                <h3 className="font-bold text-[#253d4e] mb-4">Payment info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-1 rounded border shadow-sm flex items-center justify-center">
                     <div className="w-6 h-4 bg-orange-400 rounded-sm"></div>
                  </div>

                  <span className="text-sm font-medium text-gray-600"> {currentOrder?.paymentMethod || "Cash On Delivery"}</span> 
                </div>
                <div className="text-[13px] space-y-1 text-gray-500 leading-relaxed">
                  <p>Customer: {currentOrder?.customerName}</p>
                  <p>Phone: {currentOrder?.customerPhone}</p>
                </div>
              </div> */}

              <div>
                <h3 className="font-bold text-[#253d4e] mb-3">Notes</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type some note"
                  className="w-full h-36 p-4 border-none rounded-lg text-sm resize-none mb-4"
                  style={{
                    backgroundColor: "#f3f4f6",
                    WebkitTextFillColor: "#374151",
                    opacity: 1,
                  }}
                />
                <button 
                 onClick={handleSaveNote}
                className="bg-amber-600 text-white px-6 py-2.5 rounded-md hover:bg-[#077068] transition font-medium text-sm">
                  Save note
                </button>
              </div>
            </div>
          </div>
          </div>
        </main>

      </div>
    </div>
  );
};


const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, hasSubmenu?: boolean, className?: string }> = ({ icon, label, active, hasSubmenu, className }) => (
  <div className={`flex items-center justify-between p-2.5 px-3 rounded-md cursor-pointer transition group ${active ? 'bg-[#e8f1f0] text-[#088178] font-bold' : 'hover:bg-gray-50 text-[#7c838a]'}`}>
    <div className="flex items-center gap-3">
      <span className={`${active ? 'text-[#088178]' : 'text-gray-400 group-hover:text-[#088178]'} transition-colors`}>{icon}</span>
      <span className="text-[14px]">{label}</span>
    </div>
    {hasSubmenu && <ChevronDown size={14} className="opacity-40" />}
  </div>
);

const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}> = ({ icon, title, content }) => (
  <div
    className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex gap-4"
    style={{
      minWidth: 0,
    }}
  >
    <div className="w-11 h-11 rounded-full bg-[#e8f1f0] flex items-center justify-center shrink-0">
      {icon}
    </div>

    <div className="flex-1 min-w-0">
      <h3 className="font-bold text-[#253d4e] text-[16px] mb-2">
        {title}
      </h3>

      <div
        style={{
          overflowWrap: "anywhere",
        }}
        className="text-sm text-gray-600"
      >
        {content}
      </div>
    </div>
  </div>
);

export default OrderDetailTemplate;