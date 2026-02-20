import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateTestimonialForm, type TestimonialFormData, type ValidationErrors } from '../../../components/validations/testValidation';
import { useTestimonialStore } from '../../../stores/testimonialStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { useDebounce } from '../../../components/hooks/useDebounce';


const TestimonialFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter  name...',
    required: true
  },
  {
    name: 'designation',
    label: 'Designation',
    type: 'text',
    placeholder: 'Enter designation...',
  },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'enter message...',
    required: true
  },
  {
    name: 'image',
    label: 'Image',
    type: 'file',
    required: true
  }
]

const TestimonialFormTemplate: React.FC = () => {

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {

    testimonials,
    addTestimonial,
    updateTestimonial,
    checkTestimonialNameExists,
    fetchTestimonial

  } = useTestimonialStore();

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    designation: '',
    message: '',
    rating: 0,
    image: null
  });

  const debouncedName = useDebounce(formData.name, 500);

  const [preview, setPreview] = useState<string | null>('/preview-image.jpeg');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!testimonials.length) {
      fetchTestimonial();
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const testimonial = testimonials.find((b) => b._id === id);

      if (testimonial) {
        setFormData({
          name: testimonial.name,
          designation: testimonial.designation || '',
          message: testimonial.message || '',
          rating: testimonial.rating,
          image: null
        });

        if (testimonial.image) {
          setPreview(`http://localhost:5000/${testimonial.image}`);
        }
      }
    }
  }, [id, testimonials]);

  useEffect(() => {

    if (!debouncedName.trim()) return;

    if (errors.name && errors.name !== 'Name already exists') return;

    const trimmedValue = debouncedName.trim().toLowerCase();

    if (checkTestimonialNameExists(trimmedValue, id)) {
      setErrors((prev) => ({
        ...prev,
        name: 'Name already exists',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        name: undefined,
      }));
    }

  }, [debouncedName, id, errors.name]);

  const handleChange = (
    name: keyof TestimonialFormData,
    value: string | number | File | null
  ) => {

    if (name === 'name' && typeof value === 'string') {

      if (value.startsWith(' ')) {
        setErrors((prev) => ({
          ...prev,
          name: 'Name cannot start with a space',
        }));

        setFormData((prev) => ({ ...prev, name: value }));
        return;
      }
      setErrors((prev) => ({
        ...prev,
        name: undefined,
      }));

    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const fieldErrors = validateTestimonialForm(
      { ...formData, [name]: value },
      isEditMode
    );

    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateTestimonialForm(formData, isEditMode);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      const data = new FormData();

      const formattedName =
        formData.name.charAt(0).toUpperCase() + formData.name.slice(1);

      data.append('name', formattedName);
      data.append('designation', formData.designation);
      data.append('message', formData.message)
      data.append('rating', String(formData.rating))
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (isEditMode && id) {
        await updateTestimonial(id, data);
        toast.success('Testimponial updated successfully');
      } else {
        await addTestimonial(data);
        toast.success('Testimonial added successfully');
      }

      navigate('/testimonial');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (
    file: File | null,
    inputElement?: HTMLInputElement
  ) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {

      setErrors((prev) => ({
        ...prev,
        image: 'Only JPG, PNG, or WEBP images are allowed',
      }));

      if (inputElement) inputElement.value = '';


      setTimeout(() => {
        setErrors((prev) => ({
          ...prev,
          image: undefined,
        }));
      }, 5000);

      return;
    }

    setErrors((prev) => ({
      ...prev,
      image: undefined,
    }));

    handleChange('image', file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName=""
        addButtonLink="/testimonial"
        type={isEditMode ? 'Edit' : 'Add'}
      />


      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >

        {/* Name */}
        <FormField
          field={TestimonialFields[0]}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />


        {/* Designation */}
        <FormField
          field={TestimonialFields[1]}
          value={formData.designation}
          onChange={(e) => handleChange('designation', e.target.value)}
          error={errors.designation}
        />

        {/* Message */}
        <FormField
          field={TestimonialFields[2]}
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          error={errors.message}
        />

        {/* Image */}
        <FormField
          field={TestimonialFields[3]}
          value={undefined}
          onChange={(e) => {
            const input = e.target as HTMLInputElement;
            const file = input.files?.[0] || null;
            handleImageChange(file, input);
          }}
          error={errors.image}
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-2 w-32 h-32 object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/preview-image.jpeg';
            }}
          />
        )}

 {/* Rating */}
{/* Rating */}
<div className="flex items-center gap-4 flex-wrap">
  <label className="text-base sm:text-lg font-medium text-gray-700">
    Rating
  </label>

  <div
    className="flex gap-2 sm:gap-3
               text-2xl sm:text-3xl md:text-4xl
               cursor-pointer select-none"
  >
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() =>
          handleChange(
            "rating",
            formData.rating === star ? 0 : star
          )
        }
        className={`transition-all duration-200 ${
          star <= formData.rating
            ? "text-yellow-400 scale-110"
            : "text-gray-300 hover:text-yellow-300 hover:scale-105"
        }`}
      >
        {star <= formData.rating ? "★" : "☆"}
      </span>
    ))}
  </div>
</div>






        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditMode
                ? 'Update'
                : 'Add'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default TestimonialFormTemplate;


