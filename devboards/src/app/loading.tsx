'use client';

import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';
import { useAppTheme } from '@/context/ThemeContext';

export default function Loading() {
  const { theme } = useAppTheme();

  // En tema no-usabilidad: página en blanco sin indicadores (anti-patrón)
  if (theme === 'no-usabilidad') {
    return (
      <main className="flex-grow-1 container-fluid py-4 px-3 px-lg-4 px-xxl-5" style={{ minHeight: '60vh' }}>
        {/* Intencionalmente vacío - anti-patrón UX: sin feedback de carga */}
      </main>
    );
  }

  return (
    <main className="flex-grow-1 container-fluid py-4 px-3 px-lg-4 px-xxl-5">
      {/* Filter chips skeleton */}
      <div className="row g-2 mb-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col-auto">
            <div 
              className="skeleton rounded-pill"
              style={{ width: '80px', height: '36px' }}
            />
          </div>
        ))}
      </div>

      {/* Pin grid skeleton */}
      <PinGridSkeleton count={15} />
    </main>
  );
}
