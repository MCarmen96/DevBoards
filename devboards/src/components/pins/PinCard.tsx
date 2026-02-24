'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SaveButton } from './SaveButton';
import { getLanguageBadgeClass } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';

interface PinCardProps {
  pin: PinWithRelations;
  showRemoveButton?: boolean;
  onRemove?: (pinId: string) => void;
  addToBoardId?: string;
  addToBoardName?: string;
}

export function PinCard({ pin, showRemoveButton, onRemove, addToBoardId, addToBoardName }: PinCardProps) {
  const { data: session } = useSession();
  const { theme } = useAppTheme();
  const isAccessibility = theme === 'accesibilidad';
  const [addedToBoard, setAddedToBoard] = useState(false);
  const [addingToBoard, setAddingToBoard] = useState(false);

  const handleToggleBoard = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!addToBoardId || addingToBoard) return;
    setAddingToBoard(true);
    try {
      if (addedToBoard) {
        // Deseleccionar: quitar del tablero
        const res = await fetch(`/api/boards/${addToBoardId}/pins`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinId: pin.id }),
        });
        if (res.ok) setAddedToBoard(false);
      } else {
        // Seleccionar: añadir al tablero
        const res = await fetch(`/api/boards/${addToBoardId}/pins`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinId: pin.id }),
        });
        if (res.ok) setAddedToBoard(true);
      }
    } finally {
      setAddingToBoard(false);
    }
  };
  
  const isSaved = session?.user
    ? pin.savedBy?.some((sp) => sp.userId === session.user.id)
    : false;

  return (
    <div className={`card db-card pin-card rounded-3 overflow-hidden h-100${addToBoardId ? ' pin-card-guided' : ''}${addedToBoard ? ' pin-card-selected' : ''}`}>
      <Link href={`/pin/${pin.id}`} className="text-decoration-none">
        <div className="position-relative" style={{ aspectRatio: '4/3' }}>
          <img
            src={pin.imageUrl}
            alt={isAccessibility ? '' : pin.title}
            className="w-100 h-100 object-fit-cover"
            loading="lazy"
          />
          {/* Overlay de selección cuando el pin está añadido al tablero */}
          {addedToBoard && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
              style={{ backgroundColor: 'rgba(25, 135, 84, 0.55)', pointerEvents: 'none' }}
            >
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center shadow" style={{ width: '48px', height: '48px' }}>
                <i className="bi bi-check2 text-white fs-4 fw-bold"></i>
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons - Solo visible si hay sesión */}
      {session?.user && (
        <div className="overlay-buttons position-absolute top-0 end-0 p-2 d-flex gap-2">
          {showRemoveButton && onRemove && (
            <button
              onClick={(e) => { e.preventDefault(); onRemove(pin.id); }}
              className="btn btn-dark btn-sm rounded-2"
              title="Quitar del tablero"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
          {/* Botón rápido para añadir/quitar del tablero en modo guided (solo usabilidad) */}
          {addToBoardId && (
            <button
              onClick={handleToggleBoard}
              className={`btn btn-sm rounded-2 fw-semibold ${
                addedToBoard ? 'btn-success' : 'btn-primary'
              }`}
              title={addedToBoard ? 'Quitar del tablero' : `Añadir a ${addToBoardName || 'tablero'}`}
              disabled={addingToBoard}
            >
              {addingToBoard ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : addedToBoard ? (
                <i className="bi bi-check2"></i>
              ) : (
                <i className="bi bi-plus-circle"></i>
              )}
            </button>
          )}
          {!addToBoardId && (
            <SaveButton pinId={pin.id} initialSaved={isSaved} buttonId={isAccessibility ? 'btn-guardar' : undefined} />
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="card-body p-3">
        <h6 className="card-title fw-semibold mb-2 text-truncate">
          {pin.title}
        </h6>
        
        {/* Descripción con bajo contraste en accesibilidad */}
        {pin.description && (
          <p 
            className="small mb-2 text-truncate" 
            style={isAccessibility ? { color: '#d3d3d3' } : undefined}
          >
            {pin.description}
          </p>
        )}

        <div className="d-flex align-items-center justify-content-between gap-2">
          {/* Author Info */}
          <Link
            href={`/profile/${pin.author.id}`}
            className="d-flex align-items-center gap-2 text-decoration-none min-w-0"
            style={{ minWidth: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-circle overflow-hidden bg-secondary flex-shrink-0" style={{ width: '24px', height: '24px' }}>
              {pin.author.image ? (
                <img
                  src={pin.author.image}
                  alt={pin.author.name || ''}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary-subtle">
                  <small className="text-secondary">
                    {pin.author.name?.charAt(0).toUpperCase() || 'U'}
                  </small>
                </div>
              )}
            </div>
            <small className="text-secondary text-truncate">
              @{pin.author.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
            </small>
          </Link>

          {/* Language Badge */}
          {pin.language && (
            <span className={`badge flex-shrink-0 ${getLanguageBadgeClass(pin.language)}`}>
              {pin.language.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
