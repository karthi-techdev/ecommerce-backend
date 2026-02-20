import React from 'react';
import LabeledInput from './LabeledInput';
import type { FieldConfig } from '../../types/common';
import CustomSelect from '../atoms/Select';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange?: (e: { target: { name: string; value: any } }) => void;
  error?: string;
  isRequired?: boolean; 
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
  if (field.type === 'select') {
    return (
      <div className={`md:col-span-6 flex flex-col`}>
  <label className="block mb-1 font-medium text-gray-700 text-sm">
    {field.label}
    {field.required && <span className="text-red-500 ml-1">*</span>}
  </label>

  <div className="w-full">
    <CustomSelect
      options={field.options || []}
      value={field.options?.find(opt => opt.value === value) || null}
      placeholder={field.placeholder}
      onChange={(selected: any) =>
        onChange?.({
          target: {
            name: field.name,
            value: selected ? selected.value : '',
          },
        })
      }
      className={`w-full text-sm rounded-md 
        ${error ? 'border-red-400' : 'border-gray-100'} 
        border`}
    />
  </div>

  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
</div>


    );
  }

  return (
    <div className={field.className || 'md:col-span-6'}>
      <LabeledInput
        name={field.name}
        label={field.label}
        type={field.type}
        value={value}
        

         required={field.required}  
        onChange={onChange}
        placeholder={field.placeholder}
        readonly={field.readonly}
        disabled={field.disabled}
        aria-label={field.ariaLabel} 
        error={error}
        options={field.options}
      />
     
    </div>
  );

};

export default FormField;