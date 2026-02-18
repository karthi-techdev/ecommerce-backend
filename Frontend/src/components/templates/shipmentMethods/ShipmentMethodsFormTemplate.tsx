import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  validateShipmentMethodForm,
  type ShipmentMethodFormData,
  type ValidationErrors
} from '../../validations/shipmentMethodsValidation';
import { useShipmentStore } from '../../../stores/shipmentMethodsStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';

const shipmentFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Method Name',
    type: 'text',
    placeholder: 'Enter shipment method name...',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    placeholder: 'Enter unique slug...',
    disabled: true,
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'Enter price...',
  },
  {
    name: 'estimatedDeliveryTime',
    label: 'Estimated Delivery Time',
    type: 'text',
    placeholder: 'Ex: 3-5 Business Days',
  },
];

const ShipmentMethodFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchShipmentMethodById,
    addShipmentMethod,
    updateShipmentMethod,
    checkDuplicateSlug
  } = useShipmentStore();

  const [formData, setFormData] = useState<ShipmentMethodFormData>({
    name: '',
    slug: '',
    price: 0,
    estimatedDeliveryTime: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 Fetch data for edit
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const method = await fetchShipmentMethodById(id);
        if (method) {
          setFormData({
            name: method.name || '',
            slug: method.slug || '',
            price: method.price || 0,
            estimatedDeliveryTime: method.estimatedDeliveryTime || '',
          });
        } else {
          toast.error('Failed to load shipment method');
        }
      }
    };
    fetchData();
  }, [id, fetchShipmentMethodById]);

  // 🔹 Handle input change
  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));

    // Validate changed field only
    const fieldErrors = validateShipmentMethodForm(
      {
        ...formData,
        [name]: name === 'price' ? Number(value) : value
      },
      !!id
    );

    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name as keyof ValidationErrors]
    }));
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateShipmentMethodForm(formData, !!id);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Duplicate slug check only when adding
      if (!id) {
        const isDuplicate = await checkDuplicateSlug(formData.slug);
        if (isDuplicate) {
          setErrors(prev => ({
            ...prev,
            slug: 'Slug already exists.'
          }));
          setIsSubmitting(false);
          return;
        }
      }

      if (id) {
        await updateShipmentMethod(id, formData);
        toast.success('Shipment method updated successfully');
      } else {
        await addShipmentMethod({ ...formData, status: 'active' });
        toast.success('Shipment method added successfully');
      }

      navigate('/shipment-methods');
    } catch (error: any) {
      const errorMessages = handleError(error);
      for (const message of errorMessages) {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Shipment Method"
        addButtonLink="/shipment-methods"
        type={id ? 'Edit' : 'Add'}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="space-y-6">
          {shipmentFields.map((field) => (
            <FormField
              key={field.name}
              field={{ ...field, className: 'w-full' }}
              value={formData[field.name as keyof ShipmentMethodFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ValidationErrors]}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentMethodFormTemplate;