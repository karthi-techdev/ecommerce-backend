import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Loader from '../../../atoms/Loader';
import Pagination from '../../../atoms/Pagination';
import TableHeader from '../../../molecules/TableHeader';
import { useContactStore } from '../../../../stores/contactStore'; // Adjusted store
import type { Contact } from '../../../../types/common';
import { Trash2 } from 'lucide-react';
import { FiRefreshCw } from "react-icons/fi";
import { PAGINATION_CONFIG } from '../../../../constants/pagination';
import { truncate } from '../../../utils/helper';

const ContactTrashListTemplate: React.FC = () => {
  const {
    trashContacts,
    fetchTrashContacts,
    restoreContact,
    permanentDeleteContact,
    trashTotalPages,
    loading,
    error,
  } = useContactStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);

  // Fetch trash contacts on component mount and page change
  useEffect(() => {
    fetchTrashContacts(
      currentPage,
      PAGINATION_CONFIG.DEFAULT_LIMIT
    );
  }, [currentPage, fetchTrashContacts]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  // Local filtering based on name or email
  const filteredData = trashContacts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = async (item: Contact) => {
    const result = await Swal.fire({
      title: 'Restore?',
      text: `Restore contact from "${item.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, restore',
    });

    if (!result.isConfirmed) return;

    try {
      await restoreContact(item._id!);
      toast.success('Contact restored successfully');
      // Refresh list after restoration
      fetchTrashContacts(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Restore failed';
      toast.error(msg);
    }
  };

  const handlePermanentDelete = async (item: Contact) => {
    const result = await Swal.fire({
      title: 'Delete permanently?',
      text: 'This will permanently delete the Category.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6e7881',
      confirmButtonText: 'Yes, Delete it!',
    });

    if (!result.isConfirmed) return;

    try {
      await permanentDeleteContact(item._id!);
      toast.success('Contact permanently deleted');
      // Refresh list after hard delete
      fetchTrashContacts(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Delete failed';
      toast.error(msg);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Contact Trash"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Back to Contacts"
        addButtonLink="/contacts" 
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  Trash is empty
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {(index + 1) + (currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {truncate(item.subject || '-', 25)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleRestore(item)}
                        title="Restore Contact"
                        className="text-green-600 hover:text-green-800 hover:scale-110 transition"
                      >
                        <FiRefreshCw size={18} />
                      </button>

                      <button
                        onClick={() => handlePermanentDelete(item)}
                        title="Delete Permanently"
                        className="text-red-600 hover:text-red-800 hover:scale-110 transition"
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

      {trashTotalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            pageCount={trashTotalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ContactTrashListTemplate;