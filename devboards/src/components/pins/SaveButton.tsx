'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAppTheme } from '@/context/ThemeContext';

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
  const isAccessibility = theme === 'accesibilidad';
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      const method = saved ? 'DELETE' : 'POST';
      const response = await fetch(`/api/pins/${pinId}/save`, { method });

      if (response.ok) {
        setSaved(!saved);
        onSaveChange?.(!saved);
      }
    } catch (error) {
      console.error('Error al guardar pin:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      id={buttonId}
      onClick={handleSave}
      disabled={loading}
      className={`btn btn-sm ${saved ? 'btn-primary' : 'btn-dark'}`}
      title={saved ? 'Guardado' : 'Guardar'}
      tabIndex={isAccessibility ? -1 : undefined}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      ) : (
        <i className={`bi ${saved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
      )}
    </button>
  );
}
