// // import React, { useEffect, useState, useMemo } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Swal from 'sweetalert2';
// // import { toast } from 'react-toastify';
// // import TableHeader from '../../molecules/TableHeader';
// // import Loader from '../../atoms/Loader';
// // import Pagination from '../../atoms/Pagination';
// // import CustomSelect from '../../atoms/Select'; 
// // import { useOrderStore } from '../../../stores/orderStore';
// // import type { Order } from '../../../types/common';
// // import { ShoppingBag, Clock, CheckCircle, Eye, Trash2, CreditCard } from 'lucide-react';
// // import { PAGINATION_CONFIG } from '../../../constants/pagination';

// // interface StatFilter {
// //   id: string;
// //   title: string;
// //   value: number;
// //   trend: 'up' | 'down';
// //   change: string;
// //   icon: React.ReactNode;
// // }

// // const OrderListTemplate: React.FC = () => {
// //   const navigate = useNavigate();
// //   const { orders, fetchOrders, stats, deleteOrder, totalPages, loading, error } = useOrderStore();

// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
// //   const [selectedFilter, setSelectedFilter] = useState<string>(''); 
// //   const [statusDropdown, setStatusDropdown] = useState<string>(''); 

// //   const statusOptions = useMemo(() => [
// //     { label: 'All Status', value: '' },
// //     { label: 'Pending', value: 'Pending' },
// //     { label: 'Processing', value: 'Processing' },
// //     { label: 'Shipped', value: 'Shipped' },
// //     { label: 'Delivered', value: 'Delivered' },
// //     { label: 'Cancelled', value: 'Cancelled' },
// //   ], []);

// //   useEffect(() => {
// //     const loadData = async () => {
// //       try {
// //         const activeFilter = selectedFilter || statusDropdown;
// //         // We fetch the data based on status/tabs, but search locally like SubCategory
// //         await fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, activeFilter);
// //       } catch (err: any) {
// //         toast.error(err?.message || 'Failed to load orders');
// //       }
// //     };
// //     loadData();
// //   }, [currentPage, selectedFilter, statusDropdown, fetchOrders]);

// //   // CLIENT-SIDE FILTERING (Same logic as your SubCategory management)
// //   const filteredOrders = useMemo(() => {
// //     return orders.filter((item) => {
// //       if (!item) return false;
// //       const orderNo = item.orderNumber?.toLowerCase() || '';
// //       const customer = item.customerName?.toLowerCase() || '';
// //       const search = searchTerm.toLowerCase();
      
// //       return orderNo.includes(search) || customer.includes(search);
// //     });
// //   }, [orders, searchTerm]);

// //   const handlePageChange = (selectedItem: { selected: number }) => {
// //     setCurrentPage(selectedItem.selected + 1);
// //   };

// //   const statFilters: StatFilter[] = [
// //     { id: '', title: 'Total Orders', value: stats.total, trend: 'up', change: 'Total', icon: <ShoppingBag size={20} /> },
// //     { id: 'Paid', title: 'Paid Orders', value: stats.paid, trend: 'up', change: 'Settled', icon: <CheckCircle size={20} className="text-green-500" /> },
// //     { id: 'Unpaid', title: 'Unpaid Orders', value: stats.unpaid, trend: 'down', change: 'Pending', icon: <Clock size={20} className="text-amber-500" /> },
// //   ];

// //   const handleDelete = (item: Order) => {
// //     Swal.fire({
// //       title: 'Cancel Order?',
// //       text: `Remove Order #${item.orderNumber}?`,
// //       icon: 'warning',
// //       showCancelButton: true,
// //       confirmButtonColor: '#d33',
// //       confirmButtonText: 'Yes, delete it!',
// //     }).then(async (result) => {
// //       if (result.isConfirmed && item._id) {
// //         try {
// //           // Fixed the TS error by ensuring item._id is present
// //           await deleteOrder(item._id);
// //           toast.success('Order deleted');
// //           fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter || statusDropdown);
// //         } catch {
// //           toast.error('Failed to delete');
// //         }
// //       }
// //     });
// //   };

// //   if (loading) return <Loader />;

// //   return (
// //     <div className="p-6">
// //       <TableHeader
// //         managementName="Order"
// //         searchTerm={searchTerm}
// //         onSearchChange={setSearchTerm}
// //         addButtonLabel="" 
// //         addButtonLink="/dashboard"
// //         statFilters={statFilters}
// //         selectedFilterId={selectedFilter}
// //         onSelectFilter={(id) => {
// //           setSelectedFilter(id);
// //           setStatusDropdown(''); 
// //           setCurrentPage(1);
// //         }}
// //       />

// //       <div className="flex justify-end mb-4">
// //         <div className="w-full md:w-64">
// //           <label className="block text-xs font-medium text-gray-500 uppercase mb-1 ml-1">
// //             Filter by Order Status
// //           </label>
// //           <CustomSelect
// //             options={statusOptions}
// //             value={statusOptions.find(opt => opt.value === statusDropdown)}
// //             placeholder="Select Status..."
// //             onChange={(selected: any) => {
// //               setStatusDropdown(selected?.value || '');
// //               setSelectedFilter(''); 
// //               setCurrentPage(1);
// //             }}
// //           />
// //         </div>
// //       </div>

// //       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order No</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
// //                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {filteredOrders.length === 0 ? (
// //                 <tr>
// //                   <td colSpan={6} className="px-6 py-4 text-center text-gray-500 italic">No orders found.</td>
// //                 </tr>
// //               ) : (
// //                 filteredOrders.map((item) => (
// //                   <tr key={item._id} className="hover:bg-gray-50 transition-colors">
// //                     <td className="px-6 py-4 text-sm font-bold text-gray-900">#{item.orderNumber}</td>
// //                     <td className="px-6 py-4 text-sm text-gray-900">{item.customerName}</td>
// //                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{item.totalAmount?.toLocaleString()}</td>
// //                     <td className="px-6 py-4">
// //                       <span className={`px-2 py-1 rounded-full text-xs font-bold ${
// //                         item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
// //                       }`}>
// //                         {item.paymentStatus}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
// //                         item.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
// //                         item.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
// //                       }`}>
// //                         {item.orderStatus}
// //                       </span>
// //                     </td>
// //                     <td className="px-6 py-4">
// //                       <div className="flex justify-center gap-4">
// //                         <button onClick={() => navigate(`/order/view/${item._id}`)} className="text-indigo-600 hover:text-indigo-900"><Eye size={18} /></button>
// //                         <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {totalPages > 1 && (
// //         <div className="mt-8 flex justify-center">
// //           <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default OrderListTemplate; 

// import React, { useEffect, useState, useMemo } from 'react';
// // import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';
// import TableHeader from '../../molecules/TableHeader';
// import Loader from '../../atoms/Loader';
// import Pagination from '../../atoms/Pagination';
// import CustomSelect from '../../atoms/Select'; 
// import { useOrderStore } from '../../../stores/orderStore';
// import type { Order } from '../../../types/common';
// import { ShoppingBag, Clock, CheckCircle, Eye, Trash2 } from 'lucide-react';
// import { PAGINATION_CONFIG } from '../../../constants/pagination';

// interface StatFilter {
//   id: string;
//   title: string;
//   value: number;
//   trend: 'up' | 'down';
//   change: string;
//   icon: React.ReactNode;
// }

// const OrderListTemplate: React.FC = () => {
//   // const navigate = useNavigate();
//   const { orders, fetchOrders, stats, deleteOrder, updateOrderStatus, totalPages, loading } = useOrderStore();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
//   const [selectedFilter, setSelectedFilter] = useState<string>(''); 
//   const [statusDropdown, setStatusDropdown] = useState<string>(''); 

//   const statusOptions = useMemo(() => [
//     { label: 'All Status', value: '' },
//     { label: 'Pending', value: 'Pending' },
//     { label: 'Processing', value: 'Processing' },
//     { label: 'Shipped', value: 'Shipped' },
//     { label: 'Delivered', value: 'Delivered' },
//     { label: 'Cancelled', value: 'Cancelled' },
//   ], []);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const activeFilter = selectedFilter || statusDropdown;
//         await fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, activeFilter);
//       } catch (err: any) {
//         toast.error(err?.message || 'Failed to load orders');
//       }
//     };
//     loadData();
//   }, [currentPage, selectedFilter, statusDropdown, fetchOrders]);

//   const filteredOrders = useMemo(() => {
//     return orders.filter((item) => {
//       if (!item) return false;
//       const orderNo = item.orderNumber?.toLowerCase() || '';
//       const customer = item.customerName?.toLowerCase() || '';
//       const search = searchTerm.toLowerCase();
      
//       return orderNo.includes(search) || customer.includes(search);
//     });
//   }, [orders, searchTerm]);

//   const handlePageChange = (selectedItem: { selected: number }) => {
//     setCurrentPage(selectedItem.selected + 1);
//   };

//   const statFilters: StatFilter[] = [
//     { id: '', title: 'Total Orders', value: stats.total, trend: 'up', change: 'Total', icon: <ShoppingBag size={20} /> },
//     { id: 'Paid', title: 'Paid Orders', value: stats.paid, trend: 'up', change: 'Settled', icon: <CheckCircle size={20} className="text-green-500" /> },
//     { id: 'Unpaid', title: 'Unpaid Orders', value: stats.unpaid, trend: 'down', change: 'Pending', icon: <Clock size={20} className="text-amber-500" /> },
//   ];

//   // NEW EYE ICON FUNCTIONALITY
//   const handleViewTracking = (item: Order) => {
//     // Note: ensure this image is in your /public folder
//     const imageUrl = '/image.png'; 

//     Swal.fire({
//       title: `Track Order #${item.orderNumber}`,
//       html: `
//         <div style="text-align: center;">
//           <img src="${imageUrl}" alt="Tracking" style="width: 100%; max-width: 400px; margin-bottom: 20px;" />
//           <div style="text-align: left; margin-top: 10px;">
//             <label style="display: block; font-weight: bold; margin-bottom: 5px;">Update Order Status:</label>
//             <select id="swal-status-select" class="swal2-select" style="display: flex; width: 100%; margin: 0 auto;">
//               <option value="Pending" ${item.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
//               <option value="Processing" ${item.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
//               <option value="Shipped" ${item.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
//               <option value="Delivered" ${item.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
//               <option value="Cancelled" ${item.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
//             </select>
//           </div>
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: 'Update Status',
//       confirmButtonColor: '#4f46e5',
//       preConfirm: () => {
//         const select = document.getElementById('swal-status-select') as HTMLSelectElement;
//         return select.value;
//       }
//     }).then(async (result) => {
//       if (result.isConfirmed && item._id) {
//         try {
//           // Updates the status via the store
//           await updateOrderStatus(item._id, result.value);
//           toast.success('Order status updated');
//           // Refresh list to show new status
//           fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter || statusDropdown);
//         } catch (err: any) {
//           toast.error(err?.message || 'Update failed');
//         }
//       }
//     });
//   };

//   const handleDelete = (item: Order) => {
//     Swal.fire({
//       title: 'Cancel Order?',
//       text: `Remove Order #${item.orderNumber}?`,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#d33',
//       confirmButtonText: 'Yes, delete it!',
//     }).then(async (result) => {
//       if (result.isConfirmed && item._id) {
//         try {
//           await deleteOrder(item._id);
//           toast.success('Order deleted');
//           fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter || statusDropdown);
//         } catch {
//           toast.error('Failed to delete');
//         }
//       }
//     });
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="p-6">
//       <TableHeader
//         managementName="Order"
//         searchTerm={searchTerm}
//         onSearchChange={setSearchTerm}
//         addButtonLabel="" 
//         addButtonLink="/dashboard"
//         statFilters={statFilters}
//         selectedFilterId={selectedFilter}
//         onSelectFilter={(id) => {
//           setSelectedFilter(id);
//           setStatusDropdown(''); 
//           setCurrentPage(1);
//         }}
//       />

//       <div className="flex justify-end mb-4">
//         <div className="w-full md:w-64">
//           <label className="block text-xs font-medium text-gray-500 uppercase mb-1 ml-1">
//             Filter by Order Status
//           </label>
//           <CustomSelect
//             options={statusOptions}
//             value={statusOptions.find(opt => opt.value === statusDropdown)}
//             placeholder="Select Status..."
//             onChange={(selected: any) => {
//               setStatusDropdown(selected?.value || '');
//               setSelectedFilter(''); 
//               setCurrentPage(1);
//             }}
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order No</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredOrders.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-4 text-center text-gray-500 italic">No orders found.</td>
//                 </tr>
//               ) : (
//                 filteredOrders.map((item) => (
//                   <tr key={item._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 text-sm font-bold text-gray-900">#{item.orderNumber}</td>
//                     <td className="px-6 py-4 text-sm text-gray-900">{item.customerName}</td>
//                     <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{item.totalAmount?.toLocaleString()}</td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-bold ${
//                         item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                       }`}>
//                         {item.paymentStatus}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
//                         item.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
//                         item.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
//                       }`}>
//                         {item.orderStatus}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex justify-center gap-4">
//                         {/* Eye icon updated to open popup instead of navigate */}
//                         <button onClick={() => handleViewTracking(item)} className="text-indigo-600 hover:text-indigo-900"><Eye size={18} /></button>
//                         <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {totalPages > 1 && (
//         <div className="mt-8 flex justify-center">
//           <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderListTemplate;



import React from 'react';
import { 
  LayoutDashboard, ShoppingBag, ShoppingCart, Users, PlusCircle, 
  Wallet, UserCircle, Star, Award, Printer, Download, MapPin, 
  Truck, CreditCard, ChevronDown, Calendar, User, Search
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

const OrderDetail: React.FC = () => {
  const products: Product[] = [
    { id: 1, name: "T-shirt blue, XXL size", image: "src/assets/images/product-img1.jpg", price: 44.25, quantity: 2 },
    { id: 2, name: "Winter jacket for men", image: "src/assets/images/product-img1.jpg", price: 7.50, quantity: 2 },
    { id: 3, name: "Jeans wear for men", image: "src/assets/images/product-img1.jpg", price: 43.50, quantity: 2 },
    { id: 4, name: "Product name color and size", image: "src/assets/images/product-img1.jpg", price: 99.00, quantity: 3 },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] font-sans text-[#495057]">
      
      <div className="flex-1 flex flex-col">
        <main className="p-8 flex-1">
  
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-[#253d4e]">Order detail</h2>
            <p className="text-sm text-gray-400 mt-1">Details for Order ID: 3453012</p>
          </header>

        
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm mb-6 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-100 rounded-full text-gray-500">
                <Calendar size={18} />
              </div>
              <div>
                <p className="font-bold text-[15px] text-[#253d4e]">Wed, Aug 13, 2026, 4:34PM</p>
                <p className="text-xs text-gray-400">Order ID: 3453012</p>
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
                  <p className="font-bold text-[#253d4e]">John Alexander</p>
                  <p className="text-gray-500">alex@example.com</p>
                  <p className="text-gray-500">+998 99 22123456</p>
                  <button className="text-amber-600 font-medium mt-2 hover:underline">View profile</button>
                </div>
              }
            />
            <InfoCard 
              icon={<Truck size={22} className="text-amber-600" />}
              title="Order info"
              content={
                <div className="text-[14px]">
                  <p className="text-gray-500">Shipping: Fargo express</p>
                  <p className="text-gray-500">Pay method: card</p>
                  <p className="text-gray-500">Status: new</p>
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
                  <p className="text-gray-500">City: Tashkent, Uzbekistan</p>
                  <p className="text-gray-500">Block A, House 123, Floor 2</p>
                  <p className="text-gray-500">Po Box 10000</p>
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
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 flex items-center gap-4">
                          <img src={item.image} alt="" className="w-10 h-10 rounded border" />
                          <span className="text-[14px] font-medium text-[#253d4e]">{item.name}</span>
                        </td>
                        <td className="px-6 py-4 text-[14px]">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-[14px]">{item.quantity}</td>
                        <td className="px-6 py-4 text-[14px] font-bold text-right text-[#253d4e]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col items-end">
                <div className="w-full max-w-[240px] text-sm space-y-2">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span>$973.35</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping cost:</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#253d4e] pt-1">
                    <span>Grand total:</span>
                    <span>$983.00</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-green-500 font-medium text-xs">Payment done</span>
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
              <div className="bg-[#f0f4f8] p-6 rounded-lg border border-blue-50">
                <h3 className="font-bold text-[#253d4e] mb-4">Payment info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-1 rounded border shadow-sm flex items-center justify-center">
                     <div className="w-6 h-4 bg-orange-400 rounded-sm"></div>
                  </div>
                  {/* //card detsils */}
                  <span className="text-sm font-medium text-gray-600">Master Card **** **** 4768</span> 
                </div>
                <div className="text-[13px] space-y-1 text-gray-500 leading-relaxed">
                  <p>Business name: Grand Market LLC</p>
                  <p>Phone: +1 (800) 555-154-52</p>
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

export default OrderDetail;