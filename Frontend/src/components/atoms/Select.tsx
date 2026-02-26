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
  error?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  className = '',
  placeholder = 'Select...',
  isMulti = false,
  error,
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
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: error
              ? "#ef4444" 
              : state.isFocused
              ? "#6366f1"
              : base.borderColor,
            boxShadow: state.isFocused
              ? error
                ? "0 0 0 1px #ef4444"
                : "0 0 0 1px #6366f1"
              : "none",
            "&:hover": {
              borderColor: error ? "#ef4444" : "#6366f1",
            },
            minHeight: "42px",
          }),
        }}
    />
  );
};

export default CustomSelect;
