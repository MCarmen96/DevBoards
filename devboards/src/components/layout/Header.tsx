'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { SearchBar } from '@/components/ui/SearchBar';
import { NotificationBell } from '@/components/ui/NotificationBell';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export function Header() {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky-top border-bottom bg-body">
      <div className="container-fluid px-4 py-2">
        <div className="d-flex align-items-center justify-content-between gap-3" style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Logo */}
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none flex-shrink-0">
            <div className="text-primary" style={{ width: '32px', height: '32px' }}>
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6C3 4.34315 4.34315 3 6 3H11C12.6569 3 14 4.34315 14 6V11C14 12.6569 12.6569 14 11 14H6C4.34315 14 3 12.6569 3 11V6Z"></path>
                <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V11C21 12.6569 19.6569 14 18 14H17C15.3431 14 14 12.6569 14 11V6Z" opacity="0.5"></path>
                <path d="M3 17C3 15.3431 4.34315 14 6 14H11C12.6569 14 14 15.3431 14 17V18C14 19.6569 12.6569 21 11 21H6C4.34315 21 3 19.6569 3 18V17Z" opacity="0.5"></path>
                <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" opacity="0.25"></path>
              </svg>
            </div>
            <h2 className="h5 mb-0 fw-bold d-none d-sm-block">DevBoards</h2>
          </Link>

          {/* Search Bar - Centered */}
          <div className="flex-grow-1 mx-3" style={{ maxWidth: '600px' }}>
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-3 flex-shrink-0">
            {/* Navigation Links */}
            <div className="d-none d-lg-flex align-items-center gap-4 me-2">
              <Link href="/" className="text-decoration-none small fw-medium">
                Explorar
              </Link>
              {session && (
                <Link href="/feed" className="text-decoration-none text-secondary small fw-medium">
                  Siguiendo
                </Link>
              )}
            </div>

            {/* New Pin Button */}
            {session && (
              <Link href="/create" className="btn btn-primary btn-sm d-none d-md-flex align-items-center">
                Nuevo Pin
              </Link>
            )}

            {/* Theme Toggle */}
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

            {/* Notifications */}
            {session && <NotificationBell />}

            {/* User Menu */}
            {status === 'loading' ? (
              <div className="rounded-circle bg-secondary-subtle" style={{ width: '36px', height: '36px' }}></div>
            ) : session ? (
              <div className="dropdown">
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
                  <div className="dropdown-menu dropdown-menu-end show position-absolute end-0 mt-2 shadow">
                    <div className="px-3 py-2 border-bottom">
                      <p className="small fw-medium mb-0">
                        {session.user?.name || 'Usuario'}
                      </p>
                      <small className="text-muted">{session.user?.email}</small>
                    </div>
                    <Link
                      href="/profile"
                      className="dropdown-item small"
                      onClick={() => setShowDropdown(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      href="/boards"
                      className="dropdown-item small"
                      onClick={() => setShowDropdown(false)}
                    >
                      Mis Tableros
                    </Link>
                    <Link
                      href="/saved"
                      className="dropdown-item small"
                      onClick={() => setShowDropdown(false)}
                    >
                      Pins Guardados
                    </Link>
                    <hr className="dropdown-divider" />
                    <button
                      onClick={() => signOut()}
                      className="dropdown-item small text-danger"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link href="/login" className="text-decoration-none small fw-medium">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
