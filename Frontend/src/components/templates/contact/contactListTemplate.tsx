import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useContactStore } from '../../../stores/contactStore';
import type { Contact } from '../../../types/common';
import { User, CheckCircle, XCircle, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
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

const ContactListTemplate: React.FC = () => {
  const navigate = useNavigate();

  const {
    contacts,
    fetchContacts,
    deleteContact,
    toggleStatusContact,
    totalPages,
    loading,
    error,
  } = useContactStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
  const [selectedFilter, setSelectedFilter] = useState<'total' | 'active' | 'inactive'>('total');
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchContacts(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load contacts');
      }
    };
    loadData();
  }, [currentPage, fetchContacts]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const filteredData = contacts
  .filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((item) => {
    if (selectedFilter === 'active') return item.status === 'active';
    if (selectedFilter === 'inactive') return item.status === 'inactive';
    return true; // total
  });

  const { stats } = useContactStore();

const statFilters: StatFilter[] = [
  {
    id: 'total',
    title: 'Total Contacts',
    value: stats.total,
    trend: 'up',
    change: '100%',
    icon: <User size={20} />,
  },
  {
    id: 'active',
    title: 'Active',
    value: stats.active,
    trend: 'up',
    change: '',
    icon: <CheckCircle size={20} />,
  },
  {
    id: 'inactive',
    title: 'Inactive',
    value: stats.inactive,
    trend: 'down',
    change: '',
    icon: <XCircle size={20} />,
  },
];

  const handleToggleStatus = async (item: Contact) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this contact?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleStatusContact(item._id!);
        await fetchContacts(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
        toast.success(`Contact ${action}d successfully!`);
      } catch {
        toast.error('Failed to update status');
      }
    }
  };

  const handleDelete = (item: Contact) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${item.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteContact(item._id!);
          await fetchContacts(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
          Swal.fire('Deleted!', 'Contact removed.', 'success');
        } catch {
          toast.error('Failed to delete contact');
        }
      }
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 ">
      <TableHeader
        managementName="Contact"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel=""
        addButtonLink=""
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => setSelectedFilter(id as any)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            {/* Header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 text-sm font-medium text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"> 
                      <a href={`mailto:${item.email}`} className="text-indigo-600 hover:underline">{item.email}</a>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900"> 
                      <a href={`tel:${item.phone}`} className="text-indigo-600 hover:underline">{item.phone}</a>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.subject}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {truncate(item.message, 30)}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <button onClick={() => handleToggleStatus(item)}>
                        {item.status === 'active' ? (
                          <ToggleRight className="text-green-500" size={18} />
                        ) : (
                          <ToggleLeft className="text-gray-400" size={18} />
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => navigate(`/contact/edit/${item._id}`)}
                          className="text-indigo-500"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-500"
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

      {/* Pagination */}
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

export default ContactListTemplate;