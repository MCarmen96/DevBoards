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
      className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
        saved
          ? 'bg-[#0d33f2] text-white'
          : 'bg-black/50 hover:bg-[#0d33f2] text-white'
      } disabled:opacity-50`}
      title={saved ? 'Guardado' : 'Guardar'}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      )}
    </button>
  );
}
