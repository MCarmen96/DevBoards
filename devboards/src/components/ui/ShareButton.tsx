'use client';

import { useState } from 'react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  className?: string;
}

export function ShareButton({ url, title = 'DevBoards', className = 'btn btn-secondary flex-grow-1 fw-bold small' }: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const shareUrl = url || window.location.href;

    // Intentar usar la API nativa de compartir si está disponible
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        return;
      } catch (error) {
        // Usuario canceló o error - fallback a copiar
      }
    }

    // Fallback: copiar al portapapeles
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <>
      <button onClick={handleShare} className={className}>
        Compartir
      </button>

      {/* Toast notification */}
      {showToast && (
        <div 
          className="position-fixed bottom-0 end-0 p-3" 
          style={{ zIndex: 1100 }}
        >
          <div className="toast show bg-success text-white">
            <div className="toast-body d-flex align-items-center gap-2">
              <i className="bi bi-check-circle-fill"></i>
              ¡Enlace copiado al portapapeles!
            </div>
          </div>
        </div>
      )}
    </>
  );
}
