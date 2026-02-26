import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Loader from '../../../atoms/Loader';
import TableHeader from '../../../molecules/TableHeader';
import Pagination from '../../../atoms/Pagination';
import { useMainCategoryStore } from '../../../../stores/mainCategoryStore';
import type { MainCategory } from '../../../../types/common';
import { RotateCcw, Trash2 } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../../constants/pagination';
import { useNavigate } from 'react-router-dom';

const TrashMainCategoryListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    mainCategories,
    fetchTrashedMainCategories,
    restoreMainCategory,
    permanentDeleteMainCategory,
    totalPages,
    loading,
    error,
  } = useMainCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );

  useEffect(() => {
    fetchTrashedMainCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
  }, [currentPage]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredMainCategories = mainCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (mainCategory: MainCategory) => {
    const result = await Swal.fire({
      title: 'Restore Main Category?',
      text: mainCategory.name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Restore',
    });

    if (result.isConfirmed) {
      await restoreMainCategory(mainCategory._id!);
      toast.success('Main Category restored');
      fetchTrashedMainCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    }
  };

  const handlePermanentDelete = async (mainCategory: MainCategory) => {
    const result = await Swal.fire({
      title: 'Delete Main Category permanently?',
      text: mainCategory.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });

    if (result.isConfirmed) {
      await permanentDeleteMainCategory(mainCategory._id!);
      toast.success('Main Category deleted permanently');
      fetchTrashedMainCategories(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
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
        addButtonLink="/mainCategory"
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
            {filteredMainCategories.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No trashed Main Categories
                </td>
              </tr>
            ) : (
              filteredMainCategories.map((mainCategory, index) => (
                <tr key={mainCategory._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {(currentPage - 1) *
                      PAGINATION_CONFIG.DEFAULT_LIMIT +
                      index +
                      1}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {mainCategory.name}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {mainCategory.description || '-'}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {mainCategory.image ? (
                      <img
                        src={`http://localhost:5000${mainCategory.image}`}
                        alt={mainCategory.name}
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
                      onClick={() => handleRestore(mainCategory)}
                      title="Restore"
                    >
                      <RotateCcw size={16} />
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() =>
                        handlePermanentDelete(mainCategory)
                      }
                      title="Delete Main Category permanently"
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
