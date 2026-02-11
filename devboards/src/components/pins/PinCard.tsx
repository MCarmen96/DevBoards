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
    <div className="masonry-item group relative flex flex-col gap-3 rounded-xl bg-white dark:bg-[#1e2337] p-3 shadow-sm hover:shadow-xl hover:shadow-[#0d33f2]/10 transition-all duration-300 border border-slate-200 dark:border-transparent hover:border-[#0d33f2]/50 dark:hover:border-[#0d33f2]/50">
      <Link href={`/pin/${pin.id}`}>
        <div className="relative w-full overflow-hidden rounded-lg">
          {/* Imagen del pin */}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full object-cover"
            loading="lazy"
          />
          
          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>
      </Link>

      {/* Botones de acción (visibles en hover) */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {showRemoveButton && onRemove && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(pin.id);
            }}
            className="bg-black/50 hover:bg-[#0d33f2] text-white p-2 rounded-lg backdrop-blur-md transition-colors"
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
      <div className="px-1 pb-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-slate-900 dark:text-white text-base font-semibold leading-tight group-hover:text-[#0d33f2] transition-colors">
            {pin.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Info del autor */}
          <Link
            href={`/profile/${pin.author.id}`}
            className="flex items-center gap-2 group/author"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-6 ring-1 ring-slate-200 dark:ring-white/10 overflow-hidden">
              {pin.author.image ? (
                <img
                  src={pin.author.image}
                  alt={pin.author.name || ''}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-300 dark:bg-[#222949] flex items-center justify-center">
                  <span className="text-[10px] text-slate-600 dark:text-slate-300">
                    {pin.author.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>
            <span className="text-slate-500 dark:text-[#909acb] text-xs font-medium">
              @{pin.author.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
            </span>
          </Link>

          {/* Tags de lenguaje */}
          <div className="flex gap-1">
            {pin.language && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getLanguageColorStitch(pin.language)}`}>
                {pin.language.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getLanguageColorStitch(language: string): string {
  const colors: Record<string, string> = {
    javascript: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    typescript: 'bg-blue-600/10 text-blue-700 dark:text-blue-400 border-blue-600/20',
    html: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    css: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    react: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    vue: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    tailwind: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  };
  return colors[language.toLowerCase()] || 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
}
