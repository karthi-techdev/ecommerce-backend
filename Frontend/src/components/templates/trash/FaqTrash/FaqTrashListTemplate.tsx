import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Loader from '../../../atoms/Loader';
import Pagination from '../../../atoms/Pagination';
import TableHeader from '../../../molecules/TableHeader';
import { useFaqStore } from '../../../../stores/faqStore';
import type { Faq, SubCategory } from '../../../../types/common';
import { Trash2 } from 'lucide-react';
import { FiRefreshCw } from "react-icons/fi";
import { PAGINATION_CONFIG } from '../../../../constants/pagination';
import ImportedURL from '../../../../common/urls';
import { truncate } from '../../../utils/helper';
import { useMainCategoryStore } from '../../../../stores/mainCategoryStore';


const FaqTrashListTemplate: React.FC = () => {
  const {
    trashFaq,
    fetchTrashFaq,
    restoreFaq,
    permanantDeleteFaq,
    totalPages,
    loading,
    error,
  } = useFaqStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
  useEffect(() => {
    fetchTrashFaq(
      currentPage,
      PAGINATION_CONFIG.DEFAULT_LIMIT
    );
  }, [currentPage, fetchTrashFaq]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredData = trashFaq.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (item: Faq) => {
    const result = await Swal.fire({
      title: 'Restore?',
      text: `Restore "${item.question}" from trash?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, restore',
    });

    if (!result.isConfirmed) return;

    try {
      await restoreFaq(item._id!);
      toast.success('Faq restored');
      fetchTrashFaq(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch {
      toast.error('Restore failed');
    }
  };

  const handlePermanentDelete = async (item: Faq) => {
    const result = await Swal.fire({
      title: 'Delete permanently?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Delete',
    });

    if (!result.isConfirmed) return;

    try {
      await permanantDeleteFaq(item._id!);
      toast.success('Deleted permanently');
      fetchTrashFaq(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Faq"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Faq"
        addButtonLink="/faq"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Answer</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  Trash is empty
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    {(index + 1) +
                      (currentPage - 1) *
                        PAGINATION_CONFIG.DEFAULT_LIMIT}
                  </td>
                  <td className="px-6 py-4">{item.question}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{truncate(item.answer || '-', 30)}</td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleRestore(item)}
                        title="Restore"
                        className="text-green-600 hover:scale-110 transition"
                      >
                        <FiRefreshCw size={18} />
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(item)}
                        title="Delete Permanently"
                        className="text-red-600 hover:scale-110 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default FaqTrashListTemplate;
