import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateAddInfoForm, type AddInfoFormData, type ValidationErrors } from '../../validations/addinfoValidation';
import { useAddInfoStore } from '../../../stores/addInfoStore'; 
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';

const addInfoFields: FieldConfig[] = [
  {
    name: 'key',
    label: 'Key',
    type: 'text',
    placeholder: 'Enter key',
  },
  {
    name: 'value',
    label: 'Value',
    type: 'text',
    placeholder: 'Enter the details',
  },
];

const AddInfoFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchAddInfoById, addAddInfo, updateAddInfo } = useAddInfoStore();
  
  const [formData, setFormData] = useState<AddInfoFormData>({
    key: '',
    value: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const info = await fetchAddInfoById(id);
          if (info) {
            setFormData({
              key: info.key || '',
              value: info.value || ''
            });
          } else {
            toast.error('Failed to load data');
          }
        } catch (err) {
          toast.error('Error fetching record');
        }
      }
    };
    fetchData();
  }, [id, fetchAddInfoById]);

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Perform real-time validation for the specific field
    const fieldValidationErrors = validateAddInfoForm({
      ...formData,
      [name]: value
    });

    setErrors(prev => ({
      ...prev,
      [name]: fieldValidationErrors[name as keyof ValidationErrors]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateAddInfoForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await updateAddInfo(id, formData);
        toast.success('Information updated successfully');
      } else {
        await addAddInfo(formData);
        toast.success('Information added successfully');
      }
      navigate('/products/add-info'); // Redirect to the list page
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
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
        managementName=""
        addButtonLink="/products/add-info"
        type={id ? 'Edit' : 'Add'}
      />
      
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {addInfoFields.map((field) => (
            <FormField
              key={field.name}
              field={{
                ...field,
                className: 'w-full'
              }}
              value={formData[field.name as keyof AddInfoFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ValidationErrors]}
              isRequired={true}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInfoFormTemplate;