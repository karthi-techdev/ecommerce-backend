import React, { useEffect, useState,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  validateCategoryForm,
  type CategoryFormData,
  type ValidationErrors
} from '../../validations/categoryValidation';
import { useCategoryStore } from '../../../stores/categoryStore';
import { useMainCategoryStore } from '../../../stores/mainCategoryStore';
import { useSubCategoryStore } from '../../../stores/subcategoryStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig,PopulatedCategory } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import defaultImage from '../../../assets/images/preview-image.jpg.jpeg'
const CategoryFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchCategoryById,
    addCategory,
    updateCategory
    ,slugEXist
  } = useCategoryStore();
  const {mainCategories,activeMainCategory,page,
  totalPages,fetchMainCategories,
  loading,hasMore}=useMainCategoryStore();
  const {
  subCategories,fetchSubCategories,
  subPage,
  subHasMore,
  loading: subLoading,fetchSubCategoryByMainCategoryId
} = useSubCategoryStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
const imageErrorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const slugRequestId = useRef(0);
  const [searchTerm, setSearchTerm] = useState('');
const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const subSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const [subSearchTerm, setSubSearchTerm] = useState('');
const prevMainCategoryId = useRef<string | null>(null);
const [mainCategoryLabel, setMainCategoryLabel] = useState('');
const [subCategoryLabel, setSubCategoryLabel] = useState('');
const handleSubCategorySearch = (input: string) => {
  setSubSearchTerm(input);

  if (!formData.mainCategoryId) return;

  if (subSearchTimer.current) {
    clearTimeout(subSearchTimer.current);
  }

  subSearchTimer.current = setTimeout(async () => {

    useSubCategoryStore.setState({
      subCategories: [],
      subPage: 1,
      subHasMore: true
    });

    await fetchSubCategoryByMainCategoryId(
      formData.mainCategoryId,
      1,
      5,
      input || '',  
      false
    );
  }, 500);
};
const handleMainCategorySearch = (input: string) => {

  setSearchTerm(input);

  if (searchTimer.current) {
    clearTimeout(searchTimer.current);
  }

  searchTimer.current = setTimeout(async () => {

    if (!input) {
      await activeMainCategory(1, 5, '', false);
      return;
    }

    await activeMainCategory(1, 5, input, false);

  }, 500);
};
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
      required:true,
      placeholder: 'Select the main category',
      options: mainCategories
  .filter(m => m._id)
  .map(m => ({
    label: m.name,
    value: m._id as string
  })),
   onInputChange: handleMainCategorySearch,
 onMenuScrollToBottom: () => {
  if (!loading && hasMore) {
    activeMainCategory(page + 1, 5, searchTerm, true); 
  }
},

    },
    {
      name: 'subCategoryId',
      label: 'Sub Category',
      type: 'select',
      className: 'col-span-6',
      placeholder: 'Select the sub category',
      required:true,
      options: subCategories
  .filter(s => s._id)
  .map(s => ({
    label: s.name,
    value: s._id as string
  })), onInputChange: handleSubCategorySearch,

  onMenuScrollToBottom: () => {
    if (!subLoading && subHasMore) {
      fetchSubCategoryByMainCategoryId(
        formData.mainCategoryId,
        subPage + 1,
        5,
        subSearchTerm, 
        true
      );
    }
  }
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      className: 'col-span-6',
      placeholder: 'Enter Name...',
      required:true
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      className: 'col-span-6',
      readonly: true,
      disabled:true,
      placeholder: 'Slug is auto-generated using name'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      className: 'col-span-12',
      placeholder: 'Enter the description...',
      required:true
    },
    {
      name: 'image',
      label: 'Image',
      type: 'file',
      className: 'col-span-12',
      previewEnabled:true,
    }
  ];
  useEffect(() => {
    activeMainCategory(1, 5, '');
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
      return;
    }

    const loadEditData = async () => {
  try {
    const category = await fetchCategoryById(id);
    if (!category) return;

    // populated objects
    const mainCategory = category.mainCategoryId as PopulatedCategory;
    const subCategory = category.subCategoryId as PopulatedCategory;

    const mainCatId = mainCategory?._id || '';
    const subCatId = subCategory?._id || '';

    setMainCategoryLabel(mainCategory.name || 'Selected Category');
setSubCategoryLabel(subCategory.name || 'Selected Subcategory');
console.log(mainCategory.name,"             ",subCategory.name,'category',category)
await activeMainCategory(1, 5, '', false);
     if (mainCatId && !mainCategories.some(m => m._id === mainCatId)) {
      useMainCategoryStore.setState(state => ({
        mainCategories: [
          ...state.mainCategories,
          {
            _id: mainCatId,
            name: mainCategory.name || 'Selected Category',
            slug: (mainCategory as any).slug || '',
            description: (mainCategory as any).description || '',
            image: (mainCategory as any).image || null,
            isActive: true
          }
        ]
      }));
    }

    // same for subcategory
    if (subCatId && !subCategories.some(s => s._id === subCatId)) {
      useSubCategoryStore.setState(state => ({
        subCategories: [
          ...state.subCategories,
          {
            _id: subCatId,
            name: subCategory.name || 'Selected Subcategory',
            slug: (subCategory as any).slug || '',
            description: (subCategory as any).description || '',
            image: (subCategory as any).image,
            mainCategoryId: mainCatId,
            isActive: true
          }
        ]
      }));
    }
    // if main category not loaded yet, load its page (optional)
    
    console.log(mainCategories,'for checking ',subCategories)
    // load subcategory page of that main (optional)
    if (mainCatId) {
      await fetchSubCategoryByMainCategoryId(mainCatId, 1, 5, '', false);
    }
    
    // now set form data using populated ids
    setFormData({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
      mainCategoryId: mainCatId,
      subCategoryId: subCatId,
      image: category.image || null
    });

  } catch (err) {
    console.error(err);
  }
};
    loadEditData();
  }, [id]);
useEffect(() => {
  if (!formData.subCategoryId && formData.mainCategoryId) {

    setSubSearchTerm('');

    useSubCategoryStore.setState({
      subCategories: [],
      subPage: 1,
      subHasMore: true
    });

    fetchSubCategoryByMainCategoryId(
      formData.mainCategoryId,
      1,
      5,
      '',
      false
    );
  }
}, [formData.subCategoryId]);
useEffect(() => {
  if (!formData.mainCategoryId) {

    // Clear subcategory store completely
    useSubCategoryStore.setState({
      subCategories: [],
      subPage: 1,
      subHasMore: true
    });

    prevMainCategoryId.current = null; 

    setFormData(prev => ({
      ...prev,
      subCategoryId: ''
    }));

    return;
  };

  // Only run if main category really changed
  if (prevMainCategoryId.current !== formData.mainCategoryId) {
    prevMainCategoryId.current = formData.mainCategoryId;

    useSubCategoryStore.setState({
      subCategories: [],
      subPage: 1,
      subHasMore: true
    });

    setFormData(prev => ({
      ...prev,
      subCategoryId: ''
    }));

    fetchSubCategoryByMainCategoryId(
      formData.mainCategoryId,
      1,
      5,
      '',
      false
    );
  }

}, [formData.mainCategoryId]);




  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

      const slugTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
useEffect(() => {
  if (formData.slug && formData.subCategoryId) {
    checkSlugExist(formData.slug);
  }
}, [formData.subCategoryId]);

const handleChange = (e: any) => {
  const { name, value, files } = e.target;
  console.log(name,value,files)
  let next = { ...formData };
  setErrors(prev => ({
    ...prev,
    [name]: undefined
  }));
if (name === 'image') {
 setTimeout(()=>{
   setFormData(prev => ({
    ...prev,
    image: value
  }));
 },500)
  return;
}
if (name === "mainCategoryId" && !value) {
    setSearchTerm('');
    activeMainCategory(1, 5, '', false);
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
              field={{
                ...field,
                options:
                  field.name === 'mainCategoryId'
    ? [
        ...mainCategories.map(m => ({
          label: m.name,
          value: m._id as string
        })),
        ...(formData.mainCategoryId &&
        !mainCategories.some(m => m._id === formData.mainCategoryId)
          ? [{
              label: mainCategoryLabel || 'Selected Category',
              value: formData.mainCategoryId
            }]
          : [])
      ]
                    :  field.name === 'subCategoryId'
    ? [
        ...subCategories.map(s => ({
          label: s.name,
          value: s._id as string
        })),
        ...(formData.subCategoryId &&
        !subCategories.some(s => s._id === formData.subCategoryId)
          ? [{
              label: subCategoryLabel || 'Selected Subcategory',
              value: formData.subCategoryId
            }]
          : [])
      ]
                    : undefined,
                onMenuScrollToBottom: field.onMenuScrollToBottom,
                onInputChange: field.onInputChange
              }}
              value={formData[field.name as keyof CategoryFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ValidationErrors]}
              
            />
          ))}


        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormTemplate;