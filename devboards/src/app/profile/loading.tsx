import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';

export default function Loading() {
  return (
    <main className="flex-grow-1 w-100 container py-3 py-md-4 px-3 px-md-4" style={{ maxWidth: '1280px' }}>
      {/* Breadcrumb skeleton */}
      <div className="skeleton rounded mb-4" style={{ width: '160px', height: '24px' }} />
      
      {/* Profile Header skeleton */}
      <section className="d-flex flex-column align-items-center justify-content-center mb-4 mb-md-5">
        <div className="d-flex flex-column align-items-center gap-3 w-100 text-center px-2" style={{ maxWidth: '672px' }}>
          {/* Avatar skeleton */}
          <div className="skeleton rounded-circle" style={{ width: '128px', height: '128px' }} />
          
          {/* Name skeleton */}
          <div className="skeleton rounded" style={{ width: '180px', height: '32px' }} />
          
          {/* Username skeleton */}
          <div className="skeleton rounded" style={{ width: '100px', height: '16px' }} />
          
          {/* Stats skeleton */}
          <div className="d-flex gap-4">
            <div className="skeleton rounded" style={{ width: '60px', height: '20px' }} />
            <div className="skeleton rounded" style={{ width: '80px', height: '20px' }} />
            <div className="skeleton rounded" style={{ width: '70px', height: '20px' }} />
          </div>
          
          {/* Buttons skeleton */}
          <div className="d-flex gap-2 mt-2">
            <div className="skeleton rounded" style={{ width: '120px', height: '40px' }} />
            <div className="skeleton rounded" style={{ width: '100px', height: '40px' }} />
          </div>
        </div>
      </section>

      {/* Tabs skeleton */}
      <div className="d-flex justify-content-center gap-4 mb-4 border-bottom pb-3">
        <div className="skeleton rounded" style={{ width: '100px', height: '24px' }} />
        <div className="skeleton rounded" style={{ width: '100px', height: '24px' }} />
      </div>

      {/* Content skeleton */}
      <PinGridSkeleton count={8} />
    </main>
  );
}
