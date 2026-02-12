
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useBrandStore } from '../../../stores/brandStore';
import { validateBrandForm, type BrandFormData, type ValidationErrors } from '../../validations/brandValidation';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { useDebounce } from '../../../components/hooks/useDebounce';


const brandFields: FieldConfig[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter brand name...', required: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter brand description...', required: true },
  { name: 'image', label: 'Image', type: 'file', required: true },
];

const BrandFormTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    brands,
    addBrand,
    updateBrand,
    checkBrandNameExists,
    fetchBrands
  } = useBrandStore();

  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    description: '',
    img: null,
  });
  const debouncedName = useDebounce(formData.name, 500);


  const [slug, setSlug] = useState('');
  const [preview, setPreview] = useState<string | null>('/preview-image.jpg');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(id);

 
  useEffect(() => {
    if (!brands.length) {
      fetchBrands();
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const brand = brands.find((b) => b._id === id);

      if (brand) {
        setFormData({
          name: brand.name,
          description: brand.description || '',
          img: null,
        });

        setSlug(brand.slug);

        if (brand.image) {
          setPreview(`http://localhost:5000/${brand.image}`);

        }
      }
    }
  }, [id, brands]);

 useEffect(() => {

  if (!debouncedName.trim()) return;

 
  if (errors.name && errors.name !== 'Name already exists') return;

  const trimmedValue = debouncedName.trim().toLowerCase();

  if (checkBrandNameExists(trimmedValue, id)) {
    setErrors((prev) => ({
      ...prev,
      name: 'Name already exists',
    }));
  } else {
    setErrors((prev) => ({
      ...prev,
      name: undefined,
    }));
  }

}, [debouncedName, id, errors.name]);



  //Handle Input
  const handleChange = (name: keyof BrandFormData, value: string | File | null) => {

    if (name === 'name' && typeof value === 'string') {

      if (value.startsWith(' ')) {
        setErrors((prev) => ({
          ...prev,
          name: 'Name cannot start with a space',
        }));

        setFormData((prev) => ({ ...prev, name: value }));
        return;
      }

      const trimmedValue = value.trim().toLowerCase();
    
      setErrors((prev) => ({
        ...prev,
        name: undefined,
      }));
      setSlug(
        trimmedValue
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')
      );
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldErrors = validateBrandForm(
      { ...formData, [name]: value },
      isEditMode
    );

    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateBrandForm(formData, isEditMode);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();

      const formattedName =
        formData.name.charAt(0).toUpperCase() + formData.name.slice(1);

      data.append('name', formattedName);
      data.append('slug', slug);
      data.append('description', formData.description);

      if (formData.img) {
        data.append('image', formData.img);
      }

      if (isEditMode && id) {
        await updateBrand(id, data);
        toast.success('Brand updated successfully');
      } else {
        await addBrand(data);
        toast.success('Brand added successfully');
      }

      navigate('/brand');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image Change
const handleImageChange = (
  file: File | null,
  inputElement?: HTMLInputElement
) => {
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (!allowedTypes.includes(file.type)) {

    setErrors((prev) => ({
      ...prev,
      img: 'Only JPG, PNG, or WEBP images are allowed',
    }));

    if (inputElement) inputElement.value = '';


    setTimeout(() => {
      setErrors((prev) => ({
        ...prev,
        img: undefined,
      }));
    }, 5000);

    return;
  }

  setErrors((prev) => ({
    ...prev,
    img: undefined,
  }));

  handleChange('img', file);
  setPreview(URL.createObjectURL(file));
};

  return (
    <div className="p-6">
     <FormHeader
  managementName=""
  addButtonLink="/brand"
  type={isEditMode ? 'Edit' : 'Add'}
/>


      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >

        {/* Name */}
        <FormField
          field={brandFields[0]}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />

        {/* Slug */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Slug
          </label>

          <input
            type="text"
            value={slug}
             placeholder= 'Slug generated automatically'
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-400"
          />
        </div>

        {/* Description */}
        <FormField
          field={brandFields[1]}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
        />

        {/* Image */}
        <FormField
          field={brandFields[2]}
          value={undefined}
          onChange={(e) => {
            const input = e.target as HTMLInputElement;
            const file = input.files?.[0] || null;
            handleImageChange(file, input);
          }}
          error={errors.img}
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditMode
              ? 'Update'
              : 'Add'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default BrandFormTemplate;
