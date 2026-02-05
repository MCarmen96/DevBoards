'use client';

import { PinCard } from './PinCard';
import { PinWithRelations } from '@/types';

interface PinGridProps {
  pins: PinWithRelations[];
  loading?: boolean;
}

export function PinGrid({ pins, loading }: PinGridProps) {
  if (loading) {
    return (
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 px-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="break-inside-avoid mb-4 rounded-2xl bg-gray-200 animate-pulse"
            style={{ height: `${Math.random() * 150 + 200}px` }}
          />
        ))}
      </div>
    );
  }

  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
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
        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay pins</h3>
        <p className="text-gray-500">Aún no hay contenido para mostrar</p>
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 px-4">
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </div>
  );
}
