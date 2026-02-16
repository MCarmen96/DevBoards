export default function Loading() {
  return (
    <main className="flex-grow-1 w-100 container py-4" style={{ maxWidth: '1280px' }}>
      {/* Breadcrumb skeleton */}
      <div className="skeleton rounded mb-4" style={{ width: '180px', height: '24px' }} />
      
      {/* Header skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="skeleton rounded" style={{ width: '160px', height: '32px' }} />
        <div className="skeleton rounded" style={{ width: '140px', height: '40px' }} />
      </div>

      {/* Boards grid skeleton */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="col">
            <div className="skeleton rounded-3" style={{ height: '280px' }} />
          </div>
        ))}
      </div>
    </main>
  );
}
