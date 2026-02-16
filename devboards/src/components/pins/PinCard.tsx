'use client';

import Link from 'next/link';
import { SaveButton } from './SaveButton';
import { getLanguageBadgeClass } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';

interface PinCardProps {
  pin: PinWithRelations;
  showRemoveButton?: boolean;
  onRemove?: (pinId: string) => void;
}

export function PinCard({ pin, showRemoveButton, onRemove }: PinCardProps) {
  const { data: session } = useSession();
  
  const isSaved = session?.user
    ? pin.savedBy?.some((sp) => sp.userId === session.user.id)
    : false;

  return (
    <div className="masonry-item">
      <div className="card db-card pin-card rounded-3 overflow-hidden">
        <Link href={`/pin/${pin.id}`} className="text-decoration-none">
          <div className="position-relative">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="card-img-top"
              loading="lazy"
            />
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0"></div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="overlay-buttons position-absolute top-0 end-0 p-2 d-flex gap-2">
          {showRemoveButton && onRemove && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemove(pin.id);
              }}
              className="btn btn-dark btn-sm rounded-2"
              title="Quitar del tablero"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
          <SaveButton pinId={pin.id} initialSaved={isSaved} />
        </div>

        {/* Card Body */}
        <div className="card-body p-3">
          <h6 className="card-title fw-semibold mb-2 text-truncate">
            {pin.title}
          </h6>

          <div className="d-flex align-items-center justify-content-between">
            {/* Author Info */}
            <Link
              href={`/profile/${pin.author.id}`}
              className="d-flex align-items-center gap-2 text-decoration-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-circle overflow-hidden bg-secondary" style={{ width: '24px', height: '24px' }}>
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
              <small className="text-secondary">
                @{pin.author.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}
              </small>
            </Link>

            {/* Language Badge */}
            {pin.language && (
              <span className={`badge ${getLanguageBadgeClass(pin.language)}`}>
                {pin.language.toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
