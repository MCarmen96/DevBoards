'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PinGrid } from '@/components/pins/PinGrid';
import { FilterChips } from '@/components/ui/FilterChips';
import { FAB } from '@/components/ui/FAB';
import { useAppTheme } from '@/context/ThemeContext';
import { PinWithRelations } from '@/types';

interface HomeContentProps {
  pins: PinWithRelations[];
  searchQuery?: string;
  addToBoardId?: string;
  addToBoardName?: string;
}

export function HomeContent({ pins, searchQuery, addToBoardId, addToBoardName }: HomeContentProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const { theme } = useAppTheme();
  const router = useRouter();
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

      {/* Banner modo guided: añadir pins a tablero nuevo */}
      {addToBoardId && (
        <div className="d-flex align-items-center gap-3 mb-4 rounded-3 px-4 py-3 border border-primary" style={{ backgroundColor: 'var(--bs-primary)', color: '#fff' }}>
          <i className="bi bi-bookmark-plus-fill fs-4 flex-shrink-0"></i>
          <div className="flex-grow-1">
            <p className="fw-bold mb-0 fs-6">Añade pins al tablero <span style={{ textDecoration: 'underline' }}>&quot;{decodeURIComponent(addToBoardName || '')}&quot;</span></p>
            <p className="small mb-0 mt-1" style={{ opacity: 0.9 }}>Haz clic en <i className="bi bi-plus-circle fw-bold"></i> en cada pin para seleccionarlo</p>
          </div>
          <button
            onClick={() => router.push('/boards')}
            className="btn btn-light fw-semibold d-flex align-items-center gap-2 flex-shrink-0"
            style={{ color: 'var(--bs-primary)', border: '2px solid #fff', minWidth: '110px' }}
          >
            <i className="bi bi-check2-all"></i>
            Terminar
          </button>
        </div>
      )}

      {/* Banner de resultados de búsqueda */}
      {searchQuery && theme !== 'no-usabilidad' && (
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="flex-grow-1">
            <h2 className="h5 fw-semibold mb-0">
              <i className="bi bi-search me-2 text-primary"></i>
              Resultados para &quot;{searchQuery}&quot;
            </h2>
            <p className="text-secondary small mb-0 mt-1">{pins.length} pin{pins.length !== 1 ? 's' : ''} encontrado{pins.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-x-lg"></i>
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Error de Accesibilidad: Jerarquía de encabezados rota (de h1 a h4) */}
      {theme === 'accesibilidad' && (
        <div className="mb-4">
          <h1 className="visually-hidden">Panel Principal de DevBoards</h1>
          <h4 className="h5 fw-bold text-dark border-start border-4 border-success ps-3 py-1">
            Pins y Componentes de la Comunidad
          </h4>
        </div>
      )}

      {/* Filter Chips - solo cuando no hay búsqueda */}
      {!searchQuery && <FilterChips onFilterChange={setActiveFilter} />}

      {/* Texto secretamente clicable - Solo en tema no-usabilidad (anti-patrón) */}
      {theme === 'no-usabilidad' && pins.length > 0 && (
        <p className="text-secondary small mb-3">
          <Link 
            href="/saved" 
            className="text-secondary"
            style={{ textDecoration: 'none', cursor: 'text' }}
          >
            Mostrando {filteredPins.length} pins de la comunidad. {' '}
            Los resultados pueden variar según tu ubicación y preferencias de navegación configuradas en tu cuenta.
          </Link>
        </p>
      )}

      {/* Pin Grid - En no-usabilidad se oculta durante 10s al filtrar (sin feedback) */}
      {!isDelayedLoading && <PinGrid pins={searchQuery ? pins : filteredPins} addToBoardId={addToBoardId} addToBoardName={addToBoardName} />}
      
      {/* Espacio vacío durante carga tardía (anti-patrón: sin indicador) */}
      {isDelayedLoading && theme === 'no-usabilidad' && (
        <div style={{ minHeight: '400px' }}></div>
      )}

      {/* Empty State for filtered results (only in other themes) */}
      {!isDelayedLoading && filteredPins.length === 0 && pins.length > 0 && theme !== 'no-usabilidad' && (
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

      {/* Empty State for no pins (only in other themes) */}
      {pins.length === 0 && theme !== 'no-usabilidad' && (
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

      {/* Mantenemos un espacio vacío si no hay pins en no-usabilidad, para dar idea de que desapareció todo */}
      {pins.length === 0 && theme === 'no-usabilidad' && (
        <div style={{ minHeight: '80vh' }}></div>
      )}

      {/* FAB */}
      <FAB />
    </>
  );
}
