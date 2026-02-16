import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';

export default function Loading() {
  return (
    <main className="flex-grow-1 w-100 container py-4" style={{ maxWidth: '1280px' }}>
      {/* Breadcrumb skeleton */}
      <div className="skeleton rounded mb-4" style={{ width: '200px', height: '24px' }} />
      
      {/* Header skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="skeleton rounded" style={{ width: '150px', height: '32px' }} />
        <div className="skeleton rounded" style={{ width: '100px', height: '36px' }} />
      </div>
      
      {/* Filter skeleton */}
      <div className="d-flex gap-2 mb-4">
        <div className="skeleton rounded" style={{ width: '120px', height: '36px' }} />
        <div className="skeleton rounded" style={{ width: '120px', height: '36px' }} />
      </div>

      {/* Pin grid skeleton */}
      <PinGridSkeleton count={12} />
    </main>
  );
}
