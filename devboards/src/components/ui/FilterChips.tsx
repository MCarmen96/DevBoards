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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
    onFilterChange?.(filterId);
    setDropdownOpen(false);
  };

  const activeLabel = filters.find(f => f.id === activeFilter)?.label || 'All';
  const activeIcon = filters.find(f => f.id === activeFilter)?.icon;

  return (
    <>
      {/* Mobile: Dropdown */}
      <div className="d-md-none mb-3 dropdown">
        <button
          className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2 w-100 justify-content-between"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
        >
          <span className="d-flex align-items-center gap-2">
            <i className="bi bi-funnel"></i>
            {activeIcon && <i className={`bi ${activeIcon}`}></i>}
            {activeLabel}
          </span>
          <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
        </button>
        {dropdownOpen && (
          <ul className="dropdown-menu show w-100 mt-1 shadow-sm">
            {filters.map((filter) => (
              <li key={filter.id}>
                <button
                  onClick={() => handleFilterClick(filter.id)}
                  className={`dropdown-item d-flex align-items-center gap-2 ${
                    activeFilter === filter.id ? 'active' : ''
                  }`}
                >
                  {filter.icon && <i className={`bi ${filter.icon}`}></i>}
                  {filter.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: Inline chips */}
      <div className="d-none d-md-flex gap-2 mb-3 overflow-auto pb-2 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter.id}
            id={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`btn btn-sm d-flex align-items-center gap-2 flex-shrink-0 ${
              activeFilter === filter.id
                ? 'btn-primary'
                : 'btn-outline-dark'
            }`}
          >
            {filter.icon && <i className={`bi ${filter.icon}`}></i>}
            <span>{filter.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
