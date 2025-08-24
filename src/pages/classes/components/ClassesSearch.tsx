import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ClassesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ClassesSearch: React.FC<ClassesSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-surface-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

export default ClassesSearch;
