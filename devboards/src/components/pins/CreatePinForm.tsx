'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SUPPORTED_LANGUAGES } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';

interface TouchedFields {
  title: boolean;
  imageUrl: boolean;
  description: boolean;
  language: boolean;
  codeSnippet: boolean;
  tags: boolean;
}

interface ValidationErrors {
  title?: string;
  imageUrl?: string;
  description?: string;
}

export function CreatePinForm() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isNoUsability = theme === 'no-usabilidad';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    codeSnippet: '',
    language: '',
    tags: '',
  });

  const [touched, setTouched] = useState<TouchedFields>({
    title: false,
    imageUrl: false,
    description: false,
    language: false,
    codeSnippet: false,
    tags: false,
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((field: string, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'El título es obligatorio';
        if (value.trim().length < 3) return 'El título debe tener al menos 3 caracteres';
        return undefined;
      case 'imageUrl':
        if (!value.trim()) return 'La URL de la imagen es obligatoria';
        try {
          new URL(value);
          return undefined;
        } catch {
          return 'Ingresa una URL válida';
        }
      case 'description':
        if (!value.trim()) return 'La descripción es obligatoria';
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const handleBlur = (field: keyof TouchedFields) => {
    // En modo no-usabilidad, no marcamos campos como touched (sin feedback visual)
    if (isNoUsability) return;
    
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData]);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // En modo no-usabilidad, no mostramos errores de validación en tiempo real
    if (isNoUsability) return;
    
    if (touched[field as keyof TouchedFields]) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleImageUrlChange = (url: string) => {
    handleChange('imageUrl', url);
    setPreviewUrl(url);
  };

  const isFieldValid = (field: string): boolean => {
    // En modo no-usabilidad, nunca mostramos indicadores de validación
    if (isNoUsability) return false;
    
    const value = formData[field as keyof typeof formData];
    return touched[field as keyof TouchedFields] && !validateField(field, value) && !!value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar todos los campos obligatorios
    const titleError = validateField('title', formData.title);
    const imageUrlError = validateField('imageUrl', formData.imageUrl);
    const descriptionError = validateField('description', formData.description);
    
    // En modo no-usabilidad, no actualizamos estados visuales de validación
    if (!isNoUsability) {
      setTouched({
        title: true,
        imageUrl: true,
        description: true,
        language: true,
        codeSnippet: true,
        tags: true,
      });

      setValidationErrors({ title: titleError, imageUrl: imageUrlError, description: descriptionError });
    }

    if (titleError || imageUrlError || descriptionError) {
      // En modo no-usabilidad, falla silenciosamente (no muestra error)
      if (!isNoUsability) {
        setError('Por favor, completa todos los campos obligatorios');
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el pin');
      }

      const pin = await response.json();
      router.push(`/pin/${pin.id}`);
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
    <form onSubmit={handleSubmit} className="container py-4" style={{ maxWidth: '900px' }}>
      <div className="row g-4">
        {/* Columna izquierda - Preview de imagen */}
        <div className="col-12 col-md-6">
          <div className="rounded-4 overflow-hidden border border-2 border-dashed d-flex align-items-center justify-content-center bg-secondary-subtle" style={{ aspectRatio: '3/4' }}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-100 h-100 object-fit-cover"
                onError={() => setPreviewUrl('')}
              />
            ) : (
              <div className="text-center p-4">
                <i className="bi bi-image fs-1 text-secondary mb-3 d-block"></i>
                <p className="text-secondary mb-0">Ingresa una URL de imagen para ver la preview</p>
              </div>
            )}
          </div>
          
          <div className="mt-3">
            <Input
              label="URL de la imagen"
              placeholder="https://ejemplo.com/imagen.png"
              value={formData.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              onBlur={() => handleBlur('imageUrl')}
              error={!isNoUsability && touched.imageUrl ? validationErrors.imageUrl : undefined}
              isValid={!isNoUsability && isFieldValid('imageUrl')}
              required={!isNoUsability}
            />
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column gap-3">
            <Input
              label="Título"
              placeholder="Ej: Botón con efecto glassmorphism"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              error={!isNoUsability && touched.title ? validationErrors.title : undefined}
              isValid={!isNoUsability && isFieldValid('title')}
              required={!isNoUsability}
            />

            <Textarea
              label="Descripción técnica"
              placeholder="Explica cómo funciona el código, qué técnicas usa, compatibilidad con navegadores, etc."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={!isNoUsability && touched.description ? validationErrors.description : undefined}
              isValid={!isNoUsability && touched.description && formData.description.length > 0}
              rows={3}
              required={!isNoUsability}
            />

            <div>
              <label className="form-label small fw-medium d-flex align-items-center gap-1">
                Lenguaje
                {!isNoUsability && touched.language && formData.language && (
                  <i className="bi bi-check-circle-fill text-success small"></i>
                )}
              </label>
              <select
                value={formData.language}
                onChange={(e) => {
                  handleChange('language', e.target.value);
                  if (!isNoUsability) {
                    setTouched(prev => ({ ...prev, language: true }));
                  }
                }}
                className={`form-select ${!isNoUsability && touched.language && formData.language ? 'is-valid' : ''}`}
              >
                <option value="">Seleccionar lenguaje</option>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {!isNoUsability && touched.language && formData.language && (
                <div className="valid-feedback d-block">Lenguaje seleccionado</div>
              )}
            </div>

            <div>
              <label className="form-label small fw-medium d-flex align-items-center gap-1">
                Código (snippet)
                {!isNoUsability && touched.codeSnippet && formData.codeSnippet.length > 0 && (
                  <i className="bi bi-check-circle-fill text-success small"></i>
                )}
              </label>
              <textarea
                value={formData.codeSnippet}
                onChange={(e) => handleChange('codeSnippet', e.target.value)}
                onBlur={() => {
                  if (!isNoUsability) {
                    setTouched(prev => ({ ...prev, codeSnippet: true }));
                  }
                }}
                placeholder={`/* Tu código aquí */\n.button {\n  background: linear-gradient(...);\n}`}
                className={`form-control font-monospace small ${!isNoUsability && touched.codeSnippet && formData.codeSnippet.length > 0 ? 'is-valid' : ''}`}
                style={{ backgroundColor: '#212529', color: '#20c997' }}
                rows={8}
              />
              {!isNoUsability && touched.codeSnippet && formData.codeSnippet.length > 0 && (
                <div className="valid-feedback d-block">Código añadido</div>
              )}
              <div className="form-text small">Opcional - añade el código de tu snippet</div>
            </div>

            <Input
              label="Tags (separados por coma)"
              placeholder="css, animación, hover, botón"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              onBlur={() => handleBlur('tags')}
              isValid={!isNoUsability && touched.tags && formData.tags.length > 0}
              helpText="Opcional - ayuda a otros a encontrar tu pin"
            />

            {error && !isNoUsability && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-100">
              {loading ? 'Publicando...' : 'Publicar Pin'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
