import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  error?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ className = '', error, ...rest }) => (
  <div className="relative">
    <textarea
      {...rest}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        } ${className}`}
    />
    {error && (
      <p className="mt-1 text-sm text-red-500"></p>
    )}
  </div>
);

export default TextArea;