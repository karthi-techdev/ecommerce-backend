import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {validateProductForm,type ProductFormData,type ProductValidationErrors} from '../../validations/productsValidation';
import ImportedURL from '../../../common/urls';
import { useProductStore } from '../../../stores/productStore';
import { useMainCategoryStore } from '../../../stores/mainCategoryStore';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useBrandStore } from '../../../stores/brandStore';
import { useSubCategoryStore } from '../../../stores/subcategoryStore';
import type { ProductPayload } from '../../../types/common';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import defaultImage from '../../../assets/images/preview-image.jpg.jpeg';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const { FILEURL } = ImportedURL;
const ProductFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchProductById,
    addProduct,
    updateProduct,
    slugExist
  } = useProductStore();

  const { 
  fetchAllMainCategories, 
  mainCategories 
} = useMainCategoryStore();

  const { fetchCategories, categories } = useCategoryStore();
  const {subCategories} = useSubCategoryStore();
  useEffect(() => {
  console.log("SUBCATEGORIES FROM STORE:", subCategories);
}, [subCategories]);
  const { fetchBrands, brands } = useBrandStore();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const slugTimer = useRef<NodeJS.Timeout | null>(null);
  const imageErrorTimer = useRef<NodeJS.Timeout | null>(null);
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
    categoryId: '',
    images: [],             
    thumbnail: null,      
  });


  const productFields: FieldConfig[] = React.useMemo(() => [
  {
    name: 'brandId',
    label: 'Brand ',
    type: 'select',
    className: 'col-span-6',
    placeholder: 'Select brand',
    required: true,
    options: brands.map(b => ({ label: b.name, value: b._id as string }))
  },

  {
    name: 'mainCategoryId',
    label: 'Main Category',
    type: 'select',
    className: 'col-span-6',
    required: true,
    placeholder: 'Select main category',
    options: mainCategories.map((m:any) => ({ label: m.name, value: m._id }))
  },
  {
  name: 'subCategoryId',
  label: 'Sub Category',
  type: 'select',
  className: 'col-span-6',
  placeholder: 'Select sub category',
  required: false,
  options: Array.isArray(subCategories)
  ? subCategories.map((sc:any) => ({
      label: sc.name,
      value: sc._id
    }))
  : []
 },
  {
  name: 'categoryId',
  label: 'Category',
  type: 'select',
  className: 'col-span-6',
  placeholder: 'Select category',
  options: categories.map((c: any) => ({ label: c.name, value: c._id }))
},


  { name: 'name', label: 'Name', type: 'text', className: 'col-span-6', required: true, placeholder: 'Enter name'},
  { name: 'slug', label: 'Slug', type: 'text', className: 'col-span-6', readonly: true, placeholder: 'Slug generated automatically',},
  { name: 'price', label: 'Price', type: 'number', className: 'col-span-4', required: true, placeholder: 'Enter price' },
  { name: 'discountPrice', label: 'Discount Price', type: 'number', className: 'col-span-4', required: true, placeholder: 'Enter discount price' },
  { name: 'stockQuantity', label: 'Stock', type: 'number', className: 'col-span-4', required: true, placeholder: 'Enter stock quantity' },
  { name: 'description', label: 'Description', type: 'textarea', className: 'col-span-12', required: true, placeholder: 'Enter description' },
  { name: 'images', label: 'Images', type: 'file', className: 'col-span-12', required: false},
  {name: 'thumbnail',label: 'Thumbnail',type: 'file',className: 'col-span-12',required: true },
], [brands, mainCategories, subCategories, categories, id]);


  useEffect(() => {
    fetchAllMainCategories();
    fetchCategories(1, 100);
    fetchBrands();
  }, []);

  useEffect(() => {
  const fetchSubCategories = async () => {
    if (!formData.mainCategoryId) {
      useSubCategoryStore.setState({ subCategories: [] });
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/admin/subcategory`,
        {
          params: { mainCategory: formData.mainCategoryId }
        }
      );

      console.log("SUBCATEGORY API RESPONSE:", res.data);

      // VERY IMPORTANT: handle all possible response formats
      const list =
        res.data?.data?.data ||
        res.data?.data ||
        res.data ||
        [];

      useSubCategoryStore.setState({
        subCategories: Array.isArray(list) ? list : []
      });

    } catch (error) {
      console.log("Subcategory fetch error", error);
      useSubCategoryStore.setState({ subCategories: [] });
    }
  };

  fetchSubCategories();
}, [formData.mainCategoryId]);
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const product = await fetchProductById(id);
      if (!product) return;
      console.log("FULL PRODUCT DATA:", product);
      console.log("IMAGES FROM DB:", product.images);
      const mainCategoryId =
        typeof product.mainCategoryId === 'string'
          ? product.mainCategoryId
          : product.mainCategoryId?._id;

      const subCategoryId =
        typeof product.subCategoryId === 'string'
          ? product.subCategoryId
          : product.subCategoryId?._id;

      const brandId =
        typeof product.brandId === 'string'
          ? product.brandId
          : product.brandId?._id;

      const categoryId=
        typeof product.categoryId === 'string'
          ? product.categoryId
          : product.categoryId?._id ;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        slug: product.slug || '',
        price: product.price ?? '',
        discountPrice: product.discountPrice ?? '',
        stockQuantity: product.stockQuantity ?? '',
        brandId: brandId || '',
        mainCategoryId: mainCategoryId || '',
        subCategoryId: subCategoryId || '',
        categoryId: categoryId || '',

        // ✅ KEEP existing images
        images: product.images || [],

        // ✅ KEEP existing thumbnail
        thumbnail: product.thumbnail || null
      });
      const base = FILEURL.replace(/\/$/, "");

      if (product.thumbnail) {
        const cleanThumb = product.thumbnail.startsWith("/")
          ? product.thumbnail
          : `/${product.thumbnail}`;

        setImagePreview(`${base}${cleanThumb}`);
      }

      if (product.images && product.images.length > 0) {
        const dbImages = product.images.map((img: string) =>
          img.startsWith("/") ? `${base}${img}` : `${base}/${img}`
        );

        setExistingImages(product.images || []);
        setImagePreviews(dbImages);  
      }

    };

    loadData();
  }, [id]);

  useEffect(() => {
    return () => {
      if (slugTimer.current) clearTimeout(slugTimer.current);
      if (imageErrorTimer.current) clearTimeout(imageErrorTimer.current);
    };
  }, []);


  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const checkNameExist = (slug: string) => {
    if (!slug) return;

    if (slugTimer.current) {
      clearTimeout(slugTimer.current);
    }

    slugTimer.current = setTimeout(async () => {
      const currentReq = ++slugRequestId.current;

      const exists = await slugExist({
        slug,
        _id: id   
      });

      if (currentReq !== slugRequestId.current) return;

      setErrors(prev => ({
        ...prev,
        name: exists ? "Name already exists" : undefined
      }));

    }, 500); // 500ms debounce
  };
  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      // Remove from existing images
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove from new images
      const newIndex = index - existingImages.length;
      setNewImages(prev => prev.filter((_, i) => i !== newIndex));
    }

    // Update previews
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    const invalidFile = files.find(file => !allowedTypes.includes(file.type));

    if (invalidFile) {
      setErrors(prev => ({
        ...prev,
        images: "Only JPG, JPEG, PNG, WEBP images are allowed"
      }));

      e.target.value = "";

      if (imageErrorTimer.current) {
        clearTimeout(imageErrorTimer.current);
      }

      imageErrorTimer.current = setTimeout(() => {
        setErrors(prev => ({
          ...prev,
          images: undefined
        }));
      }, 5000);

      return;
    }

    setNewImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    setErrors(prev => ({
      ...prev,
      images: undefined
    }));
  };

  const handleChange = async (e: any) => {
    const { name, value, files } = e.target;
    let next = { ...formData };

    if (name === "thumbnail") {
      const file = files?.[0];
      if (!file) return;

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          thumbnail: "Only JPG, JPEG, PNG, WEBP images are allowed"
        }));

        e.target.value = "";

        if (imageErrorTimer.current) {
          clearTimeout(imageErrorTimer.current);
        }

        imageErrorTimer.current = setTimeout(() => {
          setErrors(prev => ({
            ...prev,
            thumbnail: undefined
          }));
        }, 5000);

        return;
      }

      next.thumbnail = file;
      setImagePreview(URL.createObjectURL(file));

      setErrors(prev => ({
        ...prev,
        thumbnail: undefined
      }));
    } else if (name === "images") {
      handleImageChange(e);
    }else {
      if (name === "name") {
        next.name = value;
        const slug = generateSlug(value);
        next.slug = slug;
        if (!value.trim()) {
          setErrors(prev => ({ ...prev, name: "Name is required" }));
          setFormData(next);
          return;
        }

        if (value.trim().length < 3) {
          setErrors(prev => ({ ...prev, name: "Name must be at least 3 characters long." }));
          setFormData(next);
          return;
        }
        checkNameExist(slug);
      }

      next[name as keyof ProductFormData] = 
        name === "price" || name === "discountPrice" || name === "stockQuantity"
          ? Number(value)
          : value;

      const fieldError = validateProductForm(next, !!id)[name as keyof ProductValidationErrors];
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }

    setFormData(next);
  };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateProductForm(formData, !!id);

  // preserve duplicate error
  const finalErrors = {
    ...validationErrors,
    name: errors.name === "Name already exists"
      ? "Name already exists"
      : validationErrors.name
  };

  setErrors(finalErrors);

  if (
    Object.keys(validationErrors).length > 0 ||
    finalErrors.name === "Name already exists"
  ) {
    return;
  }

  setIsSubmitting(true);

  try {
    const formPayload = new FormData();

    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    formPayload.append("slug", formData.slug);
    formPayload.append("price", String(formData.price));
    formPayload.append("discountPrice", String(formData.discountPrice));
    formPayload.append("stockQuantity", String(formData.stockQuantity));
    formPayload.append("brandId", formData.brandId);
    formPayload.append("mainCategoryId", formData.mainCategoryId);

    if (formData.subCategoryId)
      formPayload.append("subCategoryId", formData.subCategoryId);

    if (formData.categoryId)
      formPayload.append("categoryId", formData.categoryId);

    if (formData.thumbnail instanceof File) {
      formPayload.append("thumbnail", formData.thumbnail);
    }

    existingImages.forEach((img) => {
      formPayload.append("existingImages", img);
    });

    newImages.forEach((file) => {
      formPayload.append("images", file);
    });

    if (id) {
      await updateProduct(id, formPayload);
    } else {
      await addProduct(formPayload);
    }

    toast.success(`Product ${id ? "updated" : "added"} successfully`);
    navigate("/products");

  } catch (error) {
    handleError(error).forEach(msg => toast.error(msg));
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="p-6">
      <FormHeader
        managementName=""
        addButtonLink="/products"
        type={id ? 'Edit' : 'Add'}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-12 gap-6">
          {productFields.map(field => (
            <React.Fragment key={field.name}>
              <FormField
                field={field}
                value={formData[field.name as keyof ProductFormData]}
                onChange={
                  field.name === "images"
                    ? (e) => handleImageChange(e as React.ChangeEvent<HTMLInputElement>)
                    : field.name === "slug"
                    ? () => {} 
                    : handleChange
                }
                error={errors[field.name as keyof ProductValidationErrors]}
              />
              {field.name === "images" && imagePreviews.length > 0 && (
                <div className="col-span-12 flex gap-4 flex-wrap">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} className="h-32 w-32 rounded-lg object-cover border" />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {field.name === "thumbnail" && (
                <div className="col-span-12">
                  <img
                    src={imagePreview || defaultImage}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={isSubmitting}
            className="px-4 py-2 bg-orange-600 text-white rounded-md"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormTemplate;
