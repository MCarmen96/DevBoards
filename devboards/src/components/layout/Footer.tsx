'use client';

import Link from 'next/link';
import { useAppTheme } from '@/context/ThemeContext';

export function Footer() {
  const { themeColor } = useAppTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-top mt-auto">
      <div className="container py-4" style={{ maxWidth: '1440px' }}>
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="text-primary" style={{ width: '24px', height: '24px' }}>
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6C3 4.34315 4.34315 3 6 3H11C12.6569 3 14 4.34315 14 6V11C14 12.6569 12.6569 14 11 14H6C4.34315 14 3 12.6569 3 11V6Z"></path>
                  <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V11C21 12.6569 19.6569 14 18 14H17C15.3431 14 14 12.6569 14 11V6Z" opacity="0.5"></path>
                  <path d="M3 17C3 15.3431 4.34315 14 6 14H11C12.6569 14 14 15.3431 14 17V18C14 19.6569 12.6569 21 11 21H6C4.34315 21 3 19.6569 3 18V17Z" opacity="0.5"></path>
                  <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" opacity="0.25"></path>
                </svg>
              </div>
              <span className="h6 mb-0 fw-bold">DevBoards</span>
            </div>
            <p className="small text-secondary mb-0">
              Aplicación tipo Pinterest para desarrolladores web. Proyecto académico del módulo de Diseño de Interfaces.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: themeColor }}>Navegación</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/" className="text-decoration-none text-secondary">
                  Explorar
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/analisis" className="text-decoration-none text-secondary">
                  Análisis
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/sobre-nosotros" className="text-decoration-none text-secondary">
                  Sobre Nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/mapa-sitio" className="text-decoration-none text-secondary">
                  Mapa del Sitio
                </Link>
              </li>
            </ul>
          </div>

          {/* User Column */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: themeColor }}>Usuario</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link href="/login" className="text-decoration-none text-secondary">
                  Iniciar Sesión
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/register" className="text-decoration-none text-secondary">
                  Registrarse
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/profile" className="text-decoration-none text-secondary">
                  Mi Perfil
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/boards" className="text-decoration-none text-secondary">
                  Mis Tableros
                </Link>
              </li>
            </ul>
          </div>

          {/* Info Column */}
          <div className="col-12 col-md-4">
            <h6 className="fw-bold mb-3 small text-uppercase" style={{ color: themeColor }}>Proyecto Académico</h6>
            <p className="small text-secondary mb-3">
              <i className="bi bi-book me-2"></i>
              Módulo: Diseño de Interfaces<br />
              <i className="bi bi-calendar3 me-2"></i>
              Año: {currentYear}
            </p>
            <div className="d-flex gap-3">
              <a 
                href="https://github.com/MCarmen96/DevBoards" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-secondary"
                title="Ver en GitHub"
              >
                <i className="bi bi-github fs-5"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top mt-4 pt-3">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="small text-secondary mb-0">
                © {currentYear} DevBoards. Proyecto educativo sin fines comerciales.
              </p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <p className="small text-secondary mb-0">
                Hecho con <i className="bi bi-heart-fill text-danger"></i> usando Next.js
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
