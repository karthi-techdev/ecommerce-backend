import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../../molecules/TableHeader';
import Loader from '../../../atoms/Loader';
import Pagination from '../../../atoms/Pagination';
import { useProductStore } from '../../../../stores/productStore';
import { Trash2, RefreshCcw } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../../constants/pagination';

const ProductTrashListTemplate: React.FC = () => {
  const {
    products,
    trashProduct,
    restoreProduct,
    permanentDeleteProduct,
    loading,
    error,
    trashCurrentPage,
    trashTotalPages,
  } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrashProducts =
    searchTerm.trim() === ''
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brandId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.mainCategoryId?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  useEffect(() => {
    trashProduct(1, PAGINATION_CONFIG.DEFAULT_LIMIT);
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <Loader />;

  const handleRestore = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will restore the Product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore it!',
    });

    if (result.isConfirmed) {
      try {
        await restoreProduct(productId);
        toast.success('Product restored successfully!');
        trashProduct(trashCurrentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
      } catch {
        toast.error('Failed to restore Product.');
      }
    }
  };

  const handlePermanentDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the Product.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await permanentDeleteProduct(productId);
        toast.success('Product permanently deleted!');
        trashProduct(trashCurrentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
      } catch {
        toast.error('Failed to delete Product.');
      }
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    trashProduct(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT);
  };

  return (
    <div className="p-6">
      <TableHeader
        managementName="Trash Product"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Product"
        addButtonLink="/product"
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Brand</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs uppercase">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredTrashProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No trash products available
                  </td>
                </tr>
              ) : (
                filteredTrashProducts.map((product, index) => (
                  <tr key={product._id}>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(trashCurrentPage - 1) *
                        PAGINATION_CONFIG.DEFAULT_LIMIT +
                        index +
                        1}
                    </td>

                    <td className="px-6 py-4 text-sm">{product.name}</td>

                    <td className="px-6 py-4 text-sm">
                      {product.brandId?.name}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      ₹{product.price}
                    </td>

                    <td className="px-6 py-4">
                      <img
                        src={`http://localhost:5000${product.images?.[0]}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>

                    <td className="px-4 py-2 flex gap-2">

                      <button
                        onClick={() => handleRestore(product._id!)}
                        className="text-green-500 hover:text-green-700 p-2"
                      >
                        <RefreshCcw size={16} />
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(product._id!)}
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

export default ProductTrashListTemplate;
