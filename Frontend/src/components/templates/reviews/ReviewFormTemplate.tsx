import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import Loader from '../../atoms/Loader';
import type { FieldConfig } from '../../../types/common';
import { useReviewStore } from '../../../stores/reviewStore';
import { validateReviewForm } from '../../validations/reviewValidation';

const reviewFields: FieldConfig[] = [
    {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your name...',
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'Enter your email...',
    },
    {
        name: 'rating',
        label: 'Rating',
        type: 'select',
        options: [
            { label: '5 Stars', value: '5' },
            { label: '4 Stars', value: '4' },
            { label: '3 Stars', value: '3' },
            { label: '2 Stars', value: '2' },
            { label: '1 Star', value: '1' },
        ]
    },
    {
        name: 'comment',
        label: 'Your Review',
        type: 'textarea',
        placeholder: 'Write your thoughts about the product...',
    },
];

const ReviewFormTemplate: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const isEditMode = location.pathname.includes('/edit');
    const { addReview, fetchReviewById, updateReview } = useReviewStore();
    const [guestId, setGuestId] = useState<string>("");

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        website: '',
        rating: '5',
        comment: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

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
            if (isEditMode && id) {
                setPageLoading(true);
                try {
                    const data = await fetchReviewById(id);
                    if (data) {
                        setFormData({
                            name: data.name || '',
                            email: data.email || '',
                            website: data.website || '',
                            rating: String(data.rating || '5'),
                            comment: data.comment || '',
                        });
                    }
                } catch (error) {
                    toast.error("Failed to load review data");
                } finally {
                    setPageLoading(false);
                }
            }
        };
        loadData();
    }, [id, isEditMode, fetchReviewById]);

    const handleChange = (e: { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            const fieldErrors = validateReviewForm({ ...formData, [name]: value } as any);
            setErrors((prev: any) => ({
                ...prev,
                [name]: fieldErrors[name as keyof typeof fieldErrors]
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors = validateReviewForm(formData as any);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fix the errors in the form");
            return;
        }

        if (!id) {
            toast.error("Product ID missing!");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                rating: Number(formData.rating),
            };

            if (isEditMode) {
                await updateReview(id, payload);
                toast.success('Review updated successfully');
            } else {
                await addReview({
                    ...payload,
                    productId: id,
                    userId: guestId,
                    status: 'inactive'
                });
                toast.success('Review submitted successfully');
            }

            navigate('/reviews');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Something went wrong';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (pageLoading) return <Loader />;

    return (
        <div className="p-6">
            <FormHeader
                managementName="Product Reviews"
                addButtonLink="/reviews"
                type={isEditMode ? "Edit" : "Add"}
            />

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                    {reviewFields.map((field) => (
                        <div key={field.name}>
                            <FormField
                                field={{ ...field, className: 'w-full' }}
                                value={formData[field.name as keyof typeof formData]}
                                onChange={handleChange}
                                error={errors[field.name]}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/reviews')}
                        className="py-2 px-4 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Saving...
                            </div>
                        ) : (
                            isEditMode ? 'Update Review' : 'Save Review'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewFormTemplate;