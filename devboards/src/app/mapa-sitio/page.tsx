'use client';

import { useAppTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function MapaSitioPage() {
  const { theme, themeLabel, themeColor } = useAppTheme();
  const { data: session } = useSession();

  const sections = [
    {
      title: 'Navegación Principal',
      icon: 'bi-compass',
      pages: [
        { name: 'Explorar', href: '/', icon: 'bi-house-door', description: 'Página principal con todos los pins' },
        { name: 'Siguiendo', href: '/feed', icon: 'bi-people', description: 'Pins de usuarios que sigues', auth: true },
        { name: 'Análisis', href: '/analisis', icon: 'bi-bar-chart-line', description: 'Videos de análisis del proyecto' },
        { name: 'Sobre Nosotros', href: '/sobre-nosotros', icon: 'bi-info-circle', description: 'Información del proyecto y CV' },
        { name: 'Mapa del Sitio', href: '/mapa-sitio', icon: 'bi-map', description: 'Esta página' },
      ]
    },
    {
      title: 'Contenido y Creación',
      icon: 'bi-plus-square',
      pages: [
        { name: 'Crear Pin', href: '/create', icon: 'bi-plus-circle', description: 'Crear un nuevo pin', auth: true },
        { name: 'Detalle de Pin', href: '/pin/[id]', icon: 'bi-eye', description: 'Ver detalles de un pin', dynamic: true },
      ]
    },
    {
      title: 'Perfil y Configuración',
      icon: 'bi-person-circle',
      pages: [
        { name: 'Mi Perfil', href: '/profile', icon: 'bi-person', description: 'Tu perfil de usuario', auth: true },
        { name: 'Perfil de Usuario', href: '/profile/[id]', icon: 'bi-person-badge', description: 'Ver perfil de otro usuario', dynamic: true },
        { name: 'Mis Tableros', href: '/boards', icon: 'bi-collection', description: 'Tus tableros personalizados', auth: true },
        { name: 'Pins Guardados', href: '/saved', icon: 'bi-bookmark', description: 'Pins que has guardado', auth: true },
      ]
    },
    {
      title: 'Búsqueda y Filtros',
      icon: 'bi-search',
      pages: [
        { name: 'Búsqueda', href: '/?q=[query]', icon: 'bi-search', description: 'Buscar pins por palabras clave', dynamic: true },
        { name: 'Por Lenguaje', href: '/?language=[lang]', icon: 'bi-code-slash', description: 'Filtrar por lenguaje de programación', dynamic: true },
        { name: 'Por Etiquetas', href: '/?tags=[tag]', icon: 'bi-tags', description: 'Filtrar por etiquetas', dynamic: true },
      ]
    },
    {
      title: 'Autenticación',
      icon: 'bi-shield-lock',
      pages: [
        { name: 'Iniciar Sesión', href: '/login', icon: 'bi-box-arrow-in-right', description: 'Acceder a tu cuenta', public: true },
        { name: 'Registrarse', href: '/register', icon: 'bi-person-plus', description: 'Crear una cuenta nueva', public: true },
      ]
    },
  ];

  return (
    <main className="flex-grow-1 overflow-auto">
      <div className="container py-5" style={{ maxWidth: '1200px' }}>
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">
            <i className="bi bi-map me-3" style={{ color: themeColor }}></i>
            Mapa del Sitio
          </h1>
          <p className="lead text-secondary">
            Explora todas las secciones y páginas de DevBoards
          </p>
        </div>

        {/* Theme Info Badge */}
        <div className="d-flex justify-content-center mb-4">
          <div 
            className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
            style={{ backgroundColor: `${themeColor}20`, border: `2px solid ${themeColor}` }}
          >
            <span className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: themeColor }} />
            <span className="fw-bold" style={{ color: themeColor }}>
              Tema Actual: {themeLabel}
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="row g-4">
          {sections.map((section, idx) => (
            <div key={idx} className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div 
                  className="card-header border-0 py-3"
                  style={{ backgroundColor: `${themeColor}15` }}
                >
                  <h4 className="h5 mb-0 fw-bold d-flex align-items-center gap-2">
                    <i className={`${section.icon} fs-5`} style={{ color: themeColor }}></i>
                    {section.title}
                  </h4>
                </div>
                <div className="card-body p-0">
                  <ul className="list-group list-group-flush">
                    {section.pages.map((page, pageIdx) => {
                      const isDisabled = (page.auth && !session) || (page.public && session);
                      const isDynamic = page.dynamic;
                      
                      return (
                        <li key={pageIdx} className="list-group-item border-0 py-3 px-4">
                          <div className="d-flex align-items-start gap-3">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ 
                                width: '40px', 
                                height: '40px', 
                                backgroundColor: isDisabled ? '#e9ecef' : `${themeColor}20`,
                                color: isDisabled ? '#6c757d' : themeColor
                              }}
                            >
                              <i className={page.icon}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                {isDynamic ? (
                                  <span className={`fw-semibold ${isDisabled ? 'text-muted' : ''}`}>
                                    {page.name}
                                  </span>
                                ) : (
                                  <Link 
                                    href={page.href} 
                                    className={`text-decoration-none fw-semibold ${isDisabled ? 'text-muted pe-none' : ''}`}
                                    style={!isDisabled ? { color: themeColor } : undefined}
                                  >
                                    {page.name}
                                  </Link>
                                )}
                                {isDynamic && (
                                  <span className="badge bg-secondary-subtle text-secondary small">
                                    Dinámico
                                  </span>
                                )}
                                {page.auth && !session && (
                                  <span className="badge bg-warning-subtle text-warning small">
                                    <i className="bi bi-lock-fill me-1"></i>
                                    Requiere Login
                                  </span>
                                )}
                                {page.public && session && (
                                  <span className="badge bg-info-subtle text-info small">
                                    Solo sin sesión
                                  </span>
                                )}
                              </div>
                              <p className="small text-secondary mb-0">
                                {page.description}
                              </p>
                              {!isDynamic && (
                                <code className="small text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                                  {page.href}
                                </code>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="row g-3 mt-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ backgroundColor: `${themeColor}10` }}>
              <div className="h2 fw-bold mb-1" style={{ color: themeColor }}>
                {sections.reduce((acc, section) => acc + section.pages.length, 0)}
              </div>
              <div className="small text-secondary">Páginas Totales</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ backgroundColor: `${themeColor}10` }}>
              <div className="h2 fw-bold mb-1" style={{ color: themeColor }}>
                {sections.reduce((acc, section) => acc + section.pages.filter(p => p.auth).length, 0)}
              </div>
              <div className="small text-secondary">Requieren Login</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ backgroundColor: `${themeColor}10` }}>
              <div className="h2 fw-bold mb-1" style={{ color: themeColor }}>
                {sections.reduce((acc, section) => acc + section.pages.filter(p => p.dynamic).length, 0)}
              </div>
              <div className="small text-secondary">Dinámicas</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ backgroundColor: `${themeColor}10` }}>
              <div className="h2 fw-bold mb-1" style={{ color: themeColor }}>
                3
              </div>
              <div className="small text-secondary">Temas Disponibles</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="alert alert-light border shadow-sm mt-5">
          <div className="d-flex align-items-start gap-3">
            <i className="bi bi-lightbulb fs-4" style={{ color: themeColor }}></i>
            <div>
              <h6 className="fw-bold mb-2">
                <i className="bi bi-info-circle me-2"></i>
                Información Útil
              </h6>
              <ul className="mb-0 small">
                <li>Las páginas marcadas como <span className="badge bg-warning-subtle text-warning small">Requiere Login</span> necesitan autenticación</li>
                <li>Las páginas <span className="badge bg-secondary-subtle text-secondary small">Dinámicas</span> requieren parámetros adicionales en la URL</li>
                <li>Puedes cambiar el tema desde el login/registro o desde tu perfil</li>
                <li>Los tres temas están disponibles: Usabilidad, No Usabilidad y Accesibilidad</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!session && (
          <div className="text-center mt-5">
            <p className="text-secondary mb-3">¿Nuevo en DevBoards?</p>
            <div className="d-flex gap-3 justify-content-center">
              <Link href="/register" className="btn btn-primary">
                <i className="bi bi-person-plus me-2"></i>
                Crear Cuenta
              </Link>
              <Link href="/login" className="btn btn-outline-secondary">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
