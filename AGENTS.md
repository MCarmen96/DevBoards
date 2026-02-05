# 🤖 AGENTS.md - DevBoards Project Guidelines

## 📋 Descripción del Proyecto

DevBoards es una aplicación tipo Pinterest orientada a desarrolladores web que permite coleccionar y visualizar código de UI, CSS, HTML, JavaScript y TypeScript mediante un sistema de pins y tableros temáticos.

---

## 🔧 Comandos Clave

### Instalación de Dependencias
```bash
npm install
```

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo en http://localhost:3000
```

### Pruebas
```bash
npm test             # Ejecutar todas las pruebas
npm run test:watch   # Ejecutar pruebas en modo watch
npm run test:coverage # Ejecutar pruebas con cobertura
```

### Base de Datos (Prisma)
```bash
npm run db:push      # Sincronizar esquema con la base de datos
npm run db:migrate   # Crear y aplicar migración
npm run db:studio    # Abrir Prisma Studio (GUI)
npm run db:seed      # Poblar base de datos con datos de prueba
npm run db:reset     # Resetear y repoblar base de datos
```

### Build y Producción
```bash
npm run build        # Compilar para producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
```

---

## 🚫 Condiciones y Límites

### NO Modificar
- `/.env` - Variables de entorno (contiene secretos)
- `/.env.local` - Variables de entorno locales
- `/prisma/migrations/` - Migraciones ya aplicadas (crear nuevas en su lugar)
- `/node_modules/` - Dependencias instaladas
- `/.next/` - Build de Next.js
- `/public/uploads/` - Archivos subidos por usuarios en producción

### Archivos Sensibles
- Nunca commitear archivos `.env` con credenciales reales
- No exponer claves API en el código del cliente
- No modificar configuraciones de CI/CD sin revisión

---

## 📐 Convenciones de Código

### Estilo General
- **Lenguaje**: TypeScript estricto (`strict: true`)
- **Framework**: Next.js 14 con App Router
- **Estilos**: Tailwind CSS
- **ORM**: Prisma
- **Formato**: Prettier con configuración del proyecto

### Estructura de Carpetas
```
devboards/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts            # Script de datos de prueba
├── public/
│   └── uploads/           # Imágenes de pins
├── src/
│   ├── app/               # App Router de Next.js
│   │   ├── (auth)/        # Rutas de autenticación
│   │   ├── api/           # API Routes
│   │   ├── pin/           # Páginas de pins
│   │   ├── profile/       # Páginas de perfil
│   │   ├── layout.tsx     # Layout principal
│   │   └── page.tsx       # Página principal (feed)
│   ├── components/
│   │   ├── ui/            # Componentes UI reutilizables
│   │   ├── pins/          # Componentes relacionados con pins
│   │   └── layout/        # Componentes de layout
│   ├── lib/
│   │   ├── prisma.ts      # Cliente de Prisma
│   │   ├── auth.ts        # Configuración de autenticación
│   │   └── utils.ts       # Funciones utilitarias
│   ├── types/
│   │   └── index.ts       # Tipos TypeScript globales
│   └── hooks/
│       └── index.ts       # Custom hooks
├── tests/
│   ├── unit/              # Pruebas unitarias
│   └── integration/       # Pruebas de integración
└── package.json
```

### Nomenclatura
- **Componentes**: PascalCase (`PinCard.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase con prefijo `use` (`usePins.ts`, `useAuth.ts`)
- **Utilidades**: camelCase (`formatDate.ts`, `validatePin.ts`)
- **Tipos/Interfaces**: PascalCase con prefijo descriptivo (`PinType`, `UserRole`)
- **Archivos de página**: `page.tsx` (convención Next.js)
- **Archivos de layout**: `layout.tsx` (convención Next.js)

### Componentes React
```tsx
// ✅ Correcto: Componente funcional con tipos
interface PinCardProps {
  pin: Pin;
  onSave?: (pinId: string) => void;
}

export function PinCard({ pin, onSave }: PinCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      {/* contenido */}
    </div>
  );
}

// ❌ Incorrecto: Sin tipos, export default
export default function(props) {
  return <div>{props.children}</div>;
}
```

### API Routes
```typescript
// ✅ Correcto: API Route con validación y manejo de errores
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const pins = await prisma.pin.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error fetching pins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pins' },
      { status: 500 }
    );
  }
}
```

---

## 🔄 Flujos de Trabajo

### Git Branches
- `main` - Rama de producción (protegida)
- `develop` - Rama de desarrollo
- `feature/*` - Nuevas funcionalidades (`feature/pin-upload`)
- `fix/*` - Corrección de bugs (`fix/image-loading`)
- `release/*` - Preparación de releases

### Commits (Conventional Commits)
```bash
feat: añadir componente PinCard
fix: corregir carga de imágenes en Safari
docs: actualizar README con instrucciones de instalación
style: formatear archivos con Prettier
refactor: extraer lógica de validación a hook
test: añadir pruebas para PinCard
chore: actualizar dependencias
```

### Pull Requests
1. Crear PR desde `feature/*` hacia `develop`
2. Incluir descripción clara de cambios
3. Referenciar issue relacionado (`Closes #123`)
4. Asegurar que pasan todas las pruebas
5. Solicitar revisión de al menos 1 reviewer
6. Hacer squash merge al aprobar

### CI/CD Pipeline
```yaml
# El pipeline ejecuta automáticamente:
1. Lint (ESLint)
2. Type Check (TypeScript)
3. Unit Tests (Jest/Vitest)
4. Build Test
5. Deploy Preview (en PRs)
```

---

## 💡 Ejemplos Prácticos

### Crear un Nuevo Pin (API)
```typescript
// src/app/api/pins/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  
  const pin = await prisma.pin.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      codeSnippet: data.codeSnippet,
      language: data.language,
      authorId: session.user.id,
    },
  });

  return NextResponse.json(pin, { status: 201 });
}
```

### Componente PinCard
```tsx
// src/components/pins/PinCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Pin } from '@/types';
import { SaveButton } from './SaveButton';

interface PinCardProps {
  pin: Pin;
}

export function PinCard({ pin }: PinCardProps) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
      <Link href={`/pin/${pin.id}`}>
        <div className="relative aspect-[3/4]">
          <Image
            src={pin.imageUrl}
            alt={pin.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
      </Link>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <SaveButton pinId={pin.id} />
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{pin.title}</h3>
        {pin.language && (
          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
            {pin.language}
          </span>
        )}
      </div>
    </div>
  );
}
```

### Custom Hook para Pins
```typescript
// src/hooks/usePins.ts
'use client';

import { useState, useEffect } from 'react';
import { Pin } from '@/types';

export function usePins(limit = 20) {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPins() {
      try {
        const response = await fetch(`/api/pins?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch pins');
        const data = await response.json();
        setPins(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPins();
  }, [limit]);

  return { pins, loading, error };
}
```

### Schema de Prisma
```prisma
// prisma/schema.prisma
model Pin {
  id          String   @id @default(cuid())
  title       String
  description String?
  imageUrl    String
  codeSnippet String?
  language    String?  // 'css' | 'html' | 'javascript' | 'typescript'
  
  author      User     @relation("CreatedPins", fields: [authorId], references: [id])
  authorId    String
  
  savedBy     User[]   @relation("SavedPins")
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🎯 Roles del Sistema

### Dev-Explorer (Visualizador)
- Puede visualizar pins en el feed
- Puede guardar pins en su biblioteca
- Puede crear tableros para organizar pins
- Puede seguir a otros usuarios

### Dev-Creator (Creador)
- Todas las capacidades de Explorer
- Puede crear y subir pins
- Puede añadir código y descripciones técnicas
- Puede editar y eliminar sus propios pins

---

## 📦 Releases Planificados

### Release 1: Estructura Base y Visualización ✅
- Visualizar pins aleatorios en index
- Subir pins con imagen
- Guardar pins en biblioteca personal
- Añadir descripción técnica a pins

### Release 2: Interacción y Personalización 🔜
- Crear tableros personalizados
- Alternar tema claro/oscuro
- Vista de detalle de pin

### Release 3: Comunidad 🔜
- Mostrar autor en pins
- Likes y comentarios
- Seguir usuarios

### Release 4: Búsqueda y Notificaciones 🔜
- Buscador por palabras clave y etiquetas
- Sistema de notificaciones
