// Radio.tsx
import React from 'react';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioProps {
  name: string;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: RadioOption[];
  disabled?: boolean;
  label?: string; 
  className?: string; 
}

const Radio: React.FC<RadioProps> = ({ name, selectedValue, onChange, options = [], disabled, label, className }) => (
  <div className={`flex flex-col space-y-2 ${className || ''}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <div className="flex items-center gap-4">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={selectedValue === opt.value}
            onChange={onChange}
            className="text-indigo-600 focus:ring-indigo-500"
            disabled={disabled}
          />
          {opt.label}
        </label>
      ))}
    </div>
  </div>
);

export default Radio;