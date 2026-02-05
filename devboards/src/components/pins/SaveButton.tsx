'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SaveButtonProps {
  pinId: string;
  initialSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

export function SaveButton({ pinId, initialSaved = false, onSaveChange }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
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
      onClick={handleSave}
      disabled={loading}
      className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
        saved
          ? 'bg-gray-900 text-white hover:bg-gray-800'
          : 'bg-red-500 text-white hover:bg-red-600'
      } disabled:opacity-50`}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : saved ? (
        'Guardado'
      ) : (
        'Guardar'
      )}
    </button>
  );
}
