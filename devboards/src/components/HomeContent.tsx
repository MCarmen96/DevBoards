'use client';

import { useState, useMemo } from 'react';
import { PinGrid } from '@/components/pins/PinGrid';
import { FilterChips } from '@/components/ui/FilterChips';
import { FAB } from '@/components/ui/FAB';
import { PinWithRelations } from '@/types';

interface HomeContentProps {
  pins: PinWithRelations[];
}

export function HomeContent({ pins }: HomeContentProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPins = useMemo(() => {
    if (activeFilter === 'all') {
      return pins;
    }

    if (activeFilter === 'trending') {
      // Ordenar por número de saves (más populares)
      return [...pins].sort((a, b) => (b.savedBy?.length || 0) - (a.savedBy?.length || 0));
    }

    // Filtrar por tags o lenguaje
    return pins.filter((pin) => {
      const tags = pin.tags?.toLowerCase() || '';
      const language = pin.language?.toLowerCase() || '';
      const title = pin.title?.toLowerCase() || '';
      const filterLower = activeFilter.toLowerCase();

      // Mapeo de filtros a términos de búsqueda
      const filterMappings: Record<string, string[]> = {
        animations: ['animation', 'animate', 'transition', 'motion', 'keyframe'],
        layouts: ['layout', 'grid', 'flex', 'flexbox', 'container'],
        forms: ['form', 'input', 'button', 'checkbox', 'select'],
        react: ['react', 'jsx', 'component', 'hook'],
        css: ['css', 'style', 'sass', 'scss'],
      };

      const searchTerms = filterMappings[filterLower] || [filterLower];

      return searchTerms.some(
        (term) =>
          tags.includes(term) ||
          language.includes(term) ||
          title.includes(term)
      );
    });
  }, [pins, activeFilter]);

  return (
    <>
      {/* Filter Chips */}
      <FilterChips onFilterChange={setActiveFilter} />

      {/* Pin Grid */}
      <PinGrid pins={filteredPins} />

      {/* Empty State for filtered results */}
      {filteredPins.length === 0 && pins.length > 0 && (
        <div className="text-center py-5">
          <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-search fs-1 text-secondary"></i>
          </div>
          <h3 className="h4 fw-semibold mb-2">
            No hay resultados
          </h3>
          <p className="text-secondary mb-4">
            No se encontraron pins que coincidan con este filtro.
          </p>
          <button 
            onClick={() => setActiveFilter('all')} 
            className="btn btn-primary"
          >
            Ver todos los pins
          </button>
        </div>
      )}

      {/* Empty State for no pins */}
      {pins.length === 0 && (
        <div className="text-center py-5">
          <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-plus-lg fs-1 text-secondary"></i>
          </div>
          <h3 className="h4 fw-semibold mb-2">
            ¡Sé el primero en crear!
          </h3>
          <p className="text-secondary mb-4">
            Aún no hay pins. Crea el primer pin y comparte tu código con la comunidad.
          </p>
          <a href="/create" className="btn btn-primary">
            Crear Pin
          </a>
        </div>
      )}

      {/* FAB */}
      <FAB />
    </>
  );
}
