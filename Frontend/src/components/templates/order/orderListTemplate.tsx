// import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';
// import TableHeader from '../../molecules/TableHeader';
// import Loader from '../../atoms/Loader';
// import Pagination from '../../atoms/Pagination';
// import CustomSelect from '../../atoms/Select'; 
// import { useOrderStore } from '../../../stores/orderStore';
// import type { Order } from '../../../types/common';
// import { ShoppingBag, Clock, CheckCircle, Eye, Trash2, CreditCard } from 'lucide-react';
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
//   const navigate = useNavigate();
//   const { orders, fetchOrders, stats, deleteOrder, totalPages, loading, error } = useOrderStore();

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
//         // We fetch the data based on status/tabs, but search locally like SubCategory
//         await fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, activeFilter);
//       } catch (err: any) {
//         toast.error(err?.message || 'Failed to load orders');
//       }
//     };
//     loadData();
//   }, [currentPage, selectedFilter, statusDropdown, fetchOrders]);

//   // CLIENT-SIDE FILTERING (Same logic as your SubCategory management)
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
//           // Fixed the TS error by ensuring item._id is present
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
//                         <button onClick={() => navigate(`/order/view/${item._id}`)} className="text-indigo-600 hover:text-indigo-900"><Eye size={18} /></button>
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

import React, { useEffect, useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import CustomSelect from '../../atoms/Select'; 
import { useOrderStore } from '../../../stores/orderStore';
import type { Order } from '../../../types/common';
import { ShoppingBag, Clock, CheckCircle, Eye, Trash2 } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const OrderListTemplate: React.FC = () => {
  // const navigate = useNavigate();
  const { orders, fetchOrders, stats, deleteOrder, updateOrderStatus, totalPages, loading } = useOrderStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const [selectedFilter, setSelectedFilter] = useState<string>(''); 
  const [statusDropdown, setStatusDropdown] = useState<string>(''); 

  const statusOptions = useMemo(() => [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ], []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const activeFilter = selectedFilter || statusDropdown;
        await fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, activeFilter);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load orders');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, statusDropdown, fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      if (!item) return false;
      const orderNo = item.orderNumber?.toLowerCase() || '';
      const customer = item.customerName?.toLowerCase() || '';
      const search = searchTerm.toLowerCase();
      
      return orderNo.includes(search) || customer.includes(search);
    });
  }, [orders, searchTerm]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const statFilters: StatFilter[] = [
    { id: '', title: 'Total Orders', value: stats.total, trend: 'up', change: 'Total', icon: <ShoppingBag size={20} /> },
    { id: 'Paid', title: 'Paid Orders', value: stats.paid, trend: 'up', change: 'Settled', icon: <CheckCircle size={20} className="text-green-500" /> },
    { id: 'Unpaid', title: 'Unpaid Orders', value: stats.unpaid, trend: 'down', change: 'Pending', icon: <Clock size={20} className="text-amber-500" /> },
  ];

  // NEW EYE ICON FUNCTIONALITY
  const handleViewTracking = (item: Order) => {
    // Note: ensure this image is in your /public folder
    const imageUrl = '/image.png'; 

    Swal.fire({
      title: `Track Order #${item.orderNumber}`,
      html: `
        <div style="text-align: center;">
          <img src="${imageUrl}" alt="Tracking" style="width: 100%; max-width: 400px; margin-bottom: 20px;" />
          <div style="text-align: left; margin-top: 10px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Update Order Status:</label>
            <select id="swal-status-select" class="swal2-select" style="display: flex; width: 100%; margin: 0 auto;">
              <option value="Pending" ${item.orderStatus === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${item.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${item.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${item.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${item.orderStatus === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Update Status',
      confirmButtonColor: '#4f46e5',
      preConfirm: () => {
        const select = document.getElementById('swal-status-select') as HTMLSelectElement;
        return select.value;
      }
    }).then(async (result) => {
      if (result.isConfirmed && item._id) {
        try {
          // Updates the status via the store
          await updateOrderStatus(item._id, result.value);
          toast.success('Order status updated');
          // Refresh list to show new status
          fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter || statusDropdown);
        } catch (err: any) {
          toast.error(err?.message || 'Update failed');
        }
      }
    });
  };

  const handleDelete = (item: Order) => {
    Swal.fire({
      title: 'Cancel Order?',
      text: `Remove Order #${item.orderNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed && item._id) {
        try {
          await deleteOrder(item._id);
          toast.success('Order deleted');
          fetchOrders(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter || statusDropdown);
        } catch {
          toast.error('Failed to delete');
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Order"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="" 
        addButtonLink="/dashboard"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id);
          setStatusDropdown(''); 
          setCurrentPage(1);
        }}
      />

      <div className="flex justify-end mb-4">
        <div className="w-full md:w-64">
          <label className="block text-xs font-medium text-gray-500 uppercase mb-1 ml-1">
            Filter by Order Status
          </label>
          <CustomSelect
            options={statusOptions}
            value={statusOptions.find(opt => opt.value === statusDropdown)}
            placeholder="Select Status..."
            onChange={(selected: any) => {
              setStatusDropdown(selected?.value || '');
              setSelectedFilter(''); 
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 italic">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">#{item.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.customerName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">₹{item.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        item.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 
                        item.orderStatus === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        {/* Eye icon updated to open popup instead of navigate */}
                        <button onClick={() => handleViewTracking(item)} className="text-indigo-600 hover:text-indigo-900"><Eye size={18} /></button>
                        <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default OrderListTemplate;
