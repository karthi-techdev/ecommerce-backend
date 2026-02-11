import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import Loader from '../../../atoms/Loader';
import Pagination from '../../../atoms/Pagination';
import { useCategoryStore } from '../../../../stores/categoryStore';
import type { Category } from '../../../../types/common';
import { HelpCircle, CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { FiRefreshCw } from "react-icons/fi"
import { truncate } from '../../../utils/helper'
import { PAGINATION_CONFIG } from '../../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const CategoryTrashListTemplate: React.FC = () => {
  const {
    categories,
    trashCategory,
    permanentDeleteCategory,
    restoreCategory,
    totalPages,
    loading,
    error,
  } = useCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  // Fetch data on page or filter change
  useEffect(() => {
    const loadData = async () => {
      try {
        await trashCategory(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load trash Categories. Please try again.');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, trashCategory]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter FAQs based on selected filter and search term
  const filteredFaqs = categories.filter((category) => {
    // Apply status filter
    if (selectedFilter === 'active' && category.status !== 'active') return false;
    if (selectedFilter === 'inactive' && category.status !== 'inactive') return false;

    // Apply search filter
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.mainCategoryId.name.toLowerCase().includes(searchTerm.toLowerCase())||
      category.subCategoryId.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  /**
   * Calculates statistics for FAQs including total count, active count, and percentages
   * @returns {StatFilter[]} Array of stat objects for display
   */
  const calculateStats = (): StatFilter[] => {
    const total = categories.length;

    return [
      {
        id: 'total',
        title: 'Total',
        value: total,
        trend: 'up' as const,
        change: '100%',
        icon: <HelpCircle size={20} />,
      }
    ];
  };

  const statFilters: StatFilter[] = calculateStats();
 const handleRestore = (category: Category) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to restore "${category.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a', 
    cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, restore it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restoreCategory(category._id!);

          const updatedLength = filteredFaqs.length - 1;
          const newTotalItems = categories.length - 1;
          const newTotalPages = Math.ceil(newTotalItems / PAGINATION_CONFIG.DEFAULT_LIMIT);

          // Adjust current page if necessary
          if (updatedLength === 0 && currentPage > newTotalPages) {
            const newPage = Math.max(newTotalPages || 1, 1);
            setCurrentPage(newPage);
            // Fetch data for the new page
            await trashCategory(newPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
          } else {
            // Fetch updated data for current page
            await trashCategory(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
          }

          Swal.fire('Restored!', 'The Category has been removed from the trash.', 'success');
        } catch (error) {
          toast.error('Failed to restore Category. Please try again.');
        }
      }
    });
  };

  // Delete handler
  const handleDelete = (category: Category) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to permanent delete "${category.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await permanentDeleteCategory(category._id!);

          const updatedLength = filteredFaqs.length - 1;
          const newTotalItems = categories.length - 1;
          const newTotalPages = Math.ceil(newTotalItems / PAGINATION_CONFIG.DEFAULT_LIMIT);

          // Adjust current page if necessary
          if (updatedLength === 0 && currentPage > newTotalPages) {
            const newPage = Math.max(newTotalPages || 1, 1);
            setCurrentPage(newPage);
            // Fetch data for the new page
            await trashCategory(newPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
          } else {
            // Fetch updated data for current page
            await trashCategory(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
          }

          Swal.fire('Deleted!', 'The Category has been removed permanently.', 'success');
        } catch (error) {
          toast.error('Failed to delete Category. Please try again.');
        }
      }
    });
  };



  if (loading) return <Loader />;

  return (
    <div className="p-6">
      

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MainCategory Name</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SubCategory Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((category: Category, index: number) => (
                  <tr key={category._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(category.name, 40)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <img
  src={`http://localhost:5000${category.image}`}
  alt={category.name}
  className="h-10 w-10 object-cover rounded"
/>

                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(category.mainCategoryId?.name, 40)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(category.subCategoryId?.name, 40)}
                    </td>
                    <td className="px-4 py-2 flex gap-3 items-center">
                      <button
                        className="bg-transparent text-green-600 hover:text-indigo-700 p-2 rounded"
                        title="Restore"
                      >
                        <FiRefreshCw size={16} onClick={()=>handleRestore(category)}/>
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="bg-transparent text-red-500 hover:text-red-700 p-2 rounded"
                        title="Delete"
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
export default CategoryTrashListTemplate