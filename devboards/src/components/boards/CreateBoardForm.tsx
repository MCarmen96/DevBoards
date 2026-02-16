'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';

interface CreateBoardFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface TouchedFields {
  name: boolean;
  description: boolean;
}

export function CreateBoardForm({ onSuccess, onCancel }: CreateBoardFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    description: false,
  });

  const validateName = useCallback((value: string): string | undefined => {
    if (!value.trim()) return 'El nombre del tablero es obligatorio';
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (value.trim().length > 50) return 'El nombre no puede exceder 50 caracteres';
    return undefined;
  }, []);

  const handleNameChange = (value: string) => {
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handleNameBlur = () => {
    setTouched(prev => ({ ...prev, name: true }));
    setNameError(validateName(name));
  };

  const isNameValid = touched.name && !validateName(name) && name.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar nombre
    const validationError = validateName(name);
    setTouched({ name: true, description: true });
    setNameError(validationError);

    if (validationError) {
      setError('Por favor, completa todos los campos obligatorios');
      return;
    }

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
      setTouched({ name: false, description: false });
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
        <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="form-label small fw-medium d-flex align-items-center gap-1">
          Nombre del tablero
          <span className="text-danger">*</span>
          {isNameValid && (
            <i className="bi bi-check-circle-fill text-success small"></i>
          )}
        </label>
        <div className="position-relative">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            className={`form-control ${touched.name && nameError ? 'is-invalid' : ''} ${isNameValid ? 'is-valid' : ''}`}
            placeholder="Ej: Componentes CSS"
            required
          />
          {isNameValid && (
            <i className="bi bi-check-circle-fill text-success position-absolute" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
          )}
        </div>
        {touched.name && nameError && (
          <div className="invalid-feedback d-block">{nameError}</div>
        )}
        {isNameValid && (
          <div className="valid-feedback d-block">Campo válido</div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="form-label small fw-medium d-flex align-items-center gap-1">
          Descripción (opcional)
          {touched.description && description.length > 0 && (
            <i className="bi bi-check-circle-fill text-success small"></i>
          )}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
          className={`form-control ${touched.description && description.length > 0 ? 'is-valid' : ''}`}
          rows={3}
          placeholder="Describe tu tablero..."
        />
        {touched.description && description.length > 0 && (
          <div className="valid-feedback d-block">Descripción añadida</div>
        )}
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
          <i className={`bi ${isPrivate ? 'bi-lock-fill' : 'bi-unlock'} me-1`}></i>
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
