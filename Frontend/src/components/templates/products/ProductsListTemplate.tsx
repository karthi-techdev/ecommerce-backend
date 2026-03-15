import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useProductStore } from '../../../stores/productStore';
import type { Product } from '../../../types/common';
import {Package,CheckCircle,XCircle,Pencil,Trash2,ToggleLeft,HelpCircle,ToggleRight,} from 'lucide-react';
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

const ProductListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    products,
    fetchProducts,
    deleteProduct,
    toggleProduct,
    stats,
    totalPages,
    loading,
    error,
  } = useProductStore();

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
        await fetchProducts(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load Products.');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, fetchProducts]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredProducts = products.filter((product) => {
    if (selectedFilter === 'active' && product.status !== 'active')
      return false;
    if (selectedFilter === 'inactive' && product.status !== 'inactive')
      return false;

    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brandId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.mainCategoryId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  });

  const calculateStats = (): StatFilter[] => {
    const total = stats.total;
    const active = stats.active;
    const inactive = stats.inactive;

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
        icon: <HelpCircle size={20} />,
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

  const handleToggleStatus = async (product: Product) => {
    const newStatus =
      product.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this Product?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleProduct(product._id!);
        await fetchProducts(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );
        toast.success(`Product ${action}d successfully!`);
      } catch {
        toast.error('Failed to update status.');
      }
    }
  };

  const handleDelete = (product: Product) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${product.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(product._id!);
          await fetchProducts(
            currentPage,
            PAGINATION_CONFIG.DEFAULT_LIMIT,
            selectedFilter
          );
          Swal.fire('Deleted!', 'The Prodcut has been removed.', 'success');
        } catch {
          toast.error('Failed to delete Product.');
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Products"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/products/add"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
           </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product: Product, index: number) => (
                  <tr key={product._id}>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {truncate(product.name, 40)}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.price}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.stockQuantity}
                    </td>

                    <td className="px-6 py-4">
                      {product.thumbnail ? (
                        <img
                          src={`http://localhost:5000${product.thumbnail}`}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded border"
                        />
                      ) : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={product.status === 'active'
                          ? 'text-green-600'
                          : 'text-gray-400'}
                      >
                        {product.status === 'active'
                          ? <ToggleRight size={20} />
                          : <ToggleLeft size={20} />}
                      </button>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-5">

                        <button
                          onClick={() => navigate(`/products/edit/${product._id}`)}
                          className="text-indigo-600 hover:text-indigo-800"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={15} />
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

export default ProductListTemplate;
