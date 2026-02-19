'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppTheme, AppTheme } from '@/context/ThemeContext';

export default function RegisterPage() {
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'explorer',
  });

  const themeOptions: { value: AppTheme; label: string; color: string }[] = [
    { value: 'usabilidad', label: 'Usabilidad', color: '#0d9488' },
    { value: 'no-usabilidad', label: 'No Usabilidad', color: '#f43f5e' },
    { value: 'accesibilidad', label: 'Accesibilidad', color: '#8b5cf6' },
  ];

  const currentThemeColor = themeOptions.find(t => t.value === theme)?.color || '#0d9488';

  // Función para convertir errores técnicos a mensajes amigables
  const getFriendlyErrorMessage = (error: string): string => {
    const errorLower = error.toLowerCase();
    
    if (errorLower.includes('database') || errorLower.includes('disk') || errorLower.includes('malformed')) {
      return 'Error de conexión. Por favor, inténtalo de nuevo más tarde.';
    }
    if (errorLower.includes('already exists') || errorLower.includes('ya existe') || errorLower.includes('unique')) {
      return 'Ya existe una cuenta con este email.';
    }
    if (errorLower.includes('email') && errorLower.includes('invalid')) {
      return 'El formato del email no es válido.';
    }
    if (errorLower.includes('network') || errorLower.includes('connection')) {
      return 'Error de conexión. Comprueba tu conexión a internet.';
    }
    
    // Mensaje genérico para errores desconocidos
    return 'No se pudo completar el registro. Inténtalo de nuevo.';
  };

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
      setError(getFriendlyErrorMessage(err instanceof Error ? err.message : 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-fill d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '28rem' }}>
        {/* Theme Selector */}
        <div className="mb-4">
          <p className="text-center text-secondary small mb-2">Selecciona un tema para la experiencia:</p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-1 ${
                  theme === option.value ? 'text-white' : 'btn-outline-secondary'
                }`}
                style={theme === option.value ? { backgroundColor: option.color, borderColor: option.color } : {}}
              >
                <span 
                  className="rounded-circle d-inline-block" 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: option.color 
                  }} 
                />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-body rounded-4 shadow p-4 border">
          {/* Header */}
          <div className="text-center mb-4">
            <div 
              className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3" 
              style={{ 
                width: '4rem', 
                height: '4rem', 
                backgroundColor: currentThemeColor,
                transition: 'background-color 0.3s'
              }}
            >
              <svg className="text-white" width="32" height="32" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6C3 4.34315 4.34315 3 6 3H11C12.6569 3 14 4.34315 14 6V11C14 12.6569 12.6569 14 11 14H6C4.34315 14 3 12.6569 3 11V6Z"></path>
                <path d="M14 6C14 4.34315 15.3431 3 17 3H18C19.6569 3 21 4.34315 21 6V11C21 12.6569 19.6569 14 18 14H17C15.3431 14 14 12.6569 14 11V6Z" opacity="0.5"></path>
                <path d="M3 17C3 15.3431 4.34315 14 6 14H11C12.6569 14 14 15.3431 14 17V18C14 19.6569 12.6569 21 11 21H6C4.34315 21 3 19.6569 3 18V17Z" opacity="0.5"></path>
                <path d="M14 17C14 15.3431 15.3431 14 17 14H18C19.6569 14 21 15.3431 21 17V18C21 19.6569 19.6569 21 18 21H17C15.3431 21 14 19.6569 14 18V17Z" opacity="0.25"></path>
              </svg>
            </div>
            <h1 className="h4 fw-bold">
              Únete a DevBoards
            </h1>
            <p className="text-secondary mt-2">
              Crea tu cuenta y empieza a coleccionar código
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label htmlFor="name" className="form-label small fw-medium">
                Nombre
              </label>
              <input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label small fw-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label small fw-medium">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="form-control"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="form-label small fw-medium">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="form-control"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="form-label small fw-medium">
                ¿Cómo quieres usar DevBoards?
              </label>
              <div className="row g-2">
                <div className="col-6">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'explorer' })}
                    className={`w-100 p-3 rounded-3 border text-start`}
                    style={{ 
                      borderWidth: formData.role === 'explorer' ? '2px' : '1px',
                      borderColor: formData.role === 'explorer' ? currentThemeColor : undefined,
                      backgroundColor: formData.role === 'explorer' ? `${currentThemeColor}15` : undefined
                    }}
                  >
                    <span className="d-block fs-4 mb-1">👨‍💻</span>
                    <span className="fw-bold d-block">Explorer</span>
                    <small className="text-secondary">Descubrir y guardar</small>
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'creator' })}
                    className={`w-100 p-3 rounded-3 border text-start`}
                    style={{ 
                      borderWidth: formData.role === 'creator' ? '2px' : '1px',
                      borderColor: formData.role === 'creator' ? currentThemeColor : undefined,
                      backgroundColor: formData.role === 'creator' ? `${currentThemeColor}15` : undefined
                    }}
                  >
                    <span className="d-block fs-4 mb-1">✍️</span>
                    <span className="fw-bold d-block">Creator</span>
                    <small className="text-secondary">Crear y compartir</small>
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-0 d-flex align-items-center gap-2" style={{ wordBreak: 'break-word' }}>
                <i className="bi bi-exclamation-circle flex-shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 py-2 fw-bold text-white"
              style={{ 
                backgroundColor: currentThemeColor,
                borderColor: currentThemeColor,
                transition: 'background-color 0.3s'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-secondary mb-0">
              ¿Ya tienes cuenta?{' '}
              <Link 
                href="/login" 
                className={`fw-medium ${theme === 'usabilidad' ? 'text-decoration-underline' : 'text-decoration-none'}`}
                style={{ color: currentThemeColor }}
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>

        {/* Theme Info Card */}
        <div className="mt-4 p-3 rounded-3 border bg-body-secondary">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span 
              className="rounded-circle" 
              style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: currentThemeColor 
              }} 
            />
            <span className="fw-semibold small">Tema seleccionado: {themeOptions.find(t => t.value === theme)?.label}</span>
          </div>
          <p className="small text-secondary mb-0">
            {theme === 'usabilidad' && 'Este tema sigue las mejores prácticas de usabilidad y diseño de interfaces.'}
            {theme === 'no-usabilidad' && 'Este tema muestra ejemplos de mala usabilidad para fines educativos.'}
            {theme === 'accesibilidad' && 'Este tema está optimizado para cumplir con estándares de accesibilidad web (WCAG).'}
          </p>
        </div>
      </div>
    </main>
  );
}
