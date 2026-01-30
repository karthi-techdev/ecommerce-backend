import React from 'react';

interface IconButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, className }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-full hover:bg-gray-100/50 text-gray-400 hover:text-gray-500 transition ${className}`}
    aria-label={children ? 'Icon button' : 'Action button'}
  >
    {children}
  </button>
);

export default IconButton;