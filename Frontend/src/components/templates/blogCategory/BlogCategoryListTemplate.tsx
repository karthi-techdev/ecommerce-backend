import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import { ToggleLeft, ToggleRight, Pencil, Trash2, List, CheckCircle, XCircle } from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

type FilterType = 'total' | 'active' | 'inactive';

const BlogCategoryListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    blogCategories,
    fetchBlogCategories,
    softDeleteBlogCategory,
    toggleBlogCategoryStatus,
    loading,
    currentPage,
    totalPages,
    totalBlogCategories,
    totalActive,
    totalInactive,
  } = useBlogCategoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  useEffect(() => {
    fetchBlogCategories(1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
  }, []);

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Move "${name}" to trash?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, move',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteBlogCategory(id);
        toast.success(`"${name}" moved to trash`);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete');
      }
    }
  };

  const handleToggleStatus = async (id: string, name: string, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate';
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} "${name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (result.isConfirmed) {
      try {
        await toggleBlogCategoryStatus(id);
        toast.success(`"${name}" ${action}d successfully`);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to update status');
      }
    }
  };

  const handlePageChange = (selectedItem: { selected: number }) =>
    fetchBlogCategories(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Blog Category"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/blog-category/add"
        statFilters={[
          {
            id: 'total',
            title: 'Total',
            value: totalBlogCategories,
            trend: 'up',
            change: '100%',
            icon: <List size={20} />,
          },
          {
            id: 'active',
            title: 'Active',
            value: totalActive,
            trend: 'up',
            change: `${totalBlogCategories ? Math.round((totalActive / totalBlogCategories) * 100) : 0}%`,
            icon: <CheckCircle size={20} />,
          },
          {
            id: 'inactive',
            title: 'Inactive',
            value: totalInactive,
            trend: 'down',
            change: `${totalBlogCategories ? Math.round((totalInactive / totalBlogCategories) * 100) : 0}%`,
            icon: <XCircle size={20} />,
          },
        ]}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => setSelectedFilter(id as FilterType)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-4">
                  No data to display.
                </td>
              </tr>
            ) : (
              blogCategories.map((category, index) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 text-gray-700">
                    {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                  </td>
                  <td className="px-6 py-4 text-gray-700">{category.name || '-'}</td>
                  <td className="px-6 py-4 text-gray-700">{category.slug || '-'}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(category._id!, category.name!, category.isActive)}
                      className="transition"
                    >
                      {category.isActive ? (
                        <ToggleRight size={18} className="text-green-500" />
                      ) : (
                        <ToggleLeft size={18} className="text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/blog-category/edit/${category._id}`)}
                      className="text-indigo-500 hover:text-indigo-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id!, category.name!)}
                      className="text-red-500 hover:text-red-700"
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
          <Pagination pageCount={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default BlogCategoryListTemplate;