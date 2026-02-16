'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PinGrid } from '@/components/pins/PinGrid';
import { PinWithRelations } from '@/types';

interface ProfilePinsSectionProps {
  pins: PinWithRelations[];
}

export function ProfilePinsSection({ pins }: ProfilePinsSectionProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const sortedPins = [...pins].sort((a, b) => {
    if (sortBy === 'popular') {
      const aLikes = a._count?.likes || 0;
      const bLikes = b._count?.likes || 0;
      return bLikes - aLikes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <>
      {/* Header con filtros */}
      <section className="mb-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <h2 className="h5 fw-bold mb-0">Mis Pins</h2>
          <span className="badge bg-secondary-subtle text-secondary">{pins.length}</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => setSortBy('recent')}
            className={`btn btn-sm ${sortBy === 'recent' ? 'btn-dark' : 'btn-outline-secondary'}`}
          >
            <i className="bi bi-clock me-1"></i>
            Recientes
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`btn btn-sm ${sortBy === 'popular' ? 'btn-dark' : 'btn-outline-secondary'}`}
          >
            <i className="bi bi-heart me-1"></i>
            Populares
          </button>
        </div>
      </section>

      {/* Grid de pins o mensaje vacío */}
      {pins.length > 0 ? (
        <PinGrid pins={sortedPins} />
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-pin-angle fs-1 text-secondary"></i>
          </div>
          <h3 className="h5 text-secondary">Aún no has creado ningún pin</h3>
          <p className="text-muted mb-4">¡Empieza a compartir tu código favorito!</p>
          <Link href="/create" className="btn btn-primary">
            <i className="bi bi-plus-lg me-2"></i>
            Crear mi primer pin
          </Link>
        </div>
      )}
    </>
  );
}
