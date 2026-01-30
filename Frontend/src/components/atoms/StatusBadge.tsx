import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'inactive';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseStyle =
    'px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center transition-colors duration-200';
  const colorStyle =
    status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  return <span className={`${baseStyle} ${colorStyle}`}>{status}</span>;
};

export default StatusBadge;