'use client';

import { useState, useEffect, use } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PinGrid } from '@/components/pins/PinGrid';
import { Button } from '@/components/ui/Button';
import { BoardWithPins } from '@/types';

interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [board, setBoard] = useState<BoardWithPins | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBoard();
  }, [id]);

  const fetchBoard = async () => {
    try {
      const response = await fetch(`/api/boards/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Tablero no encontrado');
        } else if (response.status === 403) {
          setError('No tienes permiso para ver este tablero');
        } else {
          setError('Error al cargar el tablero');
        }
        return;
      }
      const data = await response.json();
      setBoard(data);
    } catch (err) {
      setError('Error al cargar el tablero');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este tablero?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/boards');
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleRemovePin = async (pinId: string) => {
    try {
      const response = await fetch(`/api/boards/${id}/pins`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinId }),
      });

      if (response.ok) {
        setBoard((prev) =>
          prev
            ? {
                ...prev,
                pins: prev.pins.filter((bp) => bp.pin.id !== pinId),
                _count: { pins: prev._count.pins - 1 },
              }
            : null
        );
      }
    } catch (error) {
      console.error('Error removing pin:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{error}</h1>
        <Link href="/boards">
          <Button variant="secondary">Volver a mis tableros</Button>
        </Link>
      </div>
    );
  }

  if (!board) return null;

  const isOwner = session?.user?.id === board.userId;
  const pins = board.pins.map((bp) => bp.pin);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{board.name}</h1>
              {board.isPrivate && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Privado
                </span>
              )}
            </div>
            {board.description && (
              <p className="mt-2 text-gray-600 dark:text-gray-400">{board.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
              {board._count.pins} {board._count.pins === 1 ? 'pin' : 'pins'}
            </p>
          </div>

          {isOwner && (
            <Button variant="secondary" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Eliminando...' : 'Eliminar tablero'}
            </Button>
          )}
        </div>
      </div>

      {/* Pins */}
      {pins.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Este tablero está vacío
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Guarda pins desde el feed para añadirlos a este tablero
          </p>
          <Link href="/">
            <Button>Explorar pins</Button>
          </Link>
        </div>
      ) : (
        <PinGrid
          pins={pins}
          showRemoveButton={isOwner}
          onRemove={handleRemovePin}
        />
      )}
    </div>
  );
}
