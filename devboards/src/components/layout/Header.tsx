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
  const { toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#222949] bg-white dark:bg-[#101323]/95 backdrop-blur-sm px-6 py-3 transition-colors duration-300">
      <div className="flex items-center gap-6 w-full max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 text-slate-900 dark:text-white shrink-0">
          <div className="size-8 text-[#0d33f2]">
            <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6C3 4.34315 4.34315 3 6 3H11C12.6569 3 14 4.34315 14 6V11C14 12.6569 12.6569 14 11 14H6C4.34315 14 3 12.6569 3 11V6Z"></path>
              <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V11C21 12.6569 19.6569 14 18 14H17C15.3431 14 14 12.6569 14 11V6Z" opacity="0.5"></path>
              <path d="M3 17C3 15.3431 4.34315 14 6 14H11C12.6569 14 14 15.3431 14 17V18C14 19.6569 12.6569 21 11 21H6C4.34315 21 3 19.6569 3 18V17Z" opacity="0.5"></path>
              <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" opacity="0.25"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] hidden sm:block">DevBoards</h2>
        </Link>

        {/* Search Bar - Centered */}
        <div className="flex flex-1 justify-center max-w-2xl mx-auto px-4">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 mr-2">
            <Link
              href="/"
              className="text-slate-600 dark:text-white text-sm font-medium hover:text-[#0d33f2] dark:hover:text-[#0d33f2] transition-colors"
            >
              Explorar
            </Link>
            {session && (
              <Link
                href="/feed"
                className="text-slate-400 dark:text-[#909acb] text-sm font-medium hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                Siguiendo
              </Link>
            )}
          </div>

          {/* New Pin Button */}
          {session && (
            <Link
              href="/create"
              className="hidden md:flex items-center justify-center rounded-lg h-9 px-4 bg-[#0d33f2] hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-[#0d33f2]/20 transition-all active:scale-95"
            >
              <span className="truncate">Nuevo Pin</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#222949] transition-colors"
            aria-label="Cambiar tema"
          >
            <svg className="w-5 h-5 text-slate-600 dark:text-[#909acb] dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg className="w-5 h-5 text-slate-600 dark:text-[#909acb] hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          {/* Notifications */}
          {session && <NotificationBell />}

          {/* User Menu */}
          {status === 'loading' ? (
            <div className="size-9 rounded-full bg-slate-200 dark:bg-[#222949] animate-pulse" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 ring-2 ring-transparent hover:ring-[#0d33f2] cursor-pointer transition-all overflow-hidden"
              >
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'Usuario'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-300 dark:bg-[#222949] flex items-center justify-center">
                    <span className="text-slate-600 dark:text-white font-medium">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e2337] rounded-xl shadow-lg border border-slate-200 dark:border-[#222949] py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-[#222949]">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {session.user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#909acb]">{session.user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#222949]"
                    onClick={() => setShowDropdown(false)}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    href="/boards"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#222949]"
                    onClick={() => setShowDropdown(false)}
                  >
                    Mis Tableros
                  </Link>
                  <Link
                    href="/saved"
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#222949]"
                    onClick={() => setShowDropdown(false)}
                  >
                    Pins Guardados
                  </Link>
                  <hr className="my-1 border-slate-200 dark:border-[#222949]" />
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-[#222949]"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-slate-600 dark:text-white text-sm font-medium hover:text-[#0d33f2] transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#0d33f2] hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-[#0d33f2]/20 transition-all active:scale-95"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
