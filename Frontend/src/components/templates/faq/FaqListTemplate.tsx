import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useFaqStore } from '../../../stores/faqStore';
import type { Faq } from '../../../types/common';
import { HelpCircle, CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { truncate } from '../../utils/helper'
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const FaqListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    faqs,
    fetchFaqs,
    softDeleteFaq,
    toggleStatusFaq,faqStats,stats,
    totalPages,
    loading,
    error,
  } = useFaqStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  // Fetch data on page or filter change
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchFaqs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
        await faqStats();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load FAQs. Please try again.');
      }
    };
    loadData();
  }, [currentPage, selectedFilter, fetchFaqs]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle pagination
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Filter FAQs based on selected filter and search term
  const filteredFaqs = faqs.filter((faq) => {
    // Apply status filter
    if (selectedFilter === 'active' && faq.status !== 'active') return false;
    if (selectedFilter === 'inactive' && faq.status !== 'inactive') return false;

    // Apply search filter
    return faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
  });

  /**
   * Calculates statistics for FAQs including total count, active count, and percentages
   * @returns {StatFilter[]} Array of stat objects for display
   */
  const calculateStats = (): StatFilter[] => {
    const total = stats.total;
    const active = stats.active;
    const inactive = stats.inactive;

    // Calculate percentages with validation
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;
    const inactivePercent = total > 0 ? Math.round((inactive / total) * 100) : 0;

    return [
      {
        id: 'total',
        title: 'Total FAQs',
        value: total,
        trend: 'up' as const,
        change: '100%',
        icon: <HelpCircle size={20} />,
      },
      {
        id: 'active',
        title: 'Active FAQs',
        value: active,
        trend: 'up' as const,
        change: `${activePercent}%`,
        icon: <CheckCircle size={20} />,
      },
      {
        id: 'inactive',
        title: 'Inactive FAQs',
        value: inactive,
        trend: 'down' as const,
        change: `${inactivePercent}%`,
        icon: <XCircle size={20} />,
      },
    ];
  };

  const statFilters: StatFilter[] = calculateStats();

  // Handle status toggle
  const handleToggleStatus = async (faq: Faq) => {
    const newStatus = faq.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this FAQ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        await toggleStatusFaq(faq._id!);
        // Refresh the data to ensure UI is in sync with backend
        await fetchFaqs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
        await faqStats();
        toast.success(`FAQ ${action}d successfully!`);
      } catch (error) {
        toast.error('Failed to update status. Please try again.');
      }
    }
  };

  // Delete handler
  const handleDelete = (faq: Faq) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${faq.question}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await softDeleteFaq(faq._id!);

          const updatedLength = filteredFaqs.length - 1;
          const newTotalItems = faqs.length - 1;
          const newTotalPages = Math.ceil(newTotalItems / PAGINATION_CONFIG.DEFAULT_LIMIT);

          // Adjust current page if necessary
          if (updatedLength === 0 && currentPage > newTotalPages) {
            const newPage = Math.max(newTotalPages || 1, 1);
            setCurrentPage(newPage);
            // Fetch data for the new page
            await fetchFaqs(newPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
            await faqStats();
          } else {
            // Fetch updated data for current page
            await fetchFaqs(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter);
             await faqStats();
          }

          Swal.fire('Deleted!', 'The FAQ has been removed.', 'success');
        } catch (error) {
          toast.error('Failed to delete FAQ. Please try again.');
        }
      }
    });
  };



  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Faq"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/faq/add"
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as 'total' | 'active' | 'inactive');
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Answer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq: Faq, index: number) => (
                  <tr key={faq._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(faq.question, 40)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(faq.answer, 40)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(faq)}
                        className={`${faq.status === 'active' ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'} transition`}
                        title="Toggle Status"
                      >
                        {faq.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-3 items-center">
                      <button
                        onClick={() => navigate(`/faq/edit/${faq._id}`)}
                        className="bg-transparent text-indigo-500 hover:text-indigo-700 p-2 rounded"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
                        className="bg-transparent text-red-500 hover:text-red-700 p-2 rounded"
                        title="Delete"
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

export default FaqListTemplate;