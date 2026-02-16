import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';

export default function Loading() {
  return (
    <main className="flex-grow-1 container-fluid py-4" style={{ maxWidth: '1440px' }}>
      {/* Filter chips skeleton */}
      <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="skeleton rounded-pill"
            style={{ width: '80px', height: '36px' }}
          />
        ))}
      </div>

      {/* Pin grid skeleton */}
      <PinGridSkeleton count={15} />
    </main>
  );
}
