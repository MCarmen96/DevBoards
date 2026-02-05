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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna izquierda - Preview de imagen */}
        <div>
          <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setPreviewUrl('')}
              />
            ) : (
              <div className="text-center p-6">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500">Ingresa una URL de imagen para ver la preview</p>
              </div>
            )}
          </div>
          
          <div className="mt-4">
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
        <div className="space-y-6">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lenguaje
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código (snippet)
            </label>
            <textarea
              value={formData.codeSnippet}
              onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
              placeholder={`/* Tu código aquí */\n.button {\n  background: linear-gradient(...);\n}`}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm bg-gray-900 text-green-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Publicando...' : 'Publicar Pin'}
          </Button>
        </div>
      </div>
    </form>
  );
}
