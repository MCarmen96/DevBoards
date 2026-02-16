'use client';

import { PinCard } from './PinCard';
import { PinWithRelations, PinWithAuthor } from '@/types';

interface PinGridProps {
  pins: (PinWithRelations | PinWithAuthor)[];
  loading?: boolean;
  showRemoveButton?: boolean;
  onRemove?: (pinId: string) => void;
}

export function PinGrid({ pins, loading, showRemoveButton, onRemove }: PinGridProps) {
  // Pre-calculated heights for skeleton items
  const skeletonCount = 12;

  if (loading) {
    return (
      <div className="masonry-grid w-100">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="rounded-3 skeleton"
            style={{ aspectRatio: '4/3' }}
          />
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <div className="rounded-circle bg-secondary-subtle d-flex align-items-center justify-content-center mb-4" style={{ width: '6rem', height: '6rem' }}>
          <i className="bi bi-image fs-1 text-secondary"></i>
        </div>
        <h5 className="fw-medium mb-1">No hay pins</h5>
        <p className="text-secondary">Aún no hay contenido para mostrar</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid w-100">
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pin={pin as PinWithRelations}
          showRemoveButton={showRemoveButton}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
