'use client';

import Link from 'next/link';
import { BoardPreview } from '@/types';

interface BoardCardProps {
  board: BoardPreview;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months}mo ago`;
  if (weeks > 0) return `${weeks}w ago`;
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'now';
}

export function BoardCard({ board }: BoardCardProps) {
  // Handle different board data formats
  const previewImages = board.previewImages || 
    (board.pins?.slice(0, 4).map((bp) => (bp as { pin: { imageUrl: string } }).pin.imageUrl) ?? []);
  const pinCount = board.pinCount ?? board._count?.pins ?? 0;

  return (
    <Link href={`/boards/${board.id}`} className="text-decoration-none d-flex flex-column gap-2">
      <div className="position-relative rounded-3 overflow-hidden" style={{ aspectRatio: '4/3', background: 'var(--db-card-bg)' }}>
        {previewImages.length > 0 ? (
          <div className="d-grid h-100" style={{ gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: '1px' }}>
            {/* Main Preview - takes 2 cols and 2 rows */}
            <div 
              className="bg-secondary"
              style={{ 
                gridColumn: '1', 
                gridRow: '1 / 3',
                backgroundImage: previewImages[0] ? `url("${previewImages[0]}")` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Secondary Previews */}
            <div 
              className="bg-secondary"
              style={{ 
                backgroundImage: previewImages[1] ? `url("${previewImages[1]}")` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div 
              className="bg-secondary"
              style={{ 
                backgroundImage: previewImages[2] ? `url("${previewImages[2]}")` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="text-center text-secondary">
              <i className="bi bi-collection fs-1 d-block mb-2"></i>
              <span className="small">Sin pins</span>
            </div>
          </div>
        )}
      </div>

      <div className="px-1">
        <div className="d-flex justify-content-between align-items-start">
          <h3 className="fw-bold fs-6 mb-0">
            {board.name}
          </h3>
          {board.isPrivate && (
            <i className="bi bi-lock-fill text-secondary small"></i>
          )}
        </div>
        <div className="d-flex align-items-center gap-2 mt-1 small text-secondary fw-medium">
          <span>{pinCount} {pinCount === 1 ? 'Pin' : 'Pins'}</span>
          {board.updatedAt && (
            <>
              <span className="rounded-circle bg-secondary" style={{ width: '4px', height: '4px' }}></span>
              <span>{formatTimeAgo(new Date(board.updatedAt))}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
