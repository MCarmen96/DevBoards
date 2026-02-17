'use client';

import { useAppTheme } from '@/context/ThemeContext';
import Link from 'next/link';

export default function SobreNosotrosPage() {
  const { theme, themeLabel, themeColor } = useAppTheme();

  return (
    <main className="flex-grow-1 overflow-auto">
      <div className="container py-5" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-info-circle me-3" style={{ color: themeColor }}></i>
            Sobre Nosotros
          </h1>
          <p className="lead text-secondary">
            Conoce más sobre el proyecto DevBoards
          </p>
        </div>

        {/* Project Description */}
        <section className="mb-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 className="h3 fw-bold mb-4" style={{ color: themeColor }}>
                <i className="bi bi-code-square me-2"></i>
                Acerca del Proyecto
              </h2>
              
              <div className="mb-4">
                <h5 className="fw-semibold mb-3">¿Qué es DevBoards?</h5>
                <p className="text-secondary">
                  DevBoards es una aplicación tipo Pinterest diseñada específicamente para desarrolladores web. 
                  Permite coleccionar, organizar y compartir fragmentos de código de UI, CSS, HTML, JavaScript 
                  y TypeScript mediante un sistema intuitivo de pins y tableros temáticos.
                </p>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Contexto Académico</h5>
                <div className="alert alert-light border d-flex align-items-start gap-3">
                  <i className="bi bi-book fs-4" style={{ color: themeColor }}></i>
                  <div>
                    <p className="mb-2">
                      <strong>Este proyecto es una práctica del módulo de Diseño de Interfaces</strong> 
                      en el ciclo formativo de Desarrollo de Aplicaciones Web (DAW).
                    </p>
                    <p className="mb-0 small text-secondary">
                      El objetivo principal es aplicar principios de usabilidad, accesibilidad y diseño 
                      de experiencia de usuario (UX) en el desarrollo de aplicaciones web modernas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-semibold mb-3">Sistema de Temas Educativo</h5>
                <p className="text-secondary mb-3">
                  La aplicación incluye tres temas diferentes para demostrar distintos enfoques de diseño:
                </p>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded border" style={{ borderLeft: '4px solid #0d33f2' }}>
                      <h6 className="fw-bold text-primary mb-2">
                        <i className="bi bi-check-circle me-1"></i>
                        Usabilidad
                      </h6>
                      <small className="text-secondary d-block">
                        Diseño equilibrado siguiendo buenas prácticas de UX
                      </small>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded border" style={{ borderLeft: '4px solid #f59e0b' }}>
                      <h6 className="fw-bold mb-2" style={{ color: '#f59e0b' }}>
                        <i className="bi bi-x-circle me-1"></i>
                        No Usabilidad
                      </h6>
                      <small className="text-secondary d-block">
                        Anti-patrones y malas prácticas con fines educativos
                      </small>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded border" style={{ borderLeft: '4px solid #10b981' }}>
                      <h6 className="fw-bold mb-2" style={{ color: '#10b981' }}>
                        <i className="bi bi-universal-access me-1"></i>
                        Accesibilidad
                      </h6>
                      <small className="text-secondary d-block">
                        Optimizado para accesibilidad según WCAG
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="fw-semibold mb-3">Tecnologías Utilizadas</h5>
                <div className="d-flex flex-wrap gap-2">
                  {['Next.js 16', 'React', 'TypeScript', 'Prisma', 'SQLite', 'NextAuth.js', 'Bootstrap 5'].map((tech) => (
                    <span key={tech} className="badge bg-secondary-subtle text-secondary px-3 py-2">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CV Section */}
        <section className="mb-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <h2 className="h3 fw-bold mb-4" style={{ color: themeColor }}>
                <i className="bi bi-file-earmark-person me-2"></i>
                Curriculum Vitae
              </h2>

              <div className="d-flex flex-column gap-3">
                <p className="text-secondary">
                  Descarga el currículum del autor del proyecto en formato PDF.
                </p>

                {/* CV Embed */}
                <div className="border rounded overflow-hidden bg-light">
                  <object
                    data="/cv/curriculum.pdf"
                    type="application/pdf"
                    className="w-100"
                    style={{ height: '600px' }}
                  >
                    {/* Fallback si el navegador no puede mostrar el PDF */}
                    <div className="p-5 text-center">
                      <i className="bi bi-file-earmark-pdf fs-1 text-danger mb-3 d-block"></i>
                      <p className="text-secondary mb-3">
                        Tu navegador no puede mostrar el PDF directamente.
                      </p>
                      <a 
                        href="/cv/curriculum.pdf" 
                        download="Curriculum_DevBoards.pdf"
                        className="btn btn-primary"
                      >
                        <i className="bi bi-download me-2"></i>
                        Descargar CV (PDF)
                      </a>
                    </div>
                  </object>
                </div>

                {/* Download Button */}
                <div className="d-flex gap-3 justify-content-center">
                  <a 
                    href="/cv/curriculum.pdf" 
                    download="Curriculum_DevBoards.pdf"
                    className="btn btn-primary d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-download"></i>
                    Descargar CV
                  </a>
                  <a 
                    href="/cv/curriculum.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                    Abrir en nueva pestaña
                  </a>
                </div>

                <div className="alert alert-info border-0 shadow-sm mt-3">
                  <div className="d-flex align-items-start gap-3">
                    <i className="bi bi-info-circle-fill fs-5" style={{ color: themeColor }}></i>
                    <div>
                      <h6 className="fw-bold mb-2">Nota sobre el CV</h6>
                      <p className="mb-0 small">
                        Para mostrar tu CV, coloca el archivo PDF en la carpeta <code>public/cv/</code> con el nombre 
                        <code>curriculum.pdf</code>. El archivo se mostrará automáticamente en esta sección.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center text-secondary">
          <p className="mb-2">
            <i className="bi bi-github me-2"></i>
            <a href="https://github.com/MCarmen96/DevBoards" className="text-decoration-none">
              Ver código en GitHub
            </a>
          </p>
          <p className="small mb-0">
            Desarrollado con <i className="bi bi-heart-fill text-danger"></i> como proyecto académico
          </p>
        </div>
      </div>
    </main>
  );
}
