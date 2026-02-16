'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PinWithRelations } from '@/types';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PinWithRelations[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchPins = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.pins || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Error en búsqueda:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchPins, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (pinId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/pin/${pinId}`);
  };

  return (
    <div ref={searchRef} className="position-relative w-100">
      <div className="input-group">
        <span className="input-group-text bg-transparent border-end-0">
          <i className="bi bi-search text-secondary"></i>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar snippets, frameworks, autores..."
          className="form-control border-start-0 ps-0"
        />
        {isLoading && (
          <span className="input-group-text bg-transparent border-start-0">
            <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
          </span>
        )}
      </div>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="position-absolute top-100 mt-2 w-100 bg-body rounded-3 shadow-lg border overflow-auto" style={{ maxHeight: '24rem', zIndex: 1050 }}>
          {results.map((pin) => (
            <button
              key={pin.id}
              onClick={() => handleSelect(pin.id)}
              className="w-100 d-flex align-items-center gap-3 p-3 border-0 bg-transparent text-start"
              style={{ cursor: 'pointer' }}
            >
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="rounded"
                style={{ width: '48px', height: '48px', objectFit: 'cover' }}
              />
              <div className="flex-grow-1 overflow-hidden">
                <p className="fw-medium mb-0 text-truncate">
                  {pin.title}
                </p>
                <div className="d-flex align-items-center gap-2 small text-secondary">
                  {pin.language && (
                    <span className="badge bg-secondary-subtle text-secondary">
                      {pin.language}
                    </span>
                  )}
                  {pin.tags && (
                    <span className="text-truncate">{pin.tags.split(',')[0]}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="position-absolute top-100 mt-2 w-100 bg-body rounded-3 shadow-lg border p-4 text-center text-secondary" style={{ zIndex: 1050 }}>
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
