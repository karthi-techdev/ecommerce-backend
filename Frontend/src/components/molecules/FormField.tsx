import React from 'react';
import LabeledInput from './LabeledInput';
import type { FieldConfig } from '../../types/common';
import CustomSelect from '../atoms/Select';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange?: (e: { target: { name: string; value: any; } }) => void;
  error?: string;
  isRequired?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error,isRequired }) => {
  if (field.type === 'select') {
    return (
      <div className={field.className || 'md:col-span-6'}>
        <label className="block mb-1 font-medium">
        {field.label} 
        {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>

        <CustomSelect
        options={field.options || []}
        value={
          field.options?.find(opt => opt.value === value) || null
        }
        placeholder={field.placeholder}
        onMenuScrollToBottom={field.onMenuScrollToBottom}
        onInputChange={field.onInputChange}  
        onChange={(selected: any) =>
          onChange?.({
            target: {
              name: field.name,
              value: selected ? selected.value : '',
            },
          })
        }
      />

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
        onChange={onChange}
        placeholder={field.placeholder}
        readonly={field.readonly}
        required={isRequired}
        disabled={field.disabled}
        aria-label={field.ariaLabel} 
        error={error}
        options={field.options}
        previewEnabled={field.previewEnabled}
        withEditor={field.withEditor}
      />
    </div>
  );
};

export default FormField;