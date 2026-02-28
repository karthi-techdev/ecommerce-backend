import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';

import { validateNewsLetterForm, type NewsLetterFormData, type ValidationErrors } from '../../validations/newsLetterValidation';
import { useNewsLetterStore } from '../../../stores/newsLetterStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import ImportedURL from '../../../common/urls';

const newsLetterFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Newsletter name',
    type: 'text',
    placeholder: 'Enter newsletter name...',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    placeholder: 'Slug...',
    readonly: true
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description...',
    withEditor: true
  },
  {
    name: 'coverImage',
    label: 'Cover image',
    type: 'file',
    previewEnabled: true
  },
  {
    name: 'isPublished',
    label: 'Whether Newsletter Published?',
    type: 'checkbox',
    placeholder: '',
  }
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const NewsLetterFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchNewsLetterById, addNewsLetter, updateNewsLetter } = useNewsLetterStore();
  const [formData, setFormData] = useState<NewsLetterFormData>({
    name: '',
    slug: '',
    description:'',
    coverImage:'',
    isPublished: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const newsLetter = await fetchNewsLetterById(id);
        if (newsLetter) {
          setFormData({
            name: newsLetter.name || '',
            slug: newsLetter.slug || '',
            description:newsLetter.description || '',
            coverImage: `${ImportedURL.LIVEURL}${newsLetter.coverImage}` || '',
            isPublished: newsLetter.isPublished || false,
          });
        } else {
          toast.error('Failed to load NewsLetter data');
        }
      }
    };
    fetchData();
  }, [id, fetchNewsLetterById]);

  console.log("coverImage",formData)

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      ...name === 'name' && {slug:  generateSlug(value)},
      [name]: value
    }));
    console.log("nnnn", name, formData)

    // Validate the specific field that changed
    const fieldValidationErrors = validateNewsLetterForm({
      ...formData,
      ...name === 'name' && {slug:  generateSlug(value)},
      [name]: value
    });

    // Update only the error for the changed field
    setErrors(prev => ({
      ...prev,
       ...name === 'name' && {slug:  fieldValidationErrors['slug']},
      [name]: fieldValidationErrors[name as keyof ValidationErrors]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const validationErrors = validateNewsLetterForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);
  try {
    if (id) {
      // ✅ update
      console.log("")
      await updateNewsLetter(id, formData);
      toast.success("NewsLetter updated successfully!");
    } else {
      // ✅ add
      await addNewsLetter(formData);
      toast.success("NewsLetter added successfully!");
    }
    navigate("/newsLetters");
  } catch (error: any) {
    toast.error("Failed to save NewsLetter!");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="p-6">
      <FormHeader
        managementName="NewsLetter"
        addButtonLink="/newsLetters"
        type={id ? 'Edit' : 'Add'}
      />
      <form onSubmit={handleSubmit} encType="multipart/form-data" data-testid="newsLetter-form" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {newsLetterFields.map((field) => (
            <FormField
              key={field.name}
              field={{
                ...field,
                className: 'w-full'
              }}
              value={formData[field.name as keyof NewsLetterFormData]}
              onChange={handleChange}
              error={errors[field.name as keyof ValidationErrors]}
            />
          ))}

        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsLetterFormTemplate;