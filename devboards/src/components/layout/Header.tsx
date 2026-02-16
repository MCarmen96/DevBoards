'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { SearchBar } from '@/components/ui/SearchBar';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAppTheme } from '@/context/ThemeContext';

export function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { theme: appTheme, themeLabel, themeColor } = useAppTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky-top border-bottom bg-body">
      <nav className="navbar navbar-expand-lg py-2">
        <div className="container-fluid px-3 px-lg-4" style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Logo */}
          <Link href="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
            <div className="text-primary" style={{ width: '32px', height: '32px' }}>
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6C3 4.34315 4.34315 3 6 3H11C12.6569 3 14 4.34315 14 6V11C14 12.6569 12.6569 14 11 14H6C4.34315 14 3 12.6569 3 11V6Z"></path>
                <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V11C21 12.6569 19.6569 14 18 14H17C15.3431 14 14 12.6569 14 11V6Z" opacity="0.5"></path>
                <path d="M3 17C3 15.3431 4.34315 14 6 14H11C12.6569 14 14 15.3431 14 17V18C14 19.6569 12.6569 21 11 21H6C4.34315 21 3 19.6569 3 18V17Z" opacity="0.5"></path>
                <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" opacity="0.25"></path>
              </svg>
            </div>
            <span className="h5 mb-0 fw-bold d-none d-sm-block">DevBoards</span>
          </Link>

          {/* Search Bar - Visible en tablet y desktop, oculta en móvil */}
          <div className="d-none d-md-flex flex-grow-1 mx-3" style={{ maxWidth: '500px' }}>
            <SearchBar />
          </div>

          {/* Mobile Icons - Visibles solo en móvil antes del toggler */}
          <div className="d-flex d-lg-none align-items-center gap-2 ms-auto me-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="btn btn-link text-secondary p-2"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? (
                <i className="bi bi-sun fs-5"></i>
              ) : (
                <i className="bi bi-moon fs-5"></i>
              )}
            </button>

            {/* Notifications Mobile */}
            {session && <NotificationBell />}

            {/* User Avatar Mobile */}
            {session && (
              <div className="dropdown" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="btn p-0 rounded-circle overflow-hidden border-0"
                  style={{ width: '36px', height: '36px' }}
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Usuario'}
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="w-100 h-100 bg-secondary-subtle d-flex align-items-center justify-content-center">
                      <span className="fw-medium">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </button>
                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show position-absolute end-0 mt-2 shadow" style={{ zIndex: 1055 }}>
                    <div className="px-3 py-2 border-bottom">
                      <p className="small fw-medium mb-0">{session.user?.name || 'Usuario'}</p>
                      <small className="text-muted">{session.user?.email}</small>
                      <div className="mt-1 d-flex align-items-center gap-1">
                        <span className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: themeColor }} />
                        <small style={{ color: themeColor, fontSize: '10px' }}>Tema: {themeLabel}</small>
                      </div>
                    </div>
                    <Link href="/profile" className="dropdown-item small" onClick={() => { setShowDropdown(false); closeMobileMenu(); }}>Mi Perfil</Link>
                    <Link href="/boards" className="dropdown-item small" onClick={() => { setShowDropdown(false); closeMobileMenu(); }}>Mis Tableros</Link>
                    <Link href="/saved" className="dropdown-item small" onClick={() => { setShowDropdown(false); closeMobileMenu(); }}>Pins Guardados</Link>
                    <hr className="dropdown-divider" />
                    <button onClick={() => signOut()} className="dropdown-item small text-danger">Cerrar Sesión</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Toggle */}
          <button
            className="navbar-toggler border-0 p-2"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-controls="navbarContent"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} fs-4`}></i>
          </button>

          {/* Collapsible Content */}
          <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarContent">
            {/* Search Bar Mobile - Solo visible cuando el menú está abierto en móvil */}
            <div className="d-md-none py-3 border-bottom">
              <SearchBar />
            </div>

            {/* Navigation Links */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-3">
              <li className="nav-item">
                <Link href="/" className="nav-link fw-medium" onClick={closeMobileMenu}>
                  <i className="bi bi-compass me-2 d-lg-none"></i>Explorar
                </Link>
              </li>
              {session && (
                <li className="nav-item">
                  <Link href="/feed" className="nav-link fw-medium text-secondary" onClick={closeMobileMenu}>
                    <i className="bi bi-people me-2 d-lg-none"></i>Siguiendo
                  </Link>
                </li>
              )}
              
              {/* Divider Mobile */}
              <li className="nav-item d-lg-none"><hr className="dropdown-divider my-2" /></li>

              {/* Mobile Menu Links */}
              {session && (
                <>
                  <li className="nav-item d-lg-none">
                    <Link href="/profile" className="nav-link fw-medium" onClick={closeMobileMenu}>
                      <i className="bi bi-person me-2"></i>Mi Perfil
                    </Link>
                  </li>
                  <li className="nav-item d-lg-none">
                    <Link href="/boards" className="nav-link fw-medium" onClick={closeMobileMenu}>
                      <i className="bi bi-collection me-2"></i>Mis Tableros
                    </Link>
                  </li>
                  <li className="nav-item d-lg-none">
                    <Link href="/saved" className="nav-link fw-medium" onClick={closeMobileMenu}>
                      <i className="bi bi-bookmark me-2"></i>Guardados
                    </Link>
                  </li>
                  <li className="nav-item d-lg-none"><hr className="dropdown-divider my-2" /></li>
                </>
              )}

              {/* Create Pin Button - Mobile */}
              {session && (
                <li className="nav-item d-lg-none">
                  <Link href="/create" className="nav-link fw-medium text-primary" onClick={closeMobileMenu}>
                    <i className="bi bi-plus-circle me-2"></i>Nuevo Pin
                  </Link>
                </li>
              )}

              {/* Auth Links Mobile (si no hay sesión) */}
              {!session && status !== 'loading' && (
                <>
                  <li className="nav-item d-lg-none">
                    <Link href="/login" className="nav-link fw-medium" onClick={closeMobileMenu}>
                      <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
                    </Link>
                  </li>
                  <li className="nav-item d-lg-none">
                    <Link href="/register" className="nav-link fw-medium text-primary" onClick={closeMobileMenu}>
                      <i className="bi bi-person-plus me-2"></i>Registrarse
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Desktop Right Section */}
            <div className="d-none d-lg-flex align-items-center gap-3 ms-3">
              {/* Theme Indicator Badge */}
              {session && (
                <div 
                  className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill"
                  style={{ backgroundColor: `${themeColor}20`, border: `1px solid ${themeColor}40` }}
                  title={`Tema actual: ${themeLabel}`}
                >
                  <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: themeColor }} />
                  <span className="small fw-medium" style={{ color: themeColor, fontSize: '11px' }}>{themeLabel}</span>
                </div>
              )}

              {/* New Pin Button Desktop */}
              {session && (
                <Link href="/create" className="btn btn-primary btn-sm d-flex align-items-center">
                  <i className="bi bi-plus-lg me-1"></i>Nuevo Pin
                </Link>
              )}

              {/* Theme Toggle Desktop */}
              <button onClick={toggleTheme} className="btn btn-link text-secondary p-2" aria-label="Cambiar tema">
                {theme === 'dark' ? <i className="bi bi-sun fs-5"></i> : <i className="bi bi-moon fs-5"></i>}
              </button>

              {/* Notifications Desktop */}
              {session && <NotificationBell />}

              {/* User Menu Desktop */}
              {status === 'loading' ? (
                <div className="rounded-circle bg-secondary-subtle" style={{ width: '36px', height: '36px' }}></div>
              ) : session ? (
                <div className="dropdown" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="btn p-0 rounded-circle overflow-hidden border-0"
                    style={{ width: '36px', height: '36px' }}
                  >
                    {session.user?.image ? (
                      <img src={session.user.image} alt={session.user.name || 'Usuario'} className="w-100 h-100 object-fit-cover" />
                    ) : (
                      <div className="w-100 h-100 bg-secondary-subtle d-flex align-items-center justify-content-center">
                        <span className="fw-medium">{session.user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                    )}
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu dropdown-menu-end show position-absolute end-0 mt-2 shadow" style={{ zIndex: 1055 }}>
                      <div className="px-3 py-2 border-bottom">
                        <p className="small fw-medium mb-0">{session.user?.name || 'Usuario'}</p>
                        <small className="text-muted">{session.user?.email}</small>
                        <div className="mt-1 d-flex align-items-center gap-1">
                          <span className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: themeColor }} />
                          <small style={{ color: themeColor, fontSize: '10px' }}>Tema: {themeLabel}</small>
                        </div>
                      </div>
                      <Link href="/profile" className="dropdown-item small" onClick={() => setShowDropdown(false)}>Mi Perfil</Link>
                      <Link href="/boards" className="dropdown-item small" onClick={() => setShowDropdown(false)}>Mis Tableros</Link>
                      <Link href="/saved" className="dropdown-item small" onClick={() => setShowDropdown(false)}>Pins Guardados</Link>
                      <hr className="dropdown-divider" />
                      <button onClick={() => signOut()} className="dropdown-item small text-danger">Cerrar Sesión</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link href="/login" className="text-decoration-none small fw-medium">Iniciar Sesión</Link>
                  <Link href="/register" className="btn btn-primary btn-sm">Registrarse</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
