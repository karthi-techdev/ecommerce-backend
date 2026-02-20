import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateFaqForm, type FaqFormData, type ValidationErrors } from '../../validations/faqValidation';
import { useFaqStore } from '../../../stores/faqStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';

const faqFields: FieldConfig[] = [
  {
    name: 'question',
    label: 'Question',
    type: 'textarea',
    placeholder: 'Enter your question...',
  },
  {
    name: 'answer',
    label: 'Answer',
    type: 'textarea',
    placeholder: 'Enter the answer...',
  },
];

const FaqFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchFaqById, addFaq, updateFaq } = useFaqStore();
  const [formData, setFormData] = useState<FaqFormData>({
    question: '',
    answer: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const faq = await fetchFaqById(id);
        if (faq) {
          setFormData({
            question: faq.question || '',
            answer: faq.answer || ''
          });
        } else {
          toast.error('Failed to load FAQ data');
        }
      }
    };
    fetchData();
  }, [id, fetchFaqById]);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldValidationErrors = validateFaqForm({
      ...formData,
      [name]: value
    });

    // Update only the error for the changed field
    setErrors(prev => ({
      ...prev,
      [name]: fieldValidationErrors[name as keyof ValidationErrors]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateFaqForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await updateFaq(id, formData);
        toast.success('FAQ updated successfully');
      } else {
        await addFaq({ ...formData, status: 'active' });
        toast.success('FAQ added successfully');
      }
      navigate('/faq');
    }catch (error: any) {
  const message =
    typeof error === "string"
      ? error
      : error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

  toast.error(message);
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="FAQ"
        addButtonLink="/faq"
        type={id ? 'Edit' : 'Add'}
      />
      <form onSubmit={handleSubmit} data-testid="faq-form" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {faqFields.map((field) => (
            <FormField
              key={field.name}
              field={{
                ...field,
                className: 'w-full'
              }}
              value={formData[field.name as keyof FaqFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ValidationErrors]}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FaqFormTemplate;