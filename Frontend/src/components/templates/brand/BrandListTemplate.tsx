import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useBrandStore } from '../../../stores/brandStore';
import type { Brand } from '../../../types/common';
import { CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

type FilterType = 'total' | 'active' | 'inactive';

const BrandListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    brands,
    fetchBrands,
    softDeleteBrand,
    toggleBrandStatus,
    loading,
    error,
    currentPage,
    totalPages,
    totalBrands,
    totalActive,
    totalInactive,
  } = useBrandStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  useEffect(() => {
    fetchBrands(1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter).catch(err => {
      toast.error(err?.message || 'Failed to load brands.');
    });
  }, [fetchBrands, selectedFilter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchBrands(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
  };

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    fetchBrands(1, PAGINATION_CONFIG.DEFAULT_LIMIT, filter);
  };

  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'Total',
      value: totalBrands,
      trend: 'up',
      change: '100%',
      icon: <RefreshCw size={20} />
    },
    {
      id: 'active',
      title: 'Active',
      value: totalActive,
      trend: 'up',
      change: `${totalBrands ? Math.round((totalActive / totalBrands) * 100) : 0}%`,
      icon: <CheckCircle size={20} />
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: totalInactive,
      trend: 'down',
      change: `${totalBrands ? Math.round((totalInactive / totalBrands) * 100) : 0}%`,
      icon: <XCircle size={20} />
    }
  ];

 const handleToggleStatus = async (brand: Brand) => {
  console.log("Clicked brand:", brand);
  const action = brand.isActive ? "deactivate" : "activate";
  const result = await Swal.fire({
    title: "Are you sure?",
    text: `Do you want to ${action} this brand?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: `Yes, ${action} it!`,
  });

  if (result.isConfirmed) {
    try {
      await toggleBrandStatus(brand._id!);
      toast.success(`Brand ${action}d successfully!`);
    } catch {
      toast.error("Failed to update status.");
    }
  }
};



  const handleSoftDelete = async (brand: Brand) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will move "${brand.name}" to Trash.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, move to trash!',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteBrand(brand._id!);
        toast.success('Brand moved to trash successfully!');
      } catch {
        toast.error('Failed to move brand to trash.');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Brand"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/brand/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => handleFilterChange(id as FilterType)}

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No brands available
                  </td>
                </tr>
              ) : (
                brands.map((brand, index) => (
                  <tr key={brand._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
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
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(brand)}
                        className={`transition ${brand.isActive ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Toggle Status"
                      >
                        {brand.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <button
                        onClick={() => navigate(`/brand/edit/${brand._id}`)}
                        className="bg-transparent text-indigo-500 hover:text-indigo-700 p-2 rounded"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleSoftDelete(brand)}
                        className="bg-transparent text-orange-500 hover:text-orange-700 p-2 rounded"
                        title="Move to Trash"
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

export default BrandListTemplate;
