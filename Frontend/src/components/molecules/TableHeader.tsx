import React from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import Input from '../atoms/Input';
import ButtonLink from '../atoms/ButtonLink';
import StatCard from '../atoms/StatCard';
import { useLocation } from 'react-router-dom';


interface StatFilter {
  id: string;
  title: string;
  value: number;
  trend: 'up' | 'down';
  change: string;
  icon: React.ReactNode;
}

interface TableHeaderProps {
  searchTerm?: string;
  onSearchChange: (term: string) => void;
  addButtonLabel: string;
  addButtonLink: string;
  managementName: string;
  statFilters?: StatFilter[];
  selectedFilterId?: string;
  onSelectFilter?: (id: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  searchTerm,
  onSearchChange,
  addButtonLabel,
  addButtonLink,
  managementName,
  statFilters = [],
  selectedFilterId,
  onSelectFilter,
}) => {
  const location = useLocation();
  const isTrashPage = location.pathname.includes('/trash');
  return (
    <div className="mb-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{managementName}</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <Input
              aria-label="Search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          {!isTrashPage && (
            <ButtonLink to={addButtonLink}>
              <FiPlus className="mr-2" />
              {addButtonLabel}
            </ButtonLink>
          )}

        </div>
      </div>

      {statFilters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statFilters.map((stat) => (
            <StatCard
              key={stat.id}
              {...stat}
              isActive={selectedFilterId === stat.id}
              onClick={() => onSelectFilter?.(stat.id) }
              
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TableHeader;