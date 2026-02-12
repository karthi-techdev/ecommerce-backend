import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import { validateMainCategoryForm, type MainCategoryFormData, type ValidationErrors } from '../../validations/mainCategoryValidation';
import { useMainCategoryStore } from '../../../stores/mainCategoryStore';
import placeholderImage from '../../../assets/placeholder-image.jpeg';
import { useDebounce } from '../../hooks/useDebounce';

const mainCategoryFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter Name',
    required: true,
  },

  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    placeholder: 'Slug generated automatically',
    disabled: true,
    required: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
    required: true, 
    maxLength: 255,
  },
  {
    name: 'image',
    label: 'Image',
    type: 'file',
    placeholder: 'https://example.com/image.png',
  },
];

const MainCategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const { fetchMainCategoryById, addMainCategory, updateMainCategory } =
  useMainCategoryStore();

  const [formData, setFormData] = useState<MainCategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image: null,
    isActive: true,
  });
  const debouncedName = useDebounce(formData.name, 500);
  const [imagePreview, setImagePreview] = useState<string>(placeholderImage);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    if (!debouncedName || debouncedName.trim().length < 3) {
      setErrors(prev => ({ ...prev, name: undefined }));
      return;
    }

    const checkName = async () => {
      try {
        const exists = await useMainCategoryStore
          .getState()
          .checkMainCategoryNameExists(debouncedName, id);

        setErrors(prev => ({
          ...prev,
          name: exists ? 'Name already exists' : undefined,
        }));
      } catch {
      }
    };

    checkName();
  }, [debouncedName, id]);

  useEffect(() => {
  if (
    errors.image &&
    errors.image === 'Only JPG, JPEG, PNG images are allowed'
  ) {
    const timer = setTimeout(() => {
      setErrors(prev => ({ ...prev, image: undefined }));
    }, 5000);

    return () => clearTimeout(timer);
  }
}, [errors.image]);


  useEffect(() => {
    const fetchData = async () => {
      if (id) {
      const mainCategory = await fetchMainCategoryById(id);
        if (mainCategory) {
          setFormData({
            name: mainCategory.name || '',
            slug: mainCategory.slug || '',
            description: mainCategory.description || '',
            image: mainCategory.image || null,
            isActive: mainCategory.isActive ?? true,
          });
          if (mainCategory.image) {
            const baseUrl = "http://localhost:5000".replace(/\/$/, '');
            setImagePreview(`${baseUrl}${mainCategory.image}`);
          }

        } else {
          toast.error('Failed to load main category data');
        }
      }
    };
    fetchData();
  }, [id, fetchMainCategoryById]);

 


  const handleChange = (e: any) => {
  const { name, value, files } = e.target;

  setErrors(prev => ({
    ...prev,
    [name]: undefined,
  }));

  if (name === 'image' && files && files[0]) {
  const file = files[0];

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!allowedTypes.includes(file.type)) {
    setErrors({
      image: 'Only JPG, JPEG, PNG images are allowed',
    });

    setPdfError(true);
    e.target.value = '';

    return;
  }

  setPdfError(false);
  setErrors(prev => ({ ...prev, image: undefined }));

  setFormData(prev => ({ ...prev, image: file }));
  setImagePreview(URL.createObjectURL(file));
  return;
}


  if (name === 'name') {
  let updatedValue = value;

  if (updatedValue.length > 0 && updatedValue[0] !== ' ') {
    updatedValue =
      updatedValue.charAt(0).toUpperCase() + updatedValue.slice(1);
  }
  if (updatedValue.startsWith(' ')) {
    setErrors(prev => ({
      ...prev,
      name: 'Name should not contain spaces',
    }));
  } else if (updatedValue.trim().length === 0) {
    setErrors(prev => ({
      ...prev,
      name: 'Name is required',
    }));
  } else if (updatedValue.length < 3) {
    setErrors(prev => ({
      ...prev,
      name: 'Name must contain at least 3 characters',
    }));
  } else {
    setErrors(prev => ({
      ...prev,
      name: undefined,
    }));
  }

  const slug = updatedValue
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  setFormData(prev => ({
    ...prev,
    name: updatedValue,
    slug,
  }));

  return;
}

  setFormData(prev => ({
    ...prev,
    [name]: value,
  }));
};


 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const validationErrors = validateMainCategoryForm(formData, Boolean(id));

 
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);

  try {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('slug', formData.slug);
    payload.append('description', formData.description || '');

    if (formData.image instanceof File) {
      payload.append('image', formData.image);
    }

    if (id) {
      await updateMainCategory(id, payload);
      toast.success('Main category updated successfully');
    } else {
      await addMainCategory(payload);
      toast.success('Main category added successfully');
    }

    navigate('/mainCategory');
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || 'Something went wrong';
    if (errorMessage.toLowerCase().includes('already')) {
      setErrors(prev => ({
        ...prev,
        name: 'Name already exists',
      }));
      return;
    }
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }

};


  return (
    <div className="p-6">
      <FormHeader
        managementName=""
        addButtonLink="/mainCategory"
        type={id ? 'Edit' : 'Add'}
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
 
  {mainCategoryFields
    .filter(field => field.name !== 'image')
    .map(field => (
      <FormField
        key={field.name}
        field={{ ...field, className: 'w-full' }}
        value={formData[field.name as keyof MainCategoryFormData]}
        onChange={handleChange}
        error={errors[field.name as keyof ValidationErrors]}
      />
  ))}
  <FormField
    field={{
      name: 'image',
      label: 'Image',
      type: 'file',
      className: 'w-full',
      required: !id, 
      accept: 'image/jpeg,image/jpg,image/png',
    }}
    value=""
    onChange={handleChange}
    error={errors.image}
  />
  {imagePreview && (
    <div className="w-40 h-40  rounded-md  overflow-hidden">
      <img
        src={imagePreview}
        alt="Preview"
        className="w-full h-full object-cover"
      />
    </div>
  )}
  <div className="flex justify-end">
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex justify-center py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
    >
      {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
    </button>
  </div>
  </form>

    </div>
  );
};

export default MainCategoryFormTemplate;
