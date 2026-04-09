import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import TableHeader from '../../molecules/TableHeader';
import Loader from '../../atoms/Loader';
import Pagination from '../../atoms/Pagination';
import { useReviewStore } from '../../../stores/reviewStore';
import { Star, Trash2, MessageSquare, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { truncate } from '../../utils/helper';
import { PAGINATION_CONFIG } from '../../../constants/pagination';

const ReviewListTemplate: React.FC = () => {
    const navigate = useNavigate();
    const [guestId, setGuestId] = useState<string>("");
    const {
        reviews,
        fetchReviews,
        deleteReview,
        updateReviewStatus,
        totalPages,
        loading,
        stats,
    } = useReviewStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(PAGINATION_CONFIG.DEFAULT_PAGE);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        let id = localStorage.getItem("guestId");

        if (!id) {
            id = "guest_" + Date.now();
            localStorage.setItem("guestId", id);
        }

        setGuestId(id);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchReviews(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
            } catch (err: any) {
                toast.error(err?.message || 'Failed to load reviews.');
            }
        };
        loadData();
    }, [currentPage, fetchReviews]);

    const handleStatusToggle = async (review: any) => {
        if (!review._id) return;
        const newStatus = review.status === 'active' ? 'inactive' : 'active';
        const actionText = newStatus === 'active' ? 'activate' : 'deactivate';
        const successToast = newStatus === 'active'
            ? 'Review activated successfully!'
            : 'Review deactivated successfully!';

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${actionText} this review?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'active' ? '#10b981' : '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${actionText} it!`
        });

        if (result.isConfirmed) {
            setUpdatingId(review._id);
            try {
                await updateReviewStatus(review._id, newStatus);
                toast.success(successToast);
                // toast.success(`Review updated!`);
                await fetchReviews(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
            } catch (error: any) {
                toast.error("Status update failed");
            } finally {
                setUpdatingId(null);
            }
        }
    };

    const handlePageChange = (selectedItem: { selected: number }) => {
        setCurrentPage(selectedItem.selected + 1);
    };

    const handleDelete = (review: any) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete review from "${review.name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteReview(review._id, guestId);
                    await fetchReviews(currentPage, PAGINATION_CONFIG.DEFAULT_LIMIT);
                    Swal.fire('Deleted!', 'Review has been removed.', 'success');
                } catch (error) {
                    toast.error('Failed to delete review.');
                }
            }
        });
    };

    const filteredReviews = reviews.filter((rev) =>
        rev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rev.email && rev.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const statFilters = [
        {
            id: 'total',
            title: 'Total Reviews',
            value: stats?.total || reviews.length || 0,
            trend: 'up' as const,
            change: 'Overall',
            icon: <MessageSquare size={20} />,
        }
    ];

    if (loading && !updatingId) return <Loader />;

    return (
        <div className="p-6">
            <TableHeader
                managementName="Product Reviews"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statFilters={statFilters}
                selectedFilterId="total"
                onSelectFilter={() => { }}
            />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.NO</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">No reviews found</td>
                                </tr>
                            ) : (
                                filteredReviews.map((review, index) => (
                                    <tr key={review._id} className={updatingId === review._id ? "opacity-50 pointer-events-none" : ""}>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(currentPage - 1) * PAGINATION_CONFIG.DEFAULT_LIMIT + index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                            {review.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {review.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {review.website ? (
                                                <a href={review.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline font-medium">
                                                    <Globe size={14} /> View Site
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 italic text-xs">No Site</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md w-fit font-bold">
                                                {review.rating} <Star size={14} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span title={review.comment}>
                                                "{truncate(review.comment, 35)}"
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleStatusToggle(review)}
                                                disabled={updatingId === review._id}
                                                className={`focus:outline-none transition-all transform active:scale-90 ${updatingId === review._id ? "opacity-50 cursor-not-allowed" : ""}`}
                                            >
                                                {review.status === 'active' ? (
                                                    <ToggleRight size={20} className="text-green-500" />
                                                ) : (
                                                    <ToggleLeft size={20} className="text-gray-300" />
                                                )}
                                            </button>
                                        </td>


                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleDelete(review)}
                                                className="text-red-500 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                                title="Delete review"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReviewListTemplate;