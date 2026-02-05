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

  // Limpiar datos existentes
  await prisma.savedPin.deleteMany();
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
    prisma.pin.create({
      data: {
        title: 'Botón Glassmorphism',
        description: 'Efecto de cristal esmerilado usando backdrop-filter. Compatible con Chrome, Firefox y Safari modernos.',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
        codeSnippet: `.glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 12px 24px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}`,
        language: 'css',
        tags: 'css,glassmorphism,botón,efecto,ui',
        authorId: creator.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'Card con Hover 3D',
        description: 'Efecto de rotación 3D al hacer hover usando CSS transforms.',
        imageUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=500&fit=crop',
        codeSnippet: `.card-3d {
  perspective: 1000px;
}

.card-3d-inner {
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-3d:hover .card-3d-inner {
  transform: rotateY(10deg) rotateX(5deg);
}`,
        language: 'css',
        tags: 'css,3d,hover,card,animación',
        authorId: creator.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'Gradient Text Animation',
        description: 'Texto con gradiente animado usando CSS custom properties.',
        imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop',
        codeSnippet: `.gradient-text {
  background: linear-gradient(90deg, #ff0080, #7928ca, #ff0080);
  background-size: 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 3s ease infinite;
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}`,
        language: 'css',
        tags: 'css,gradient,text,animación',
        authorId: creator2.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'React useLocalStorage Hook',
        description: 'Hook personalizado para sincronizar estado con localStorage.',
        imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=500&fit=crop',
        codeSnippet: `function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}`,
        language: 'typescript',
        tags: 'react,hook,typescript,localStorage',
        authorId: creator2.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'Loading Spinner CSS',
        description: 'Spinner de carga minimalista usando solo CSS.',
        imageUrl: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&h=400&fit=crop',
        codeSnippet: `.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
        language: 'css',
        tags: 'css,loading,spinner,animación',
        authorId: creator.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'Responsive Grid Layout',
        description: 'Grid responsive con auto-fit y minmax.',
        imageUrl: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=400&h=600&fit=crop',
        codeSnippet: `.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.grid-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}`,
        language: 'css',
        tags: 'css,grid,responsive,layout',
        authorId: creator2.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'Dark Mode Toggle',
        description: 'Toggle de tema oscuro con CSS variables.',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=500&fit=crop',
        codeSnippet: `:root {
  --bg-color: #ffffff;
  --text-color: #1a1a1a;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}`,
        language: 'javascript',
        tags: 'javascript,dark-mode,css-variables',
        authorId: creator.id,
      },
    }),
    prisma.pin.create({
      data: {
        title: 'Smooth Scroll Behavior',
        description: 'Scroll suave nativo con CSS y JavaScript.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop',
        codeSnippet: `/* CSS nativo */
html {
  scroll-behavior: smooth;
}

/* JavaScript con opciones */
element.scrollIntoView({
  behavior: 'smooth',
  block: 'start'
});`,
        language: 'javascript',
        tags: 'javascript,scroll,ux',
        authorId: creator2.id,
      },
    }),
  ]);

  console.log(`✅ Created ${pins.length} pins`);

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
