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

interface CodeBlock {
  lang: string;
  code: string;
}

const LANG_LABELS: Record<string, string> = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JS',
  typescript: 'TS',
  react: 'React',
  vue: 'Vue',
  svelte: 'Svelte',
};

function getLangLabel(lang: string): string {
  return LANG_LABELS[lang] || lang.toUpperCase();
}

const LANG_DOT_COLORS: Record<string, string> = {
  html: '#e06c75',
  css: '#61afef',
  javascript: '#e5c07b',
  typescript: '#4ec9b0',
  react: '#61dafb',
  vue: '#42b883',
  svelte: '#ff3e00',
};

export function CreatePinForm() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const isNoUsability = theme === 'no-usabilidad';
  const isAccessibility = theme === 'accesibilidad';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPinId, setCreatedPinId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    tags: '',
  });

  // Multi-bloque de código
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([{ lang: '', code: '' }]);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [showAddLang, setShowAddLang] = useState(false);
  const [newLang, setNewLang] = useState('');

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
        try { new URL(value); return undefined; } catch { return 'Ingresa una URL válida'; }
      case 'description':
        if (!value.trim()) return 'La descripción es obligatoria';
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const handleBlur = (field: keyof TouchedFields) => {
    if (isNoUsability) return;
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, formData[field as keyof typeof formData] ?? '');
    setValidationErrors(prev => ({ ...prev, [field]: err }));
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (isNoUsability) return;
    if (touched[field as keyof TouchedFields]) {
      const err = validateField(field, value);
      setValidationErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleImageUrlChange = (url: string) => {
    handleChange('imageUrl', url);
    setPreviewUrl(url);
  };

  const isFieldValid = (field: string): boolean => {
    if (isNoUsability) return false;
    const value = formData[field as keyof typeof formData] ?? '';
    return touched[field as keyof TouchedFields] && !validateField(field, value) && !!value;
  };

  // -- Gestión de bloques de código --
  const updateBlockCode = (code: string) => {
    setCodeBlocks(prev => prev.map((b, i) => i === activeBlockIndex ? { ...b, code } : b));
  };

  const updateBlockLang = (lang: string) => {
    setCodeBlocks(prev => prev.map((b, i) => i === activeBlockIndex ? { ...b, lang } : b));
  };

  const addBlock = () => {
    if (!newLang) return;
    const alreadyExists = codeBlocks.some(b => b.lang === newLang);
    if (alreadyExists) { setShowAddLang(false); setNewLang(''); return; }
    const updated = [...codeBlocks, { lang: newLang, code: '' }];
    setCodeBlocks(updated);
    setActiveBlockIndex(updated.length - 1);
    setShowAddLang(false);
    setNewLang('');
  };

  const removeBlock = (index: number) => {
    if (codeBlocks.length <= 1) return;
    const updated = codeBlocks.filter((_, i) => i !== index);
    setCodeBlocks(updated);
    setActiveBlockIndex(Math.min(activeBlockIndex, updated.length - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const titleError = validateField('title', formData.title);
    const imageUrlError = validateField('imageUrl', formData.imageUrl);
    const descriptionError = validateField('description', formData.description);

    if (!isNoUsability) {
      setTouched({ title: true, imageUrl: true, description: true, language: true, codeSnippet: true, tags: true });
      setValidationErrors({ title: titleError, imageUrl: imageUrlError, description: descriptionError });
    }

    if (titleError || imageUrlError || descriptionError) {
      if (!isNoUsability) setError('Por favor, completa todos los campos obligatorios');
      return;
    }

    // Serializar bloques de código
    const filledBlocks = codeBlocks.filter(b => b.lang && b.code.trim());
    let codeSnippet = '';
    let language = '';
    if (filledBlocks.length === 1) {
      codeSnippet = filledBlocks[0].code;
      language = filledBlocks[0].lang;
    } else if (filledBlocks.length > 1) {
      codeSnippet = JSON.stringify(filledBlocks);
      language = filledBlocks[0].lang;
    } else {
      // Bloque sin completar, intentar usar el primero
      const first = codeBlocks[0];
      codeSnippet = first.code;
      language = first.lang;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, codeSnippet, language }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear el pin');
      }

      const pin = await response.json();
      
      if (theme === 'usabilidad') {
        setCreatedPinId(pin.id);
        setShowSuccessModal(true);
      } else if (isNoUsability) { 
        router.push('/'); 
      } else { 
        router.push(`/pin/${pin.id}`); 
      }
    } catch (err) {
      if (!isNoUsability) setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const activeBlock = codeBlocks[activeBlockIndex];
  const usedLangs = new Set(codeBlocks.map(b => b.lang));
  const availableLangs = SUPPORTED_LANGUAGES.filter(l => !usedLangs.has(l.value));

  return (
    <form onSubmit={handleSubmit} className="container py-4" style={{ maxWidth: '900px' }}>
      <div className="row g-4">
        {/* Columna izquierda - Preview de imagen */}
        <div className="col-12 col-md-6">
          <div className="rounded-4 overflow-hidden border border-2 border-dashed d-flex align-items-center justify-content-center bg-secondary-subtle" style={{ aspectRatio: '3/4' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-100 h-100 object-fit-cover" onError={() => setPreviewUrl('')} />
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
              hideLabel={isAccessibility}
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
              hideLabel={isAccessibility}
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
              hideLabel={isAccessibility}
            />

            {/* Editor de código multi-bloque */}
            <div>
              {!isAccessibility && (
                <label className="form-label small fw-medium mb-2">
                  Código (opcional) — añade bloques por lenguaje
                </label>
              )}

              <div className="rounded-3 overflow-hidden border">
                {/* Barra de pestañas */}
                <div className="d-flex align-items-center pin-code-surface border-bottom flex-wrap gap-0">
                  {codeBlocks.map((block, idx) => (
                    <div key={idx} className="d-flex align-items-center position-relative">
                      <button
                        type="button"
                        onClick={() => setActiveBlockIndex(idx)}
                        className={`btn btn-sm px-3 py-2 rounded-0 border-0 fw-semibold small pin-code-tab ${activeBlockIndex === idx ? 'pin-code-tab-active' : 'pin-code-tab-inactive'}`}
                      >
                        {block.lang && (
                          <span
                            className="pin-lang-dot me-1"
                            style={{ backgroundColor: LANG_DOT_COLORS[block.lang] || '#888', display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%' }}
                          ></span>
                        )}
                        {block.lang ? getLangLabel(block.lang) : `Bloque ${idx + 1}`}
                      </button>
                      {codeBlocks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBlock(idx)}
                          className="btn btn-sm btn-link text-secondary p-0 pe-2 border-0"
                          style={{ fontSize: '0.65rem', lineHeight: 1 }}
                          title="Eliminar bloque"
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Botón añadir bloque */}
                  {availableLangs.length > 0 && (
                    <div className="position-relative ms-1">
                      <button
                        type="button"
                        onClick={() => setShowAddLang(v => !v)}
                        className="btn btn-sm btn-link text-secondary px-2 py-2 border-0"
                        title="Añadir bloque de código"
                      >
                        <i className="bi bi-plus-lg"></i>
                      </button>
                      {showAddLang && (
                        <div
                          className="position-absolute bg-body border rounded-3 shadow-lg p-2"
                          style={{ zIndex: 100, top: '100%', left: 0, minWidth: '160px' }}
                        >
                          <p className="small text-secondary mb-2 px-1">Añadir lenguaje:</p>
                          {availableLangs.map(l => (
                            <button
                              key={l.value}
                              type="button"
                              onClick={() => { setNewLang(l.value); }}
                              className={`w-100 text-start btn btn-sm px-2 py-1 border-0 rounded-2 mb-1 ${newLang === l.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                            >
                              <span
                                className="me-2"
                                style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: LANG_DOT_COLORS[l.value] || '#888' }}
                              ></span>
                              {l.label}
                            </button>
                          ))}
                          <div className="d-flex gap-2 mt-2">
                            <button
                              type="button"
                              onClick={addBlock}
                              disabled={!newLang}
                              className="btn btn-primary btn-sm flex-grow-1"
                            >
                              Añadir
                            </button>
                            <button
                              type="button"
                              onClick={() => { setShowAddLang(false); setNewLang(''); }}
                              className="btn btn-outline-secondary btn-sm"
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Selector de lenguaje del bloque activo (si no tiene asignado) */}
                {activeBlock && !activeBlock.lang && (
                  <div className="p-3 pin-code-surface border-bottom">
                    <label className="form-label small text-secondary mb-1">Selecciona el lenguaje de este bloque:</label>
                    <select
                      value={activeBlock.lang}
                      onChange={(e) => updateBlockLang(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ maxWidth: '200px' }}
                    >
                      <option value="">— Lenguaje —</option>
                      {SUPPORTED_LANGUAGES.filter(l => !usedLangs.has(l.value) || l.value === activeBlock.lang).map((lang) => (
                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Área de código */}
                {activeBlock && (
                  <div className="pin-code-surface">
                    <textarea
                      value={activeBlock.code}
                      onChange={(e) => updateBlockCode(e.target.value)}
                      placeholder={
                        activeBlock.lang === 'html' ? '<button class="btn">\n  Haz clic\n</button>' :
                        activeBlock.lang === 'css' ? '.btn {\n  background: linear-gradient(...);\n}' :
                        activeBlock.lang === 'javascript' ? 'document.querySelector(".btn")\n  .addEventListener("click", () => {})' :
                        '/* Tu código aquí */'
                      }
                      className="form-control border-0 font-monospace small pin-code-surface pin-token-plain"
                      style={{ minHeight: '180px', resize: 'vertical', outline: 'none', boxShadow: 'none' }}
                      rows={10}
                      spellCheck={false}
                    />
                  </div>
                )}
              </div>
              <div className="form-text small mt-1">
                Opcional — puedes añadir HTML, CSS, JS y más en pestañas separadas
              </div>
            </div>

            <Input
              label="Tags (separados por coma)"
              placeholder="css, animación, hover, botón"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              onBlur={() => handleBlur('tags')}
              isValid={!isNoUsability && touched.tags && formData.tags.length > 0}
              helpText="Opcional - ayuda a otros a encontrar tu pin"
              hideLabel={isAccessibility}
            />

            {error && !isNoUsability && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {error}
              </div>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-100"
              style={isNoUsability ? { backgroundColor: '#dc3545', borderColor: '#dc3545' } : undefined}
            >
              {loading ? 'Publicando...' : 'Publicar Pin'}
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de éxito (Tema Usabilidad) */}
      {showSuccessModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4 shadow border-0 overflow-hidden">
              <div className="modal-body p-5 text-center">
                <div 
                  className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-4" 
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-check-circle-fill text-success fs-1"></i>
                </div>
                <h3 className="h4 fw-bold text-body mb-2">¡Pin creado con éxito!</h3>
                <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '300px' }}>
                  Tu pin ya está disponible para toda la comunidad de DevBoards.
                </p>
                <div className="d-grid gap-2">
                  <Button 
                    onClick={() => router.push(`/pin/${createdPinId}`)}
                    className="fw-bold py-2"
                  >
                    Ver mi Pin <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => router.push('/')}
                    className="small fw-semibold py-2"
                  >
                    Volver al inicio
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div 
            className="position-fixed top-0 start-0 w-100 h-100" 
            style={{ zIndex: -1 }} 
            onClick={() => router.push(`/pin/${createdPinId}`)} 
          />
        </div>
      )}
    </form>
  );
}

