'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { SaveToBoardModal } from '@/components/boards/SaveToBoardModal';
import { BackButton } from '@/components/ui/BackButton';
import { formatDistanceToNow } from '@/lib/utils';
import { useAppTheme } from '@/context/ThemeContext';

interface PinDetailProps {
  pin: PinWithRelations;
  relatedPins?: {
    id: string;
    title: string;
    imageUrl: string;
    author: { id: string; name: string | null; image: string | null };
  }[];
}

function getUsername(name: string | null): string {
  if (!name) return 'user';
  return name.toLowerCase().replace(/\s+/g, '');
}

function getLanguageLabel(language: string | null): string {
  const labels: Record<string, string> = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    react: 'React',
    vue: 'Vue',
    svelte: 'Svelte',
  };
  return labels[language?.toLowerCase() || ''] || language?.toUpperCase() || 'Code';
}

export function PinDetail({ pin, relatedPins = [] }: PinDetailProps) {
  const { data: session } = useSession();
  const { theme } = useAppTheme();
  const isUsability = theme === 'usabilidad';
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLiked = session?.user
    ? pin.likes?.some((like) => like.userId === session.user.id)
    : false;

  const handleCopyCode = () => {
    if (pin.codeSnippet) {
      navigator.clipboard.writeText(pin.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(pin.createdAt));

  return (
    <main className={`flex-grow-1 d-flex flex-column ${isUsability ? 'overflow-hidden' : 'overflow-auto'}`} style={isUsability ? { height: 'calc(100vh - 73px)' } : undefined}>
      {/* Mobile/Tablet: Stacked layout */}
      <div className="d-lg-none d-flex flex-column overflow-auto">
        {/* Breadcrumbs & Heading */}
        <div className={`px-3 d-flex flex-column border-bottom ${isUsability ? 'py-2 gap-2' : 'py-3 gap-3'}`}>
          {/* Back button and breadcrumb */}
          <div className="d-flex align-items-center gap-3">
            <BackButton className="btn-sm" label="" />
            <nav aria-label="breadcrumb" className="flex-grow-1">
              <ol className="breadcrumb mb-0 small">
                <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Explorar</Link></li>
                {pin.language && (
                  <li className="breadcrumb-item">{getLanguageLabel(pin.language)}</li>
                )}
                <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '150px' }}>{pin.title}</li>
              </ol>
            </nav>
          </div>

          <div className="d-flex flex-column gap-2">
            <h1 className={`mb-0 fw-bold ${isUsability ? 'h6' : 'h5'}`}>{pin.title}</h1>
            <div className={`d-flex align-items-center gap-2 text-secondary ${isUsability ? 'small' : 'small'}`}>
              <span>by</span>
              <Link href={`/profile/${pin.author.id}`} className="text-decoration-none fw-medium">
                @{getUsername(pin.author.name)}
              </Link>
              <span className="mx-1">•</span>
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Action Buttons Mobile */}
          <div className="d-flex align-items-center gap-2">
            <LikeButton
              pinId={pin.id}
              initialLiked={isLiked ?? false}
              initialCount={pin._count?.likes || 0}
            />
            <button 
              onClick={() => setShowSaveModal(true)}
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
            >
              <i className="bi bi-bookmark"></i>
              <span>Guardar</span>
            </button>
          </div>
        </div>

        {/* Preview Image Mobile */}
        <div className="position-relative" style={{ minHeight: isUsability ? '180px' : '250px', background: 'var(--db-card-bg)' }}>
          <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-1">
            <div className="btn-group bg-dark bg-opacity-75 rounded-3 p-1">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`btn btn-sm ${activeTab === 'preview' ? 'btn-secondary' : 'btn-outline-secondary border-0'}`}
              >
                <i className="bi bi-eye"></i>
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`btn btn-sm ${activeTab === 'code' ? 'btn-secondary' : 'btn-outline-secondary border-0'}`}
              >
                <i className="bi bi-code-slash"></i>
              </button>
            </div>
          </div>
          <div className={`d-flex align-items-center justify-content-center ${isUsability ? 'p-2' : 'p-3'}`} style={{ minHeight: isUsability ? '180px' : '250px' }}>
            {activeTab === 'preview' ? (
              <img 
                src={pin.imageUrl} 
                alt={pin.title}
                className="mw-100 mh-100 object-fit-contain rounded shadow"
                style={{ maxHeight: isUsability ? '200px' : '300px' }}
              />
            ) : pin.codeSnippet ? (
              <div className="w-100 rounded overflow-hidden border">
                <div className={`d-flex align-items-center justify-content-between bg-dark border-bottom ${isUsability ? 'px-2 py-1' : 'px-3 py-2'}`}>
                  <span className="small text-secondary">{getLanguageLabel(pin.language)}</span>
                  <button onClick={handleCopyCode} className="btn btn-link btn-sm text-secondary p-0">
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <pre className={`font-monospace text-light mb-0 overflow-auto bg-dark ${isUsability ? 'p-2' : 'p-3'}`} style={{ maxHeight: isUsability ? '180px' : '250px', fontSize: isUsability ? '0.7rem' : undefined }}>
                  <code>{pin.codeSnippet}</code>
                </pre>
              </div>
            ) : (
              <div className="text-secondary text-center">
                <i className="bi bi-code-slash fs-1 opacity-50 d-block mb-3"></i>
                <p className="mb-0">No hay código disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Description & Tags Mobile */}
        {(pin.description || pin.tags) && (
          <div className={`border-top ${isUsability ? 'p-2' : 'p-3'}`}>
            {pin.description && (
              <div className={isUsability ? 'mb-2' : 'mb-3'} style={isUsability ? { maxHeight: '15vh', overflow: 'auto' } : undefined}>
                <h6 className={`fw-semibold ${isUsability ? 'mb-1 small' : 'mb-2'}`}>Descripción</h6>
                <p className={`text-secondary mb-0 ${isUsability ? 'small' : 'small'}`} style={{ whiteSpace: 'pre-wrap', fontSize: isUsability ? '0.8rem' : undefined }}>{pin.description}</p>
              </div>
            )}
            {pin.tags && (
              <div className="d-flex flex-wrap gap-2">
                {pin.tags.split(',').map((tag, i) => (
                  <span key={i} className={`badge bg-secondary-subtle text-secondary ${isUsability ? 'small' : ''}`}>#{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comments Section Mobile */}
        <div className="border-top" style={{ minHeight: isUsability ? '200px' : '300px' }}>
          <CommentSection pinId={pin.id} initialCount={pin._count?.comments || 0} />
        </div>
      </div>

      {/* Desktop: Side by side layout */}
      <div className="d-none d-lg-flex flex-row flex-grow-1 overflow-hidden">
      {/* Left: Preview & Header Info */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Breadcrumbs & Heading */}
        <div className={`px-4 d-flex flex-column gap-3 border-bottom ${isUsability ? 'py-2' : 'py-3'}`}>
          {/* Back button and breadcrumbs */}
          <div className="d-flex align-items-center gap-3">
            <BackButton className="btn-sm" />
            <nav aria-label="breadcrumb" className="flex-grow-1">
              <ol className="breadcrumb mb-0 small">
                <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Explorar</Link></li>
                {pin.language && (
                  <li className="breadcrumb-item">{getLanguageLabel(pin.language)}</li>
                )}
                <li className="breadcrumb-item active text-truncate" aria-current="page">{pin.title}</li>
              </ol>
            </nav>
          </div>

          {/* Title and Actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div className="d-flex flex-column gap-1">
              <h1 className={`mb-0 fw-bold ${isUsability ? 'h5' : 'h4'}`}>{pin.title}</h1>
              <div className="d-flex align-items-center gap-2 small text-secondary">
                <span>by</span>
                <Link href={`/profile/${pin.author.id}`} className="text-decoration-none fw-medium">
                  @{getUsername(pin.author.name)}
                </Link>
                <span className="mx-1">•</span>
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex align-items-center gap-2">
              <LikeButton
                pinId={pin.id}
                initialLiked={isLiked ?? false}
                initialCount={pin._count?.likes || 0}
              />
              <button 
                onClick={() => setShowSaveModal(true)}
                className={`btn btn-primary d-flex align-items-center gap-2 ${isUsability ? 'btn-sm' : ''}`}
              >
                <i className="bi bi-bookmark"></i>
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Canvas Area */}
        <div className="flex-grow-1 position-relative d-flex flex-column overflow-hidden" style={{ minHeight: '300px', background: 'var(--db-card-bg)' }}>
          {/* Toolbar overlay */}
          <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-1">
            <div className="btn-group bg-dark bg-opacity-75 rounded-3 p-1">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`btn btn-sm ${activeTab === 'preview' ? 'btn-secondary' : 'btn-outline-secondary border-0'}`}
                title="Preview"
              >
                <i className="bi bi-eye"></i>
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`btn btn-sm ${activeTab === 'code' ? 'btn-secondary' : 'btn-outline-secondary border-0'}`}
                title="Code"
              >
                <i className="bi bi-code-slash"></i>
              </button>
              <a 
                href={pin.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-secondary border-0"
                title="Open in new tab"
              >
                <i className="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </div>

          {/* Preview Content */}
          <div className={`flex-grow-1 d-flex align-items-center justify-content-center ${isUsability ? 'p-3' : 'p-4'}`}>
            {activeTab === 'preview' ? (
              <img 
                src={pin.imageUrl} 
                alt={pin.title}
                className="mw-100 mh-100 object-fit-contain rounded shadow"
              />
            ) : pin.codeSnippet ? (
              <div className="w-100 rounded overflow-hidden border" style={{ maxWidth: '900px' }}>
                <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-dark border-bottom">
                  <span className="small text-secondary">{getLanguageLabel(pin.language)}</span>
                  <button 
                    onClick={handleCopyCode}
                    className="btn btn-link btn-sm text-secondary text-decoration-none p-0"
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <pre className="p-3 small font-monospace text-light mb-0 overflow-auto bg-dark" style={{ maxHeight: isUsability ? '40vh' : '60vh' }}>
                  <code>{pin.codeSnippet}</code>
                </pre>
              </div>
            ) : (
              <div className="text-secondary text-center">
                <i className="bi bi-code-slash fs-1 opacity-50 d-block mb-3"></i>
                <p className="mb-0">No hay código disponible</p>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          {pin.language && !isUsability && (
            <div className="px-3 py-2 bg-dark border-top d-flex align-items-center justify-content-between small text-secondary">
              <div className="d-flex align-items-center gap-3">
                <span className="d-flex align-items-center gap-1">
                  <span className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }}></span>
                  Ready
                </span>
                <span>{getLanguageLabel(pin.language)}</span>
              </div>
              <span>{pin._count?.likes || 0} likes</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Code Editor & Sidebar Info */}
      <div className="d-flex flex-column border-start overflow-hidden" style={{ width: '100%', maxWidth: isUsability ? '420px' : '500px' }}>
        {/* Description & Tags Section */}
        {(pin.description || pin.tags) && (
          <div className={`border-bottom overflow-auto ${isUsability ? 'p-2' : 'p-4'}`} style={isUsability ? { maxHeight: '20vh' } : undefined}>
            {pin.description && (
              <div className={isUsability ? 'mb-2' : 'mb-3'}>
                <h6 className={`fw-semibold ${isUsability ? 'mb-1 small' : 'mb-2'}`}>Descripción</h6>
                <p className={`text-secondary mb-0 ${isUsability ? 'small' : 'small'}`} style={{ whiteSpace: 'pre-wrap' }}>{pin.description}</p>
              </div>
            )}
            {pin.tags && (
              <div className="d-flex flex-wrap gap-2">
                {pin.tags.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className={`badge bg-secondary-subtle text-secondary ${isUsability ? 'small' : ''}`}
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Code Editor Section */}
        {pin.codeSnippet && (
          <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minHeight: isUsability ? '200px' : '300px' }}>
            {/* Editor Header */}
            <div className="d-flex align-items-center bg-dark border-bottom">
              <div className={`px-4 small fw-bold border-bottom border-primary border-2 ${isUsability ? 'py-1' : 'py-2'}`} style={{ borderWidth: '2px' }}>
                {getLanguageLabel(pin.language)}
              </div>
              <div className="flex-grow-1"></div>
              <button 
                onClick={handleCopyCode}
                className="btn btn-link text-secondary p-2 me-2"
                title="Copy Code"
              >
                <i className="bi bi-clipboard"></i>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-grow-1 overflow-auto bg-dark font-monospace position-relative" style={{ fontSize: isUsability ? '0.7rem' : '0.875rem', padding: isUsability ? '0.5rem' : '0.75rem' }}>
              <button 
                onClick={handleCopyCode}
                className="btn btn-primary btn-sm position-absolute top-0 end-0 m-3 opacity-0"
                style={{ transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <div className="d-flex">
                <div className="d-flex flex-column text-secondary user-select-none pe-3 text-end" style={{ minWidth: '2rem' }}>
                  {pin.codeSnippet.split('\n').map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <pre className="text-light mb-0" style={{ whiteSpace: 'pre', overflowX: 'auto' }}>
                  <code>{pin.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-top d-flex flex-column overflow-hidden" style={{ height: isUsability ? '30%' : '40%', minHeight: isUsability ? '200px' : '280px' }}>
          <CommentSection
            pinId={pin.id}
            initialCount={pin._count?.comments || 0}
          />
        </div>
      </div>

      {/* Related Pins Sidebar (xl screens) - Oculto en tema usabilidad para mejor uso del espacio */}
      {!isUsability && relatedPins.length > 0 && (
        <div className="d-none d-xl-flex flex-column border-start" style={{ width: '280px' }}>
          <div className="p-3 border-bottom">
            <h6 className="fw-semibold mb-0">Pins relacionados</h6>
          </div>
          <div className="flex-grow-1 overflow-auto p-3">
            <div className="d-flex flex-column gap-3">
              {relatedPins.map((relatedPin) => (
                <Link key={relatedPin.id} href={`/pin/${relatedPin.id}`} className="text-decoration-none">
                  <div className="rounded overflow-hidden mb-2" style={{ aspectRatio: '16/9', background: 'var(--db-card-bg)' }}>
                    <img 
                      src={relatedPin.imageUrl} 
                      alt={relatedPin.title}
                      className="w-100 h-100 object-fit-cover opacity-75"
                      style={{ transition: 'opacity 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '0.75'}
                    />
                  </div>
                  <h6 className="small fw-medium mb-0 text-truncate">{relatedPin.title}</h6>
                  <small className="text-muted">by @{getUsername(relatedPin.author.name)}</small>
                </Link>
              ))}
            </div>
          </div>
          <div className="p-3 border-top text-center">
            <Link href="/" className="small text-primary text-decoration-none fw-medium">
              Ver todos los pins
            </Link>
          </div>
        </div>
      )}
      </div>

      {/* Save to Board Modal */}
      {showSaveModal && (
        <SaveToBoardModal
          pinId={pin.id}
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </main>
  );
}
