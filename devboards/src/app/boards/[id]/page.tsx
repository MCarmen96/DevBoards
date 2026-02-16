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
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '1280px' }}>
        <h1 className="h4 fw-bold text-body mb-4">{error}</h1>
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
    <div className="container py-4" style={{ maxWidth: '1280px' }}>
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-start justify-content-between">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h1 className="h3 fw-bold text-body">{board.name}</h1>
              {board.isPrivate && (
                <span className="badge bg-secondary d-inline-flex align-items-center gap-1">
                  <i className="bi bi-lock-fill small"></i>
                  Privado
                </span>
              )}
            </div>
            {board.description && (
              <p className="mt-2 text-secondary">{board.description}</p>
            )}
            <p className="mt-1 small text-secondary">
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
        <div className="text-center py-5">
          <div className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '96px', height: '96px' }}>
            <i className="bi bi-image text-secondary fs-1"></i>
          </div>
          <h2 className="h5 fw-semibold text-body mb-2">
            Este tablero está vacío
          </h2>
          <p className="text-secondary mb-4">
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
