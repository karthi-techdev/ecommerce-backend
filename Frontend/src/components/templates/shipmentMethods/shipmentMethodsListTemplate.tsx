import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useShipmentStore } from '../../../stores/shipmentMethodsStore';
import type { ShipmentMethod } from '../../../stores/shipmentMethodsStore';
import {
  Truck,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
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

  const {
    shipmentMethods,
    fetchShipmentMethods,
    deleteShipmentMethod,
    toggleStatus,
    totalPages,
    loading,
    error
  } = useShipmentStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );
  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>('total');

  // 🔹 Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        const apiFilter =
          selectedFilter === 'total'
            ? 'all'
            : selectedFilter;

        await fetchShipmentMethods(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          apiFilter
        );
      } catch (err: any) {
        toast.error(
          err?.message || 'Failed to load shipment methods.'
        );
      }
    };

    loadData();
  }, [currentPage, selectedFilter, fetchShipmentMethods]);

  // 🔹 Error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // 🔹 Filtered Data
  const filteredMethods = shipmentMethods.filter((method) => {
    if (selectedFilter === 'active' && method.status !== 'active')
      return false;
    if (selectedFilter === 'inactive' && method.status !== 'inactive')
      return false;

    return (
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 🔹 Stats
  const calculateStats = (): StatFilter[] => {
    const total = shipmentMethods.length;
    const active = shipmentMethods.filter(
      (m) => m.status === 'active'
    ).length;
    const inactive = total - active;

    const activePercent =
      total > 0 ? Math.round((active / total) * 100) : 0;
    const inactivePercent =
      total > 0 ? Math.round((inactive / total) * 100) : 0;

    return [
      {
        id: 'total',
        title: 'Total Methods',
        value: total,
        trend: 'up',
        change: '100%',
        icon: <Truck size={20} />
      },
      {
        id: 'active',
        title: 'Active Methods',
        value: active,
        trend: 'up',
        change: `${activePercent}%`,
        icon: <CheckCircle size={20} />
      },
      {
        id: 'inactive',
        title: 'Inactive Methods',
        value: inactive,
        trend: 'down',
        change: `${inactivePercent}%`,
        icon: <XCircle size={20} />
      }
    ];
  };

  const statFilters = calculateStats();

  // 🔹 Toggle Status
  const handleToggleStatus = async (method: ShipmentMethod) => {
    const newStatus =
      method.status === 'active' ? 'inactive' : 'active';
    const action =
      newStatus === 'active' ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this shipment method?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        await toggleStatus(method._id!);
        await fetchShipmentMethods(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter === 'total'
            ? 'all'
            : selectedFilter
        );
        toast.success(`Shipment method ${action}d successfully!`);
      } catch {
        toast.error('Failed to update status.');
      }
    }
  };

  // 🔹 Delete
  const handleDelete = (method: ShipmentMethod) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${method.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteShipmentMethod(method._id!);

          const newTotalItems = shipmentMethods.length - 1;
          const newTotalPages = Math.ceil(
            newTotalItems / PAGINATION_CONFIG.DEFAULT_LIMIT
          );

          if (
            filteredMethods.length - 1 === 0 &&
            currentPage > newTotalPages
          ) {
            const newPage = Math.max(newTotalPages || 1, 1);
            setCurrentPage(newPage);
            await fetchShipmentMethods(
              newPage,
              PAGINATION_CONFIG.DEFAULT_LIMIT,
              selectedFilter === 'total'
                ? 'all'
                : selectedFilter
            );
          } else {
            await fetchShipmentMethods(
              currentPage,
              PAGINATION_CONFIG.DEFAULT_LIMIT,
              selectedFilter === 'total'
                ? 'all'
                : selectedFilter
            );
          }

          Swal.fire(
            'Deleted!',
            'Shipment method removed successfully.',
            'success'
          );
        } catch {
          toast.error('Failed to delete shipment method.');
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
        addButtonLink="/shipment-method/add"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMethods.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredMethods.map((method, index) => (
                  <tr key={method._id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) *
                        PAGINATION_CONFIG.DEFAULT_LIMIT +
                        index +
                        1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {truncate(method.name, 30)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{method.price}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {truncate(method.estimatedDeliveryTime, 30)}
                    </td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(method)}
                        className={`${method.status === 'active'
                          ? 'text-green-500'
                          : 'text-gray-400'
                          }`}
                      >
                        {method.status === 'active'
                          ? <ToggleRight size={18} />
                          : <ToggleLeft size={18} />}
                      </button>
                    </td>

                    <td className="px-4 py-2 flex gap-3">
                      <button
                        onClick={() =>
                          navigate(`/shipment-method/edit/${method._id}`)
                        }
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(method)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
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
          <Pagination
            pageCount={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ShipmentMethodListTemplate;