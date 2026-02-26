import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useShipmentMethodStore } from '../../../stores/shipmentMethodsStore';
import type { ShipmentMethod } from '../../../types/common';
import { Truck, CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { truncate } from '../../utils/helper';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const ShipmentMethodListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const { shipmentMethods, fetchShipmentMethods, deleteShipmentMethod, toggleStatusShipmentMethod, totalPages, loading, error,} = useShipmentMethodStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchShipmentMethods(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load Shipment Methods');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, fetchShipmentMethods]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredData = shipmentMethods.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateStats = (): StatFilter[] => {
    const total = shipmentMethods.length;
    const active = shipmentMethods.filter(s => s.status === 'active').length;
    const inactive = total - active;

    return [
      {
        id: 'total',
        title: 'Total Methods',
        value: total,
        trend: 'up',
        change: '100%',
        icon: <Truck size={20} />,
      },
      {
        id: 'active',
        title: 'Active',
        value: active,
        trend: 'up',
        change: `${total ? Math.round((active / total) * 100) : 0}%`,
        icon: <CheckCircle size={20} />,
      },
      {
        id: 'inactive',
        title: 'Inactive',
        value: inactive,
        trend: 'down',
        change: `${total ? Math.round((inactive / total) * 100) : 0}%`,
        icon: <XCircle size={20} />,
      },
    ];
  };

  const statFilters = calculateStats();

  const handleToggleStatus = async (item: ShipmentMethod) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this shipment method?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleStatusShipmentMethod(item._id!);
        await fetchShipmentMethods(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
        toast.success(`Shipment method ${action}d successfully!`);
      } catch {
        toast.error('Failed to update status');
      }
    }
  };

  const handleDelete = (item: ShipmentMethod) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${item.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteShipmentMethod(item._id!);
          await fetchShipmentMethods(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
          Swal.fire('Deleted!', 'Shipment method removed.', 'success');
        } catch {
          toast.error('Failed to delete shipment method');
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Shipment Method"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/shipment-methods/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as FilterType);
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500"> No data available </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm text-gray-500"> {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900"> {item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900"> {item.description? truncate(item.description, 30): '-'} </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.price}</td>
                    <td className="px-6 py-2">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`${item.status === 'active'? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {item.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center align-middle">
                      <div className='flex justify-center gap-3 w-full items-center'>
                        <button onClick={() => navigate(`/shipment-methods/edit/${item._id}`)} className="text-indigo-500 hover:text-indigo-700">
                        <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
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
        <div className="flex justify-center mt-6">
          <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange}/>
        </div>
      )}
    </div>
  );
};

export default ShipmentMethodListTemplate;
