import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Loader from '../../atoms/Loader';
import TableHeader from '../../molecules/TableHeader';
import Pagination from '../../atoms/Pagination';
import { useMainCategoryStore } from '../../../stores/mainCategoryStore';
import type { MainCategory } from '../../../types/common';
import { RotateCcw, Trash2 } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';
import { useNavigate } from 'react-router-dom';

const TrashMainCategoryListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    mainCategories,
    fetchTrashedCategories,
    restoreCategory,
    permanentDeleteCategory,
    totalPages,
    loading,
    error,
  } = useMainCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );

  useEffect(() => {
    fetchTrashedCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
  }, [currentPage]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredCategories = mainCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (category: MainCategory) => {
    const result = await Swal.fire({
      title: 'Restore category?',
      text: category.name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Restore',
    });

    if (result.isConfirmed) {
      await restoreCategory(category._id!);
      toast.success('Category restored');
      fetchTrashedCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    }
  };

  const handlePermanentDelete = async (category: MainCategory) => {
    const result = await Swal.fire({
      title: 'Delete permanently?',
      text: category.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });

    if (result.isConfirmed) {
      await permanentDeleteCategory(category._id!);
      toast.success('Category deleted permanently');
      fetchTrashedCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Trash Main Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Main Category"
        addButtonLink="/main-category"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.NO
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IMAGE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No trashed categories
                </td>
              </tr>
            ) : (
              filteredCategories.map((category, index) => (
                <tr key={category._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {(currentPage - 1) *
                      PAGINATION_CONFIG.DEFAULT_LIMIT +
                      index +
                      1}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {category.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {category.description || '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.image ? (
                      <img
                        src={`http://localhost:5000${category.image}`}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-sm text-gray-400">
                        No Image
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                    <button
                      className="text-green-600 hover:text-green-700 transition"
                      onClick={() => handleRestore(category)}
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() =>
                        handlePermanentDelete(category)
                      }
                      title="Delete permanently"
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

export default TrashMainCategoryListTemplate;
