import React from 'react';
import LabeledInput from './LabeledInput';
import type { FieldConfig } from '../../types/common';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange?: (e: { target: { name: string; value: any } }) => void;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error }) => {
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
        required={field.required}
        disabled={field.disabled}
        aria-label={field.ariaLabel}
        error={error}
        options={field.options}
      />
    </div>
  );
};

export default FormField;