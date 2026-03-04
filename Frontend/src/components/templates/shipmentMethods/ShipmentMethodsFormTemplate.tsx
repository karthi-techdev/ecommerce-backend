import React, { useEffect, useState , useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateShipmentMethodForm,type ShipmentMethodFormData, type ShipmentMethodValidationErrors} from '../../validations/shipmentMethodsValidation';
import { useShipmentMethodStore } from '../../../stores/shipmentMethodsStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';


const generateSlug = (value: string): string => {
   return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');           
};
const shipmentFields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter Shipment Method'},
  { name: 'slug', label: 'Slug', type: 'text', placeholder: 'slug-is-auto-generated', disabled: true},
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description'},
  { name: 'price', label: 'Price', type: 'text', placeholder: 'Enter price'},
];

const ShipmentMethodFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {fetchShipmentMethodById,addShipmentMethod,updateShipmentMethod,checkDuplicateSlug} = useShipmentMethodStore();
  const [formData, setFormData] = useState<ShipmentMethodFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
  });

  const [errors, setErrors] = useState<ShipmentMethodValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const method = await fetchShipmentMethodById(id);
        if (method) {
          setFormData({
            name: method.name || '',
            slug: method.slug || '',
            description: method.description || '',
            price: method.price || '',
          });
        } else {
          toast.error('Failed to load shipment method data');
        }
      }
    };

    fetchData();
  }, [id, fetchShipmentMethodById]);

  const nameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debounceNameCheck = (fn: () => void, delay = 400) => {
      if (nameCheckTimer.current) {
        clearTimeout(nameCheckTimer.current);
      }

      nameCheckTimer.current = setTimeout(() => {
        fn();
      }, delay);
    };


  const handleChange = (e: { target: { name: string; value: any } }) => {
  const { name, value } = e.target;
  let updatedData = { ...formData, [name]: value };
  if (name === 'name') {
    updatedData.slug = generateSlug(value);
  }
  setFormData(updatedData);
  const validation = validateShipmentMethodForm(updatedData);
  setErrors(prev => ({
    ...prev,
    [name]: validation[name as keyof ShipmentMethodValidationErrors]
  }));
  if (name === 'name' && value.trim()) {
    debounceNameCheck(async () => {
      try {
        const exists = await checkDuplicateSlug(updatedData.slug);
        if (exists) {
          setErrors(prev => ({
            ...prev,
            name: 'Shipment method already exists'
          }));
        }
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          name: handleError(error)?.[0]
        }));
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateShipmentMethodForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
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
      <FormHeader managementName="Shipment Method" addButtonLink="/shipment-methods" type={id ? 'Edit' : 'Add'}/>
      <form  onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {shipmentFields.map(field => {
          const isRequired = ['name', 'price'].includes(field.name);

          return (
            <FormField
              key={field.name}
              field={{
                ...field,
                className: 'w-full'
              }}
              isRequired={isRequired}
              value={formData[field.name as keyof ShipmentMethodFormData] ?? ''}
              onChange={handleChange}
              error={errors[field.name as keyof ShipmentMethodValidationErrors]}
            />
          );
        })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white rounded"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShipmentMethodFormTemplate;
