'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { useAppTheme } from '@/context/ThemeContext';

interface CreateBoardFormProps {
  onSuccess?: (boardId: string, boardName: string) => void;
  onCancel?: () => void;
}

interface TouchedFields {
  name: boolean;
  description: boolean;
}

export function CreateBoardForm({ onSuccess, onCancel }: CreateBoardFormProps) {
  const { theme } = useAppTheme();
  const isNoUsability = theme === 'no-usabilidad';
  
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
    // En modo no-usabilidad, no mostramos errores en tiempo real
    if (isNoUsability) return;
    
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  const handleNameBlur = () => {
    // En modo no-usabilidad, no marcamos campos como touched
    if (isNoUsability) return;
    
    setTouched(prev => ({ ...prev, name: true }));
    setNameError(validateName(name));
  };

  // En modo no-usabilidad, nunca mostramos indicadores de validación
  const isNameValid = !isNoUsability && touched.name && !validateName(name) && name.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar nombre
    const validationError = validateName(name);
    
    // En modo no-usabilidad, no actualizamos estados visuales
    if (!isNoUsability) {
      setTouched({ name: true, description: true });
      setNameError(validationError);
    }

    if (validationError) {
      // En modo no-usabilidad, falla silenciosamente
      if (!isNoUsability) {
        setError('Por favor, completa todos los campos obligatorios');
      }
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

      const created = await response.json();
      setName('');
      setDescription('');
      setIsPrivate(false);
      setTouched({ name: false, description: false });
      onSuccess?.(created.id, created.name);
    } catch (err) {
      // En modo no-usabilidad, falla silenciosamente
      if (!isNoUsability) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {error && !isNoUsability && (
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
            className={`form-control ${!isNoUsability && touched.name && nameError ? 'is-invalid' : ''} ${isNameValid ? 'is-valid' : ''}`}
            placeholder="Ej: Componentes CSS"
            required
          />
          {isNameValid && (
            <i className="bi bi-check-circle-fill text-success position-absolute" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
          )}
        </div>
        {!isNoUsability && touched.name && nameError && (
          <div className="invalid-feedback d-block">{nameError}</div>
        )}
        {isNameValid && (
          <div className="valid-feedback d-block">Campo válido</div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="form-label small fw-medium d-flex align-items-center gap-1">
          Descripción (opcional)
          {!isNoUsability && touched.description && description.length > 0 && (
            <i className="bi bi-check-circle-fill text-success small"></i>
          )}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => {
            if (!isNoUsability) {
              setTouched(prev => ({ ...prev, description: true }));
            }
          }}
          className={`form-control ${!isNoUsability && touched.description && description.length > 0 ? 'is-valid' : ''}`}
          rows={3}
          placeholder="Describe tu tablero..."
        />
        {!isNoUsability && touched.description && description.length > 0 && (
          <div className="valid-feedback d-block">Descripción añadida</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label small fw-medium">Visibilidad</label>
        <div className="row g-2">
          <div className="col-6">
            <div 
              className={`p-3 border rounded-3 text-center transition-all ${!isPrivate ? 'border-primary bg-primary-subtle' : 'bg-body-tertiary opacity-75'}`}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => setIsPrivate(false)}
            >
              <i className={`bi bi-unlock-fill d-block mb-1 ${!isPrivate ? 'text-primary' : 'text-secondary'}`} style={{ fontSize: '1.2rem' }}></i>
              <span className={`small fw-bold d-block ${!isPrivate ? 'text-primary' : 'text-secondary'}`}>Público</span>
              <span className="text-secondary" style={{ fontSize: '0.7rem' }}>Cualquiera puede verlo</span>
            </div>
          </div>
          <div className="col-6">
            <div 
              className={`p-3 border rounded-3 text-center transition-all ${isPrivate ? 'border-primary bg-primary-subtle' : 'bg-body-tertiary opacity-75'}`}
              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => setIsPrivate(true)}
            >
              <i className={`bi bi-lock-fill d-block mb-1 ${isPrivate ? 'text-primary' : 'text-secondary'}`} style={{ fontSize: '1.2rem' }}></i>
              <span className={`small fw-bold d-block ${isPrivate ? 'text-primary' : 'text-secondary'}`}>Privado</span>
              <span className="text-secondary" style={{ fontSize: '0.7rem' }}>Solo tú lo verás</span>
            </div>
          </div>
        </div>
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
