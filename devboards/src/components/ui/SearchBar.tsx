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
    <div ref={searchRef} className="relative w-full">
      <label className="flex flex-col w-full h-10">
        <div className="flex w-full flex-1 items-stretch rounded-lg h-full relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-[#909acb] group-focus-within:text-[#0d33f2] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar snippets, frameworks, autores..."
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-2 focus:ring-[#0d33f2]/50 border border-slate-200 dark:border-[#222949] bg-slate-100 dark:bg-[#1c2136] placeholder:text-slate-400 dark:placeholder:text-[#909acb] pl-10 pr-4 text-sm font-normal leading-normal text-slate-900 dark:text-white transition-all"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-[#0d33f2] rounded-full animate-spin" />
            </div>
          )}
        </div>
      </label>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#1e2337] rounded-xl shadow-lg border border-slate-200 dark:border-[#222949] max-h-96 overflow-y-auto z-50">
          {results.map((pin) => (
            <button
              key={pin.id}
              onClick={() => handleSelect(pin.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-[#222949] transition-colors text-left"
            >
              <img
                src={pin.imageUrl}
                alt={pin.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {pin.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-[#909acb]">
                  {pin.language && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#222949] rounded text-xs">
                      {pin.language}
                    </span>
                  )}
                  {pin.tags && (
                    <span className="truncate">{pin.tags.split(',')[0]}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#1e2337] rounded-xl shadow-lg border border-slate-200 dark:border-[#222949] p-4 text-center text-slate-500 dark:text-[#909acb] z-50">
          No se encontraron resultados para &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
