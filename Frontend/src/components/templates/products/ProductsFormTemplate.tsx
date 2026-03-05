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
  const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const imageErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  { name: 'images', label: 'Images', type: 'file', className: 'col-span-12', required: false, multiple: true},
  {name: 'thumbnail',label: 'Thumbnail',type: 'file',className: 'col-span-12',required: true },
], [brands, mainCategories, subCategories, categories, id]);


  useEffect(() => {
    fetchAllMainCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
  console.log("MAIN CATEGORIES FROM STORE:", mainCategories);
}, [mainCategories]);

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
 
 const subCategoryId = formData.subCategoryId;
useEffect(() => {

  const fetchCategoryBySub = async () => {

    if (!subCategoryId) {
      useCategoryStore.setState({ categories: [] });
      return;
    }

    try {

      const res = await axiosInstance.get(`/admin/categories`);

      console.log("CATEGORY API RESPONSE:", res.data);

      const list =
        res.data?.data?.data ||
        res.data?.data ||
        res.data ||
        [];

      const filtered = Array.isArray(list)
        ? list.filter((item: any) => {

            const subId =
              typeof item.subCategoryId === "string"
                ? item.subCategoryId
                : item.subCategoryId?._id;

            return subId === subCategoryId;

          })
        : [];

      useCategoryStore.setState({
        categories: filtered
      });

    } catch (error) {

      console.log("Category fetch error", error);

      useCategoryStore.setState({
        categories: []
      });
    }
  };

  fetchCategoryBySub();

}, [subCategoryId]);

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

  
  const handleImageChange = (e: any) => {

  const input = document.querySelector(
    'input[name="images"]'
  ) as HTMLInputElement;

  const files = input?.files ? Array.from(input.files) : [];

  if (files.length === 0) return;

  const previews = files.map(file =>
    URL.createObjectURL(file)
  );

  setNewImages(prev => [...prev, ...files]);
  setImagePreviews(prev => [...prev, ...previews]);
};


const handleThumbnailChange = (e: any) => {

  const input = document.querySelector(
    'input[name="thumbnail"]'
  ) as HTMLInputElement;

  console.log("INPUT FILES:", input?.files);

  if (!input?.files || input.files.length === 0) return;

  const file = input.files[0];

  const previewUrl = URL.createObjectURL(file);

  setFormData(prev => ({
    ...prev,
    thumbnail: file
  }));

  setImagePreview(previewUrl);
    setErrors(prev => ({
    ...prev,
    thumbnail: undefined
  }));
};
  const handleChange = async (e: any) => {
    const { name, value, files } = e.target;
    let next = { ...formData };

    if (name === "mainCategoryId") {

  next = {
    ...next,
    mainCategoryId: value,
    subCategoryId: "",
    categoryId: ""
  };

  useSubCategoryStore.setState({ subCategories: [] });
  useCategoryStore.setState({ categories: [] });

  const fieldError = validateProductForm(next, !!id).mainCategoryId;

setErrors(prev => ({
  ...prev,
  mainCategoryId: fieldError
}));

setFormData(next);
return;
}

    if (name === "subCategoryId") {

  next = {
    ...next,
    subCategoryId: value,
    categoryId: ""
  };

  useCategoryStore.setState({ categories: [] });

  setFormData(next);
  return;
}

    if (name === "images") {
      return;
    }else {
      if (name === "name") {

        next.name = value;
        if (value.startsWith(" ")) {
          setErrors(prev => ({
            ...prev,
            name: "Name should not start with space."
          }));
          setFormData(next);
          return;
        }

        if (!value) {
          setErrors(prev => ({
            ...prev,
            name: "Name is required"
          }));
          setFormData(next);
          return;z
        }

        if (value.trim().length < 3) {
          setErrors(prev => ({
            ...prev,
            name: "Name must be at least 3 characters long."
          }));
          setFormData(next);
          return;
        }

        const slug = generateSlug(value);
        next.slug = slug;

        checkNameExist(slug);
      }
      if (name === "price") {
        next.price = value === "" ? "" : Number(value);
      } 
      else if (name === "discountPrice") {
        next.discountPrice = value === "" ? "" : Number(value);
      } 
      else if (name === "stockQuantity") {
        next.stockQuantity = value === "" ? "" : Number(value);
      } 
      else {
        next[name as keyof ProductFormData] = value;
      }

      const fieldError = validateProductForm(next, !!id)[name as keyof ProductValidationErrors];
      setErrors(prev => ({ ...prev, [name]: fieldError }));
    }

    setFormData(next);
  };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateProductForm(formData, !!id);

  const finalErrors: ProductValidationErrors = {
    ...validationErrors,
    name:
      errors.name === "Name already exists"
        ? "Name already exists"
        : validationErrors.name
  };

  setErrors(finalErrors);

  const hasError = Object.values(finalErrors).some(
    (err) => err !== undefined && err !== ""
  );

  if (hasError) return;

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
    formPayload.append("subCategoryId", formData.subCategoryId);
    formPayload.append("categoryId", formData.categoryId);

    // thumbnail
    if (formData.thumbnail instanceof File) {
      formPayload.append("thumbnail", formData.thumbnail);
    }

    // new images
    newImages.forEach((img) => {
      formPayload.append("images", img);
    });

    // existing images
    existingImages.forEach((img) => {
      formPayload.append("existingImages", img);
    });

    if (id) {
      await updateProduct(id, formPayload);
      toast.success("Product updated successfully");
    } else {
      await addProduct(formPayload);
      toast.success("Product added successfully");
    }

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

      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-12 gap-6">
          {productFields.map(field => (
            <React.Fragment key={field.name}>
              <FormField
                field={{ ...field }}
                isRequired={field.required}
                value={
                  field.type === "file"
                    ? undefined
                    : formData[field.name as keyof ProductFormData]
                }
                onChange={
                  field.name === "images"
                    ? (e) => handleImageChange(e as React.ChangeEvent<HTMLInputElement>)
                    : field.name === "thumbnail"
                    ? (e) => handleThumbnailChange(e as React.ChangeEvent<HTMLInputElement>)
                    : field.name === "slug"
                    ? () => {}
                    : handleChange
                }
                error={errors[field.name as keyof ProductValidationErrors]}
              />
              {field.name === "images" && imagePreviews.length > 0 && (
                <div className="col-span-12 flex gap-4 flex-wrap mt-2">
                  {imagePreviews.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        className="h-32 w-32 rounded-lg object-cover border"
                      />

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
                <div className="col-span-12 mt-2">
                  <img
                    key={imagePreview}
                    src={imagePreview || defaultImage}
                    className="h-32 w-32 rounded-lg object-cover border"
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
