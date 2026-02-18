import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useTestimonialStore } from '../../../stores/testimonialStore';
import type { Testimonial } from '../../../types/common';
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

const TestimoialListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    testimonials,
    fetchTestimonial,
    softDeleteTestimonial,
    toggleTestimonialStatus,
    loading,
    error,
    currentPage,
    totalPages,
    totalTestimonial,
    totalActive,
    totalInactive,

  } = useTestimonialStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  const filteredTestimonials =
    searchTerm.trim() === ''
      ? testimonials
      : testimonials.filter((testimonial) =>
        testimonial.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );

  useEffect(() => {
    fetchTestimonial(1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter).catch(err => {
      toast.error(err?.message || 'Failed to load Testimonial');
    });
  }, [fetchTestimonial, selectedFilter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchTestimonial(selectedItem.selected + 1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
  };
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    fetchTestimonial(1, PAGINATION_CONFIG.DEFAULT_LIMIT, filter);
  };
  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'Total',
      value: totalTestimonial,
      trend: 'up',
      change: '100%',
      icon: <RefreshCw size={20} />
    },
    {
      id: 'active',
      title: 'Active',
      value: totalActive,
      trend: 'up',
      change: `${totalTestimonial ? Math.round((totalActive / totalTestimonial) * 100) : 0}%`,
      icon: <CheckCircle size={20} />
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: totalInactive,
      trend: 'down',
      change: `${totalTestimonial ? Math.round((totalInactive / totalTestimonial) * 100) : 0}%`,
      icon: <XCircle size={20} />
    }
  ];

  const handleToggleStatus = async (testimonial: Testimonial) => {
    const action = testimonial.isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this Testimonial?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleTestimonialStatus(testimonial._id!);
        toast.success(`Testimonial ${action}d successfully!`);
      } catch {
        toast.error("Failed to update status.");
      }
    }
  };

  const handleSoftDelete = async (testimonial: Testimonial) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `This will  delete "${testimonial.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete!',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteTestimonial(testimonial._id!);
        toast.success('Testimonial delete successfully!');
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <Loader />;


  return (
    <div className="p-6">
      <TableHeader
        managementName="Testimonial"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/testimonial/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => handleFilterChange(id as FilterType)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No testimonials available
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((testimonial, index) => (
                  <tr key={testimonial._id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {testimonial.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {testimonial.designation || '-'}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      <img
                        src={`http://localhost:5000/${testimonial.image}`}
                        alt={testimonial.name}
                        className="w-12 h-12 object-cover rounded-md border border-gray-200"
                      />
                    </td>


                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= (testimonial.rating ?? 0) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>

                    </td>

                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(testimonial)}
                        className={`transition ${testimonial.isActive
                            ? 'text-green-500 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        {testimonial.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>

                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => navigate(`/testimonial/edit/${testimonial._id}`)}
                        className="text-indigo-500 hover:text-indigo-700 p-2"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleSoftDelete(testimonial)}
                        className="text-orange-500 hover:text-orange-700 p-2"
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

export default TestimoialListTemplate;

