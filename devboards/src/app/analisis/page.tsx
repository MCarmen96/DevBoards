'use client';

import { useState } from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

type AnalisisTab = 'usabilidad' | 'accesibilidad' | 'responsive';

const TABS: { id: AnalisisTab; label: string; icon: string; color: string }[] = [
  { id: 'usabilidad',    label: 'Usabilidad',    icon: 'bi-check-circle',       color: '#0d9488' },
  { id: 'accesibilidad', label: 'Accesibilidad', icon: 'bi-universal-access',   color: '#8b5cf6' },
  { id: 'responsive',   label: 'Responsive',    icon: 'bi-phone',              color: '#0d6efd' },
];

const VIDEO_COUNT = 10;

function VideoCard({ filename }: { filename: string }) {
  return (
    <div className="card border h-100">
      <div className="card-body p-3">
        <h6 className="card-title fw-semibold mb-2 text-truncate small" title={filename}>
          <i className="bi bi-play-circle me-1 text-primary"></i>
          {filename}
        </h6>
        <div className="ratio ratio-16x9 rounded overflow-hidden bg-dark">
          <video controls className="w-100 h-100">
            <source src={`/videos/${filename}`} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      </div>
    </div>
  );
}

export default function AnalisisPage() {
  const [activeTab, setActiveTab] = useState<AnalisisTab>('usabilidad');

  const videos = Array.from({ length: VIDEO_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `${activeTab}_${n}.mp4`;
  });

  return (
    <main className="flex-grow-1 overflow-auto">
      <div className="container py-4" style={{ maxWidth: '1200px' }}>
        <Breadcrumb />

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-bar-chart-line me-3 text-primary"></i>
            Análisis
          </h1>
          <p className="lead text-secondary">
            Vídeos de análisis y demostración del proyecto DevBoards
          </p>
        </div>

        {/* Video principal demo */}
        <div className="card border mb-5">
          <div className="card-body p-4">
            <h5 className="card-title fw-bold mb-3">
              <i className="bi bi-play-circle me-2 text-primary"></i>
              Demo del Proyecto
            </h5>
            <div className="ratio ratio-16x9 rounded overflow-hidden bg-dark">
              <video controls className="w-100 h-100">
                <source src="/videos/demo.mp4" type="video/mp4" />
                <source src="/videos/demo.webm" type="video/webm" />
                Tu navegador no soporta el elemento de video.
              </video>
            </div>
            <p className="text-secondary mt-3 mb-0">
              Visualización completa de las funcionalidades principales de DevBoards.
            </p>
          </div>
        </div>

        {/* Tabs de análisis */}
        <div className="card border">
          <div className="card-body p-4">
            {/* Tabs centrados */}
            <ul className="nav nav-tabs justify-content-center mb-4 border-bottom" role="tablist">
              {TABS.map((tab) => (
                <li key={tab.id} className="nav-item" role="presentation">
                  <button
                    className={`nav-link d-flex align-items-center gap-2 fw-semibold px-4${activeTab === tab.id ? ' active' : ''}`}
                    style={activeTab === tab.id ? { color: tab.color, borderBottomColor: tab.color } : {}}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                  >
                    <i className={`bi ${tab.icon}`}></i>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Grid de 10 vídeos */}
            <div className="row g-3">
              {videos.map((filename) => (
                <div key={filename} className="col-12 col-sm-6 col-xl-4">
                  <VideoCard filename={filename} />
                </div>
              ))}
            </div>

            <p className="text-secondary small text-center mt-4 mb-0">
              <i className="bi bi-folder2 me-1"></i>
              Coloca los vídeos en <code>public/videos/</code> con el nombre indicado en cada tarjeta.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
