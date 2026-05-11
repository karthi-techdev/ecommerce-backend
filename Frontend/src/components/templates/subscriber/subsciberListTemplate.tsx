import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useSubscriberStore } from '../../../stores/subscriberStore';
import { PAGINATION_CONFIG } from '../../../constants/pagination';
import { HelpCircle, ToggleRight, ToggleLeft, Trash2 , CheckCircle, XCircle} from 'lucide-react';
import type { SubscriberFormData } from '@/types/common';

const SubscriberListTemplate: React.FC = () => {
  type FilterType = 'total' | 'active' | 'inactive';

  const {
    subscriber,
    fetchAllSubscriber,
    DeleteSubscriber,
    toggleStatus,
    totalPages,
    loading,
    error,
    stats,
  } = useSubscriberStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);


  useEffect(() => {
  const loadData = async () => {
    try {
      await fetchAllSubscriber(
        currentPage,
        PAGINATION_CONFIG.DEFAULT_LIMIT,
        selectedFilter 
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load Subscribers');
    }
  };
  loadData();
}, [currentPage, selectedFilter])

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const statFilters = [
  {
    id: "total",
    title: "Total",
    value: stats.total,
    trend: "up" as const,
    change: "100%",
    icon: <HelpCircle size={20} />,
  },
  {
    id: "active",
    title: "Active",
    value: stats.active,
    trend: "up" as const,
    change: `${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}%`,
    icon: <CheckCircle size={20} />,
  },
  {
    id: "inactive",
    title: "Inactive",
    value: stats.inactive,
    trend: "down" as const,
    change: `${stats.total ? Math.round((stats.inactive / stats.total) * 100) : 0}%`,
    icon: <XCircle size={20} />,
  },
];

  const filteredSubscribers = subscriber.filter((item) =>
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = async (subscriber: SubscriberFormData) => {
    const action = subscriber.isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this Subscriber?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleStatus(subscriber._id!);
        toast.success(`Subscriber ${action}d successfully!`);
      } catch {
        toast.error("Failed to update status.");
      }
    }
  };

  const handleHardDelete = async (subscriber: SubscriberFormData) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `This will  delete `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
      });
  
      if (result.isConfirmed) {
        try {
          await DeleteSubscriber(subscriber._id!);
          toast.success('Subscriber delete successfully!');
        } catch {
          toast.error('Failed to delete');
        }
      }
    };

  if (loading) return <Loader />;

  return (
    <div className="p-6">

      <TableHeader
        managementName="Subscriber"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel=""
        addButtonLink=""
        statFilters={statFilters}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => setSelectedFilter(id as FilterType)}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">

            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>

              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((item, index) => (
                  <tr key={index}>

                    {/* S.NO */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    {/* EMAIL */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.email}
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                     {/* STATUS */}
                    <td className="px-6 py-4 text-sm ">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`transition ${item.isActive
                            ? 'text-green-500 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                          }`}
                      >
                        {item.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                      </button>
                    </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                      <button
                        onClick={() => handleHardDelete(item)}
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

export default SubscriberListTemplate;