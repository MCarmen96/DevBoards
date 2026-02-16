'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { SUPPORTED_LANGUAGES } from '@/types';

export function CreatePinForm() {
  const router = useRouter();
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

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, imageUrl: url });
    setPreviewUrl(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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
      setError(err instanceof Error ? err.message : 'Error desconocido');
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
              label="URL de la imagen *"
              placeholder="https://ejemplo.com/imagen.png"
              value={formData.imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="col-12 col-md-6">
          <div className="d-flex flex-column gap-3">
            <Input
              label="Título *"
              placeholder="Ej: Botón con efecto glassmorphism"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Textarea
              label="Descripción técnica"
              placeholder="Explica cómo funciona el código, qué técnicas usa, compatibilidad con navegadores, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />

            <div>
              <label className="form-label small fw-medium">
                Lenguaje
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="form-select"
              >
                <option value="">Seleccionar lenguaje</option>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label small fw-medium">
                Código (snippet)
              </label>
              <textarea
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                placeholder={`/* Tu código aquí */\n.button {\n  background: linear-gradient(...);\n}`}
                className="form-control font-monospace small"
                style={{ backgroundColor: '#212529', color: '#20c997' }}
                rows={8}
              />
            </div>

            <Input
              label="Tags (separados por coma)"
              placeholder="css, animación, hover, botón"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />

            {error && (
              <div className="alert alert-danger py-2 small">
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
