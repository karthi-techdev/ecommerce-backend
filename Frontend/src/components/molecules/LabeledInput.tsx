import React, { memo } from 'react';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';
import Checkbox from '../atoms/Checkbox';
import Radio from '../atoms/Radio';
import type { InputType } from '../../types/common';

interface LabeledInputProps {
  name: string;
  label?: string;
  type: InputType;
  value?: any;
  onChange?: (e: { target: { name: string; value: string | boolean } }) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
  options?: { label: string; value: string }[];
  error?: string;
}

const LabeledInput: React.FC<LabeledInputProps> = memo(({
  name,
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  disabled,
  'aria-label': ariaLabel,
  className,
  options = [],
  error
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: e.target.checked
        }
      });
    }
  };

  return (
    <div className={`flex flex-col ${className || ''}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <TextArea
          id={name}
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel}
          className={error ? 'border-red-500 focus:ring-red-500' : ''}
        />
      ) : type === 'checkbox' ? (
        <Checkbox
          id={name}
          name={name}
          checked={!!value}
          onChange={handleCheckboxChange}
          disabled={disabled}
          label={ariaLabel}
        />
      ) : type === 'radio' ? (
        <Radio
          name={name}
          selectedValue={value || ''}
          onChange={handleInputChange}
          disabled={disabled}
          label={ariaLabel}
          options={options}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          aria-label={ariaLabel}
          className={error ? 'border-red-500' : ''}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
});

LabeledInput.displayName = 'LabeledInput';

export default LabeledInput;