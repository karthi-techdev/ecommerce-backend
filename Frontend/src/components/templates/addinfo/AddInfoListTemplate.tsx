

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useAddInfoStore } from '../../../stores/addInfoStore';
import type { AddInfo } from '../../../types/common';
import {
  RefreshCw,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,ArrowLeft
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

const AddInfoListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    addInfos,
    fetchAddInfos,
    softDeleteAddInfo,
    toggleStatusAddInfo,
    restoreAddInfo,
    stats,
    totalPages,
    loading,
    error,
  } = useAddInfoStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );

  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>('total');

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchAddInfos(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load data.');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, fetchAddInfos]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredData = addInfos.filter((item) => {
  if (selectedFilter === 'active' && (!item.isActive || item.isDeleted)) return false;
  if (selectedFilter === 'inactive' && (item.isActive || item.isDeleted)) return false;
  if (selectedFilter === 'total' && item.isDeleted) return false;

  if (searchTerm.trim() !== '') {
    const term = searchTerm.toLowerCase();

    return (
      item.key?.toLowerCase().includes(term) ||
      item.value?.toLowerCase().includes(term)
    );
  }

  return true;
});


  const calculateStats = (): StatFilter[] => {
    const total = stats.total || 0;
    const active = stats.active || 0;
    const inactive = stats.inactive || 0;

    const activePercent =
      total > 0 ? Math.round((active / total) * 100) : 0;

    const inactivePercent =
      total > 0 ? Math.round((inactive / total) * 100) : 0;

    return [
      {
        id: 'total',
        title: 'Total',
        value: total,
        trend: 'up',
        change: '100%',
        icon: <RefreshCw size={20} />,
      },
      {
        id: 'active',
        title: 'Active',
        value: active,
        trend: 'up',
        change: `${activePercent}%`,
        icon: <CheckCircle size={20} />,
      },
      {
        id: 'inactive',
        title: 'Inactive',
        value: inactive,
        trend: 'down',
        change: `${inactivePercent}%`,
        icon: <XCircle size={20} />,
      },
    ];
  };

  const statFilters = calculateStats();

const handleToggleStatus = async (item: AddInfo) => {
  const newStatus = item.isActive ? false : true;
  const action = newStatus ? 'activate' : 'deactivate';

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to ${action} this info?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: `Yes, ${action} it!`,
  });

  if (!result.isConfirmed) return;

  try {
    await toggleStatusAddInfo(item._id!);

    await fetchAddInfos(
      currentPage,
      PAGINATION_CONFIG.DEFAULT_LIMIT,
      selectedFilter
    );

    toast.success(`Successfully ${action}d!`);
  } catch (err: any) {
    toast.error(err?.message || 'Failed to update');
  }
};

  const handleDelete = (item: AddInfo) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to delete "${item.key}"`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await softDeleteAddInfo(item._id!);

        await fetchAddInfos(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );

        toast.success('Moved to trash successfully!');
      } catch {
        toast.error('Failed to delete');
      }
    }
  });
};

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-sm rounded-lg border border-gray-200"
      >
        <ArrowLeft size={16} />
        Back
      </button>
    </div>
      <TableHeader
        managementName="Additional Info"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/products/add-info/add"        
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredData.map((item: AddInfo, index: number) => (
                  <tr key={item._id} className="hover:bg-gray-50">

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {truncate(item.key, 30)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {truncate(item.value, 50)}
                    </td>

                    <td className="px-6 py-4">
                     <button onClick={() => handleToggleStatus(item)}>
                      {item.isActive ? (
                        <ToggleRight className="text-green-500" size={18} />
                      ) : (
                        <ToggleLeft className="text-gray-400" size={18} />
                      )}
                    </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            navigate(`/products/add-info/edit/${item._id}`)
                          }
                          className="text-indigo-500 hover:text-indigo-700"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
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

export default AddInfoListTemplate;