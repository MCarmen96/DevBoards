'use client';

import { useState } from 'react';

interface FilterChipsProps {
  onFilterChange?: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'All', icon: null },
  { id: 'animations', label: 'Animations', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' },
  { id: 'layouts', label: 'Layouts', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
  { id: 'forms', label: 'Forms', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'trending', label: 'Trending', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { id: 'react', label: 'React', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { id: 'css', label: 'CSS Only', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
];

export function FilterChips({ onFilterChange }: FilterChipsProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg pl-4 pr-4 transition-all hover:scale-105 active:scale-95 ${
            activeFilter === filter.id
              ? 'bg-[#0d33f2] text-white'
              : 'bg-slate-200 dark:bg-[#222949] hover:bg-slate-300 dark:hover:bg-[#2f3861] group'
          }`}
        >
          {filter.icon && (
            <svg
              className={`w-[18px] h-[18px] ${
                activeFilter === filter.id
                  ? 'text-white'
                  : 'text-slate-600 dark:text-white group-hover:text-[#0d33f2]'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={filter.icon} />
            </svg>
          )}
          <p
            className={`text-sm font-medium ${
              activeFilter === filter.id ? 'text-white' : 'text-slate-700 dark:text-white'
            }`}
          >
            {filter.label}
          </p>
        </button>
      ))}
    </div>
  );
}
