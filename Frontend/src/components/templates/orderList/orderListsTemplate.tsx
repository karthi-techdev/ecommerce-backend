import React, { useState } from 'react';
import { ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const FilterInput = ({ label }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-700 mb-2 tracking-wider">{label}</label>
    <input
      type="text"
      placeholder="Type here"
      className="w-full p-3 bg-[#f1f5f9] border-none rounded-md text-sm placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-teal-500"
    />
  </div>
);

const OrderListsTemplate = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for Custom Dropdowns
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Status");
  const [showOpen, setShowOpen] = useState(false);
  const [showSelected, setShowSelected] = useState("Show 20");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const toggleMenu = (id) => {
  setActiveMenuId(activeMenuId === id ? null : id);
  };

  const showOptions = [
    { label: "Show 20" },
    { label: "Show 30" },
    { label: "Show 40" },
  ];

  const options = [
    { label: "Status" },
    { label: "Show All" },
    { label: "Active" },
    { label: "Disabled" },
  ];

  const allOrders = [
    { id: '452', name: 'Devon Lane', price: '$948.55', status: 'Pending', date: '07.05.2026' },
    { id: '789', name: 'Guy Hawkins', price: '$0.00', status: 'Received', date: '25.05.2026' },
    { id: '478', name: 'Leslie Alexander', price: '$293.01', status: 'Cancelled', date: '18.05.2026' },
    { id: '589', name: 'Albert Flores', price: '$105.55', status: 'Cancelled', date: '07.02.2026' },
    { id: '345', name: 'Eleanor Pena', price: '$779.58', status: 'Pending', date: '18.03.2026' },
    { id: '210', name: 'Jane Cooper', price: '$120.00', status: 'Received', date: '12.01.2026' },
    { id: '992', name: 'Wade Warren', price: '$450.10', status: 'Cancelled', date: '15.04.2026' },
    { id: '452', name: 'Devon Lane', price: '$948.55', status: 'Pending', date: '07.05.2026' },
    { id: '789', name: 'Guy Hawkins', price: '$0.00', status: 'Received', date: '25.05.2026' },
    { id: '478', name: 'Leslie Alexander', price: '$293.01', status: 'Cancelled', date: '18.05.2026' },
    { id: '589', name: 'Albert Flores', price: '$105.55', status: 'Cancelled', date: '07.02.2026' },
    { id: '345', name: 'Eleanor Pena', price: '$779.58', status: 'Pending', date: '18.03.2026' },
    { id: '210', name: 'Jane Cooper', price: '$120.00', status: 'Received', date: '12.01.2026' },
    { id: '992', name: 'Wade Warren', price: '$450.10', status: 'Cancelled', date: '15.04.2026' },
  ];

  // Logic to get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = allOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allOrders.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-700">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#334155]">Order List</h1>
        <p className="text-slate-500 mt-1">Lorem ipsum dolor sit amet.</p>
      </header>

      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
          
          {/* Table Controls */}
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-white">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-4 pr-10 py-2 bg-[#f1f5f9] border-none rounded-md text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            
            <div className="flex gap-3">
              {/* Status Dropdown */}
              <div className="relative inline-block">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-8 px-4 py-2 rounded text-sm font-medium bg-[#f1f5f9] text-slate-500 transition"
                >
                  {selected}
                  <ChevronDown size={16} />
                </button>
                {open && (
                  <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden z-20">
                    {options.map((opt) => (
                      <div
                        key={opt.label}
                        onClick={() => { setSelected(opt.label); setOpen(false); }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#137e7e] hover:text-white transition"
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Show items Dropdown */}
              <div className="relative inline-block">
                <button
                  onClick={() => setShowOpen(!showOpen)}
                  className="flex items-center gap-8 px-4 py-2 rounded text-sm font-medium bg-[#f1f5f9] text-slate-500 transition"
                >
                  {showSelected}
                  <ChevronDown size={16} />
                </button>
                {showOpen && (
                  <div className="absolute mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden z-20">
                    {showOptions.map((opt) => (
                      <div
                        key={opt.label}
                        onClick={() => { setShowSelected(opt.label); setShowOpen(false); }}
                        className="px-4 py-2 text-sm cursor-pointer hover:bg-[#137e7e] hover:text-white transition"
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-800 font-semibold text-sm border-b border-slate-50">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none">
                    <td className="px-6 py-5 font-medium">{order.id}</td>
                    <td className="px-6 py-5 text-slate-600">{order.name}</td>
                    <td className="px-6 py-5 text-slate-600">{order.price}</td>
                    <td className="px-6 py-5">{order.status}</td>
                    <td className="px-6 py-5 text-slate-600">{order.date}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col items-end gap-1">
                        <button className="bg-[#137e7e] hover:bg-[#0e6363] text-white px-6 py-1.5 rounded text-xs font-medium transition-colors">
                          Detail
                        </button>
                         <div className="relative">
                        <button 
                          onClick={() => toggleMenu(order.id)}
                          className={`p-1 border rounded transition-colors ${
                            activeMenuId === order.id 
                              ? 'bg-[#137e7e] border-[#137e7e] text-white' 
                              : 'border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <MoreHorizontal size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === order.id && (
                          <>
                            {/* Invisible backdrop to close menu on click away */}
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setActiveMenuId(null)}
                            ></div>
                            
                            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-150 origin-top-right">
                              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                View detail
                              </button>
                              <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                                Edit info
                              </button>
                              <div className="my-1 border-t border-slate-50"></div>
                              <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-md text-sm font-medium transition-colors ${
                    currentPage === i + 1 
                    ? 'bg-[#137e7e] text-white' 
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Filter */}
        <aside className="w-80 bg-white rounded-lg border border-slate-100 shadow-sm p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Filter by</h2>
          <div className="space-y-5">
            <FilterInput label="Order ID" />
            <FilterInput label="Customer" />
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 tracking-wider">Order Status</label>
              <div className="relative">
                <select className="w-full p-3 bg-[#f1f5f9] border-none rounded-md text-sm text-slate-600 appearance-none outline-none cursor-pointer">
                  <option>Received</option>
                  <option>Cancelled</option>
                  <option>Pending</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
            <FilterInput label="Total" />
            <FilterInput label="Date Added" />
            <FilterInput label="Date Modified" />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default OrderListsTemplate;