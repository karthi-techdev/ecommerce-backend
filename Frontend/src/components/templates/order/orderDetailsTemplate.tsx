
import React from 'react';
import { 
  Wallet, UserCircle, Star, Award, Printer, Download, MapPin, 
  Truck, CreditCard, ChevronDown, Calendar, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useParams } from 'react-router-dom';
import { useOrderStore } from '../../../stores/orderStore';
import { useEffect } from 'react';
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const OrderDetailTemplate: React.FC = () => {
      const navigate = useNavigate();
  const { id } = useParams();

const { currentOrder, fetchOrderById, loading } = useOrderStore();

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
        <main className="p-8 flex-1">
  
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
            
            <div className="flex items-center gap-2">
              <select className="bg-gray-100 border-none rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500">
              <option>Change status</option>
              <option>Awaiting payment</option>
              <option>Confirmed</option>
              <option>Shipped</option>
          </select>
              <button className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-[#077068] transition font-medium text-sm">
                Save
              </button>
              <button className="p-2 bg-gray-600 border border-radius-5 rounded-md text-gray-600 hover:bg-gray-300 transition">
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
                  <button className="text-amber-600 font-medium mt-2 hover:underline">View profile</button>
                </div>
              }
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
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
                                ? matchedProduct.images[0]
                                : "/no-image.png"
                            }
                            alt=""
                            className="w-10 h-10 rounded border"
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
                    <span>₹{currentOrder?.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping cost:</span>
                    <span>₹{currentOrder?.shippingCharge || 0}</span>
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
                <button  className="bg-amber-600 text-white px-8 py-2.5 rounded-md hover:bg-[#077068] transition font-medium text-sm" 
                            onClick={() => navigate(`/ordertracking/${currentOrder?._id}`)}
                >
                  View Order Tracking
                </button>
              </div>
            </div>


            <div className="space-y-8">
              <div className="bg-[#f0f4f8] p-6 rounded-lg border border-blue-50">
                <h3 className="font-bold text-[#253d4e] mb-4">Payment info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-1 rounded border shadow-sm flex items-center justify-center">
                     <div className="w-6 h-4 bg-orange-400 rounded-sm"></div>
                  </div>
                  {/* //card detsils */}
                  <span className="text-sm font-medium text-gray-600"> {currentOrder?.paymentMethod || "Cash On Delivery"}</span> 
                </div>
                <div className="text-[13px] space-y-1 text-gray-500 leading-relaxed">
                  <p>Customer: {currentOrder?.customerName}</p>
                  <p>Phone: {currentOrder?.customerPhone}</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#253d4e] mb-3">Notes</h3>
                <textarea 
                  placeholder="Type some note" 
                  className="w-full h-36 p-4 bg-[#f3f4f6] border-none rounded-lg focus:ring-1 focus:ring-[#088178] text-sm resize-none mb-4"
                />
                <button className="bg-amber-600 text-white px-6 py-2.5 rounded-md hover:bg-[#077068] transition font-medium text-sm">
                  Save note
                </button>
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

const InfoCard: React.FC<{ icon: React.ReactNode, title: string, content: React.ReactNode }> = ({ icon, title, content }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex gap-4">
    <div className="w-11 h-11 rounded-full bg-[#e8f1f0] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-[#253d4e] text-[16px] mb-2">{title}</h3>
      {content}
    </div>
  </div>
);

export default OrderDetailTemplate;