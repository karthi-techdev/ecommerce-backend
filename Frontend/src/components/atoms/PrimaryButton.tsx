// PrimaryButton.tsx
import React, { memo } from 'react';
import { FiSave, FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface PrimaryButtonProps extends HTMLMotionProps<'button'> {
  label?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: React.ReactNode; // Add children prop
}

const PrimaryButton: React.FC<PrimaryButtonProps> = memo(({
  label,
  className,
  loading = false,
  icon = <FiSave className="mr-2" />,
  type = 'button',
  disabled = false,
  children,
  ...props
}) => {
  const defaultClasses = `
    flex items-center px-4 py-2 
    bg-amber-200 text-white rounded-lg 
    hover:bg-amber-400 
    dark:bg-amber-500 dark:hover:bg-amber-500 
    transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const appliedClassName = className || defaultClasses;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={appliedClassName}
      type={type}
      aria-label={label || (typeof children === 'string' ? children : 'Button')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <FiLoader className="mr-2 animate-spin" /> : icon}
      {children || label } 
    </motion.button>
  );
});

export default PrimaryButton;