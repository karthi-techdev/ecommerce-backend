import React, { memo } from 'react';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';
import Checkbox from '../atoms/Checkbox';
import Radio from '../atoms/Radio';
import CustomSelect from '../atoms/Select';
import type { InputType } from '../../types/common';

interface LabeledInputProps {
  name: string;
  label?: string;
  type: InputType;
  value?: any;
  onChange?: (e: { target: { name: string; value: string | boolean } }) => void;
  placeholder?: string;
  readonly?:boolean;
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
  readonly,
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
          disabled={disabled}
          aria-label={ariaLabel}
          error={error}
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
      ) :  type === 'select' ? (
   <CustomSelect
  options={options}
  value={options.find(opt => opt.value === value) || null}
  onChange={(selected) => {
    onChange?.({
      target: {
        name,
        value: (selected as any)?.value || ''
      }
    });
  }}
  placeholder={`Select ${label}`}
  className={error ? 'react-select-error' : ''}
/>
  ) :(
        <Input
          id={name}
          name={name}
          type={type}
          value={value || ''}
          onChange={handleInputChange}
          readOnly={readonly}
          placeholder={placeholder}
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