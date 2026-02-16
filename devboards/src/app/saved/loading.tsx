'use client';

import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';
import { useAppTheme } from '@/context/ThemeContext';

export default function Loading() {
  const { theme } = useAppTheme();

  if (theme === 'no-usabilidad') {
    return (
      <main className="flex-grow-1 w-100 container py-4" style={{ maxWidth: '1280px', minHeight: '60vh' }}>
        {/* Intencionalmente vacío */}
      </main>
    );
  }

  return (
    <main className="flex-grow-1 w-100 container py-4" style={{ maxWidth: '1280px' }}>
      {/* Breadcrumb skeleton */}
      <div className="skeleton rounded mb-4" style={{ width: '220px', height: '24px' }} />
      
      {/* Header skeleton */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="skeleton rounded" style={{ width: '180px', height: '32px' }} />
      </div>

      {/* Pin grid skeleton */}
      <PinGridSkeleton count={12} />
    </main>
  );
}
