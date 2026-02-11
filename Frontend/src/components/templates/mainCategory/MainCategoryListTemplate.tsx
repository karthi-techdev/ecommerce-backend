import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../atoms/Loader';
import TableHeader from '../../molecules/TableHeader';
import Pagination from '../../atoms/Pagination';
import { useMainCategoryStore } from '../../../stores/mainCategoryStore';
import type { MainCategory } from '../../../types/common';
import {
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  HelpCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';
import ImportedURL from '../../../common/urls';

const MainCategoryListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    mainCategories,
    stats,
    fetchCategories,
    deleteCategory,
    toggleCategoryStatus,
    totalPages,
    loading,
    error,
  } = useMainCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );
  const getStatusFromFilter = (
    filter: 'total' | 'active' | 'inactive'
  ): 'total' | 'active' | 'inactive' => {
    return filter;
  };

  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  useEffect(() => {
    fetchCategories(
      currentPage,
      PAGINATION_CONFIG.DEFAULT_LIMIT,
      selectedFilter
    );
  }, [currentPage, selectedFilter]);



  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };


  const handleToggleStatus = async (category: MainCategory) => {
    const action = category.isActive ? 'hide' : 'show';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this category?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    });

    if (result.isConfirmed) {
      try {
        await toggleCategoryStatus(category._id!);
        toast.success(`Category ${action}d successfully`);

        setCurrentPage(1); 

        await fetchCategories(
          1,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter
        );

      } catch {
        toast.error('Failed to update status');
      }
    }
  };

  const handleDelete = async (category: MainCategory) => {
    const result = await Swal.fire({
      title: 'Delete category?',
      text: category.name,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    });

    if (result.isConfirmed) {
      await deleteCategory(category._id!);

      setCurrentPage(1); 

      await fetchCategories(
        1,
        PAGINATION_CONFIG.DEFAULT_LIMIT,
        selectedFilter
      );

      toast.success('Main Category deleted');

    }
  };

  if (loading) return <Loader />;

  const statFilters = [
    {
      id: 'total',
      title: 'Total',
      value: stats.total,
      icon: <HelpCircle size={20} />,
    },
    {
      id: 'active',
      title: 'Active',
      value: stats.active,
      icon: <CheckCircle size={20} />,
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: stats.inactive,
      icon: <XCircle size={20} />,
    },
  ];
  const filteredCategories = mainCategories.filter((category) => {
  if (selectedFilter === 'active') return category.isActive === true;
  if (selectedFilter === 'inactive') return category.isActive === false;
  return true; 
});


  return (
    <div className="p-6">
      <TableHeader
        managementName="Main Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/main-category/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as FilterType);
          setCurrentPage(1);
          setSearchTerm(''); 
        }}
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
                STATUS
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
                  colSpan={6}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              filteredCategories.map((category, index) => (
                <tr key={category._id} className="text-sm text-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggleStatus(category)}>
                      {category.isActive ? (
                        <ToggleRight className="text-green-500" />
                      ) : (
                        <ToggleLeft className="text-gray-400" />
                      )}
                    </button>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                    <button
                      className="text-indigo-500 hover:text-indigo-700"
                      onClick={() =>
                        navigate(`/main-category/edit/${category._id}`)
                      }
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(category)}
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

export default MainCategoryListTemplate;
