import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  validateProductForm,
  type ProductFormData,
  type ProductValidationErrors
} from '../../validations/productValidation';

import { useProductStore } from '../../../stores/productStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useBrandStore } from '../../../stores/brandStore';

import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import defaultImage from '../../../assets/images/preview-image.jpg.jpeg';

const ProductFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchProductById,
    addProduct,
    updateProduct,
    slugExist
  } = useProductStore();

  const { fetchMainCategory, mainCategories, fetchSubCategory, subCategories } =
    useCategoryStore();

  const { fetchBrands, brands } = useBrandStore();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const slugTimer = useRef<NodeJS.Timeout | null>(null);
  const slugRequestId = useRef(0);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    slug: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    brandId: '',
    mainCategoryId: '',
    subCategoryId: '',
    images: []
  });

  const productFields: FieldConfig[] = [
    {
      name: 'brandId',
      label: 'Brand',
      type: 'select',
      className: 'col-span-6',
      options: brands.map(b => ({
        label: b.name,
        value: b._id
      }))
    },
    {
      name: 'mainCategoryId',
      label: 'Main Category',
      type: 'select',
      className: 'col-span-6',
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
      options: subCategories.map(s => ({
        label: s.name,
        value: s._id
      }))
    },
    { name: 'name', label: 'Name', type: 'text', className: 'col-span-6' },
    { name: 'slug', label: 'Slug', type: 'text', className: 'col-span-6', readonly: true },
    { name: 'price', label: 'Price', type: 'number', className: 'col-span-4' },
    { name: 'discountPrice', label: 'Discount Price', type: 'number', className: 'col-span-4' },
    { name: 'stockQuantity', label: 'Stock', type: 'number', className: 'col-span-4' },
    { name: 'description', label: 'Description', type: 'textarea', className: 'col-span-12' },
    { name: 'images', label: 'Image', type: 'file', className: 'col-span-12' }
  ];

  useEffect(() => {
    fetchMainCategory();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const product = await fetchProductById(id);
      if (!product) return;

      await fetchSubCategory(product.mainCategoryId);

      setFormData({
        ...product,
        images: product.images || []
      });

      if (product.images?.length) {
        setImagePreview(product.images[0]);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!formData.mainCategoryId) return;
    fetchSubCategory(formData.mainCategoryId);
    setFormData(prev => ({ ...prev, subCategoryId: '' }));
  }, [formData.mainCategoryId]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const checkSlugExist = (slug: string) => {
    if (!slug) return;

    if (slugTimer.current) clearTimeout(slugTimer.current);

    slugTimer.current = setTimeout(async () => {
      const currentReq = ++slugRequestId.current;

      const exists = await slugExist({ slug, _id: id });

      if (currentReq !== slugRequestId.current) return;

      setErrors(prev => ({
        ...prev,
        name: exists ? 'Product already exists' : undefined
      }));
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    let next = { ...formData };

    if (name === 'images') {
      const file = files?.[0];
      if (!file) return;

      next.images = [file];
      setImagePreview(URL.createObjectURL(file));
      setFormData(next);
      return;
    }

    if (name === 'name') {
      next.name = value;
      next.slug = generateSlug(value);
      checkSlugExist(next.slug);
    } else {
      next[name as keyof ProductFormData] = value;
    }

    setFormData(next);

    const validationErrors = validateProductForm(next);
    setErrors(prev => ({
      ...prev,
      [name]: validationErrors[name as keyof ProductValidationErrors]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateProductForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0 || errors.name) return;

    setIsSubmitting(true);

    try {
      if (id) {
        await updateProduct(id, formData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(formData);
        toast.success('Product added successfully');
      }

      navigate('/product');
    } catch (error) {
      handleError(error).forEach(msg => toast.error(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Product"
        addButtonLink="/product"
        type={id ? 'Edit' : 'Add'}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-12 gap-6">
          {productFields.map(field => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name as keyof ProductFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ProductValidationErrors]}
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
              className="h-32 w-32 rounded-lg object-cover"
              alt="Preview"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormTemplate;
