import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useBrandStore } from '../../../stores/brandStore';
import { Trash2, RefreshCcw} from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

const BrandTrashListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    trashBrands,
    fetchTrashBrands,
    restoreBrand,
    hardDeleteBrand,
    loading,
    error,
    trashCurrentPage,
    trashTotalPages,
    totalTrashBrands,
  } = useBrandStore();

useEffect(() => {
  fetchTrashBrands(1, PAGINATION_CONFIG.DEFAULT_LIMIT);
}, []);


  if (loading) return <Loader />;

  const handleRestore = async (brandId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the brand.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it!',
    });

    if (result.isConfirmed) {
      try {
        await restoreBrand(brandId);
        toast.success('Brand restored successfully!');
      } catch {
        toast.error('Failed to restore brand.');
      }
    }
  };

  const handlePermanentDelete = async (brandId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the brand.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await hardDeleteBrand(brandId);
        toast.success('Brand permanently deleted!');
      } catch {
        toast.error('Failed to delete brand.');
      }
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchTrashBrands(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT);
  };

  return (
    <div className="p-6">
      <TableHeader
        managementName="Trash Brands"
        searchTerm=""
        onSearchChange={() => {}}
        addButtonLabel="Back to Brands"
        addButtonLink="/brand"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trashBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No trash brands available
                  </td>
                </tr>
              ) : (
                trashBrands.map((brand, index) => (
                  <tr key={brand._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {(trashCurrentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brand.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{brand.description || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <img
                        src={`${import.meta.env.VITE_FILE_URL}default/${brand.image}`}
                        alt={brand.name}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200"
                      />
                    </td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <button
                        onClick={() => handleRestore(brand._id!)}
                        className="bg-transparent text-green-500 hover:text-green-700 p-2 rounded"
                        title="Restore"
                      >
                        <RefreshCcw size={16} />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(brand._id!)}
                        className="bg-transparent text-red-500 hover:text-red-700 p-2 rounded"
                        title="Permanent Delete"
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

export default BrandTrashListTemplate;
