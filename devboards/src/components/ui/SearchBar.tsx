'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PinWithRelations } from '@/types';

interface Suggestion {
  type: 'tag' | 'language' | 'pin';
  value: string;
  pinId?: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PinWithRelations[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cargar sugerencias iniciales
  useEffect(() => {
    const loadInitialSuggestions = async () => {
      try {
        const res = await fetch('/api/search/suggestions');
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error cargando sugerencias:', error);
      }
    };
    loadInitialSuggestions();
  }, []);

  // Buscar sugerencias mientras escribe
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 1) {
        // Mostrar sugerencias populares
        try {
          const res = await fetch('/api/search/suggestions');
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        } catch (error) {
          console.error('Error:', error);
        }
        return;
      }

      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error en sugerencias:', error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounce);
  }, [query]);

  // Buscar pins cuando hay 2+ caracteres
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
        setShowSuggestions(false);
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
    setShowSuggestions(false);
    setQuery('');
    router.push(`/pin/${pinId}`);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'pin' && suggestion.pinId) {
      handleSelect(suggestion.pinId);
    } else {
      setQuery(suggestion.value);
      setShowSuggestions(false);
    }
  };

  const handleFocus = () => {
    if (query.length < 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'tag':
        return 'bi-hash';
      case 'language':
        return 'bi-code-slash';
      case 'pin':
        return 'bi-pin-angle';
      default:
        return 'bi-search';
    }
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
          onFocus={handleFocus}
          placeholder="Buscar snippets, frameworks, autores..."
          className="form-control border-start-0 ps-0"
        />
        {isLoading && (
          <span className="input-group-text bg-transparent border-start-0">
            <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
          </span>
        )}
      </div>

      {/* Sugerencias (mientras escribe) */}
      {showSuggestions && suggestions.length > 0 && query.length < 2 && (
        <div className="position-absolute top-100 mt-2 w-100 bg-body rounded-3 shadow-lg border overflow-hidden" style={{ zIndex: 1050 }}>
          <div className="px-3 py-2 bg-body-tertiary border-bottom">
            <small className="text-secondary fw-medium">
              <i className="bi bi-lightning me-1"></i>
              Sugerencias populares
            </small>
          </div>
          {suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.type}-${suggestion.value}-${idx}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-100 d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent text-start hover-bg-secondary"
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${getIconForType(suggestion.type)} text-secondary`}></i>
              <span className="text-body">{suggestion.value}</span>
              <span className="badge bg-secondary-subtle text-secondary ms-auto small">
                {suggestion.type === 'tag' ? 'etiqueta' : suggestion.type === 'language' ? 'lenguaje' : 'pin'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Sugerencias de autocompletado mientras escribe */}
      {showSuggestions && suggestions.length > 0 && query.length >= 1 && query.length < 2 && (
        <div className="position-absolute top-100 mt-2 w-100 bg-body rounded-3 shadow-lg border overflow-hidden" style={{ zIndex: 1050 }}>
          <div className="px-3 py-2 bg-body-tertiary border-bottom">
            <small className="text-secondary fw-medium">
              <i className="bi bi-search me-1"></i>
              Sugerencias para &quot;{query}&quot;
            </small>
          </div>
          {suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.type}-${suggestion.value}-${idx}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-100 d-flex align-items-center gap-3 px-3 py-2 border-0 bg-transparent text-start"
              style={{ cursor: 'pointer' }}
            >
              <i className={`bi ${getIconForType(suggestion.type)} text-secondary`}></i>
              <span className="text-body">{suggestion.value}</span>
              <span className="badge bg-secondary-subtle text-secondary ms-auto small">
                {suggestion.type === 'tag' ? 'etiqueta' : suggestion.type === 'language' ? 'lenguaje' : 'pin'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Resultados de búsqueda */}
      {isOpen && results.length > 0 && (
        <div className="position-absolute top-100 mt-2 w-100 bg-body rounded-3 shadow-lg border overflow-auto" style={{ maxHeight: '24rem', zIndex: 1050 }}>
          <div className="px-3 py-2 bg-body-tertiary border-bottom">
            <small className="text-secondary fw-medium">
              <i className="bi bi-pin-angle me-1"></i>
              {results.length} resultado{results.length !== 1 ? 's' : ''}
            </small>
          </div>
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
          <i className="bi bi-search fs-4 d-block mb-2"></i>
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
