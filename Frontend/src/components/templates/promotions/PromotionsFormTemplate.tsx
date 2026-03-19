import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validatePromotionsForm, type PromotionsFormData, type ValidationErrors } from '../../validations/promotionsValidation';
import { usePromotionsStore } from '../../../stores/promotionsStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import ImportedURL from '../../../common/urls';

const promotionsFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter promotion name...',
  },
  {
    name: 'image',
    label: 'Image',
    type: 'file',
    previewEnabled: true,
    accept: "image/png,image/jpeg,image/jpg,image/webp"
  },
  // {
  //   name: 'isActive',
  //   label: 'Status',
  //   type: 'checkbox',
  // },
];


const PromotionsFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchPromotionsById, addPromotions, updatePromotions } = usePromotionsStore();

  const [formData, setFormData] = useState({
    name: '',
    image: null,
    isActive: true
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing promotion if editing
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const promotion = await fetchPromotionsById(id);
        if (promotion) {
          setFormData({
            name: promotion.name || '',
            image: `${ImportedURL.LIVEURL}${promotion.image}` || '',// keep null for file input
            isActive: promotion.isActive ?? true,
          });
        } else {
          toast.error('Failed to load promotion data');
        }
      }
    };
    fetchData();
  }, [id, fetchPromotionsById]);

  // Handle input changes
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const target = e.target;
    let newValue: any;

    if (target.type === 'checkbox') {
      newValue = (target as HTMLInputElement).checked;
    } else if (target.type === 'file') {
      const fileTarget = target as HTMLInputElement;
      newValue = fileTarget.files ? fileTarget.files[0] : null;
    } else {
      newValue = target.value;
    }

    setFormData(prev => ({ ...prev, [target.name]: newValue }));

    // Validate field
    const fieldValidationErrors = validatePromotionsForm({ ...formData, [target.name]: newValue }, !!id);
    setErrors(prev => ({ ...prev, [target.name]: fieldValidationErrors[target.name as keyof ValidationErrors] }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validatePromotionsForm(formData, !!id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('isActive', formData.isActive ? "1" : "0");
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      if (id) {
        await updatePromotions(id, data);
        toast.success('Promotion updated successfully');
      } else {
        await addPromotions(data);
        toast.success('Promotion added successfully');
      }

      navigate('/promotions');
    } catch (error: any) {
      const message =
        typeof error === 'string' ? error : error?.response?.data?.message || error?.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader managementName="Promotions" addButtonLink="/promotions" type={id ? 'Edit' : 'Add'} />
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {promotionsFields.map((field) => (
            <div key={field.name}>
              <FormField
                field={{ ...field, className: 'w-full' }}

                value={formData[field.name as keyof PromotionsFormData]}
                onChange={handleChange}
                error={errors[field.name as keyof ValidationErrors]}
              />

              {/* Only show preview for file field */}
              {/* {field.type === 'file' && previewUrl && (
      <div className="relative w-40 h-40 border rounded overflow-hidden flex items-center justify-center bg-gray-100 mt-2">
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
      </div>
    )} */}
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionsFormTemplate;