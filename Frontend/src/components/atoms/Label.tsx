import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ children, ...props }) => (
  <label {...props} className={`block text-sm font-medium text-gray-700 mb-1 ${props.className || ''}`}>
    {children}
  </label>
);

export default Label;