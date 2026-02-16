'use client';

import { useState } from 'react';

interface FilterChipsProps {
  onFilterChange?: (filter: string) => void;
}

const filters = [
  { id: 'all', label: 'All', icon: null },
  { id: 'animations', label: 'Animations', icon: 'bi-play-circle' },
  { id: 'layouts', label: 'Layouts', icon: 'bi-layout-wtf' },
  { id: 'forms', label: 'Forms', icon: 'bi-file-earmark-text' },
  { id: 'trending', label: 'Trending', icon: 'bi-lightning' },
  { id: 'react', label: 'React', icon: 'bi-code-slash' },
  { id: 'css', label: 'CSS Only', icon: 'bi-palette' },
];

export function FilterChips({ onFilterChange }: FilterChipsProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <div className="d-flex gap-2 overflow-auto pb-3 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => handleFilterClick(filter.id)}
          className={`btn btn-sm d-flex align-items-center gap-2 flex-shrink-0 ${
            activeFilter === filter.id
              ? 'btn-primary'
              : 'btn-outline-secondary'
          }`}
        >
          {filter.icon && <i className={`bi ${filter.icon}`}></i>}
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
}
