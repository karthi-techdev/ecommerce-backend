import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateOfferForm, type OfferFormData, type OfferValidationErrors } from '../../validations/offerValidation';
import { useOfferStore } from '../../../stores/offerStore';
import { useProductStore } from '../../../stores/productStore'; // Assuming you have a product store
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { toast } from 'react-toastify';
import { handleError } from '../../utils/errorHandler';

const OfferFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Stores
  const { fetchOfferById, addOffer, updateOffer, checkDuplicateOffer } = useOfferStore();
  const { fetchActiveProducts, products, hasMore, loading, page } = useProductStore();

  const offerFields: FieldConfig[] = [
    { name: 'name', label: 'Offer Name', type: 'text', placeholder: 'Enter Offer Name' },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter offer description' },
    { name: 'buttonName', label: 'Button Text', type: 'text', placeholder: 'e.g., Shop Now, Claim Offer' },
    { 
      name: 'products', 
      label: 'Select Products', 
      type: 'select', 
      placeholder: 'Select multiple products', 
      isMulti: true 
    },
  ];

  const [formData, setFormData] = useState<OfferFormData>({
    name: '',
    description: '',
    buttonName: '',
    products: [],
    isActive: true,
  });

  const [errors, setErrors] = useState<OfferValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const nameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounceNameCheck = (fn: () => void, delay = 400) => {
    if (nameCheckTimer.current) clearTimeout(nameCheckTimer.current);
    nameCheckTimer.current = setTimeout(() => fn(), delay);
  };

  // Fetch products for the dropdown with search/pagination
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchActiveProducts(1, 10, searchTerm);
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, fetchActiveProducts]);

  // Load existing data for Edit mode
  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      const offer = await fetchOfferById(id);
      if (!offer) return;
      setFormData({
        name: offer.name || '',
        description: offer.description || '',
        buttonName: offer.buttonName || '',
        products: offer.products?.map((p: any) => p._id || p) || [],
        isActive: offer.isActive ?? true,
      });
    };
    loadData();
  }, [id, fetchOfferById]);

//   const handleChange = (e: any) => {
//     // Handling both standard inputs and Select components
//     const name = e.target ? e.target.name : e.name;
//     const value = e.target ? e.target.value : e.value;

//     const updatedFormData = { ...formData, [name]: value };
//     setFormData(updatedFormData);

//     // Clear error on change
//     if (errors[name as keyof OfferValidationErrors]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }

//     // Duplicate Name Check
//     if (name === 'name' && value.trim()) {
//       debounceNameCheck(async () => {
//         try {
//           const exists = await checkDuplicateOffer(value, id);
//           if (exists) {
//             setErrors(prev => ({ ...prev, name: 'Offer name already exists' }));
//           }
//         } catch (error: any) {
//           setErrors(prev => ({ ...prev, name: handleError(error)?.[0] }));
//         }
//       });
//     }
//   };
  const handleChange = (e: any) => {
    // Handling both standard inputs and Select components
    const name = e.target ? e.target.name : e.name;
    const value = e.target ? e.target.value : e.value;

    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    // Clear error on change - FIXED: Typed 'prev'
    if (errors[name as keyof OfferValidationErrors]) {
      setErrors((prev: OfferValidationErrors) => ({ ...prev, [name]: undefined }));
    }

    // Duplicate Name Check
    if (name === 'name' && value.trim()) {
      debounceNameCheck(async () => {
        try {
          const exists = await checkDuplicateOffer(value, id);
          if (exists) {
            // FIXED: Typed 'prev'
            setErrors((prev: OfferValidationErrors) => ({ ...prev, name: 'Offer name already exists' }));
          }
        } catch (error: any) {
          // FIXED: Typed 'prev'
          setErrors((prev: OfferValidationErrors) => ({ ...prev, name: handleError(error)?.[0] }));
        }
      });
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
      if (id) {
        await updateOffer(id, formData);
        toast.success('Offer updated successfully');
      } else {
        await addOffer(formData);
        toast.success('Offer added successfully');
      }
      navigate('/offers');
    } catch (error: any) {
      handleError(error).forEach(msg => toast.error(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader 
        managementName="Offer" 
        addButtonLink="/offers" 
        type={id ? 'Edit' : 'Add'} 
      />
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {offerFields.map(field => {
            const isRequired = ['name', 'buttonName', 'products'].includes(field.name);
            
            return (
              <FormField
                key={field.name}
                field={{
                  ...field,
                  options: field.name === 'products' 
                    ? products?.map(prod => ({ label: prod.name, value: prod._id })) 
                    : undefined,
                  onMenuScrollToBottom: () => {
                    if (hasMore && !loading) fetchActiveProducts(page + 1, 10, searchTerm);
                  },
                  onInputChange: (value: string) => setSearchTerm(value)
                }}
                isRequired={isRequired}
                value={formData[field.name as keyof OfferFormData] ?? ''}
                onChange={handleChange}
                error={errors[field.name as keyof OfferValidationErrors]}
              />
            );
          })}

          {/* Product Count Preview (Requirement) */}
          <div className="text-sm text-gray-500 italic">
            Selected Products: {formData.products.length}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update Offer' : 'Save Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferFormTemplate;