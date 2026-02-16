import React, { useEffect, useState,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  validateCategoryForm,
  type CategoryFormData,
  type ValidationErrors
} from '../../validations/categoryValidation';
import { useCategoryStore } from '../../../stores/categoryStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import defaultImage from '../../../assets/images/preview-image.jpg.jpeg'
const CategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchCategoryById,
    addCategory,
    updateCategory,
    fetchSubCategory,
    subCategories,slugEXist,fetchMainCategory,mainCategories
  } = useCategoryStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
const imageErrorTimer = useRef<NodeJS.Timeout | null>(null);
const slugRequestId = useRef(0);


  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    mainCategoryId: '',
    subCategoryId: '',
    image: null
  });
  const categoryFields: FieldConfig[] = [
    {
      name: 'mainCategoryId',
      label: 'Main Category',
      type: 'select',
      className: 'col-span-6',
      placeholder: 'Select the main category',
      options: mainCategories.map(m => ({
        label: m.name,
        value: m._id
      }))
    },
    {
      name: 'subCategoryId',
      label: 'Sub Category',
      type: 'select',
      className: 'col-span-6',
      placeholder: 'Select the sub category',
      options: subCategories.map(s => ({
        label: s.name,
        value: s._id
      }))
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      className: 'col-span-6',
      placeholder: 'Enter Name...'
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      className: 'col-span-6',
      readonly: true,
      placeholder: 'Slug is auto-generated using name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      className: 'col-span-12',
      placeholder: 'Enter the description...'
    },
    {
      name: 'image',
      label: 'Image',
      type: 'file',
      className: 'col-span-12'
    }
  ];

  useEffect(() => {
    fetchMainCategory();
  }, []);

  useEffect(() => {
    if (!id) {
      setFormData({
        name: '',
        description: '',
        slug: '',
        mainCategoryId: '',
        subCategoryId: '',
        image: null
      });
      setImagePreview(null);
      return;
    }

    const loadEditData = async () => {
      try {
        const category = await fetchCategoryById(id);
        if (!category) return;
        const mainCatId =
          typeof category.mainCategoryId === 'object'
            ? category.mainCategoryId._id
            : category.mainCategoryId;
        if (mainCatId) {
          await fetchSubCategory(mainCatId);
        }
        setFormData({
          name: category.name || '',
          description: category.description || '',
          slug: category.slug || '',
          mainCategoryId: mainCatId || '',
          subCategoryId:
            typeof category.subCategoryId === 'object'
              ? category.subCategoryId?._id
              : category.subCategoryId || '',
          image: category.image||null
        });
        console.log(category)
        if (category.image) {
          setImagePreview(category.image);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadEditData();
  }, [id]);
 useEffect(() => {
  if (!formData.mainCategoryId) return;

  fetchSubCategory(formData.mainCategoryId);

  setFormData(prev => ({
    ...prev,
    subCategoryId: ''
  }));
}, [formData.mainCategoryId]);


  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

      const slugTimer = useRef<NodeJS.Timeout | null>(null);
useEffect(() => {
  setErrors(prev => ({
    ...prev,
    name: undefined
  }));
}, [formData.subCategoryId]);

const checkSlugExist = (slug: string) => {
  if (!slug || !formData.subCategoryId) return;

  if (slugTimer.current) {
    clearTimeout(slugTimer.current);
  }

  slugTimer.current = setTimeout(async () => {
    const currentReq = ++slugRequestId.current;

    const exists = await slugEXist({
      slug,
      subCategoryId: formData.subCategoryId,
      _id: id
    });
    if (currentReq !== slugRequestId.current) return;

    setErrors(prev => ({
      ...prev,
      name: exists ? 'Name already exists' : undefined
    }));
  }, 500);
};


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, files } = e.target;
  let next = { ...formData };
  setErrors(prev => ({
    ...prev,
    [name]: undefined
  }));
if (name === 'image') {
  const file = files?.[0];
  if (!file) return;

  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    setErrors(prev => ({
      ...prev,
      image: 'Only JPG, JPEG, PNG, WEBP images are allowed'
    }));
    e.target.value = '';
    if (imageErrorTimer.current) {
      clearTimeout(imageErrorTimer.current);
    }
    imageErrorTimer.current = setTimeout(() => {
      setErrors(prev => ({
        ...prev,
        image: undefined
      }));
    }, 5000);
    return;
  }
  next.image = file;
  setImagePreview(URL.createObjectURL(file));
  setErrors(prev => ({
    ...prev,
    image: undefined
  }));
  setFormData(next);
  return;
}
  if (name === 'name') {
    next.name = value;
    next.slug = generateSlug(value);
    checkSlugExist(next.slug);
  } else {
    next[name as keyof CategoryFormData] = value;
  }
  setFormData(next);

  const fieldErrors = validateCategoryForm(next);
  setErrors(prev => ({
    ...prev,[name]: fieldErrors[name as keyof ValidationErrors]
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateCategoryForm(formData);
  setErrors(prev => ({
    ...prev,
    ...validationErrors
  }));

  if (
    Object.keys(validationErrors).length > 0 ||
    errors.name 
  ) {
    return;
  }

  setIsSubmitting(true);
  try {

    if (id) {
      await updateCategory(id, formData);
      toast.success('Category updated successfully');
    } else {
      console.log(formData,'in add')
      await addCategory(formData);
      toast.success('Category added successfully');
    }
    navigate('/category');
  } catch (error) {
    handleError(error).forEach(msg => toast.error(msg));
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="p-6">
      <FormHeader
        managementName="Category"
        addButtonLink="/category"
        type={id ? 'Edit' : 'Add'}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm  p-6">
        <div className="grid grid-cols-12 gap-6">
          {categoryFields.map(field => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name as keyof CategoryFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ValidationErrors]}
            />
          ))}

         <div className="col-span-12">
  <img
    src={
      imagePreview
        ? imagePreview.startsWith('blob:')
          ? imagePreview
          : `http://localhost:5000${imagePreview}`
        : defaultImage
    }
    className="h-32 w-32 rounded-lg object-cover "
    alt="Preview"
  />
</div>

        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormTemplate;