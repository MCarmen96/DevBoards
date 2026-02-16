'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Theme = 'usabilidad' | 'no-usabilidad' | 'accesibilidad';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<Theme>('usabilidad');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // TEMA: USABILIDAD (Diseño óptimo)
  // ============================================
  if (theme === 'usabilidad') {
    return (
      <main className="flex-fill d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: '28rem' }}>
          {/* Theme Selector */}
          <div className="mb-4 d-flex justify-content-center gap-2">
            <button
              onClick={() => setTheme('usabilidad')}
              className="btn btn-primary btn-sm rounded-3"
            >
              Usabilidad
            </button>
            <button
              onClick={() => setTheme('no-usabilidad')}
              className="btn btn-secondary btn-sm rounded-3"
            >
              No Usabilidad
            </button>
            <button
              onClick={() => setTheme('accesibilidad')}
              className="btn btn-secondary btn-sm rounded-3"
            >
              Accesibilidad
            </button>
          </div>

          <div className="bg-body rounded-3 shadow p-4 border">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-3" style={{ width: '4rem', height: '4rem', backgroundColor: '#0d33f2' }}>
                <i className="bi bi-braces-asterisk text-white fs-3"></i>
              </div>
              <h1 className="h4 fw-bold">
                Bienvenido a DevBoards
              </h1>
              <p className="text-secondary mt-2">
                Inicia sesión para continuar
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="form-control"
                />
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
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-secondary">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-primary fw-medium text-decoration-none">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // TEMA: NO USABILIDAD (Diseño con problemas)
  // ============================================
  if (theme === 'no-usabilidad') {
    return (
      <main className="flex-fill d-flex align-items-center justify-content-center p-4" style={{ background: 'linear-gradient(45deg, #ff00ff, #00ffff, #ff0000, #00ff00)', backgroundSize: '400% 400%', animation: 'gradient 3s ease infinite' }}>
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
        <div className="w-100" style={{ maxWidth: '32rem' }}>
          {/* Theme Selector */}
          <div className="mb-4 d-flex justify-content-center gap-2">
            <button
              onClick={() => setTheme('usabilidad')}
              className="btn btn-secondary btn-sm rounded-3"
            >
              Usabilidad
            </button>
            <button
              onClick={() => setTheme('no-usabilidad')}
              className="btn btn-primary btn-sm rounded-3"
            >
              No Usabilidad
            </button>
            <button
              onClick={() => setTheme('accesibilidad')}
              className="btn btn-secondary btn-sm rounded-3"
            >
              Accesibilidad
            </button>
          </div>

          <div className="p-4 border border-warning border-4" style={{ borderStyle: 'dashed', background: 'repeating-linear-gradient(45deg, #ff69b4, #ff69b4 10px, #00ced1 10px, #00ced1 20px)' }}>
            {/* Header con animaciones molestas */}
            <div className="text-center mb-3">
              <div className="mx-auto mb-2" style={{ width: '5rem', height: '5rem', animation: 'rotate 2s linear infinite' }}>
                <span style={{ fontSize: '3.5rem' }}>🎪</span>
              </div>
              <h1 className="h5 text-danger" style={{ fontFamily: 'Comic Sans MS, cursive', animation: 'blink 0.5s infinite', textShadow: '3px 3px 0 yellow, -3px -3px 0 cyan' }}>
                ¡¡¡BIENVENIDO!!!
              </h1>
              <div className="overflow-hidden bg-dark py-1">
                <p className="small text-success text-nowrap mb-0" style={{ fontSize: '0.65rem', animation: 'marquee 5s linear infinite' }}>
                  🔥 INICIA SESIÓN AHORA 🔥 OFERTAS EXCLUSIVAS 🔥 NO TE LO PIERDAS 🔥 INICIA SESIÓN AHORA 🔥 OFERTAS EXCLUSIVAS 🔥
                </p>
              </div>
            </div>

            {/* Form con problemas de usabilidad */}
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-2">
              {/* Campo sin label visible, placeholder confuso */}
              <div>
                <span style={{ fontSize: '8px', fontFamily: 'Papyrus, fantasy', color: 'purple' }}>campo 1</span>
                <input
                  type="text"
                  placeholder="Introduce aquí tu identificador de usuario electrónico"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-control form-control-sm border-4 border-success"
                  style={{ fontFamily: 'Comic Sans MS, cursive', fontSize: '0.75rem', backgroundColor: '#fef08a', color: '#581c87' }}
                />
              </div>

              {/* Contraseña visible (mala práctica) */}
              <div>
                <span style={{ fontSize: '8px', fontFamily: 'Papyrus, fantasy', color: 'orange' }}>campo secreto 🤫</span>
                <input
                  type="text"
                  placeholder="Tu clave secreta (todos la pueden ver)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="form-control form-control-sm border-4 border-danger"
                  style={{ fontFamily: 'Comic Sans MS, cursive', fontSize: '0.75rem', backgroundColor: '#bef264', color: '#7f1d1d' }}
                />
              </div>

              {/* Captcha falso molesto */}
              <div className="p-2 border border-dark border-2" style={{ borderStyle: 'dashed', backgroundColor: 'rgba(255,255,255,0.5)' }}>
                <p className="text-dark mb-1" style={{ fontSize: '10px' }}>¿Cuánto es 2847 × 3912 ÷ 7?</p>
                <input type="text" className="form-control form-control-sm" style={{ fontSize: '0.75rem' }} placeholder="Resuelve para continuar..." />
              </div>

              {error && (
                <div className="p-2 bg-danger text-white" style={{ fontSize: '0.75rem', animation: 'shake 0.3s infinite' }}>
                  ❌ ERROR GRAVE: {error} ❌
                </div>
              )}

              {/* Múltiples botones confusos */}
              <div className="d-flex gap-1 flex-wrap">
                <button
                  type="button"
                  className="btn btn-secondary flex-fill py-2 rounded"
                  style={{ fontSize: '10px' }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-fill py-2 rounded"
                  style={{ fontSize: '10px' }}
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-secondary flex-fill py-2 rounded"
                  style={{ fontSize: '10px' }}
                >
                  {loading ? '...' : 'OK'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-fill py-2 rounded"
                  style={{ fontSize: '10px' }}
                >
                  Ayuda
                </button>
              </div>
            </form>

            {/* Links confusos */}
            <div className="mt-3 text-center d-flex flex-column gap-1">
              <p className="text-dark mb-0" style={{ fontSize: '8px' }}>
                <a href="#" className="text-primary text-decoration-underline">Términos</a> | 
                <a href="#" className="text-primary text-decoration-underline">Privacidad</a> | 
                <a href="#" className="text-primary text-decoration-underline">Cookies</a> | 
                <a href="#" className="text-primary text-decoration-underline">Legal</a> | 
                <a href="#" className="text-primary text-decoration-underline">FAQ</a> | 
                <a href="#" className="text-primary text-decoration-underline">Soporte</a>
              </p>
              <p className="text-danger mb-0" style={{ fontSize: '10px', animation: 'blink 1s infinite' }}>
                ⚠️ HAZ CLIC AQUÍ PARA REGISTRARTE ⚠️
              </p>
              <Link href="/register" className="text-secondary text-decoration-none" style={{ fontSize: '8px' }}>
                (o aquí si lo anterior no funciona)
              </Link>
            </div>

            {/* Popup falso molesto */}
            <div className="mt-3 p-2 bg-primary text-white border border-white border-2" style={{ fontSize: '10px' }}>
              <p className="mb-1">🔔 ¡Suscríbete a nuestro newsletter!</p>
              <input type="email" placeholder="tu@email.com" className="form-control form-control-sm mt-1" style={{ fontSize: '8px' }} />
              <div className="d-flex gap-1 mt-1">
                <button className="btn btn-success flex-fill py-1" style={{ fontSize: '8px' }}>SÍ, QUIERO</button>
                <button className="btn btn-danger flex-fill py-1" style={{ fontSize: '8px' }}>NO, GRACIAS</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================
  // TEMA: ACCESIBILIDAD (Diseño accesible)
  // ============================================
  return (
    <main className="flex-fill d-flex align-items-center justify-content-center p-4 bg-body">
      <div className="w-100" style={{ maxWidth: '32rem' }}>
        {/* Theme Selector */}
        <nav aria-label="Selector de tema" className="mb-4 d-flex justify-content-center gap-2">
          <button
            onClick={() => setTheme('usabilidad')}
            aria-pressed="false"
            className="btn btn-secondary btn-sm rounded-3"
          >
            Usabilidad
          </button>
          <button
            onClick={() => setTheme('no-usabilidad')}
            aria-pressed="false"
            className="btn btn-secondary btn-sm rounded-3"
          >
            No Usabilidad
          </button>
          <button
            onClick={() => setTheme('accesibilidad')}
            aria-pressed="true"
            className="btn btn-primary btn-sm rounded-3"
          >
            Accesibilidad
          </button>
        </nav>

        <div 
          className="bg-body rounded-4 shadow p-4 border border-2"
          role="region"
          aria-labelledby="login-heading"
        >
          {/* Header */}
          <header className="text-center mb-4">
            <div 
              className="d-flex align-items-center justify-content-center mx-auto mb-3 rounded-4"
              style={{ width: '5rem', height: '5rem', backgroundColor: '#0d47a1' }}
              aria-hidden="true"
            >
              <i className="bi bi-braces-asterisk text-white fs-2"></i>
            </div>
            <h1 id="login-heading" className="h3 fw-bold">
              Iniciar Sesión en DevBoards
            </h1>
            <p className="fs-6 text-secondary mt-2">
              Accede a tu cuenta para continuar
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3" aria-describedby={error ? 'error-message' : undefined}>
            <div>
              <label 
                htmlFor="email-accessible" 
                className="form-label fw-semibold"
              >
                Correo electrónico
                <span className="text-danger ms-1" aria-hidden="true">*</span>
                <span className="visually-hidden">(obligatorio)</span>
              </label>
              <input
                id="email-accessible"
                type="email"
                autoComplete="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                aria-required="true"
                className="form-control form-control-lg"
              />
              <div className="form-text">
                Introduce tu dirección de correo electrónico
              </div>
            </div>

            <div>
              <label 
                htmlFor="password-accessible" 
                className="form-label fw-semibold"
              >
                Contraseña
                <span className="text-danger ms-1" aria-hidden="true">*</span>
                <span className="visually-hidden">(obligatorio)</span>
              </label>
              <input
                id="password-accessible"
                type="password"
                autoComplete="current-password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                aria-required="true"
                className="form-control form-control-lg"
              />
              <div className="form-text">
                Mínimo 8 caracteres
              </div>
            </div>

            {error && (
              <div 
                id="error-message"
                role="alert"
                aria-live="assertive"
                className="alert alert-danger d-flex align-items-center gap-2"
              >
                <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                <span className="fw-medium">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
              aria-busy={loading}
            >
              {loading && (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              )}
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-4 pt-3 border-top text-center">
            <p className="fs-6 text-secondary">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/register" 
                className="text-primary fw-bold text-decoration-none"
              >
                Crear cuenta nueva
              </Link>
            </p>
          </footer>

          {/* Skip to main content link for screen readers */}
          <div className="visually-hidden">
            <a href="#login-heading" className="btn btn-primary position-absolute top-0 start-0 m-2">
              Volver al inicio del formulario
            </a>
          </div>
        </div>

        {/* Accessibility info panel */}
        <div className="mt-4 p-3 bg-success bg-opacity-10 rounded-3 border border-success border-2">
          <h2 className="h6 fw-bold text-success mb-2 d-flex align-items-center gap-2">
            <i className="bi bi-info-circle-fill"></i>
            Características de accesibilidad
          </h2>
          <ul className="small text-success mb-0 ps-4">
            <li>Alto contraste de colores (WCAG AA)</li>
            <li>Tamaño de fuente grande y legible</li>
            <li>Labels descriptivos y visibles</li>
            <li>Focus visible con indicadores claros</li>
            <li>Atributos ARIA para lectores de pantalla</li>
            <li>Mensajes de error accesibles con role=&quot;alert&quot;</li>
            <li>Textos de ayuda en cada campo</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
