'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function AnalisisPage() {

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

        {/* Video Section */}
        <div className="row g-4">
          {/* Video 1 */}
          <div className="col-12">
            <div className="card border">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-play-circle me-2 text-primary"></i>
                  Demo del Proyecto
                </h5>
                <div className="ratio ratio-16x9 rounded overflow-hidden bg-dark">
                  <video 
                    controls 
                    className="w-100 h-100"
                    poster="/api/placeholder/1280/720"
                  >
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
          </div>

          {/* Video 2 - Placeholder para futuro */}
          <div className="col-12 col-lg-6">
            <div className="card border">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-play-circle me-2 text-primary"></i>
                  Análisis de Usabilidad
                </h5>
                <div className="ratio ratio-16x9 rounded overflow-hidden bg-dark">
                  <video 
                    controls 
                    className="w-100 h-100"
                    poster="/api/placeholder/1280/720"
                  >
                    <source src="/videos/usabilidad.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
                <p className="text-secondary mt-3 mb-0 small">
                  Análisis del tema de usabilidad.
                </p>
              </div>
            </div>
          </div>

          {/* Video 3 - Placeholder para futuro */}
          <div className="col-12 col-lg-6">
            <div className="card border">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">
                  <i className="bi bi-play-circle me-2 text-primary"></i>
                  Anti-patrones UX
                </h5>
                <div className="ratio ratio-16x9 rounded overflow-hidden bg-dark">
                  <video 
                    controls 
                    className="w-100 h-100"
                    poster="/api/placeholder/1280/720"
                  >
                    <source src="/videos/no-usabilidad.mp4" type="video/mp4" />
                    Tu navegador no soporta el elemento de video.
                  </video>
                </div>
                <p className="text-secondary mt-3 mb-0 small">
                  Demostración de anti-patrones en el tema de no-usabilidad.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="alert alert-info mt-5 d-flex align-items-start gap-3 border">
          <i className="bi bi-info-circle-fill fs-4 text-primary"></i>
          <div>
            <h6 className="fw-bold mb-2">Nota sobre los vídeos</h6>
            <p className="mb-0 small">
              Para agregar tus vídeos, colócalos en la carpeta <code>public/videos/</code> con los nombres:
              <code>demo.mp4</code>, <code>usabilidad.mp4</code>, <code>no-usabilidad.mp4</code>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
