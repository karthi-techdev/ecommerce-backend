import React from 'react';
import { Link } from 'react-router-dom';

interface DropdownItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/50 transition-colors flex items-center"
  >
    {icon}
    <span className="ml-2">{label}</span>
  </Link>
);

export default DropdownItem;