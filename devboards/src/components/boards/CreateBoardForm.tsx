'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface CreateBoardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateBoardForm({ onSuccess, onCancel }: CreateBoardFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isPrivate }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear tablero');
      }

      setName('');
      setDescription('');
      setIsPrivate(false);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {error && (
        <div className="alert alert-danger py-2 small">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="form-label small fw-medium">
          Nombre del tablero *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          placeholder="Ej: Componentes CSS"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="form-label small fw-medium">
          Descripción (opcional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="Describe tu tablero..."
        />
      </div>

      <div className="form-check">
        <input
          type="checkbox"
          id="isPrivate"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="form-check-input"
        />
        <label htmlFor="isPrivate" className="form-check-label small">
          Tablero privado (solo tú podrás verlo)
        </label>
      </div>

      <div className="d-flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-grow-1">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading || !name.trim()} className="flex-grow-1">
          {loading ? 'Creando...' : 'Crear tablero'}
        </Button>
      </div>
    </form>
  );
}
