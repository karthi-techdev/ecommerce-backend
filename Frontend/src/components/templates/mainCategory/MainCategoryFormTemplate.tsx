import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
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
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
    required: true, 
  },
  {
    name: 'icon', 
    label: 'Icon',
    type: 'text',
    placeholder: 'Enter Icon Name',
    required: true,
  },
  {
    name: 'image',
    label: 'Image',
    type: 'file',
    placeholder: 'https://example.com/image.png',
  },
];
const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const MainCategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const { fetchMainCategoryById, addMainCategory, updateMainCategory } =
  useMainCategoryStore();

  const [formData, setFormData] = useState<MainCategoryFormData>({
    name: '',
    slug: '',
     icon: '',
    description: '',
    image: null,
    isActive: true,
  });
  const debouncedName = useDebounce(formData.name, 500);
  const [imagePreview, setImagePreview] = useState<string>(placeholderImage);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const fetchData = async () => {
      if (id) {
      const mainCategory = await fetchMainCategoryById(id);
        if (mainCategory) {
          setFormData({
            name: mainCategory.name || '',
            slug: mainCategory.slug || '',
            description: mainCategory.description || '',
            image: mainCategory.image || null,
            icon: mainCategory.icon || '', 
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
  const { name, value } = e.target;

  setErrors(prev => ({
    ...prev,
    [name]: undefined,
  }));

  if (name === "image") {

    const input = document.querySelector(
      'input[name="image"]'
    ) as HTMLInputElement;

    if (!input?.files || input.files.length === 0) {
      setFormData(prev => ({
        ...prev,
        image: null
      }));

      setImagePreview(placeholderImage);
      return;
    }

    const file = input.files[0];

    const previewUrl = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      image: file
    }));

    setImagePreview(previewUrl);

    return;
  }

  if (name === "name") {

  const slug = generateSlug(value);

  if (value.startsWith(" ")) {
    setErrors(prev => ({
      ...prev,
      name: "Name should not start with space"
    }));

    setFormData(prev => ({
      ...prev,
      name: value,
      slug: slug
    }));

    return;
  }

  if (!value) {
    setErrors(prev => ({
      ...prev,
      name: "Name is required"
    }));

    setFormData(prev => ({
      ...prev,
      name: value,
      slug: ""
    }));

    return;
  }

  if (value.trim().length < 3) {
    setErrors(prev => ({
      ...prev,
      name: "Name must be at least 3 characters"
    }));

    setFormData(prev => ({
      ...prev,
      name: value,
      slug: slug
    }));

    return;
  }

  setFormData(prev => ({
    ...prev,
    name: value,
    slug: slug
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
  setErrors(prev => ({
    ...prev,
    ...validationErrors
  }));
  return;
}

  setIsSubmitting(true);

  try {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('slug', formData.slug);
    payload.append('description', formData.description || '');
    payload.append('icon', formData.icon);
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
        isRequired={field.required}  
      />
  ))}
  <FormField
    field={{
      name: 'image',
      label: 'Image',
      type: 'file',
      className: 'w-full',
      required: true,
      previewEnabled: false, 
      accept: 'image/jpeg,image/jpg,image/png',
    }}
    value={formData.image}
    onChange={handleChange}
    error={errors.image}
    isRequired={true}

  />
  <div className="mt-3">
  <img
  src={imagePreview}
  alt="Preview"
  className="w-32 h-32 object-cover rounded-md border"
/>
</div>
  <div className="flex justify-end">
    <button
      type="submit"
      disabled={isSubmitting}
      className="inline-flex justify-center py-2 px-4 rounded-md text-white bg-orange-500 hover:bg-orange-500 disabled:opacity-50"
    >
      {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
    </button>
  </div>
  </form>

    </div>
  );
};

export default MainCategoryFormTemplate;
