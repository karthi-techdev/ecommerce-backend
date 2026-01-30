import React from 'react';
import ButtonLink from '../atoms/ButtonLink';

interface ProfileDropdownItemProps {
  to?: string; // Make to optional
  icon: React.ReactNode;
  label: string;
  onClick?: () => void; // Add optional onClick
  className?: string; // Add optional className for custom styling
}

const ProfileDropdownItem: React.FC<ProfileDropdownItemProps> = ({ to, icon, label, onClick, className = "" }) => {
  const content = (
    <div className="flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <ButtonLink
      to={to || '#'} // Fallback to '#' if to is undefined
      className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors ${className}`}
    >
      {content}
    </ButtonLink>
  );
};

export default ProfileDropdownItem;