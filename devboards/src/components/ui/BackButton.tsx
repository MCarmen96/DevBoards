'use client';

import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/context/ThemeContext';

interface BackButtonProps {
  className?: string;
  label?: string;
}

export function BackButton({ className = '', label = 'Volver' }: BackButtonProps) {
  const router = useRouter();
  const { theme } = useAppTheme();

  // No mostrar botón en tema no-usabilidad (anti-patrón: sin forma de volver)
  if (theme === 'no-usabilidad') {
    return null;
  }

  const handleBack = () => {
    // Intenta ir hacia atrás en el historial, si no hay historial va al inicio
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`btn btn-outline-secondary d-inline-flex align-items-center gap-2 ${className}`}
      aria-label="Volver a la página anterior"
    >
      <i className="bi bi-arrow-left"></i>
      <span>{label}</span>
    </button>
  );
}
