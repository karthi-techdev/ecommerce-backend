import React, { memo } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input: React.FC<InputProps> = memo(({ className = '', value, defaultValue, ...props }) => {
  const defaultClasses =
    'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500';

  // For file input, never set value or defaultValue
  if (props.type === 'file') {
    return (
      <input
        {...props}
        className={`${defaultClasses} ${className}`}
      />
    );
  }
  return (
    <input
      {...props}
      value={value !== undefined ? value : undefined}
      defaultValue={value === undefined ? (defaultValue ?? '') : undefined}
      className={`${defaultClasses} ${className}`}
    />
  );
});

export default Input;