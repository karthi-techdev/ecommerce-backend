import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import placeholderImage from '../../../assets/placeholder-image.jpeg';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import { useBlogStore } from '../../../stores/blogStore';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import ImportedURL from '../../../common/urls';
import type { BlogFormData, FieldConfig } from '../../../types/common';

const blogFields: FieldConfig[] = [
  { name: 'categoryId', label: 'Category', type: 'select', options: [], placeholder: 'Select category...', required: true },
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter name...', required: true },
  { name: 'slug', label: 'Slug', type: 'text', placeholder: 'Slug generated automatically from name', readonly: true },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: '', withEditor: true, required: true }
];

const BlogFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchBlogById, addBlog, updateBlog } = useBlogStore();
  const { fetchBlogCategories, blogCategories } = useBlogCategoryStore();

  const [formData, setFormData] = useState<BlogFormData>({
    name: '',
    slug: '',
    categoryId: '',
    description: '',
    isActive: true,
    coverImage: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>(placeholderImage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogCategories();
  }, [fetchBlogCategories]);

useEffect(() => {
  if (!id) return;

  const loadBlog = async () => {
    try {
      const blog = await fetchBlogById(id);
      if (!blog) return;

      const blogData: any = blog;
      const imagePath = blogData.image || '';

      setFormData({
        name: blogData.name || '',
        slug: blogData.slug || '',
        categoryId:
          typeof blogData.categoryId === 'object'
            ? blogData.categoryId?._id || ''
            : blogData.categoryId || '',
        description: blogData.description || '',
        isActive: blogData.isActive ?? true,
        coverImage: undefined
      });

      if (imagePath) {
        const baseUrl = ImportedURL.LIVEURL.replace(/\/$/, '');
        const normalizedPath = String(imagePath).replace(/\\/g, '/').replace(/^\/+/, '');

        const finalImageUrl = /^https?:\/\//i.test(imagePath)
          ? imagePath
          : `${baseUrl}/uploads/blog/${normalizedPath}`;

        console.log('blogData.image:', blogData.image);
        console.log('final preview url:', finalImageUrl);

        setImagePreview(finalImageUrl);
      } else {
        setImagePreview(placeholderImage);
      }
    } catch (error) {
      toast.error('Failed to load blog data');
      setImagePreview(placeholderImage);
    }
  };

  loadBlog();
}, [id, fetchBlogById]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();

    if (!trimmedName) newErrors.name = 'Name is required';
    else if (formData.name.startsWith(' ')) newErrors.name = 'Name cannot start with space';
    else if (trimmedName.length < 3) newErrors.name = 'Name must be at least 3 characters';

    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    if (!id && !formData.coverImage) newErrors.image = 'Image is required';

    if (!trimmedDescription) newErrors.description = 'Description is required';
    else if (trimmedDescription.length < 10) newErrors.description = 'Description must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, files } = target;

    if (name === 'name') {
      const newSlug = generateSlug(value);

      setFormData(prev => ({
        ...prev,
        name: value,
        slug: newSlug
      }));

      setErrors(prev => ({ ...prev, name: '' }));
    } else if (name === 'description') {
      setFormData(prev => ({ ...prev, description: value }));
      setErrors(prev => ({ ...prev, description: '' }));
    } else if (type === 'file' && files && files[0]) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Only JPG and PNG files are allowed' }));
        setFormData(prev => ({ ...prev, coverImage: undefined }));
        setImagePreview(placeholderImage);
        return;
      }

      const previewUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));

      setImagePreview(previewUrl);
      setErrors(prev => ({ ...prev, image: '' }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      payload.append('name', formData.name);
      payload.append('slug', formData.slug);
      payload.append('categoryId', formData.categoryId);
      payload.append('description', formData.description);
      payload.append('isActive', String(formData.isActive));

      if (formData.coverImage instanceof File) {
        payload.append('image', formData.coverImage);
      }

      if (id) await updateBlog(id, payload);
      else await addBlog(payload);

      toast.success(id ? 'Blog updated successfully!' : 'Blog added successfully!');
      navigate('/blogs');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to save blog';

      if (msg.includes('exists')) {
        setErrors(prev => ({ ...prev, name: 'Blog name already exists' }));
      } else {
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Blog"
        addButtonLink="/blogs"
        type={id ? 'Edit' : 'Add'}
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          {blogFields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <FormField
                field={{
                  ...field,
                  className: `w-full ${errors[field.name] ? 'border-red-500' : ''}`,
                  options:
                    field.name === 'categoryId'
                      ? blogCategories
                          .filter((c: any) => c.isActive)
                          .map((c: any) => ({
                            label: c.name,
                            value: c._id
                          }))
                      : []
                }}
                value={formData[field.name as keyof BlogFormData] as any}
                onChange={handleChange as any}
                isRequired={field.required}
              />

              {errors[field.name] && (
                <span className="text-red-500 text-base mt-1 ml-1">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Image <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
              className={`block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 cursor-pointer ${
                errors.image ? 'border-red-500' : ''
              }`}
            />

            {errors.image && (
              <span className="text-red-500 text-base font-medium block mt-1">
                {errors.image}
              </span>
            )}

            <div className="mt-4">
              <div className="w-56 h-36 rounded-lg border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
                <img
                  src={imagePreview || placeholderImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = placeholderImage;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-8 rounded-md bg-amber-600 text-white disabled:opacity-50 transition-colors font-semibold"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogFormTemplate;