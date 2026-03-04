import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {validateSubCategoryForm,type SubCategoryFormData,type ValidationErrors,} from '../../validations/subcategoryValidation';
import { useSubCategoryStore } from '../../../stores/subcategoryStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import ImportedURL from '../../../common/urls';
import previewImage from '../../../assets/images/preview-image.jpg';
import { toast } from 'react-toastify';
import { handleError } from '../../utils/errorHandler';

const createSlug = (text: string) => text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
const ALLOWED_IMAGE_TYPES = ['image/jpeg','image/jpg','image/png','image/webp',];
const SubCategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {fetchSubCategoryById,addSubCategory, updateSubCategory,checkDuplicateSubCategory,fetchActiveMainCategories,subCategories,page, hasMore,loading} = useSubCategoryStore();
  const subCategoryFields: FieldConfig[] = [
    { name: 'mainCategoryId', label: 'Main Category', type: 'select',placeholder: 'Select MainCategory', },
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter Name',},
    { name: 'slug', label: 'Slug', type: 'text', placeholder: 'slug-is-automatically-generated', disabled: true, },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Enter description', },
    { name: 'image', label: 'Image', type: 'file', accept: 'image/png,image/jpeg,image/jpg,image/webp',},
  ];

  const [formData, setFormData] = useState<SubCategoryFormData>({ name: '', slug: '', description: '', mainCategoryId: '', image: null,});
  const nameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const debounceNameCheck = (fn: () => void, delay = 400) => {
    if (nameCheckTimer.current) {
      clearTimeout(nameCheckTimer.current);
    }
    nameCheckTimer.current = setTimeout(() => {
      fn();
    }, delay);
  };
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const imageErrorDebounce = useRef<any>(null);
  const showImageErrorWithDebounce = (message: string) => {
    if (imageErrorDebounce.current) clearTimeout(imageErrorDebounce.current);
    imageErrorDebounce.current = setTimeout(() => {
      setErrors(prev => ({ ...prev, image: message }));
      setTimeout(() => {
        setErrors(prev => ({ ...prev, image: undefined }));
      }, 5000);
    }, 400);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchActiveMainCategories(1, 5, searchTerm);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    fetchActiveMainCategories(1, 5, "");
  }, []);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      const subCategory = await fetchSubCategoryById(id);
      if (!subCategory) return;
      setFormData({
        name: subCategory.name || '',
        slug: subCategory.slug || '',
        description: subCategory.description || '',
        mainCategoryId: subCategory.mainCategoryId || '',
        image: null,
      });
      if (subCategory.image) {
        setImagePreview(
          `${ImportedURL.FILEURL}${subCategory.image.startsWith('/')? subCategory.image.slice(1) : subCategory.image}`
        );
      }
    };

    loadData();
  }, [id, fetchSubCategoryById]);

  const handleChange = (e: any) => {
  const { name, value, files, type } = e.target;

 if (type === 'file') {
  const file = files?.[0];
  if (!file) return;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    e.target.value = '';
    showImageErrorWithDebounce('Only JPG, PNG or WEBP images are allowed');
    if (!id) {
      setImagePreview(null);
      setFormData(prev => ({ ...prev, image: null }));
    }
    return;
  }
  setFormData(prev => ({ ...prev, image: file }));
  setImagePreview(URL.createObjectURL(file));
  setErrors(prev => ({ ...prev, image: undefined }));
  return;
}
  const updatedSlug = name === 'name' ? createSlug(value) : formData.slug;
  const updatedFormData = { ...formData, [name]: value, ...(name === 'name' && { slug: updatedSlug }),};
  setFormData(updatedFormData);
  if (name === 'name') {
    setErrors(prev => ({ ...prev, name: undefined, }));
  }

  const validation = validateSubCategoryForm(updatedFormData, !!id);
  setErrors(prev => ({...prev, [name]: validation[name as keyof ValidationErrors],}));

  if (name === 'name' && value.trim() && updatedFormData.mainCategoryId) {
    debounceNameCheck(async () => {
      try {
        const exists = await checkDuplicateSubCategory( updatedSlug, updatedFormData.mainCategoryId, id);
        if (exists) {
          setErrors(prev => ({ ...prev, name: 'Subcategory already exists', }));
        }
      } catch (error: any) {
        setErrors(prev => ({...prev, name: handleError(error)?.[0], }));
      }
    });
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSubCategoryForm(formData, !!id);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value as any);
        }
      });

      if (id) {
        await updateSubCategory(id, payload);
        toast.success('Sub Category updated successfully');
      } else {
        await addSubCategory(payload);
        toast.success('Sub Category added successfully');
      }

      navigate('/subcategory');
    } catch (error: any) {
      handleError(error).forEach(msg => toast.error(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader managementName="Sub Category" addButtonLink="/subcategory" type={id ? 'Edit' : 'Add'}/>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {subCategoryFields.map(field => {
            const isRequired = ['mainCategoryId', 'name'].includes(field.name) || (!id && field.name === 'image');
            return (
              <FormField
  key={field.name}
  field={{
    ...field,
    options:
      field.name === 'mainCategoryId'
        ? subCategories?.filter((cat) => cat && cat._id && cat.name).map(cat => ({
            label: cat.name,
            value: cat._id ?? ""
          }))
        : undefined,

        onMenuScrollToBottom: () => {
          if (hasMore && !loading) {
            fetchActiveMainCategories(page + 1, 5, searchTerm);
          }
        },

          onInputChange: (value: string) => {  
            setSearchTerm(value);
          }
        }}
        isRequired={isRequired}
        value={
          field.type === 'file'
            ? undefined
            : formData[field.name as keyof SubCategoryFormData] ?? ''
        }
        onChange={handleChange}
        error={errors[field.name as keyof ValidationErrors]}
      />
            );
          })}

          <div>
            <div className="h-24 w-24 border border-gray-300 rounded flex items-center justify-center">
              <img src={imagePreview || previewImage} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-amber-600 text-white rounded">
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubCategoryFormTemplate;