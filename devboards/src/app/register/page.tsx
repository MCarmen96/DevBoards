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
    <main className="flex-fill d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: '28rem' }}>
        <div className="bg-body rounded-3 shadow p-4 border">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3" style={{ width: '4rem', height: '4rem', backgroundColor: '#0d33f2' }}>
              <i className="bi bi-braces-asterisk text-white fs-3"></i>
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
                    className={`w-100 p-3 rounded-3 border text-start ${
                      formData.role === 'explorer'
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'bg-body'
                    }`}
                    style={{ 
                      borderWidth: formData.role === 'explorer' ? '2px' : '1px'
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
                    className={`w-100 p-3 rounded-3 border text-start ${
                      formData.role === 'creator'
                        ? 'border-primary bg-primary bg-opacity-10'
                        : 'bg-body'
                    }`}
                    style={{ 
                      borderWidth: formData.role === 'creator' ? '2px' : '1px'
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
              <div className="alert alert-danger py-2">
                <p className="small mb-0">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
              style={{ height: '2.75rem' }}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              )}
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary fw-medium text-decoration-none">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
