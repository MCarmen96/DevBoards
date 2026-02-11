'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PinWithRelations } from '@/types';
import { LikeButton } from './LikeButton';
import { CommentSection } from './CommentSection';
import { SaveToBoardModal } from '@/components/boards/SaveToBoardModal';
import { formatDistanceToNow } from '@/lib/utils';

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
    <main className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#101322]">
      {/* Left: Preview & Header Info */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#101322]">
        {/* Breadcrumbs & Heading */}
        <div className="px-6 py-4 flex flex-col gap-4 border-b border-[#222949]">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[#909acb] hover:text-white transition-colors">Explorar</Link>
            <span className="text-[#909acb]">/</span>
            {pin.language && (
              <>
                <span className="text-[#909acb]">{getLanguageLabel(pin.language)}</span>
                <span className="text-[#909acb]">/</span>
              </>
            )}
            <span className="text-white font-medium truncate">{pin.title}</span>
          </div>

          {/* Title and Actions */}
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-2xl font-bold leading-tight">{pin.title}</h1>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#909acb]">by</span>
                <Link href={`/profile/${pin.author.id}`} className="text-white font-medium hover:underline">
                  @{getUsername(pin.author.name)}
                </Link>
                <span className="text-[#909acb] mx-1">•</span>
                <span className="text-[#909acb]">{timeAgo}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <LikeButton
                pinId={pin.id}
                initialLiked={isLiked ?? false}
                initialCount={pin._count?.likes || 0}
              />
              <button 
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#0d33f2] hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-[0_0_15px_rgba(13,51,242,0.4)]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Canvas Area */}
        <div className="flex-1 relative bg-[#0a0c14] flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          {/* Toolbar overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 bg-[#1a1d2d]/90 backdrop-blur-md rounded-lg border border-[#2b3355] shadow-xl">
            <button 
              onClick={() => setActiveTab('preview')}
              className={`p-2 rounded-md transition-colors ${activeTab === 'preview' ? 'text-white bg-white/10' : 'text-[#909acb] hover:text-white hover:bg-white/10'}`}
              title="Preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`p-2 rounded-md transition-colors ${activeTab === 'code' ? 'text-white bg-white/10' : 'text-[#909acb] hover:text-white hover:bg-white/10'}`}
              title="Code"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
            <div className="w-px h-4 bg-[#2b3355] mx-1" />
            <a 
              href={pin.imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-[#909acb] hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title="Open in new tab"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Preview Content */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1e32] to-[#0a0c14]">
            {activeTab === 'preview' ? (
              <img 
                src={pin.imageUrl} 
                alt={pin.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : pin.codeSnippet ? (
              <div className="w-full max-w-4xl bg-[#0d101c] rounded-lg overflow-hidden border border-[#222949]">
                <div className="flex items-center justify-between px-4 py-2 bg-[#101323] border-b border-[#222949]">
                  <span className="text-sm text-[#909acb]">{getLanguageLabel(pin.language)}</span>
                  <button 
                    onClick={handleCopyCode}
                    className="text-xs text-[#909acb] hover:text-white transition-colors"
                  >
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <pre className="p-4 text-sm font-mono text-gray-300 overflow-auto max-h-[60vh]">
                  <code>{pin.codeSnippet}</code>
                </pre>
              </div>
            ) : (
              <div className="text-[#909acb] text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <p>No hay código disponible</p>
              </div>
            )}
          </div>

          {/* Bottom Status Bar */}
          {pin.language && (
            <div className="h-8 bg-[#101323] border-t border-[#222949] flex items-center justify-between px-4 text-xs text-[#909acb]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
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
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col border-l border-[#222949] bg-[#161b2e]">
        {/* Description & Tags Section */}
        {(pin.description || pin.tags) && (
          <div className="p-5 border-b border-[#222949]">
            {pin.description && (
              <div className="mb-4">
                <h3 className="text-white font-semibold text-sm mb-2">Descripción</h3>
                <p className="text-[#909acb] text-sm leading-relaxed whitespace-pre-wrap">{pin.description}</p>
              </div>
            )}
            {pin.tags && (
              <div className="flex flex-wrap gap-2">
                {pin.tags.split(',').map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#222949] text-[#909acb] text-xs rounded-full hover:bg-[#2b3355] transition-colors"
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
          <div className="flex-1 flex flex-col min-h-[300px]">
            {/* Editor Header */}
            <div className="flex items-center bg-[#101323] border-b border-[#222949]">
              <div className="px-5 py-3 text-sm font-bold text-white border-b-2 border-[#0d33f2] bg-[#161b2e]">
                {getLanguageLabel(pin.language)}
              </div>
              <div className="flex-1" />
              <button 
                onClick={handleCopyCode}
                className="mr-3 p-1.5 text-[#909acb] hover:text-white rounded hover:bg-[#222949] transition-colors"
                title="Copy Code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-auto bg-[#0d101c] p-4 font-mono text-sm leading-relaxed scrollbar-hide relative group">
              <button 
                onClick={handleCopyCode}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0d33f2]/90 hover:bg-[#0d33f2] text-white text-xs font-bold py-1.5 px-3 rounded shadow-lg backdrop-blur-sm"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <div className="flex">
                <div className="flex flex-col text-[#4b5263] select-none pr-4 text-right min-w-[2rem]">
                  {pin.codeSnippet.split('\n').map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <pre className="text-gray-300 whitespace-pre overflow-x-auto">
                  <code>{pin.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="h-[40%] min-h-[280px] border-t border-[#222949] bg-[#101323] flex flex-col">
          <CommentSection
            pinId={pin.id}
            initialCount={pin._count?.comments || 0}
          />
        </div>
      </div>

      {/* Related Pins Sidebar (2xl screens) */}
      {relatedPins.length > 0 && (
        <div className="hidden 2xl:flex flex-col w-[280px] border-l border-[#222949] bg-[#0d101c]">
          <div className="p-4 border-b border-[#222949]">
            <h3 className="text-white font-semibold text-sm">Pins relacionados</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {relatedPins.map((relatedPin) => (
              <Link key={relatedPin.id} href={`/pin/${relatedPin.id}`} className="group cursor-pointer block">
                <div className="aspect-video rounded-lg bg-[#1e2337] mb-2 overflow-hidden relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url("${relatedPin.imageUrl}")` }}
                  />
                </div>
                <h4 className="text-white text-xs font-medium truncate group-hover:text-[#0d33f2] transition-colors">
                  {relatedPin.title}
                </h4>
                <p className="text-[#565f89] text-[10px]">
                  by @{getUsername(relatedPin.author.name)}
                </p>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t border-[#222949] text-center">
            <Link href="/" className="text-xs text-[#0d33f2] font-medium hover:underline">
              Ver todos los pins
            </Link>
          </div>
        </div>
      )}

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
