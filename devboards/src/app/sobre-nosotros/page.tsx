'use client';

import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function SobreNosotrosPage() {

  return (
    <main className="flex-grow-1 overflow-auto">
      <div className="container py-4" style={{ maxWidth: '900px' }}>
        <Breadcrumb />
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-info-circle me-3 text-primary"></i>
            Sobre Nosotros
          </h1>
          <p className="lead text-secondary">
            Conoce más sobre el proyecto DevBoards
          </p>
        </div>

        {/* Presentación Personal */}
        <section className="mb-5">
          <div className="card border">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex flex-column gap-4">
                <div className="text-center">
                  <img
                    src="/cv/foto-perfil.png"
                    alt="Foto de Mª Carmen García Navarro"
                    className="rounded-circle border shadow"
                    style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                  />
                  <h3 className="h4 fw-bold mt-3 mb-1">Mª Carmen García Navarro</h3>
                  <p className="text-secondary mb-0">Técnico Superior en Desarrollo de Aplicaciones Web (en curso)</p>
                </div>

                <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
                  <h5 className="fw-semibold mb-3">Sobre mí</h5>
                  <p className="text-secondary mb-0">
                    Soy Mª Carmen García Navarro, estudiante de Desarrollo de Aplicaciones Web con un perfil
                    creativo y técnico, orientado al diseño y la construcción de productos digitales. Me gusta
                    combinar desarrollo, usabilidad y estética visual para crear experiencias claras y útiles,
                    aplicando lo aprendido en proyectos reales como DevBoards.
                  </p>
                </div>

                <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
                  <h5 className="fw-semibold mb-3">Diseño</h5>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {[
                      'Substance Painter',
                      'ZBrush',
                      'Blender',
                      'Maya',
                      'Unreal Engine 5',
                      'Substance Designer',
                      'Unity'
                    ].map((software) => (
                      <span key={software} className="badge bg-secondary-subtle text-secondary px-3 py-2">{software}</span>
                    ))}
                  </div>
                </div>

                <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
                  <h5 className="fw-semibold mb-3">Desarrollo</h5>
                  <div className="d-flex flex-wrap justify-content-center gap-2">
                    {['Laravel', 'Java', 'JavaScript', 'TypeScript', 'Python', 'Angular'].map((tech) => (
                      <span key={tech} className="badge bg-secondary-subtle text-secondary px-3 py-2">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="text-center mx-auto" style={{ maxWidth: '700px' }}>
                  <h5 className="fw-semibold mb-3">Premio</h5>
                  <p className="text-secondary mb-0">
                    Premio al mejor videojuego en Málaga Game Jam 2022 con el proyecto “Cleaning for Mamma”,
                    destacando en jugabilidad/mecánicas, diseño/gráficos y sonido.
                  </p>
                </div>

                <div className="mt-2 mb-0 text-center">
                  <h6 className="fw-bold mb-3">Contacto</h6>
                  <div className="d-flex flex-column gap-2">
                    <a
                      href="https://www.linkedin.com/in/maricarmengarcianavarro19/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-linkedin me-2"></i>
                      linkedin.com/in/maricarmengarcianavarro19
                    </a>
                    <a
                      href="https://github.com/MCarmen96"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-github me-2"></i>
                      github.com/MCarmen96
                    </a>
                    <a
                      href="mailto:carmengarcianavarro19@gmail.com"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      carmengarcianavarro19@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Description */}
        <section className="mb-5">
          <div className="card border">
            <div className="card-body p-4 p-md-5">
              <h2 className="h3 fw-bold mb-4 text-primary">
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
                  <i className="bi bi-book fs-4 text-primary"></i>
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
                    <div className="p-3 rounded border" style={{ borderLeft: '4px solid #0d9488' }}>
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
                    <div className="p-3 rounded border" style={{ borderLeft: '4px solid #f43f5e' }}>
                      <h6 className="fw-bold mb-2" style={{ color: '#f43f5e' }}>
                        <i className="bi bi-x-circle me-1"></i>
                        No Usabilidad
                      </h6>
                      <small className="text-secondary d-block">
                        Anti-patrones y malas prácticas con fines educativos
                      </small>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 rounded border" style={{ borderLeft: '4px solid #8b5cf6' }}>
                      <h6 className="fw-bold mb-2" style={{ color: '#8b5cf6' }}>
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
