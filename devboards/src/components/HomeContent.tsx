'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PinGrid } from '@/components/pins/PinGrid';
import { FilterChips } from '@/components/ui/FilterChips';
import { FAB } from '@/components/ui/FAB';
import { useAppTheme } from '@/context/ThemeContext';
import { PinWithRelations } from '@/types';

interface HomeContentProps {
  pins: PinWithRelations[];
}

export function HomeContent({ pins }: HomeContentProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const { theme } = useAppTheme();
  const [isDelayedLoading, setIsDelayedLoading] = useState(false);
  const isFirstRender = useRef(true);

  // Anti-patrón: Carga tardía sin feedback en tema no-usabilidad
  useEffect(() => {
    // Ignorar el primer render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (theme === 'no-usabilidad') {
      setIsDelayedLoading(true);
      const timer = setTimeout(() => {
        setIsDelayedLoading(false);
      }, 10000); // 10 segundos de espera sin feedback

      return () => clearTimeout(timer);
    }
  }, [activeFilter, theme]);

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
      {/* Indicador de ubicación - Solo visible en tema Usabilidad */}
      {theme === 'usabilidad' && (
        <nav aria-label="Ubicación actual" className="mb-3">
          <div className="d-inline-flex align-items-center gap-2 small bg-body-tertiary rounded-2 px-3 py-2">
            <i className="bi bi-house-door text-primary"></i>
            <span className="text-primary fw-medium">Estás en: Explorar Pins</span>
          </div>
        </nav>
      )}

      {/* Filter Chips */}
      <FilterChips onFilterChange={setActiveFilter} />

      {/* Texto secretamente clicable - Solo en tema no-usabilidad (anti-patrón) */}
      {theme === 'no-usabilidad' && (
        <p className="text-secondary small mb-3">
          Mostrando {filteredPins.length} pins de la comunidad. {' '}
          <Link 
            href="/saved" 
            className="text-secondary"
            style={{ textDecoration: 'none', cursor: 'text' }}
          >
            Los resultados pueden variar según tu ubicación y preferencias de navegación configuradas en tu cuenta.
          </Link>
        </p>
      )}

      {/* Pin Grid - En no-usabilidad se oculta durante 10s al filtrar (sin feedback) */}
      {!isDelayedLoading && <PinGrid pins={filteredPins} />}
      
      {/* Espacio vacío durante carga tardía (anti-patrón: sin indicador) */}
      {isDelayedLoading && theme === 'no-usabilidad' && (
        <div style={{ minHeight: '400px' }}></div>
      )}

      {/* Empty State for filtered results */}
      {!isDelayedLoading && filteredPins.length === 0 && pins.length > 0 && (
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
