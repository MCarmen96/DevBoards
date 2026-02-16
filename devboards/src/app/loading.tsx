'use client';

import { PinGridSkeleton } from '@/components/ui/LoadingIndicator';
import { useAppTheme } from '@/context/ThemeContext';

export default function Loading() {
  const { theme } = useAppTheme();

  // En tema no-usabilidad: página en blanco sin indicadores (anti-patrón)
  if (theme === 'no-usabilidad') {
    return (
      <main className="flex-grow-1 container-fluid py-4" style={{ maxWidth: '1440px', minHeight: '60vh' }}>
        {/* Intencionalmente vacío - anti-patrón UX: sin feedback de carga */}
      </main>
    );
  }

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
