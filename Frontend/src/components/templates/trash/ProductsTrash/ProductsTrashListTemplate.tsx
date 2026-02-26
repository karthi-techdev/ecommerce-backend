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
    if (error) {
      toast.error(error);
      useProductStore.setState({ error: null }); 
    }
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
        managementName="Trash Products"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Product"
        addButtonLink="/product"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.NO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTrashProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No trash products available
                  </td>
                </tr>
              ) : (
                filteredTrashProducts.map((product, index) => (
                  <tr key={product._id} className="text-sm text-gray-700">

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(trashCurrentPage - 1) *
                        PAGINATION_CONFIG.DEFAULT_LIMIT +
                        index +
                        1}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {product.brandId?.name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ₹{product.price}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={`http://localhost:5000${product.images?.[0]}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">

                        <button
                          onClick={() => handleRestore(product._id!)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <RefreshCcw size={16} />
                        </button>

                        <button
                          onClick={() => handlePermanentDelete(product._id!)}
                          className="text-red-500 hover:text-red-700"
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
