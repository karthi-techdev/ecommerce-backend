import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useOfferStore } from '../../../stores/offerStore';
import type { Offer } from '../../../types/common';
import {
  Tag,
  CheckCircle,
  XCircle,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

const OfferListTemplate: React.FC = () => {

  const navigate = useNavigate();

  const {
    offers,
    fetchOffers,
    permanentDeleteOffer,
    toggleOfferStatus,
    stats,
    totalPages,
    loading,
    error
  } = useOfferStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(
    PAGINATION_CONFIG.DEFAULT_PAGE
  );

  type FilterType = 'total' | 'active' | 'inactive';
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  useEffect(() => {

    const loadData = async () => {

      try {

        await fetchOffers(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter === 'total' ? undefined : selectedFilter
        );

      } catch (err: any) {

        toast.error(err?.message || 'Failed to load Offers.');

      }

    };

    loadData();

  }, [currentPage, selectedFilter, fetchOffers]);

  useEffect(() => {

    if (error) toast.error(error);

  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {

    setCurrentPage(selectedItem.selected + 1);

  };

  const calculateStats = (): StatFilter[] => {

    const total = stats?.total || 0;
    const active = stats?.active || 0;
    const inactive = stats?.inactive || 0;

    return [

      {
        id: 'total',
        title: 'Total Offers',
        value: total,
        trend: 'up',
        change: '100%',
        icon: <Tag size={20} />
      },

      {
        id: 'active',
        title: 'Active',
        value: active,
        trend: 'up',
        change: `${total > 0 ? Math.round((active / total) * 100) : 0}%`,
        icon: <CheckCircle size={20} />
      },

      {
        id: 'inactive',
        title: 'Inactive',
        value: inactive,
        trend: 'down',
        change: `${total > 0 ? Math.round((inactive / total) * 100) : 0}%`,
        icon: <XCircle size={20} />
      }

    ];

  };

  const filteredOffers = offers
    .filter((offer) => {

      if (selectedFilter === 'active') return offer.isActive === true;
      if (selectedFilter === 'inactive') return offer.isActive === false;

      return true;

    })
    .filter((offer) => {

      const search = searchTerm.toLowerCase();

      return (
        offer.name?.toLowerCase().includes(search) ||
        offer.buttonName?.toLowerCase().includes(search)
      );
    });

  const handleToggleStatus = async (offer: Offer) => {
    const action = offer.isActive ? 'deactivate' : 'activate';
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${action} this offer?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        await toggleOfferStatus(offer._id!);
        await fetchOffers(
          currentPage,
          PAGINATION_CONFIG.DEFAULT_LIMIT,
          selectedFilter === 'total' ? undefined : selectedFilter
        );
        toast.success(`Offer ${action}d successfully!`);
      } catch {
        toast.error('Failed to update status.');
      }
    }
  };

  const handleDelete = (offer: Offer) => {

    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${offer.name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {

      if (result.isConfirmed) {

        try {

          await permanentDeleteOffer(offer._id!);
          await fetchOffers(
            currentPage,
            PAGINATION_CONFIG.DEFAULT_LIMIT,
            selectedFilter === 'total' ? undefined : selectedFilter
          );
          Swal.fire('Deleted!', 'The offer has been removed.', 'success');
        } catch {
          toast.error('Failed to delete Offer.');
        }
      }
    });
  };
  if (loading) return <Loader />;
  return (
    <div className="p-6">
      <TableHeader
        managementName="Offers"
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        addButtonLabel="Add"
        addButtonLink="/offer/add"
        statFilters={calculateStats()}
        selectedFilterId={selectedFilter}
        onSelectFilter={(id) => {
          setSelectedFilter(id as FilterType);
          setCurrentPage(1);
        }}
      />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Button Text</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No offers available
                  </td>

                </tr>

              ) : (

                filteredOffers.map((offer: Offer, index: number) => (
                  <tr key={offer._id}>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {offer.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {offer.buttonName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-bold">
                        {offer.products?.length || 0} Products
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(offer)}
                        className={offer.isActive ? 'text-green-600' : 'text-gray-400'}
                      >
                        {offer.isActive
                          ? <ToggleRight size={24} />
                          : <ToggleLeft size={24} />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => navigate(`/offer/edit/${offer._id}`)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(offer)}
                          className="text-red-600 hover:text-red-800"
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

export default OfferListTemplate;
