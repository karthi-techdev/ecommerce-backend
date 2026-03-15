import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogCategoryStore } from '../../../stores/blogCategoryStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { BlogCategoryFormData } from '../../validations/blogCategoryValidation';

const BlogCategoryFormTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogCategories, addBlogCategory, updateBlogCategory } = useBlogCategoryStore();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<BlogCategoryFormData>({
    name: '',
    slug: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<{ name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const category = blogCategories.find(b => b._id === id);
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          isActive: category.isActive,
        });
      }
    }
  }, [id, blogCategories, isEditMode]);

  useEffect(() => {
    if (formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name]);

  const validateName = (name: string): string | undefined => {
    const trimmed = name.trim();
    if (!trimmed) return 'Name is required';
    if (name.startsWith(' ')) return 'Name cannot start with a space';
    if (trimmed.length < 3) return 'Name must be at least 3 characters';

    const duplicate = blogCategories.find(
      b => b.name.toLowerCase() === trimmed.toLowerCase() && b._id !== id
    );
    if (duplicate) return 'Name already exists';

    return undefined;
  };

  const handleChange = (field: 'name' | 'isActive', value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && typeof value === 'string') {
      setErrors({ name: validateName(value) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateName(formData.name);
    if (error) {
      setErrors({ name: error });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      if (isEditMode && id) {
        await updateBlogCategory(id, payload);
      } else {
        await addBlogCategory(payload);
      }
      navigate('/blog-category');
    } catch (err: any) {
      setErrors({ name: err?.response?.data?.message || 'Something went wrong' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Blog Category"
        addButtonLink="/blog-category"
        type={isEditMode ? 'Edit' : 'Add'}
      />
      <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
        <FormField
          field={{ name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Enter category name' }}
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          error={errors.name}
        />

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            value={formData.slug}
            placeholder="Slug generated automatically"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="isActive" className="text-gray-700 font-medium">Active</label>
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={e => handleChange('isActive', e.target.checked)}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogCategoryFormTemplate;