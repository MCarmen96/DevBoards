'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'explorer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Registrar usuario
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al registrar');
      }

      // Iniciar sesión automáticamente
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#1e2336] rounded-xl shadow-xl p-8 border border-gray-200 dark:border-[#2a324b]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0d33f2] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Únete a DevBoards
            </h1>
            <p className="text-[#909acb] mt-2">
              Crea tu cuenta y empieza a coleccionar código
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border-none rounded-lg bg-gray-100 dark:bg-[#222949] text-gray-900 dark:text-white placeholder-[#909acb] focus:outline-none focus:ring-2 focus:ring-[#0d33f2] focus:bg-white dark:focus:bg-[#1c223e] transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 border-none rounded-lg bg-gray-100 dark:bg-[#222949] text-gray-900 dark:text-white placeholder-[#909acb] focus:outline-none focus:ring-2 focus:ring-[#0d33f2] focus:bg-white dark:focus:bg-[#1c223e] transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-2.5 border-none rounded-lg bg-gray-100 dark:bg-[#222949] text-gray-900 dark:text-white placeholder-[#909acb] focus:outline-none focus:ring-2 focus:ring-[#0d33f2] focus:bg-white dark:focus:bg-[#1c223e] transition-all"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full px-4 py-2.5 border-none rounded-lg bg-gray-100 dark:bg-[#222949] text-gray-900 dark:text-white placeholder-[#909acb] focus:outline-none focus:ring-2 focus:ring-[#0d33f2] focus:bg-white dark:focus:bg-[#1c223e] transition-all"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ¿Cómo quieres usar DevBoards?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'explorer' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.role === 'explorer'
                      ? 'border-[#0d33f2] bg-[#0d33f2]/10 ring-2 ring-[#0d33f2]'
                      : 'border-gray-200 dark:border-[#2a324b] hover:border-[#0d33f2]/50 bg-white dark:bg-[#222949]'
                  }`}
                >
                  <span className="text-2xl mb-2 block">👨‍💻</span>
                  <span className="font-bold block text-gray-900 dark:text-white">Explorer</span>
                  <span className="text-xs text-[#909acb]">Descubrir y guardar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'creator' })}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    formData.role === 'creator'
                      ? 'border-[#0d33f2] bg-[#0d33f2]/10 ring-2 ring-[#0d33f2]'
                      : 'border-gray-200 dark:border-[#2a324b] hover:border-[#0d33f2]/50 bg-white dark:bg-[#222949]'
                  }`}
                >
                  <span className="text-2xl mb-2 block">✍️</span>
                  <span className="font-bold block text-gray-900 dark:text-white">Creator</span>
                  <span className="text-xs text-[#909acb]">Crear y compartir</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#0d33f2] hover:bg-[#0a29c9] text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[#909acb]">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-[#0d33f2] font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
