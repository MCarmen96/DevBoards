'use client';

import { useAppTheme } from '@/context/ThemeContext';
import { ReactNode } from 'react';

interface ThemeAwareLoadingProps {
  children: ReactNode;
  blankComponent?: ReactNode;
}

/**
 * Componente que muestra diferentes estados de carga según el tema.
 * En tema "no-usabilidad", muestra una página en blanco sin indicadores (anti-patrón).
 * En otros temas, muestra el skeleton de carga normal.
 */
export function ThemeAwareLoading({ children, blankComponent }: ThemeAwareLoadingProps) {
  const { theme } = useAppTheme();

  // En tema no-usabilidad, mostrar página en blanco (anti-patrón: no feedback al usuario)
  if (theme === 'no-usabilidad') {
    return blankComponent || (
      <div className="flex-grow-1" style={{ minHeight: '60vh' }}>
        {/* Intencionalmente vacío - anti-patrón de UX */}
      </div>
    );
  }

  // En otros temas, mostrar el skeleton normal
  return <>{children}</>;
}
