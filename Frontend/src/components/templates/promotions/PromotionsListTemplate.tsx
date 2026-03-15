import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { usePromotionsStore } from '../../../stores/promotionsStore';
import type { Promotions } from '../../../types/common';
import { HelpCircle, CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { truncate } from '../../utils/helper'
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const PromotionsListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    promotions,
    fetchPromotions,
    softDeletePromotions,
    toggleStatusPromotions,promotionsStats,stats,
    totalPages,
    loading,
    error,
  } = usePromotionsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  // Fetch data on page or filter change
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchPromotions(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
        await promotionsStats();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load Promotions. Please try again.');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, fetchPromotions]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter Promotions based on selected filter and search term
  const filteredPromotions = promotions.filter((promotions) => {
    // Apply status filter
    if (selectedFilter === 'active' && !promotions.isActive) return false;
if (selectedFilter === 'inactive' && promotions.isActive) return false;

    // Apply search filter
    return promotions.name.toLowerCase().includes(searchTerm.toLowerCase())
       || (promotions.image?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
  });

  /**
  
   * @returns {StatFilter[]} Array of stat objects for display
   */
  const calculateStats = (): StatFilter[] => {
    const total = stats?.total ?? 0;
const active = stats?.active ?? 0;
const inactive = stats?.inactive ?? 0;

    // Calculate percentages with validation
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

    return [
      {
        id: 'total',
        title: 'Total Promotions',
        value: total,
        trend: 'up' as const,
        change: '100%',
        icon: <HelpCircle size={20} />,
      },
      {
        id: 'active',
        title: 'Active Promotions',
        value: active,
        trend: 'up' as const,
        change: `${activePercent}%`,
        icon: <CheckCircle size={20} />,
      },
      {
        id: 'inactive',
        title: 'Inactive Promotions',
        value: inactive,
        trend: 'down' as const,
        change: `${inactivePercent}%`,
        icon: <XCircle size={20} />,
      },
    ];
  };

  const statFilters: StatFilter[] = calculateStats();

  // Handle status toggle
  const handleToggleStatus = async (promotions: Promotions) => {
  if (!promotions._id) return;

  // Toggle the boolean isActive
  const newStatus = !promotions.isActive;
  const action = newStatus ? 'activate' : 'deactivate';

  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to ${action} this promotion?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: `Yes, ${action} it!`
  });

  if (result.isConfirmed) {
    try {
      await toggleStatusPromotions(promotions._id); // send new isActive status
      await fetchPromotions(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
      await promotionsStats(); // refresh stats if needed
      toast.success(`Promotion ${action}d successfully!`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update status. Please try again.');
    }
  }
};

  // Delete handler
  const handleDelete = (promotion: Promotions) => {

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${promotion.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await softDeletePromotions(promotion._id!);

          const updatedLength = filteredPromotions.length - 1;
          const newTotalItems = promotions.length - 1;
          const newTotalPages = Math.ceil(newTotalItems / PAGINATION_CONFIG.DEFAULT_LIMIT);

          // Adjust current page if necessary
          if (updatedLength === 0 && currentPage > newTotalPages) {
            const newPage = Math.max(newTotalPages || 1, 1);
            setCurrentPage(newPage);
            // Fetch data for the new page
            await fetchPromotions(newPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
            await promotionsStats();
          } else {
            // Fetch updated data for current page
            await fetchPromotions(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
             await promotionsStats();
          }

          Swal.fire('Deleted!', 'The Promotions has been removed.', 'success');
        } catch (error) {
          toast.error('Failed to delete Promotions. Please try again.');
        }
      }
    });
  };



  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Promotions"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/promotions/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promotion Name</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
           <tbody className="bg-white divide-y divide-gray-200">
  {filteredPromotions.length === 0 ? (
    <tr>
      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
        No data available
      </td>
    </tr>
  ) : (
    filteredPromotions.map((promotion: Promotions, index: number) => (
      <tr key={promotion._id}>
        {/* S.NO */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
        </td>

        {/* Promotion Name */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {truncate(promotion.name, 40)}
        </td>

        {/* Image
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {promotion.image ? (
            <img src={promotion.image} alt={promotion.name} className="h-10 w-20 object-cover rounded" />
          ) : (
            'No Image'
          )}
        </td> */}

        {/* Status Toggle */}
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <button
              onClick={() => handleToggleStatus(promotion)}
              className={`${promotion.isActive ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'} transition`}
              title="Toggle Status"
            >
              {promotion.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />} 
            </button>
            
          </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <div className="flex items-center gap-3">
              <button
          onClick={() => navigate(`/promotions/edit/${promotion._id}`)}
          className="text-indigo-500 hover:text-indigo-700"
          title="Edit"
    >

            <Pencil size={16} />
          </button>
          <button
      onClick={() => handleDelete(promotion)}
      className="text-red-500 hover:text-red-700"
      title="Delete"
    >
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

export default PromotionsListTemplate;