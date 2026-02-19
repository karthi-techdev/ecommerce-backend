import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useConfigStore } from '../../../stores/configStore';
import FormHeader from '../../molecules/FormHeader';
import FormField from '../../molecules/FormField';
import type { FieldConfig } from '../../../types/common';
import { handleError } from '../../utils/errorHandler';
import { Trash2 } from 'lucide-react';
import { validateConfigForm } from '../../validations/configValidation';

type ConfigFormData = {
  name: string;
  slug: string;
  options: { key: string; value: string }[];
};

const ConfigFormTemplate: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getConfigById, addConfig, updateConfig } = useConfigStore();

  const [formData, setFormData] = useState<ConfigFormData>({
    name: '',
    slug: '',
    options: []
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const configFields: FieldConfig[] = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      className: 'col-span-6',
      placeholder: 'Enter name...',
      required: true,
      disabled: !!id
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      className: 'col-span-6',
      readonly: true,
      placeholder: 'Slug auto-generated',
      disabled: !!id
    },
  ];

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const config = await getConfigById(id);
        if (!config) return;
        console.log(config, ' config is here')
        setFormData({
          name: config.name || '',
          slug: config.slug || '',
          options:
            config.options?.length > 0
              ? config.options
              : []
        });
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [id]);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;

    let next = { ...formData };
    if (name === 'name') {
      next.name = value;
      next.slug = generateSlug(value);
    } else {
      next[name as keyof ConfigFormData] = value;
    }

    setFormData(next);

    setErrors((prev: any) => ({
      ...prev,
      [name]: undefined
    }));
  };

 const handleConfigFieldChange = (
  index: number,
  field: 'key' | 'value',
  value: string
) => {
  const updatedFields = [...formData.options];
  updatedFields[index][field] = value;

  setFormData(prev => ({
    ...prev,
    options: updatedFields
  }));
  setErrors((prev: any) => {
    const newErrors = { ...prev };
    if (newErrors.options?.[index]) {
      newErrors.options[index][field] = undefined;
    }
    return newErrors;
  });
};

  const addFieldRow = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { key: '', value: '' }]
    }));
  };

  const removeFieldRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateConfigForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;


    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      if (id) {
        const filteredOptions = formData.options.filter(
          row => row.key.trim() !== '' && row.value.trim() !== ''
        );

        const payload = {
          ...formData,
          options: filteredOptions
        };
        

        await updateConfig(id, payload);
        toast.success('Config updated successfully');
      } else {
        console.log(formData)
        const payload = {
          name: formData.name,
          slug: formData.slug
        };
        await addConfig(payload);
        toast.success('Config added successfully');
      }

      navigate('/config');
    } catch (error) {
      handleError(error).forEach(msg => toast.error(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <FormHeader
        managementName="Config"
        addButtonLink="/config"
        type={id ? 'Edit' : 'Add'}
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-12 gap-6">
          {configFields.map(field => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name as keyof ConfigFormData]}
              onChange={handleChange}
              error={errors[field.name]}
              isRequired={field.required}
            />
          ))}

          <div className="col-span-12">
            {id && formData.options.length > 0 && formData.options.map((field, index) => (
              <div key={index} className="flex gap-3 mb-3 items-start">
  <div className="w-full">
    <input
      type="text"
      placeholder="Key"
      value={field.key}
      onChange={e =>
        handleConfigFieldChange(index, 'key', e.target.value)
      }
      className={`border w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.options?.[index]?.key ? 'border-red-500' : ''
      }`}
    />
    {errors.options?.[index]?.key && (
      <p className="text-red-500 text-sm mt-1">
        {errors.options[index].key}
      </p>
    )}
  </div>

  <div className="w-full">
    <input
      type="text"
      placeholder="Value"
      value={field.value}
      onChange={e =>
        handleConfigFieldChange(index, 'value', e.target.value)
      }
      className={`border w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 ${
        errors.options?.[index]?.value ? 'border-red-500' : ''
      }`}
    />
    {errors.options?.[index]?.value && (
      <p className="text-red-500 text-sm mt-1">
        {errors.options[index].value}
      </p>
    )}
  </div>
  <button
    type="button"
    onClick={() => removeFieldRow(index)}
    className="bg-transparent text-red-500 hover:text-red-700 p-2 rounded"
    title="Delete"
  >
    <Trash2 size={16} />
  </button>
</div>

            ))}
            {id &&
              <button
                type="button"
                onClick={addFieldRow}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                + Add
              </button>}

            {errors.configFields && (
              <p className="text-red-500 mt-2">{errors.configFields}</p>
            )}
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

export default ConfigFormTemplate;
