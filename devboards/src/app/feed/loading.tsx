'use client';

import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';
import { useAppTheme } from '@/context/ThemeContext';

export default function Loading() {
  const { theme } = useAppTheme();

  // En tema no-usabilidad: página en blanco sin indicadores (anti-patrón)
  if (theme === 'no-usabilidad') {
    return (
      <main className="flex-grow-1 w-100 container-fluid py-4 px-3 px-lg-4 px-xxl-5" style={{ minHeight: '60vh' }}>
        {/* Intencionalmente vacío */}
      </main>
    );
  }

  return (
    <main className="flex-grow-1 w-100 container-fluid py-4 px-3 px-lg-4 px-xxl-5">
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
