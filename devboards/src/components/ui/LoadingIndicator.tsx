'use client';

export function PinGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="masonry-grid w-100">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3 skeleton"
          style={{ aspectRatio: '4/3' }}
        />
      ))}
    </div>
  );
}

export function PageLoadingIndicator() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="position-relative mb-4">
        <div 
          className="spinner-border text-primary" 
          role="status"
          style={{ width: '3rem', height: '3rem' }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
      <p className="text-secondary small mb-0">Cargando pins...</p>
    </div>
  );
}

export function InlineLoadingIndicator({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-3">
      <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
      <span className="text-secondary small">{text}</span>
    </div>
  );
}
