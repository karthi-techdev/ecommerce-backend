import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import Loader from '../../../atoms/Loader';
import Pagination from '../../../atoms/Pagination';
import { useCategoryStore } from '../../../../stores/categoryStore';
import { Trash2, RefreshCcw } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../../constants/pagination';

const CategoryTrashListTemplate: React.FC = () => {

  const {
    categories,
    trashCategory,
    restoreCategory,
    permanentDeleteCategory,
    loading,
    error,
    trashCurrentPage,
    trashTotalPages,
  } = useCategoryStore();

  
  const [searchTerm, setSearchTerm] = useState('');


  const filteredTrashCategories =
    searchTerm.trim() === ''
      ? categories
      : categories.filter((category) =>
category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.mainCategoryId.name.toLowerCase().includes(searchTerm.toLowerCase())||
      category.subCategoryId.name.toLowerCase().includes(searchTerm.toLowerCase())   
         );

  useEffect(() => {
    trashCategory(1, PAGINATION_CONFIG.DEFAULT_LIMIT);
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <Loader />;

  const handleRestore = async (categoryID: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the category.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it!',
    });

    if (result.isConfirmed) {
      try {
        await restoreCategory(categoryID);
        
        toast.success('Category restored successfully!');
        await trashCategory();
      } catch {
        toast.error('Failed to restore Category.');
      }
    }
  };

  const handlePermanentDelete = async (categoryId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the Category.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await permanentDeleteCategory(categoryId);
        toast.success('Category permanently deleted!');
        await trashCategory();
      } catch {
        toast.error('Failed to delete Category.');
      }
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    trashCategory(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT);
  };

  return (
    <div className="p-6">

     
      <TableHeader
        managementName="Trash Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Category"
        addButtonLink="/category"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">MainCategory Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SubCategory Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">

              {filteredTrashCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No trash categories available
                  </td>
                </tr>
              ) : (
                filteredTrashCategories.map((category, index) => (
                  <tr key={category._id}>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(trashCurrentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.mainCategoryId?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.subCategoryId?.name}
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={`http://localhost:5000${category.image}`}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-md "
                      />
                    </td>

                    <td className="px-4 py-2 flex gap-2">

                      <button
                        onClick={() => handleRestore(category._id!)}
                        className="text-green-500 hover:text-green-700 p-2"
                      >
                        <RefreshCcw size={16} />
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(category._id!)}
                        className="text-red-500 hover:text-red-700 p-2"
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

      {trashTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={trashTotalPages}
            currentPage={trashCurrentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

    </div>
  );
};

export default CategoryTrashListTemplate;