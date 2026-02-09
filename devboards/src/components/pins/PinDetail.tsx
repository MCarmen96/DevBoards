'use client';

import Link from 'next/link';
import { SaveButton } from './SaveButton';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { FollowButton } from '@/components/ui/FollowButton';
import { getLanguageColor } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';

interface PinDetailProps {
  pin: PinWithRelations;
}

export function PinDetail({ pin }: PinDetailProps) {
  const { data: session } = useSession();
  
  const isSaved = session?.user
    ? pin.savedBy?.some((sp) => sp.userId === session.user.id)
    : false;

  const isLiked = session?.user
    ? pin.likes?.some((like) => like.userId === session.user.id)
    : false;

  const isAuthor = session?.user?.id === pin.authorId;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden">
        {/* Imagen */}
        <div className="bg-gray-100 dark:bg-gray-800">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenido */}
        <div className="p-8 flex flex-col">
          {/* Acciones */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {pin.language && (
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getLanguageColor(
                    pin.language
                  )}`}
                >
                  {pin.language.toUpperCase()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isAuthor && (
                <Link
                  href={`/pin/${pin.id}/edit`}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Editar
                </Link>
              )}
              <SaveButton pinId={pin.id} initialSaved={isSaved} />
            </div>
          </div>

          {/* Título y descripción */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{pin.title}</h1>
          
          {pin.description && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Descripción Técnica
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{pin.description}</p>
            </div>
          )}

          {/* Código */}
          {pin.codeSnippet && (
            <div className="mb-6 flex-1">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Código
              </h2>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm font-mono max-h-64 overflow-y-auto">
                  <code>{pin.codeSnippet}</code>
                </pre>
                <button
                  onClick={() => navigator.clipboard.writeText(pin.codeSnippet!)}
                  className="absolute top-2 right-2 px-3 py-1 text-xs bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Copiar
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          {pin.tags && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {pin.tags.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Likes y comentarios */}
          <div className="flex items-center gap-4 mb-6">
            <LikeButton
              pinId={pin.id}
              initialLiked={isLiked ?? false}
              initialCount={pin._count?.likes || 0}
            />
          </div>

          {/* Autor */}
          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Link
                href={`/profile/${pin.author.id}`}
                className="flex items-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                  {pin.author.image ? (
                    <img
                      src={pin.author.image}
                      alt={pin.author.name || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg text-gray-600 dark:text-gray-300">
                      {pin.author.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-red-500">
                    {pin.author.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Autor del pin</p>
                </div>
              </Link>
              
              {!isAuthor && (
                <FollowButton userId={pin.author.id} />
              )}
            </div>
          </div>

          {/* Sección de comentarios */}
          <CommentSection
            pinId={pin.id}
            initialCount={pin._count?.comments || 0}
          />
        </div>
      </div>
    </div>
  );
}
