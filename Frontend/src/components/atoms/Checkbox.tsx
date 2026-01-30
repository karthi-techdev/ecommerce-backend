import React from 'react';

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  label?: string;
  className?: string; // Add className as an optional prop
}

const Checkbox: React.FC<CheckboxProps> = ({ id, name, checked, onChange, disabled, label, className }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <input
      id={id}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      disabled={disabled}
    />
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
  </div>
);

export default Checkbox;