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
  if (loading) {
    return (
      <div className="masonry-grid w-full">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="masonry-item rounded-xl bg-slate-200 dark:bg-[#1e2337] animate-pulse"
            style={{ height: `${Math.random() * 150 + 200}px` }}
          />
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-slate-100 dark:bg-[#1e2337] rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-slate-400 dark:text-[#909acb]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No hay pins</h3>
        <p className="text-slate-500 dark:text-[#909acb]">Aún no hay contenido para mostrar</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid w-full">
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
