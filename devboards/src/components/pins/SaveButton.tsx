'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/context/ThemeContext';
import { SaveToBoardModal } from '@/components/boards/SaveToBoardModal';

interface SaveButtonProps {
  pinId: string;
  initialSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
  buttonId?: string;
}

export function SaveButton({ pinId, initialSaved = false, onSaveChange, buttonId }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme } = useAppTheme();
  const [saved, setSaved] = useState(initialSaved);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    // En los temas usabilidad y accesibilidad, si ya está guardado,
    // clicando el botón se desguarda directamente.
    // Pero en el tema no usabilidad, mantenemos el comportamiento anterior (abrir modal).
    if (saved && (theme === 'usabilidad' || theme === 'accesibilidad')) {
      setLoading(true);
      try {
        const res = await fetch(`/api/pins/${pinId}/save`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          setSaved(false);
          onSaveChange?.(false);
        }
      } catch (error) {
        console.error('Error desguardando pin:', error);
      } finally {
        setLoading(false);
      }
      return;
    }

    setShowModal(true);
  };

  const handleSaved = () => {
    setSaved(true);
    onSaveChange?.(true);
    
    // También guardamos el pin en la colección general (SavedPin) para que el estado persista
    fetch(`/api/pins/${pinId}/save`, {
      method: 'POST',
    }).catch(err => console.error('Error sincronizando savedPin:', err));
  };

  return (
    <>
      <button
        id={buttonId}
        onClick={handleClick}
        disabled={loading}
        className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-dark'}`}
        title={saved ? (theme === 'usabilidad' || theme === 'accesibilidad' ? 'Quitar de guardados' : 'Gestionar en tableros') : 'Guardar en tablero'}
        tabIndex={theme === 'accesibilidad' ? -1 : undefined}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm"></span>
        ) : (
          <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
        )}
      </button>

      {showModal && (
        <SaveToBoardModal
          pinId={pinId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
