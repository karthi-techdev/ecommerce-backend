import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useCouponStore } from '../../../stores/CouponStore';
import type { Coupon } from '../../../types/common';
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

const CouponListTemplate: React.FC = () => {
  const navigate = useNavigate();
  const {
    coupons,
    fetchCoupons,
    softDeleteCoupon,
    toggleCouponStatus,
    loading,
    error,
    currentPage,
    totalPages,
    totalCoupons,
    totalActive,
    totalInactive,
  } = useCouponStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('total');

  const filteredCoupons =
    searchTerm.trim() === ''
      ? coupons
      : coupons.filter((coupon) =>
          coupon.code.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );

  useEffect(() => {
    fetchCoupons(1, PAGINATION_CONFIG.DEFAULT_LIMIT, selectedFilter)
      .catch(err => {
        toast.error(err?.message || 'Failed to load coupons.');
      });
  }, [fetchCoupons, selectedFilter]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePageChange = (selectedItem: { selected: number }) => {
    fetchCoupons(
      selectedItem.selected + 1,
      PAGINATION_CONFIG.DEFAULT_LIMIT,
      selectedFilter
    );
  };

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
    fetchCoupons(1, PAGINATION_CONFIG.DEFAULT_LIMIT, filter);
  };

  const statFilters: StatFilter[] = [
    {
      id: 'total',
      title: 'Total',
      value: totalCoupons,
      trend: 'up',
      change: '100%',
      icon: <RefreshCw size={20} />
    },
    {
      id: 'active',
      title: 'Active',
      value: totalActive,
      trend: 'up',
      change: `${totalCoupons ? Math.round((totalActive / totalCoupons) * 100) : 0}%`,
      icon: <CheckCircle size={20} />
    },
    {
      id: 'inactive',
      title: 'Inactive',
      value: totalInactive,
      trend: 'down',
      change: `${totalCoupons ? Math.round((totalInactive / totalCoupons) * 100) : 0}%`,
      icon: <XCircle size={20} />
    }
  ];

  const handleToggleStatus = async (coupon: Coupon) => {
    const action = coupon.isActive ? "deactivate" : "activate";
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${action} this coupon?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (result.isConfirmed) {
      try {
        await toggleCouponStatus(coupon._id!);
        toast.success(`Coupon ${action}d successfully!`);
      } catch {
        toast.error("Failed to update status.");
      }
    }
  };

  const handleSoftDelete = async (coupon: Coupon) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete this "${coupon.code}" `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await softDeleteCoupon(coupon._id!);
        toast.success('Coupon deleted successfully!');
      } catch {
        toast.error('Failed to delete the coupon.');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <TableHeader
        managementName="Coupon"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addButtonLabel="Add"
        addButtonLink="/coupon/add"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount Type</th>
<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount Value</th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No coupons available
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon, index) => (
                  <tr key={coupon._id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-red-700">
                      {coupon.code}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
  {coupon.discountType}
</td>

<td className="px-6 py-4 text-sm text-gray-900">
  {coupon.discountType === "percentage"
    ? `${coupon.discountValue}%`
    : `₹${coupon.discountValue}`}
</td>


                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(coupon)}
                        className={`transition ${
                          coupon.isActive
                            ? 'text-green-500 hover:text-green-700'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {coupon.isActive
                          ? <ToggleRight size={18} />
                          : <ToggleLeft size={18} />
                        }
                      </button>
                    </td>

                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => navigate(`/coupon/edit/${coupon._id}`)}
                        className="text-indigo-500 hover:text-indigo-700 p-2"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleSoftDelete(coupon)}
                        className="text-red-500 hover:text-orange-700 p-2"
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

export default CouponListTemplate;
