'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

type CodeTokenType = 'plain' | 'comment' | 'string' | 'keyword' | 'number' | 'tag' | 'attr' | 'identifier' | 'operator';

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case', 'break',
  'continue', 'class', 'new', 'try', 'catch', 'finally', 'throw', 'import', 'from', 'export', 'default',
  'async', 'await', 'true', 'false', 'null', 'undefined', 'interface', 'type', 'extends', 'implements'
]);

function classifyToken(token: string): CodeTokenType {
  if (/^(\/\/.*|\/\*.*\*\/)$/.test(token)) return 'comment';
  if (/^(["'`]).*\1$/.test(token)) return 'string';
  if (/^\d+(\.\d+)?$/.test(token)) return 'number';
  if (/^<\/?[a-zA-Z][\w-]*>?$/.test(token)) return 'tag';
  if (/^[a-zA-Z_:][\w:-]*=$/.test(token)) return 'attr';
  if (/^(=>|===|!==|==|!=|<=|>=|\+|-|\*|\/|%|=|\.|,|;|:|\(|\)|\[|\]|\{|\})$/.test(token)) return 'operator';
  if (KEYWORDS.has(token)) return 'keyword';
  if (/^[a-zA-Z_][\w]*$/.test(token)) return 'identifier';
  return 'plain';
}

function tokenizeLine(line: string): Array<{ type: CodeTokenType; text: string }> {
  const regex = /(\/\/.*$|\/\*.*\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|<\/?[a-zA-Z][\w-]*>?|[a-zA-Z_:][\w:-]*=|=>|===|!==|==|!=|<=|>=|[+\-*/%=.,;:()[\]{}]|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_][\w]*\b)/g;
  const tokens: Array<{ type: CodeTokenType; text: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(line);

  while (match) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'plain', text: line.slice(lastIndex, match.index) });
    }

    const value = match[0];
    tokens.push({ type: classifyToken(value), text: value });
    lastIndex = match.index + value.length;
    match = regex.exec(line);
  }

  if (lastIndex < line.length) {
    tokens.push({ type: 'plain', text: line.slice(lastIndex) });
  }

  return tokens;
}

function renderHighlightedCode(code: string) {
  const lines = code.split('\n');

  return lines.map((line, lineIndex) => {
    const tokens = tokenizeLine(line);

    return (
      <span key={lineIndex} className="pin-code-line">
        {tokens.length === 0 ? ' ' : tokens.map((token, tokenIndex) => (
          <span key={`${lineIndex}-${tokenIndex}`} className={`pin-token-${token.type}`}>
            {token.text}
          </span>
        ))}
        {lineIndex < lines.length - 1 && '\n'}
      </span>
    );
  });
}

// Multi-language code support
type CodeBlock = { lang: string; code: string };

function parseCodeSnippets(
  codeSnippet: string | null | undefined,
  language: string | null | undefined
): CodeBlock[] {
  if (!codeSnippet) return [];
  const trimmed = codeSnippet.trim();
  if (trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed) as CodeBlock[];
    } catch { /* fall through */ }
  }
  return [{ lang: language || 'code', code: codeSnippet }];
}

export function PinDetail({ pin, relatedPins = [] }: PinDetailProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const router = useRouter();
  const { theme } = useAppTheme();
  const isUsability = theme === 'usabilidad';
  const showBreadcrumbs = theme !== 'accesibilidad' && theme !== 'no-usabilidad';
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isSaved, setIsSaved] = useState(() => 
    session?.user ? pin.savedBy?.some((sp) => sp.userId === session.user.id) : false
  );
  const [saveLoading, setSaveLoading] = useState(false);

  const isAuthor = session?.user?.id === pin.author.id;
  const codeBlocks = parseCodeSnippets(pin.codeSnippet, pin.language);
  const [activeCodeTab, setActiveCodeTab] = useState<string>(() => codeBlocks[0]?.lang || '');
  const activeBlock = codeBlocks.find(b => b.lang === activeCodeTab) ?? codeBlocks[0];

  const isLiked = session?.user
    ? pin.likes?.some((like) => like.userId === session.user.id)
    : false;

  const handleSaveClick = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    // En los temas usabilidad y accesibilidad, si ya está guardado,
    // clicando el botón se desguarda directamente.
    if (isSaved && (theme === 'usabilidad' || theme === 'accesibilidad')) {
      setSaveLoading(true);
      try {
        const res = await fetch(`/api/pins/${pin.id}/save`, {
          method: 'DELETE',
        });
        
        if (res.ok) {
          setIsSaved(false);
        }
      } catch (error) {
        console.error('Error desguardando pin:', error);
      } finally {
        setSaveLoading(false);
      }
      return;
    }

    setShowSaveModal(true);
  };

  const handleSaved = () => {
    setIsSaved(true);
    // También guardamos el pin en la colección general (SavedPin) para que el estado persista
    fetch(`/api/pins/${pin.id}/save`, {
      method: 'POST',
    }).catch(err => console.error('Error sincronizando savedPin:', err));
  };

  const handleCopyCode = () => {
    if (codeBlocks.length === 0) return;
    const allCode = codeBlocks.length === 1
      ? codeBlocks[0].code
      : codeBlocks.map(b => `/* ${getLanguageLabel(b.lang)} */\n${b.code}`).join('\n\n');
    navigator.clipboard.writeText(allCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBlock = (lang: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBlock(lang);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const handleDeletePin = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/pins/${pin.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar el pin');
      }
    } catch {
      alert('Error al eliminar el pin');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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
            {showBreadcrumbs && (
              <nav aria-label="breadcrumb" className="flex-grow-1">
                <ol className="breadcrumb mb-0 small">
                  <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Explorar</Link></li>
                  {pin.language && (
                    <li className="breadcrumb-item">{getLanguageLabel(pin.language)}</li>
                  )}
                  <li className="breadcrumb-item active text-truncate" aria-current="page" style={{ maxWidth: '150px' }}>{pin.title}</li>
                </ol>
              </nav>
            )}
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

          {/* Action Buttons Mobile - Solo visible si hay sesión */}
          {session?.user && (
            <div className="d-flex align-items-center gap-2">
              <LikeButton
                pinId={pin.id}
                initialLiked={isLiked ?? false}
                initialCount={pin._count?.likes || 0}
              />
              <button 
                onClick={handleSaveClick}
                disabled={saveLoading}
                className={`btn btn-sm d-flex align-items-center gap-2 ${isSaved ? 'btn-success' : 'btn-primary'}`}
              >
                {saveLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                )}
                <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
              </button>
              {isAuthor && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                  title="Eliminar pin"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Preview Image Mobile */}
        <div className="position-relative overflow-hidden" style={{ background: 'var(--db-card-bg)' }}>
          <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-1">
            <div className="btn-group pin-detail-toolbar rounded-3 p-1">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`btn btn-sm pin-toolbar-btn ${activeTab === 'preview' ? 'pin-toolbar-btn-active' : ''}`}
              >
                <i className="bi bi-eye"></i>
              </button>
              {isAuthenticated && codeBlocks.length > 0 && (
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`btn btn-sm pin-toolbar-btn ${activeTab === 'code' ? 'pin-toolbar-btn-active' : ''}`}
                >
                  <i className="bi bi-code-slash"></i>
                </button>
              )}
            </div>
          </div>
          <div className={`d-flex align-items-center justify-content-center ${isUsability ? 'p-2' : 'p-3'}`} style={{ minHeight: isUsability ? '180px' : '200px' }}>
            {!isAuthenticated || activeTab === 'preview' ? (
              <img 
                src={pin.imageUrl} 
                alt={pin.title}
                className="mw-100 object-fit-contain rounded shadow"
                style={{ maxHeight: isUsability ? '250px' : '40vh' }}
              />
            ) : codeBlocks.length > 0 && !isAuthenticated ? (
              <div className="w-100 rounded border d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ minHeight: '12rem' }}>
                <i className="bi bi-lock-fill fs-1 text-secondary opacity-50 mb-3"></i>
                <p className="fw-semibold mb-1">Código restringido</p>
                <p className="text-secondary small mb-3">Inicia sesión para ver el código de este pin.</p>
                <Link href="/login" className="btn btn-primary btn-sm px-4">Iniciar sesión</Link>
              </div>
            ) : codeBlocks.length > 0 ? (
              <div className="w-100 rounded overflow-hidden border" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Tab bar mobile */}
                <div className="d-flex align-items-center pin-code-surface border-bottom">
                  {codeBlocks.map((block) => (
                    <button
                      key={block.lang}
                      onClick={() => setActiveCodeTab(block.lang)}
                      className={`btn btn-sm px-3 py-2 rounded-0 border-0 fw-semibold small pin-code-tab ${activeCodeTab === block.lang ? 'pin-code-tab-active' : 'pin-code-tab-inactive'}`}
                    >
                      <span className={`pin-lang-dot pin-lang-dot-${block.lang}`}></span>
                      {getLanguageLabel(block.lang)}
                    </button>
                  ))}
                  <div className="ms-auto pe-2">
                    <button onClick={() => activeBlock && handleCopyBlock(activeBlock.lang, activeBlock.code)} className="btn btn-link btn-sm pin-copy-link p-1">
                      <i className={`bi ${copiedBlock === activeCodeTab ? 'bi-check2' : 'bi-clipboard'}`}></i>
                    </button>
                  </div>
                </div>
                {activeBlock && (
                  <div className="d-flex pin-code-surface" style={{ fontSize: '0.85rem', padding: '0.75rem' }}>
                    <div className="d-flex flex-column pin-code-lines user-select-none pe-3 text-end" style={{ minWidth: '2rem' }}>
                      {activeBlock.code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
                    </div>
                    <pre className="pin-code-text mb-0" style={{ whiteSpace: 'pre', overflowX: 'auto', flex: 1 }}>
                      <code>{renderHighlightedCode(activeBlock.code)}</code>
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-secondary text-center">
                <i className="bi bi-code-slash fs-1 opacity-50 d-block mb-3"></i>
                <p className="mb-0">No hay código disponible</p>
              </div>
            )}
          </div>
        </div>

        {/* Anti-pattern: Push details down in no-usabilidad theme */}
        {theme === 'no-usabilidad' && (
          <div style={{ height: '800px', backgroundColor: 'transparent' }} className="d-flex align-items-center justify-content-center text-muted small">
            <i className="bi bi-chevron-double-down me-2"></i>
            Scroll para ver detalles
            <i className="bi bi-chevron-double-down ms-2"></i>
          </div>
        )}

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
            {showBreadcrumbs && (
              <nav aria-label="breadcrumb" className="flex-grow-1">
                <ol className="breadcrumb mb-0 small">
                  <li className="breadcrumb-item"><Link href="/" className="text-decoration-none">Explorar</Link></li>
                  {pin.language && (
                    <li className="breadcrumb-item">{getLanguageLabel(pin.language)}</li>
                  )}
                  <li className="breadcrumb-item active text-truncate" aria-current="page">{pin.title}</li>
                </ol>
              </nav>
            )}
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

            {/* Action Buttons - Solo visible si hay sesión */}
            {session?.user && (
              <div className="d-flex align-items-center gap-2">
                <LikeButton
                  pinId={pin.id}
                  initialLiked={isLiked ?? false}
                  initialCount={pin._count?.likes || 0}
                />
                <button 
                  onClick={handleSaveClick}
                  disabled={saveLoading}
                  className={`btn d-flex align-items-center gap-2 ${isUsability ? 'btn-sm' : ''} ${isSaved ? 'btn-success' : 'btn-primary'}`}
                >
                  {saveLoading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
                  )}
                  <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                </button>
                {isAuthor && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={`btn btn-outline-danger d-flex align-items-center gap-2 ${isUsability ? 'btn-sm' : ''}`}
                    title="Eliminar pin"
                  >
                    <i className="bi bi-trash"></i>
                    <span className="d-none d-xl-inline">Eliminar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Canvas Area */}
        <div className="flex-grow-1 position-relative d-flex flex-column overflow-hidden" style={{ minHeight: '300px', background: 'var(--db-card-bg)' }}>
          {/* Toolbar overlay */}
          <div className="position-absolute top-0 start-50 translate-middle-x mt-3 z-1">
            <div className="btn-group pin-detail-toolbar rounded-3 p-1">
              <button 
                onClick={() => setActiveTab('preview')}
                className={`btn btn-sm pin-toolbar-btn ${activeTab === 'preview' ? 'pin-toolbar-btn-active' : ''}`}
                title="Preview"
              >
                <i className="bi bi-eye"></i>
              </button>
              {isAuthenticated && codeBlocks.length > 0 && (
                <button 
                  onClick={() => setActiveTab('code')}
                  className={`btn btn-sm pin-toolbar-btn ${activeTab === 'code' ? 'pin-toolbar-btn-active' : ''}`}
                  title="Code"
                >
                  <i className="bi bi-code-slash"></i>
                </button>
              )}
              <a 
                href={pin.imageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm pin-toolbar-btn"
                title="Open in new tab"
              >
                <i className="bi bi-box-arrow-up-right"></i>
              </a>
            </div>
          </div>

          {/* Preview Content */}
          <div className={`flex-grow-1 d-flex align-items-center justify-content-center ${isUsability ? 'p-3' : 'p-4'}`}>
            {!isAuthenticated || activeTab === 'preview' ? (
              <img 
                src={pin.imageUrl} 
                alt={pin.title}
                className="mw-100 mh-100 object-fit-contain rounded shadow"
              />
            ) : codeBlocks.length > 0 && !isAuthenticated ? (
              <div className="w-100 rounded border d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ minHeight: '14rem', maxWidth: '960px' }}>
                <i className="bi bi-lock-fill fs-1 text-secondary opacity-50 mb-3"></i>
                <p className="fw-semibold mb-1">Código restringido</p>
                <p className="text-secondary small mb-3">Inicia sesión para ver el código de este pin.</p>
                <Link href="/login" className="btn btn-primary btn-sm px-4">Iniciar sesión</Link>
              </div>
            ) : codeBlocks.length > 0 ? (
              <div className="w-100 rounded overflow-hidden border" style={{ maxWidth: '960px', maxHeight: '75vh' }}>
                {/* Tab bar desktop preview */}
                <div className="d-flex align-items-center pin-code-surface border-bottom">
                  {codeBlocks.map((block) => (
                    <button
                      key={block.lang}
                      onClick={() => setActiveCodeTab(block.lang)}
                      className={`btn btn-sm px-4 py-2 rounded-0 border-0 fw-semibold small pin-code-tab ${activeCodeTab === block.lang ? 'pin-code-tab-active' : 'pin-code-tab-inactive'}`}
                    >
                      <span className={`pin-lang-dot pin-lang-dot-${block.lang}`}></span>
                      {getLanguageLabel(block.lang)}
                    </button>
                  ))}
                  <div className="ms-auto pe-2">
                    <button onClick={() => activeBlock && handleCopyBlock(activeBlock.lang, activeBlock.code)} className="btn btn-link btn-sm pin-copy-link p-1">
                      <i className={`bi ${copiedBlock === activeCodeTab ? 'bi-check2' : 'bi-clipboard'}`}></i>
                    </button>
                  </div>
                </div>
                {activeBlock && (
                  <div className="overflow-auto pin-code-surface" style={{ maxHeight: '60vh' }}>
                    <div className="d-flex" style={{ fontSize: '0.92rem', padding: '1rem' }}>
                      <div className="d-flex flex-column pin-code-lines user-select-none pe-3 text-end" style={{ minWidth: '2.5rem' }}>
                        {activeBlock.code.split('\n').map((_, i) => <span key={i}>{i + 1}</span>)}
                      </div>
                      <pre className="pin-code-text mb-0" style={{ whiteSpace: 'pre', overflowX: 'auto', flex: 1 }}>
                        <code>{renderHighlightedCode(activeBlock.code)}</code>
                      </pre>
                    </div>
                  </div>
                )}
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

        {/* Anti-pattern: Push description down in no-usabilidad theme */}
        {theme === 'no-usabilidad' && (
          <div style={{ height: '600px', backgroundColor: 'transparent' }} className="d-flex align-items-center justify-content-center text-muted small p-4 border-top">
            <i className="bi bi-chevron-double-down me-2"></i>
            Scroll para leer la descripción
            <i className="bi bi-chevron-double-down ms-2"></i>
          </div>
        )}

        {/* Description & Tags - below visualization, aligned with Comments */}
        {(pin.description || pin.tags) && (
          <div
            className={`border-top flex-shrink-0 overflow-auto ${isUsability ? 'p-2' : 'p-4'}`}
            style={{
              maxHeight: isUsability ? '170px' : '210px',
              minHeight: isUsability ? '80px' : '100px',
            }}
          >
            {pin.description && (
              <div className={isUsability ? 'mb-2' : 'mb-3'}>
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
      </div>

      {/* Right: Code Editor & Sidebar Info */}
      <div className={`d-flex flex-column border-start ${theme === 'no-usabilidad' ? 'overflow-auto' : 'overflow-hidden'}`} style={{ width: '100%', maxWidth: isUsability ? '420px' : '500px' }}>
        {/* Anti-pattern: Hide sidebar details in no-usabilidad theme */}
        {theme === 'no-usabilidad' && (
          <div style={{ height: '1200px' }} className="d-flex flex-column align-items-center justify-content-center text-muted p-5 text-center">
            <i className="bi bi-chevron-double-down fs-1 mb-3"></i>
            <p className="fw-bold">Más abajo encontrarás la interacción</p>
            <p className="small">Desliza para ver código y comentarios</p>
          </div>
        )}

        {/* Code Editor Section */}
        {codeBlocks.length > 0 && (
          <div className="flex-grow-1 d-flex flex-column overflow-hidden" style={{ minHeight: '350px' }}>
            {isAuthenticated ? (
              <>
                {/* Tab bar */}
                <div className="d-flex align-items-center pin-code-surface border-bottom">
                  {codeBlocks.map((block) => (
                    <button
                      key={block.lang}
                      onClick={() => setActiveCodeTab(block.lang)}
                      className={`btn btn-sm px-3 rounded-0 border-0 fw-semibold small pin-code-tab ${isUsability ? 'py-1' : 'py-2'} ${activeCodeTab === block.lang ? 'pin-code-tab-active' : 'pin-code-tab-inactive'}`}
                    >
                      <span className={`pin-lang-dot pin-lang-dot-${block.lang}`}></span>
                      {getLanguageLabel(block.lang)}
                    </button>
                  ))}
                  <div className="ms-auto">
                    <button
                      onClick={() => activeBlock && handleCopyBlock(activeBlock.lang, activeBlock.code)}
                      className="btn btn-link pin-copy-link p-2 me-1"
                      title="Copiar código"
                    >
                      <i className={`bi ${copiedBlock === activeCodeTab ? 'bi-check2' : 'bi-clipboard'}`}></i>
                    </button>
                  </div>
                </div>
                {/* Active tab code */}
                {activeBlock && (
                  <div className="flex-grow-1 overflow-auto pin-code-surface font-monospace"
                    style={{ fontSize: isUsability ? '0.78rem' : '0.9rem', padding: isUsability ? '0.6rem 0.75rem' : '1rem' }}
                  >
                    <div className="d-flex">
                      <div className="d-flex flex-column pin-code-lines user-select-none pe-3 text-end" style={{ minWidth: '2.5rem' }}>
                        {activeBlock.code.split('\n').map((_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </div>
                      <pre className="pin-code-text mb-0" style={{ whiteSpace: 'pre', overflowX: 'auto', flex: 1 }}>
                        <code>{renderHighlightedCode(activeBlock.code)}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-4 text-center pin-code-surface">
                <i className="bi bi-lock-fill fs-1 text-secondary opacity-50 mb-3"></i>
                <p className="fw-semibold mb-1">Código restringido</p>
                <p className="text-secondary small mb-3">Inicia sesión para ver el código de este pin.</p>
                <Link href="/login" className="btn btn-primary btn-sm px-4">Iniciar sesión</Link>
              </div>
            )}
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

      </div>

      {/* Save to Board Modal */}
      {showSaveModal && (
        <SaveToBoardModal
          pinId={pin.id}
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Eliminar pin</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}></button>
              </div>
              <div className="modal-body">
                <p className="text-secondary mb-0">¿Estás segura de que quieres eliminar <strong>{pin.title}</strong>? Esta acción no se puede deshacer.</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDeleteConfirm(false)} disabled={deleting}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger btn-sm d-flex align-items-center gap-2" onClick={handleDeletePin} disabled={deleting}>
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-trash"></i>
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Anti-pattern: Unnecessary scroll padding for No Usability theme */}
      {theme === 'no-usabilidad' && (
        <div style={{ height: '3000px', pointerEvents: 'none' }}></div>
      )}
    </main>
  );
}
