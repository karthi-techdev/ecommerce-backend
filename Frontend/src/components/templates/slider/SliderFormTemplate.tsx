import React, { useEffect, useState,useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { validateSliderForm, type SliderFormData, type ValidationErrors } from '../../validations/sliderValidation';
import { useSliderStore } from '../../../stores/sliderStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import ImportedURL from '../../../common/urls';
import defaultImg from '../../../assets/images/preview-image.jpg.jpeg'
const sliderFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type:'text',
    required:true,
    placeholder: 'Enter your title...',
    className:'col-span-6',
  },
  {
    name: 'highlightsText',
    label: 'Highlight Text',
    type: 'text',
    placeholder: 'Enter the Highlights Text...',
    className:'col-span-6',
  },
  {
    name: 'serialNumber',
    label: 'Serial Number',
    type: 'number',
    required:true,
    placeholder: 'Enter the Serial Number...',
    className:'col-span-6',
  },{
    name: 'buttonName',
    label: 'Button Name',
    type: 'text',
    placeholder: 'Enter the Button Name...',
    className:'col-span-6',
  },{
    name: 'buttonUrl',
    label: 'Button Url',
    type: 'text',
    placeholder: 'Enter the Button Url...',
    className:'col-span-6',
  },{
    name: 'image',
    label: 'Image',
    type:'file',
    required:true,
    placeholder: 'Enter the image...',
     className: 'col-span-12',
  },
];

const SliderFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ALLOWED_IMAGE_TYPES = ['image/jpeg','image/jpg','image/png','image/webp',];
  const { fetchSlider, addSlider, updateSlider } = useSliderStore();
  const [preview, setPreview] = useState<string>(defaultImg);
  const existingImageUrl=useRef<string>(defaultImg);
const [fileError, setFileError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SliderFormData>({
    title: '',
    highlightsText: '',
    buttonName:'',
    buttonUrl:'',
    image:null,
    serialNumber:0
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const slider = await fetchSlider(id);
        if (slider) {
          setFormData({
            title: slider.title || '',
            highlightsText: slider.highlightsText || '',
            buttonName: slider.buttonName || '',
            buttonUrl: slider.buttonUrl || '',
            serialNumber: slider.serialNumber.valueOf() || 0,
            image:slider.image||null
          });
          if (slider.image) {
            const url = `${ImportedURL.FILEURL}${
            slider.image.toString().startsWith('/') 
              ? slider.image.slice(1) 
              : slider.image
          }`;
          existingImageUrl.current=url;
          setPreview(url);
        } else {
          setPreview(defaultImg);
        }
        } else {
          toast.error('Failed to load Slider data');
        }
      }
    };
    fetchData();
  }, [id, fetchSlider]);

 const handleChange = (e: any) => {
const { name, value, files } = e.target;
    console.log(name,'name',value,'value',files,'files')
  setErrors(prev => ({ ...prev, [name]: undefined }));
  setFileError(null);

 if (name === "image") {
  const file = files?.[0] ?? (value instanceof File ? value : null);
  
  if (!file) {
    setFormData(prev => ({ ...prev, image: null }));
    setPreview(id ? existingImageUrl.current : defaultImg);
    return;
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    setFileError("Only JPG, PNG or WEBP images are allowed");
    setTimeout(() => setFileError(null), 4000);
   if (!id) {
    setFormData(prev => ({ ...prev, image: null }));
  }
    setPreview(id ? existingImageUrl.current : defaultImg);
    return;
  }

  setPreview(URL.createObjectURL(file));
  setFormData(prev => ({ ...prev, image: file }));
  return;
}

  if (name !== "image") {
    setFormData(prev => ({
    ...prev,
    [name]: value
  }));

  const fieldValidationErrors = validateSliderForm({
    ...formData,
    [name]: value
  });

  setErrors(prev => ({
    ...prev,
    [name]: fieldValidationErrors[name as keyof ValidationErrors]
  }));
  }
};
// useEffect(() => {
//   return () => {
//     if (preview && preview !== defaultImg) {
//       URL.revokeObjectURL(preview);
//     }
//   };
// }, [preview]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateSliderForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (id) {
        await updateSlider(id, formData);
        toast.success('Slider updated successfully');
      } else {
        await addSlider({ ...formData});
        toast.success('Slider added successfully');
      }
      navigate('/slider');
    }catch (error: any) {
  const message =
    typeof error === "string"
      ? error
      : error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

  toast.error(message);
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Slider"
        addButtonLink="/slider"
        type={id ? 'Edit' : 'Add'}
      />
      <form onSubmit={handleSubmit}  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-12 gap-6">
          {sliderFields.map((field) => (
            <FormField
              key={field.name}
              field={{
                ...field
              }}
              value={formData[field.name as keyof SliderFormData]}
              onChange={handleChange}
            error={field.name === 'image' ? fileError || errors[field.name as keyof ValidationErrors] : errors[field.name as keyof ValidationErrors]}
              isRequired={field.required}
            />
          ))}
          <div className="col-span-12">
    <div className="h-24 w-24 border border-gray-300 rounded flex items-center justify-center">
      <img
        src={preview}
        className="h-full w-full object-cover rounded"
        
      />
    </div>
  </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SliderFormTemplate;