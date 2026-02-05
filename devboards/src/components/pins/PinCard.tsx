'use client';

import Link from 'next/link';
import { SaveButton } from './SaveButton';
import { getLanguageColor } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';

interface PinCardProps {
  pin: PinWithRelations;
}

export function PinCard({ pin }: PinCardProps) {
  const { data: session } = useSession();
  
  // Verificar si el usuario actual ha guardado este pin
  const isSaved = session?.user
    ? pin.savedBy?.some((sp) => sp.userId === session.user.id)
    : false;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 break-inside-avoid mb-4">
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

      {/* Botón guardar (visible en hover) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <SaveButton pinId={pin.id} initialSaved={isSaved} />
      </div>

      {/* Información del pin */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{pin.title}</h3>
        
        {pin.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {pin.author.image ? (
                <img
                  src={pin.author.image}
                  alt={pin.author.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-600">
                  {pin.author.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-600 group-hover/author:text-gray-900">
              {pin.author.name}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
