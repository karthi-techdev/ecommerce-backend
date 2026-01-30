import React from 'react';
import Select from 'react-select';
import type { MultiValue, SingleValue, ActionMeta } from 'react-select';

interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: SelectOption | SelectOption[] | null;
  onChange?: (value: SelectOption | SelectOption[] | null) => void;
  className?: string;
  placeholder?: string;
  isMulti?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
  placeholder = 'Select...',
  isMulti = false,
}) => {
  const handleChange = (
    newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
    _: ActionMeta<SelectOption>
  ) => {
    if (isMulti) {
      onChange?.([...(newValue as MultiValue<SelectOption>)]);
    } else {
      onChange?.(newValue as SingleValue<SelectOption>);
    }
  };

  return (
    <Select
      options={options}
      value={value as any} 
      onChange={handleChange}
      isMulti={isMulti}
      placeholder={placeholder}
      className={className}
      classNamePrefix="react-select"
    />
  );
};

export default CustomSelect;
