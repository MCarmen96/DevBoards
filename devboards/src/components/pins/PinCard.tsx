'use client';

import Link from 'next/link';
import { SaveButton } from './SaveButton';
import { getLanguageColor } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';

interface PinCardProps {
  pin: PinWithRelations;
  showRemoveButton?: boolean;
  onRemove?: (pinId: string) => void;
}

export function PinCard({ pin, showRemoveButton, onRemove }: PinCardProps) {
  const { data: session } = useSession();
  
  // Verificar si el usuario actual ha guardado este pin
  const isSaved = session?.user
    ? pin.savedBy?.some((sp) => sp.userId === session.user.id)
    : false;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid mb-4">
      <Link href={`/pin/${pin.id}`}>
        <div className="relative">
          {/* Imagen del pin */}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Botones (visibles en hover) */}
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(pin.id);
            }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
            title="Quitar del tablero"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <SaveButton pinId={pin.id} initialSaved={isSaved} />
      </div>

      {/* Información del pin */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{pin.title}</h3>
        
        {pin.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {pin.description}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Tag de lenguaje */}
          {pin.language && (
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getLanguageColor(
                pin.language
              )}`}
            >
              {pin.language.toUpperCase()}
            </span>
          )}

          {/* Info del autor */}
          <Link
            href={`/profile/${pin.author.id}`}
            className="flex items-center gap-2 group/author"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              {pin.author.image ? (
                <img
                  src={pin.author.image}
                  alt={pin.author.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {pin.author.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 group-hover/author:text-gray-900 dark:group-hover/author:text-white">
              {pin.author.name}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
