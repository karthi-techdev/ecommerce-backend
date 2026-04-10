import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateOfferForm, type OfferFormData, type OfferValidationErrors } from '../../validations/offerValidation';
import { useOfferStore } from '../../../stores/offerStore';
import { useProductStore } from '../../../stores/productStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { toast } from 'react-toastify';
import { handleError } from '../../utils/errorHandler';
import ImportedURL from '../../../common/urls';

const OfferFormTemplate: React.FC = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchOfferById,
    addOffer,
    updateOffer,
    checkDuplicateOffer,
    offers,
    fetchOffers
  } = useOfferStore();

  const {
    fetchProducts,
    products,
    totalPages,
    loading,
    page
  } = useProductStore();

  const [formData, setFormData] = useState<OfferFormData>({
    name: '',
    banner: '',
    description: '',
    buttonName: '',
    products: [],
    isActive: true,
    image: null
  });

  const [errors, setErrors] = useState<OfferValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const nameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getBannerUsage = (bannerName: string) => {
    return offers.filter(o => o.banner === bannerName && o._id !== id).length;
  };

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  useEffect(() => {
    if (!id && offers.length >= 6) {
      toast.error('Maximum 6 offers allowed (3 per banner)');
      navigate('/offer');
    }
  }, [offers, id, navigate]);
  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      const offer = await fetchOfferById(id);
      if (!offer) return;
      setFormData({
        name: offer.name || '',
        banner: offer.banner || '',
        description: offer.description || '',
        buttonName: offer.buttonName || '',
        products: offer.products?.map((p: any) => p._id || p) || [],
        isActive: offer.isActive ?? true,
        image: offer.image ? `${ImportedURL.LIVEURL}${offer.image}` : null,
      });
    };
    loadData();
  }, [id, fetchOfferById]);
  useEffect(() => {
    fetchProducts(1, 10, 'active');
  }, [fetchProducts]);
  const handleChange = (e: any) => {
    const name = e.target ? e.target.name : e.name;
    let value = e.target ? e.target.value : e.value;

    if (name === 'name' && value.trim()) {
      if (nameCheckTimer.current) clearTimeout(nameCheckTimer.current);
      nameCheckTimer.current = setTimeout(async () => {
        const exists = await checkDuplicateOffer(value, id);
        if (exists) {
          setErrors(prev => ({
            ...prev,
            name: 'Offer name already exists'
          }));
        }
      }, 400);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof OfferValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateOfferForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('banner', formData.banner || '');
      data.append('description', formData.description || '');
      data.append('buttonName', formData.buttonName);
      data.append('isActive', formData.isActive ? '1' : '0');


      formData.products.forEach((p: string) => data.append('products', p));

      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }

      if (id) {
        await updateOffer(id, data as any);
        toast.success('Offer updated successfully');
      } else {
        await addOffer(data as any);
        toast.success('Offer added successfully');
      }
      navigate('/offer');
    } catch (error: any) {
      handleError(error).forEach(msg => toast.error(msg));
    } finally {
      setIsSubmitting(false);
    }
  };
  const offerFields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Enter Offer Name'
    },
    {
      name: 'banner',
      label: 'Banner',
      type: 'select',
      placeholder: 'Select Banner',
      options: [
        {
          label: 'Banner 1',
          value: 'Banner 1',
          isDisabled: getBannerUsage('Banner 1') >= 3
        },
        {
          label: 'Banner 2',
          value: 'Banner 2',
          isDisabled: getBannerUsage('Banner 2') >= 3
        }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter description'
    },
    {
      name: 'buttonName',
      label: 'Button',
      type: 'text',
      placeholder: 'Shop Now'
    },
    {
      name: 'products',
      label: 'Products',
      type: 'select',
      placeholder: 'Select products',
      isMulti: true as any
    },
    {
      name: 'image',
      label: 'Image',
      type: 'file',
      previewEnabled: true,
      accept: "image/png,image/jpeg,image/jpg,image/webp"
    }
  ];
  return (
    <div className="p-6">
      <FormHeader
        managementName="Offer"
        addButtonLink="/offer"
        type={id ? 'Edit' : 'Add'}
      />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-4"
      >
        <div className="space-y-6">
          {offerFields.map(field => {
            let fieldOptions = field.options;
            if (field.name === 'products') {
              fieldOptions = products?.map(p => ({
                label: p.name,
                value: p._id ?? ''
              }));
            }
            return (
              <div key={field.name}>
                <FormField
                  field={{
                    ...field,
                    options: fieldOptions,
                    onMenuScrollToBottom: () => {
                      if (page < totalPages && !loading) fetchProducts(page + 1, 10, 'active');
                    },
                    onInputChange: (val) => setSearchTerm(val),
                  }}
                  isRequired={['name', 'banner', 'description', 'buttonName', 'products'].includes(field.name)}
                  value={formData[field.name as keyof OfferFormData]}
                  onChange={handleChange}
                  error={errors[field.name as keyof OfferValidationErrors]}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md disabled:bg-gray-400"
          >
            {isSubmitting
              ? 'Saving...'
              : id
                ? 'Update'
                : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default OfferFormTemplate;
