'use client';

import { useAppTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function MapaSitioPage() {
  const { theme, themeLabel, themeColor } = useAppTheme();
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  return (
    <main className="flex-grow-1 overflow-auto">
      <div className="container py-4" style={{ maxWidth: '900px' }}>
        <Breadcrumb />
        {/* Header */}
        <div className="mb-4">
          <h1 className="h2 fw-bold mb-2">Mapa del Sitio</h1>
          <p className="text-secondary mb-0">
            Estructura completa de navegación de DevBoards
            {isLoggedIn
              ? <span className="ms-2 badge bg-success-subtle text-success">Sesión iniciada</span>
              : <span className="ms-2 badge bg-secondary-subtle text-secondary">Sin sesión</span>
            }
          </p>
        </div>

        <hr className="my-4" />

        {/* Mapa en formato lista jerárquica */}
        <div className="p-4 rounded border">
          <nav aria-label="Mapa del sitio">
            <ul className="list-unstyled mb-0">

              {/* ── ZONA PÚBLICA ─────────────────────────────────── */}
              <li className="mb-4">
                <span className="fw-bold text-uppercase small text-secondary d-block mb-2" style={{ letterSpacing: '.05em' }}>
                  Zona pública
                </span>
                <ul className="list-unstyled ms-3">

                  {/* Inicio */}
                  <li className="mb-3">
                    <Link href="/" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                      <i className="bi bi-house-door"></i> Inicio — Explorar Pins
                    </Link>
                    <ul className="list-unstyled ms-4 mt-1">
                      <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Filtrar por lenguaje (HTML, CSS, JS, TS, React…)</li>
                      <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Buscar por palabra clave o etiqueta</li>
                      <li className="mb-2">
                        <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Abrir pin</span>
                        {/* Detalle de Pin — anidado aquí porque se accede desde el listado */}
                        <ul className="list-unstyled ms-4 mt-1">
                          <li className="mb-1">
                            <span className="small fw-semibold text-body"><i className="bi bi-eye me-1 text-secondary"></i>Detalle de Pin</span>
                            <ul className="list-unstyled ms-4 mt-1">
                              <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver imagen y código</li>
                              <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver comentarios</li>
                              {isLoggedIn && <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Dar like / Guardar en tablero</li>}
                              {isLoggedIn && <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Escribir comentario</li>}
                              <li className="mb-1">
                                <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver autor</span>
                                {/* Perfil — anidado aquí porque se accede desde el detalle */}
                                <ul className="list-unstyled ms-4 mt-1">
                                  <li className="mb-1">
                                    <span className="small fw-semibold text-body"><i className="bi bi-person-badge me-1 text-secondary"></i>Perfil de usuario</span>
                                    <ul className="list-unstyled ms-4 mt-1">
                                      <li className="small text-muted mb-1"><i className="bi bi-arrow-return-right me-1"></i>Ver pins del usuario</li>
                                      <li className="small text-muted mb-1"><i className="bi bi-arrow-return-right me-1"></i>Ver estadísticas</li>
                                      {isLoggedIn && <li className="small text-muted mb-1"><i className="bi bi-arrow-return-right me-1"></i>Seguir / Dejar de seguir</li>}
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>

                  {/* Análisis */}
                  <li className="mb-2">
                    <Link href="/analisis" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                      <i className="bi bi-bar-chart-line"></i> Análisis
                    </Link>
                    <ul className="list-unstyled ms-4 mt-1">
                      <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver vídeos de demostración del proyecto</li>
                    </ul>
                  </li>

                  {/* Sobre Nosotros */}
                  <li className="mb-2">
                    <Link href="/sobre-nosotros" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                      <i className="bi bi-info-circle"></i> Sobre Nosotros
                    </Link>
                    <ul className="list-unstyled ms-4 mt-1">
                      <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Información del proyecto</li>
                      <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver y descargar CV del autor</li>
                    </ul>
                  </li>

                  {/* Mapa del Sitio */}
                  <li className="mb-2">
                    <Link href="/mapa-sitio" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                      <i className="bi bi-map"></i> Mapa del Sitio
                      <span className="badge bg-secondary-subtle text-secondary ms-1 small fw-normal">Esta página</span>
                    </Link>
                  </li>

                </ul>
              </li>

              {/* ── ACCESO (sin sesión) ──────────────────────────── */}
              {!isLoggedIn && (
                <li className="mb-4">
                  <span className="fw-bold text-uppercase small text-secondary d-block mb-2" style={{ letterSpacing: '.05em' }}>
                    Acceso
                  </span>
                  <ul className="list-unstyled ms-3">
                    <li className="mb-2">
                      <Link href="/login" className="text-decoration-none d-flex align-items-center gap-2 text-body">
                        <i className="bi bi-box-arrow-in-right text-secondary"></i> Iniciar Sesión
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Entrar con email y contraseña</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Enlace a Registrarse</li>
                      </ul>
                    </li>
                    <li className="mb-2">
                      <Link href="/register" className="text-decoration-none d-flex align-items-center gap-2 text-body">
                        <i className="bi bi-person-plus text-secondary"></i> Registrarse
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Crear cuenta nueva</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Seleccionar tema de interfaz</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Enlace a Iniciar Sesión</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              )}

              {/* ── ZONA PRIVADA (con sesión) ──────────────────── */}
              {isLoggedIn && (
                <li className="mb-4">
                  <span className="fw-bold text-uppercase small text-secondary d-block mb-2" style={{ letterSpacing: '.05em' }}>
                    Mi cuenta
                  </span>
                  <ul className="list-unstyled ms-3">
                    <li className="mb-2">
                      <Link href="/profile" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                        <i className="bi bi-person-circle"></i> Mi Perfil
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver estadísticas (seguidores, siguiendo, pins)</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Editar bio</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver mis tableros → <em>Mis Tableros</em></li>
                        <li className="mb-1">
                          <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver mis pins publicados</span>
                          <ul className="list-unstyled ms-4 mt-1">
                            <li className="small fw-semibold text-body mb-1"><i className="bi bi-eye me-1 text-secondary"></i>Detalle de Pin</li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className="mb-2">
                      <Link href="/boards" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                        <i className="bi bi-collection"></i> Mis Tableros
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Crear nuevo tablero</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Eliminar tablero</li>
                        <li className="mb-2">
                          <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Abrir tablero</span>
                          <ul className="list-unstyled ms-4 mt-1">
                            <li className="mb-1">
                              <span className="small fw-semibold text-body"><i className="bi bi-collection me-1 text-secondary"></i>Tablero</span>
                              <ul className="list-unstyled ms-4 mt-1">
                                <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver pins del tablero</li>
                                <li className="mb-1">
                                  <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Abrir pin</span>
                                  <ul className="list-unstyled ms-4 mt-1">
                                    <li className="small fw-semibold text-body"><i className="bi bi-eye me-1 text-secondary"></i>Detalle de Pin</li>
                                  </ul>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className="mb-2">
                      <Link href="/saved" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                        <i className="bi bi-bookmark"></i> Pins Guardados
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Ver biblioteca personal de pins guardados</li>
                        <li className="mb-1">
                          <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Abrir pin</span>
                          <ul className="list-unstyled ms-4 mt-1">
                            <li className="small fw-semibold text-body"><i className="bi bi-eye me-1 text-secondary"></i>Detalle de Pin</li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className="mb-2">
                      <Link href="/feed" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                        <i className="bi bi-people"></i> Siguiendo
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Feed de pins de usuarios que sigues</li>
                        <li className="mb-1">
                          <span className="small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Abrir pin</span>
                          <ul className="list-unstyled ms-4 mt-1">
                            <li className="small fw-semibold text-body"><i className="bi bi-eye me-1 text-secondary"></i>Detalle de Pin</li>
                          </ul>
                        </li>
                      </ul>
                    </li>

                    <li className="mb-2">
                      <Link href="/create" className="text-decoration-none fw-semibold d-flex align-items-center gap-2 text-primary">
                        <i className="bi bi-plus-circle"></i> Crear Pin
                      </Link>
                      <ul className="list-unstyled ms-4 mt-1">
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Subir imagen</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Añadir título, descripción, código y etiquetas</li>
                        <li className="mb-1 small text-muted"><i className="bi bi-arrow-return-right me-1"></i>Seleccionar lenguaje de programación</li>
                      </ul>
                    </li>
                  </ul>
                </li>
              )}

              {/* ── TEMAS ──────────────────────────────────────── */}
              <li className="mb-2">
                <span className="fw-bold text-uppercase small text-secondary d-block mb-2" style={{ letterSpacing: '.05em' }}>
                  Temas de interfaz
                </span>
                <ul className="list-unstyled ms-3">
                  <li className="mb-2 d-flex align-items-start gap-2">
                    <span className="rounded-circle mt-1" style={{ width: '10px', height: '10px', backgroundColor: '#0d9488', display: 'inline-block', flexShrink: 0 }}></span>
                    <div>
                      <strong className="text-primary">Usabilidad</strong>
                      <small className="text-muted d-block">Buenas prácticas de UX — se elige en login/registro</small>
                    </div>
                  </li>
                  <li className="mb-2 d-flex align-items-start gap-2">
                    <span className="rounded-circle mt-1" style={{ width: '10px', height: '10px', backgroundColor: '#f43f5e', display: 'inline-block', flexShrink: 0 }}></span>
                    <div>
                      <strong style={{ color: '#f43f5e' }}>No Usabilidad</strong>
                      <small className="text-muted d-block">Anti-patrones de UX con fines educativos</small>
                    </div>
                  </li>
                  <li className="mb-2 d-flex align-items-start gap-2">
                    <span className="rounded-circle mt-1" style={{ width: '10px', height: '10px', backgroundColor: '#8b5cf6', display: 'inline-block', flexShrink: 0 }}></span>
                    <div>
                      <strong style={{ color: '#8b5cf6' }}>Accesibilidad</strong>
                      <small className="text-muted d-block">Errores de accesibilidad demostrativos</small>
                    </div>
                  </li>
                </ul>
              </li>

            </ul>
          </nav>

          {/* Footer info */}
          <hr className="my-4" />
          <div className="small text-secondary">
            <p className="mb-2">
              <i className="bi bi-info-circle me-2"></i>
              <strong>Proyecto Académico:</strong> Módulo de Diseño de Interfaces — DAW
            </p>
            <p className="mb-0">
              <i className="bi bi-github me-2"></i>
              Código disponible en:
              <a href="https://github.com/MCarmen96/DevBoards" className="ms-1" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </p>
          </div>
        </div>

        {/* Tema actual */}
        <div className="mt-4 text-center">
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-2"
          >
            <span className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: themeColor }} />
            <small className="fw-medium" style={{ color: themeColor }}>
              Visualizando en tema: {themeLabel}
            </small>
          </div>
        </div>
      </div>
    </main>
  );
}
