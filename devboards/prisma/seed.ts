import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

// La base de datos está en la raíz del proyecto (./dev.db)
const dbPath = path.join(process.cwd(), 'dev.db');

async function main() {
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter });

  console.log('🌱 Seeding database...');

  // Limpiar datos existentes (en orden correcto por las relaciones)
  await prisma.boardPin.deleteMany();
  await prisma.savedPin.deleteMany();
  await prisma.board.deleteMany();
  await prisma.pin.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de prueba
  const hashedPassword = await bcrypt.hash('password123', 12);

  const creator = await prisma.user.create({
    data: {
      name: 'Ana Developer',
      email: 'ana@devboards.com',
      password: hashedPassword,
      role: 'creator',
      bio: 'Frontend developer apasionada por el CSS y las animaciones',
    },
  });

  const explorer = await prisma.user.create({
    data: {
      name: 'Carlos Explorer',
      email: 'carlos@devboards.com',
      password: hashedPassword,
      role: 'explorer',
      bio: 'Junior dev buscando inspiración',
    },
  });

  const creator2 = await prisma.user.create({
    data: {
      name: 'María UI',
      email: 'maria@devboards.com',
      password: hashedPassword,
      role: 'creator',
      bio: 'UI/UX Designer & Developer',
    },
  });

  console.log('✅ Users created');

  // Crear pins de ejemplo
  const pins = await Promise.all([
    // Pin 0 – Glassmorphism Button
    prisma.pin.create({
      data: {
        title: 'Botón Glassmorphism',
        description: 'Efecto de cristal esmerilado con backdrop-filter blur. Perfecto para UIs sobre fondos con gradiente. Compatible con Chrome, Firefox y Safari modernos.',
        imageUrl: '/uploads/seeds/glassmorphism-button.svg',
        codeSnippet: `.glass-button {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 14px 36px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.glass-button:active {
  transform: translateY(-1px);
}`,
        language: 'css',
        tags: 'css,glassmorphism,botón,efecto,ui,blur',
        authorId: creator.id,
      },
    }),
    // Pin 1 – Neon Glow Button
    prisma.pin.create({
      data: {
        title: 'Botón Neon Glow',
        description: 'Efecto neón con box-shadow múltiple y text-shadow. Ideal para dashboards o landing pages con estética dark/cyberpunk.',
        imageUrl: '/uploads/seeds/neon-button.svg',
        codeSnippet: `.neon-btn {
  background: transparent;
  border: 2px solid #0ff;
  border-radius: 8px;
  padding: 14px 40px;
  color: #0ff;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 10px #0ff, 0 0 20px #0ff;
  box-shadow: 0 0 5px #0ff,
              0 0 15px #0ff,
              0 0 30px #0ff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.neon-btn:hover {
  box-shadow: 0 0 10px #0ff,
              0 0 30px #0ff,
              0 0 60px #0ff,
              0 0 90px #0ff;
}

@keyframes neonPulse {
  0%, 100% { box-shadow: 0 0 5px #0ff, 0 0 20px #0ff; }
  50%       { box-shadow: 0 0 15px #0ff, 0 0 50px #0ff; }
}`,
        language: 'css',
        tags: 'css,neon,glow,botón,dark,efecto',
        authorId: creator.id,
      },
    }),
    // Pin 2 – 3D Card Hover
    prisma.pin.create({
      data: {
        title: 'Card con Hover 3D',
        description: 'Efecto de inclinación 3D al hacer hover usando CSS perspective y rotateY/rotateX. Añade profundidad sin JavaScript.',
        imageUrl: '/uploads/seeds/3d-card.svg',
        codeSnippet: `.card-wrapper {
  perspective: 1000px;
}

.card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  transform-style: preserve-3d;
  will-change: transform;
}

.card:hover {
  transform: perspective(1000px)
             rotateY(-12deg)
             rotateX(5deg)
             scale(1.02);
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.5),
             -5px -5px 20px rgba(255, 255, 255, 0.05);
}

/* Shine overlay */
.card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.15) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card:hover::after { opacity: 1; }`,
        language: 'css',
        tags: 'css,3d,hover,card,perspective,animación',
        authorId: creator.id,
      },
    }),
    // Pin 3 – Gradient Text
    prisma.pin.create({
      data: {
        title: 'Gradient Text Animado',
        description: 'Texto con gradiente en movimiento usando background-clip: text y animación CSS. Funciona en todos los navegadores modernos.',
        imageUrl: '/uploads/seeds/gradient-text.svg',
        codeSnippet: `.gradient-text {
  background: linear-gradient(
    90deg,
    #ff0080,
    #7928ca,
    #00d4ff,
    #ff0080
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-weight: 900;
  animation: gradientFlow 4s ease infinite;
}

@keyframes gradientFlow {
  0%   { background-position: 0%   50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0%   50%; }
}

/* Variante con múltiples colores */
.rainbow-text {
  background: linear-gradient(
    90deg,
    #f9a825, #ef5350, #7b1fa2
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientFlow 3s linear infinite;
}`,
        language: 'css',
        tags: 'css,gradient,text,animación,tipografía',
        authorId: creator2.id,
      },
    }),
    // Pin 4 – Loading Spinners
    prisma.pin.create({
      data: {
        title: 'Loading Spinners CSS',
        description: 'Cuatro variantes de spinners de carga en CSS puro: ring, dots, pulse y bars. Sin JavaScript ni librerías externas.',
        imageUrl: '/uploads/seeds/loading-spinner.svg',
        codeSnippet: `/* Ring spinner */
.spinner-ring {
  width: 48px;
  height: 48px;
  border: 5px solid rgba(102, 126, 234, 0.15);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Dot bounce */
.spinner-dots span {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #f093fb;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}
.spinner-dots span:nth-child(2) { animation-delay: 0.2s; }
.spinner-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Pulse */
.spinner-pulse {
  width: 52px;
  height: 52px;
  background: #4facfe;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40%           { transform: scale(1); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1);   opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.5; }
}`,
        language: 'css',
        tags: 'css,loading,spinner,animación,ui',
        authorId: creator.id,
      },
    }),
    // Pin 5 – Responsive Navbar
    prisma.pin.create({
      data: {
        title: 'Navbar Responsive',
        description: 'Barra de navegación responsive con menú hamburguesa en móvil. Incluye estado activo, CTA y dropdown. Sticky con backdrop-filter.',
        imageUrl: '/uploads/seeds/navbar.svg',
        codeSnippet: `/* Navbar base */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-link {
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.nav-link:hover,
.nav-link.active { color: white; }

.nav-link.active {
  border-bottom: 2px solid #667eea;
  padding-bottom: 4px;
}

/* Mobile */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 64px; left: 0; right: 0;
    background: #0f172a;
    padding: 1rem;
  }
  .nav-links.open { display: flex; }
  .hamburger { display: flex; }
}`,
        language: 'css',
        tags: 'css,navbar,responsive,navegación,layout,html',
        authorId: creator2.id,
      },
    }),
    // Pin 6 – Toggle Switch
    prisma.pin.create({
      data: {
        title: 'Toggle Switch CSS Puro',
        description: 'Interruptor toggle accesible con CSS puro, sin JavaScript. Múltiples tamaños y colores usando custom properties.',
        imageUrl: '/uploads/seeds/toggle-switch.svg',
        codeSnippet: `/* HTML: <label class="toggle">
  <input type="checkbox" />
  <span class="track"><span class="thumb"></span></span>
</label> */

.toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.toggle input { display: none; }

.track {
  position: relative;
  width: 52px;
  height: 28px;
  background: #cbd5e1;
  border-radius: 14px;
  transition: background 0.3s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

/* Checked state */
.toggle input:checked ~ .track {
  background: linear-gradient(90deg, #667eea, #764ba2);
  box-shadow: 0 0 12px rgba(102,126,234,0.4);
}
.toggle input:checked ~ .track .thumb {
  transform: translateX(24px);
}

/* Accessible focus */
.toggle input:focus-visible ~ .track {
  outline: 3px solid #667eea;
  outline-offset: 2px;
}`,
        language: 'css',
        tags: 'css,toggle,switch,formulario,accesibilidad,ui',
        authorId: creator2.id,
      },
    }),
    // Pin 7 – CSS Grid Dashboard
    prisma.pin.create({
      data: {
        title: 'Dashboard con CSS Grid',
        description: 'Layout de dashboard tipo admin usando CSS Grid con áreas nombradas. Tarjetas de métricas, gráfico de barras y panel lateral.',
        imageUrl: '/uploads/seeds/css-grid-dashboard.svg',
        codeSnippet: `.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto 1fr 1fr;
  gap: 16px;
  padding: 24px;
  min-height: 100vh;
  background: #0f172a;
}

/* Estadísticas: 1 columna cada una */
.stat-card {
  border-radius: 14px;
  padding: 20px;
  color: white;
}
.stat-card:nth-child(1) { background: linear-gradient(135deg, #667eea, #764ba2); }
.stat-card:nth-child(2) { background: linear-gradient(135deg, #f093fb, #f5576c); }
.stat-card:nth-child(3) { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.stat-card:nth-child(4) { background: linear-gradient(135deg, #10b981, #059669); }

/* Gráfico ocupa 3 columnas */
.chart-area {
  grid-column: 1 / 4;
  grid-row: 2 / 3;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 20px;
}

/* Sidebar ocupa col 4, filas 2 y 3 */
.sidebar {
  grid-column: 4 / 5;
  grid-row: 2 / 4;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 20px;
}`,
        language: 'css',
        tags: 'css,grid,dashboard,layout,admin,responsive',
        authorId: creator2.id,
      },
    }),
    // Pin 8 – Modal Component (HTML + CSS + JS)
    prisma.pin.create({
      data: {
        title: 'Modal / Dialog Nativo',
        description: 'Modal con el elemento <dialog> nativo de HTML5. Sin librerías, con backdrop-filter, animación de entrada y cierre al pulsar fuera.',
        imageUrl: '/uploads/seeds/modal-component.svg',
        codeSnippet: JSON.stringify([
          {
            lang: 'html',
            code: `<dialog id="confirm-modal" class="modal">
  <div class="modal-header">
    <h2>Confirmar acción</h2>
    <button class="close-btn"
      onclick="this.closest('dialog').close()">✕</button>
  </div>
  <div class="modal-body">
    <p>¿Estás seguro de continuar?</p>
    <div class="warning-box">
      ⚠ Esta acción no se puede deshacer.
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn-secondary"
      onclick="confirmModal.close()">Cancelar</button>
    <button class="btn-danger">Sí, eliminar</button>
  </div>
</dialog>`,
          },
          {
            lang: 'css',
            code: `.modal {
  border: none;
  border-radius: 16px;
  padding: 0;
  width: min(440px, 90vw);
  box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  background: #1e293b;
  color: white;
}
.modal::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}
.modal[open] {
  animation: fadeIn 0.2s ease;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: #334155;
  border-radius: 16px 16px 0 0;
}
.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
}
.warning-box {
  background: rgba(245,158,11,0.1);
  border: 1px solid rgba(245,158,11,0.3);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #fbbf24;
  margin-top: 1rem;
}
@keyframes fadeIn {
  from { opacity:0; transform: scale(0.95) translateY(-10px); }
  to   { opacity:1; transform: scale(1)    translateY(0); }
}`,
          },
          {
            lang: 'javascript',
            code: `const modal = document.getElementById('confirm-modal');

// Abrir modal
document.querySelector('.open-btn')
  .addEventListener('click', () => modal.showModal());

// Cerrar al hacer click en el backdrop
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});`,
          },
        ]),
        language: 'html',
        tags: 'html,css,javascript,modal,dialog,animación,ui',
        authorId: creator.id,
      },
    }),
    // Pin 9 – Accordion (HTML + CSS + JS)
    prisma.pin.create({
      data: {
        title: 'Accordion Animado',
        description: 'Accordion expandible con animación CSS smooth usando max-height. Accesible, sin dependencias y con cierre automático del resto de paneles.',
        imageUrl: '/uploads/seeds/accordion-component.svg',
        codeSnippet: JSON.stringify([
          {
            lang: 'html',
            code: `<div class="accordion">
  <div class="acc-item">
    <button class="acc-btn">
      ¿Qué es CSS Grid?
      <span class="acc-icon">▼</span>
    </button>
    <div class="acc-content">
      <p>Sistema de layout bidimensional que
         permite controlar filas y columnas.</p>
    </div>
  </div>

  <div class="acc-item">
    <button class="acc-btn">
      ¿Cuándo usar Flexbox?
      <span class="acc-icon">▼</span>
    </button>
    <div class="acc-content">
      <p>Ideal para layouts unidimensionales
         (una fila o una columna).</p>
    </div>
  </div>
</div>`,
          },
          {
            lang: 'css',
            code: `.acc-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 4px;
}
.acc-btn:hover { background: #273548; }
.acc-btn.open  {
  background: #1e3a5f;
  border-color: #3b82f6;
}
.acc-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease,
              padding 0.2s ease;
  background: #0f2440;
  border-radius: 0 0 10px 10px;
  padding: 0 1.25rem;
}
.acc-btn.open + .acc-content {
  max-height: 200px;
  padding: 1rem 1.25rem;
}
.acc-icon { transition: transform 0.3s ease; }
.acc-btn.open .acc-icon {
  transform: rotate(180deg);
}`,
          },
          {
            lang: 'javascript',
            code: `document.querySelectorAll('.acc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Cierra los demás paneles
    document.querySelectorAll('.acc-btn')
      .forEach(b => {
        if (b !== btn) b.classList.remove('open');
      });

    // Abre o cierra el actual
    btn.classList.toggle('open');
  });
});`,
          },
        ]),
        language: 'html',
        tags: 'html,css,javascript,accordion,animación,ui,componente',
        authorId: creator2.id,
      },
    }),
    // Pin 10 – Toast Notifications (HTML + CSS + JS)
    prisma.pin.create({
      data: {
        title: 'Toast Notifications',
        description: 'Sistema de notificaciones toast con 4 tipos (success, error, warn, info), animación de entrada, barra de progreso y auto-cierre.',
        imageUrl: '/uploads/seeds/toast-notification.svg',
        codeSnippet: JSON.stringify([
          {
            lang: 'html',
            code: `<!-- Contenedor (añadir al <body>) -->
<div id="toast-container"></div>

<!-- Botones de demo -->
<button
  onclick="showToast('Guardado correctamente', 'success')">
  Éxito
</button>
<button
  onclick="showToast('Error al procesar', 'error')">
  Error
</button>
<button
  onclick="showToast('Sesión próxima a expirar', 'warn')">
  Aviso
</button>`,
          },
          {
            lang: 'css',
            code: `#toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  z-index: 9999;
}
.toast {
  min-width: 280px;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border-left: 5px solid;
  color: white;
  font-size: 0.9rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  animation: toastIn 0.3s ease;
}
.toast-success { background:#052e16; border-color:#16a34a; color:#4ade80; }
.toast-error   { background:#450a0a; border-color:#dc2626; color:#f87171; }
.toast-warn    { background:#431407; border-color:#d97706; color:#fbbf24; }
.toast-info    { background:#0c1a2e; border-color:#2563eb; color:#60a5fa; }
@keyframes toastIn {
  from { opacity:0; transform: translateX(100%); }
  to   { opacity:1; transform: translateX(0); }
}`,
          },
          {
            lang: 'javascript',
            code: `function showToast(message, type = 'info', ms = 3000) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;

  // Barra de progreso
  const bar = document.createElement('div');
  bar.style.cssText =
    'height:3px;margin-top:8px;border-radius:2px;' +
    'background:currentColor;opacity:.4;' +
    'animation:shrink ' + ms + 'ms linear forwards';
  toast.appendChild(bar);

  container.appendChild(toast);
  setTimeout(() => toast.remove(), ms);
}

// Uso:
showToast('Pin guardado en tu tablero', 'success');`,
          },
        ]),
        language: 'html',
        tags: 'html,css,javascript,toast,notificación,animación,ui',
        authorId: creator.id,
      },
    }),
    // Pin 11 – React Counter (TypeScript)
    prisma.pin.create({
      data: {
        title: 'React Counter con TypeScript',
        description: 'Componente contador en React con TypeScript. Props tipadas, useCallback para optimizar renders, límites min/max y barra de progreso opcional.',
        imageUrl: '/uploads/seeds/react-counter.svg',
        codeSnippet: `import { useState, useCallback } from 'react';

interface CounterProps {
  initial?: number;
  step?: number;
  min?: number;
  max?: number;
}

export function Counter({
  initial = 0,
  step = 1,
  min = -Infinity,
  max = Infinity,
}: CounterProps) {
  const [count, setCount] = useState<number>(initial);

  const decrement = useCallback(
    () => setCount(c => Math.max(min, c - step)),
    [min, step]
  );

  const increment = useCallback(
    () => setCount(c => Math.min(max, c + step)),
    [max, step]
  );

  const reset = useCallback(
    () => setCount(initial),
    [initial]
  );

  const progress = max !== Infinity
    ? ((count - min) / (max - min)) * 100
    : undefined;

  return (
    <div className="counter">
      <span className="counter-value">{count}</span>
      <div className="counter-controls">
        <button onClick={decrement} disabled={count <= min}>−</button>
        <button onClick={reset} className="reset">↺</button>
        <button onClick={increment} disabled={count >= max}>+</button>
      </div>
      {progress !== undefined && (
        <progress value={progress} max={100} />
      )}
    </div>
  );
}`,
        language: 'typescript',
        tags: 'react,typescript,hooks,counter,componente,useCallback',
        authorId: creator2.id,
      },
    }),
    // Pin 12 – Fetch API (JavaScript)
    prisma.pin.create({
      data: {
        title: 'Fetch API con Async/Await',
        description: 'Patrón completo para peticiones HTTP con fetch: GET y POST, headers de autenticación, manejo de errores con try/catch/finally y loading state.',
        imageUrl: '/uploads/seeds/js-fetch-api.svg',
        codeSnippet: `// GET con manejo de errores
async function fetchData(url) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (!response.ok) {
    throw new Error('HTTP ' + response.status + ': ' + response.statusText);
  }

  return response.json();
}

// POST con body JSON
async function createResource(url, data) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || 'Error en la petición');
  }

  return response.json();
}

// Patrón con loading/error state
async function loadUsers(setData, setLoading, setError) {
  try {
    const users = await fetchData('/api/users');
    setData(users);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}`,
        language: 'javascript',
        tags: 'javascript,fetch,async,await,http,api,petición',
        authorId: creator.id,
      },
    }),
  ]);

  console.log(`✅ Created ${pins.length} pins`);

  // Crear tableros para los usuarios
  const boards = await Promise.all([
    // Tableros de Ana (creator)
    prisma.board.create({
      data: {
        name: 'Efectos CSS',
        description: 'Colección de efectos visuales con CSS puro',
        isPrivate: false,
        userId: creator.id,
      },
    }),
    prisma.board.create({
      data: {
        name: 'Animaciones',
        description: 'Animaciones y transiciones CSS',
        isPrivate: false,
        userId: creator.id,
      },
    }),
    prisma.board.create({
      data: {
        name: 'Proyectos WIP',
        description: 'Trabajo en progreso - privado',
        isPrivate: true,
        userId: creator.id,
      },
    }),
    prisma.board.create({
      data: {
        name: 'Ideas Experimentales',
        description: 'Conceptos experimentales',
        isPrivate: true,
        userId: creator.id,
      },
    }),
    // Tableros de María (creator2)
    prisma.board.create({
      data: {
        name: 'React Hooks',
        description: 'Hooks personalizados útiles',
        isPrivate: false,
        userId: creator2.id,
      },
    }),
    prisma.board.create({
      data: {
        name: 'UI Components',
        description: 'Componentes de interfaz reutilizables',
        isPrivate: false,
        userId: creator2.id,
      },
    }),
    prisma.board.create({
      data: {
        name: 'Secretos de Diseño',
        description: 'Mis trucos privados',
        isPrivate: true,
        userId: creator2.id,
      },
    }),
    // Tableros de Carlos (explorer)
    prisma.board.create({
      data: {
        name: 'Favoritos',
        description: 'Mis pins favoritos',
        isPrivate: false,
        userId: explorer.id,
      },
    }),
    prisma.board.create({
      data: {
        name: 'Para Aprender',
        description: 'Pins para estudiar después',
        isPrivate: true,
        userId: explorer.id,
      },
    }),
  ]);

  console.log(`✅ Created ${boards.length} boards`);

  // Asociar pins a tableros
  await prisma.boardPin.createMany({
    data: [
      // Tablero "Efectos CSS" de Ana
      { boardId: boards[0].id, pinId: pins[0].id },
      { boardId: boards[0].id, pinId: pins[1].id },
      { boardId: boards[0].id, pinId: pins[2].id },
      // Tablero "Animaciones" de Ana
      { boardId: boards[1].id, pinId: pins[4].id },
      { boardId: boards[1].id, pinId: pins[2].id },
      // Tablero privado "Proyectos WIP" de Ana
      { boardId: boards[2].id, pinId: pins[6].id },
      // Tablero privado "Ideas Experimentales" de Ana
      { boardId: boards[3].id, pinId: pins[7].id },
      // Tablero "React Hooks" de María
      { boardId: boards[4].id, pinId: pins[3].id },
      // Tablero "UI Components" de María
      { boardId: boards[5].id, pinId: pins[5].id },
      { boardId: boards[5].id, pinId: pins[0].id },
      // Tablero privado "Secretos de Diseño" de María
      { boardId: boards[6].id, pinId: pins[1].id },
      { boardId: boards[6].id, pinId: pins[4].id },
      // Tablero "Favoritos" de Carlos
      { boardId: boards[7].id, pinId: pins[0].id },
      { boardId: boards[7].id, pinId: pins[2].id },
      { boardId: boards[7].id, pinId: pins[4].id },
      // Tablero privado "Para Aprender" de Carlos
      { boardId: boards[8].id, pinId: pins[3].id },
      { boardId: boards[8].id, pinId: pins[7].id },
      // Nuevos pins
      { boardId: boards[5].id, pinId: pins[8].id },   // Modal → UI Components (María)
      { boardId: boards[5].id, pinId: pins[9].id },   // Accordion → UI Components (María)
      { boardId: boards[0].id, pinId: pins[10].id },  // Toast → Efectos CSS (Ana)
      { boardId: boards[4].id, pinId: pins[11].id },  // React Counter → React Hooks (María)
      { boardId: boards[8].id, pinId: pins[12].id },  // Fetch API → Para Aprender (Carlos)
    ],
  });

  console.log('✅ Board pins associations created');

  // Guardar algunos pins como favoritos
  await prisma.savedPin.createMany({
    data: [
      { userId: explorer.id, pinId: pins[0].id },
      { userId: explorer.id, pinId: pins[2].id },
      { userId: explorer.id, pinId: pins[4].id },
      { userId: creator.id, pinId: pins[3].id },
      { userId: creator2.id, pinId: pins[1].id },
    ],
  });

  console.log('✅ Saved pins created');
  console.log('');
  console.log('🎉 Seed completed!');
  console.log('');
  console.log('📧 Test accounts:');
  console.log('   Creator: ana@devboards.com / password123');
  console.log('   Explorer: carlos@devboards.com / password123');
  console.log('   Creator2: maria@devboards.com / password123');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
