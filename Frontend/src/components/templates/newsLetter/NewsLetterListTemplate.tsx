import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useNewsLetterStore } from '../../../stores/newsLetterStore';
import type { NewsLetter } from '../../../types/common';
import { HelpCircle, Pencil, Trash2 } from 'lucide-react';
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

const NewsLetterListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    newsLetters,
    fetchNewsLetters,
    deleteNewsLetter,
    totalPages,
    loading,
    error,
  } = useNewsLetterStore();

  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);

  // Fetch data on page change
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchNewsLetters(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load NewsLetters.');
      }
    };
    loadData();
  }, [currentPage, fetchNewsLetters]);

  // Show error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const calculateStats = (): StatFilter[] => {
    const total = newsLetters.length;

    return [
      {
        id: 'total',
        title: 'Total NewsLetters',
        value: total,
        trend: 'up' as const,
        change: '100%',
        icon: <HelpCircle size={20} />,
      },
    ];
  };

  const statFilters: StatFilter[] = calculateStats();

  // Delete handler
  const handleDelete = (newsLetter: NewsLetter) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${newsLetter.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteNewsLetter(newsLetter._id!);
          Swal.fire('Deleted!', 'The NewsLetter has been removed.', 'success');
        } catch (err) {
          toast.error('Failed to delete NewsLetter. Please try again.');
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="NewsLetter"
        addButtonLabel="Add"
        addButtonLink="/newsLetters/add"
        statFilters={statFilters}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Newsletter Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">isPublished</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {newsLetters.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                newsLetters.map((newsLetter: NewsLetter, index: number) => (
                  <tr key={newsLetter._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(newsLetter.name, 40)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {truncate(newsLetter.slug, 40)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {newsLetter.isPublished ? "true" : "false"}
                    </td>
                    <td className="px-4 py-2 flex gap-3 items-center">
                      <button
                        onClick={() => navigate(`/newsLetters/edit/${newsLetter._id}`)}
                        className="bg-transparent text-indigo-500 hover:text-indigo-700 p-2 rounded"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(newsLetter)}
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

export default NewsLetterListTemplate;
