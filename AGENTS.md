# 🤖 AGENTS.md - DevBoards Project Guidelines

## 📋 Descripción del Proyecto

DevBoards es una aplicación tipo Pinterest orientada a desarrolladores web que permite coleccionar y visualizar código de UI, CSS, HTML, JavaScript y TypeScript mediante un sistema de pins y tableros temáticos.

**Características especiales:**
- Sistema de 3 temas de interfaz (Usabilidad, No Usabilidad, Accesibilidad) para demostrar diferentes enfoques de UX
- Diseño basado en sistema Stitch (Bootstrap 5)
- Persistencia de tema seleccionado en localStorage

---

## 🎨 Sistema de Temas

La aplicación implementa 3 temas seleccionables para demostrar diferentes enfoques de diseño de experiencia de usuario:

| Tema | Color | Propósito |
|------|-------|-----------|
| **Usabilidad** | Azul `#0d33f2` | Diseño equilibrado siguiendo buenas prácticas de UX |
| **No Usabilidad** | Naranja `#f59e0b` | Ejemplos de anti-patrones y malas prácticas de UX |
| **Accesibilidad** | Verde `#10b981` | Optimizado para accesibilidad WCAG |

### Implementación del Sistema de Temas

```typescript
// src/context/ThemeContext.tsx
export type AppTheme = 'usabilidad' | 'no-usabilidad' | 'accesibilidad';

// Hook para usar el tema en componentes
const { theme, setTheme, themeLabel, themeColor } = useAppTheme();
```

El tema se selecciona en la página de login/registro y persiste durante toda la sesión.

---

## 🔧 Comandos Clave

### Instalación de Dependencias
```bash
cd devboards
npm install
```

### Desarrollo
```bash
npm run dev          # Servidor de desarrollo en http://localhost:3000
```

### Base de Datos (Prisma + SQLite)
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
- **Lenguaje**: TypeScript
- **Framework**: Next.js 16 con App Router
- **Estilos**: Bootstrap 5 + CSS/SCSS personalizado
- **ORM**: Prisma 7.x con SQLite
- **Autenticación**: NextAuth.js

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
│   │   ├── api/           # API Routes
│   │   ├── login/         # Página de login (con selector de tema)
│   │   ├── register/      # Página de registro (con selector de tema)
│   │   ├── pin/           # Páginas de pins
│   │   ├── profile/       # Páginas de perfil
│   │   ├── boards/        # Tableros del usuario
│   │   ├── saved/         # Pins guardados
│   │   ├── create/        # Crear nuevo pin
│   │   ├── feed/          # Feed de pins
│   │   ├── layout.tsx     # Layout principal (incluye ThemeProvider)
│   │   └── page.tsx       # Página principal
│   ├── components/
│   │   ├── ui/            # Componentes UI reutilizables
│   │   ├── pins/          # Componentes de pins (PinCard, PinGrid)
│   │   ├── boards/        # Componentes de tableros
│   │   ├── layout/        # Header, navegación
│   │   └── providers/     # Providers (SessionProvider)
│   ├── context/
│   │   └── ThemeContext.tsx  # Contexto global de tema
│   ├── lib/
│   │   ├── prisma.ts      # Cliente de Prisma
│   │   └── auth.ts        # Configuración de autenticación
│   └── types/
│       └── index.ts       # Tipos TypeScript globales
└── package.json
```

### Nomenclatura
- **Componentes**: PascalCase (`PinCard.tsx`, `UserProfile.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAppTheme.ts`)
- **Context**: PascalCase con sufijo `Context` (`ThemeContext.tsx`)
- **Utilidades**: camelCase (`formatDate.ts`, `validatePin.ts`)
- **Tipos/Interfaces**: PascalCase (`Pin`, `User`, `AppTheme`)
- **Archivos de página**: `page.tsx` (convención Next.js)
- **Archivos de layout**: `layout.tsx` (convención Next.js)

### Uso del Sistema de Temas
```tsx
// En cualquier componente cliente
'use client';
import { useAppTheme } from '@/context/ThemeContext';

export function MyComponent() {
  const { theme, setTheme, themeColor, themeLabel } = useAppTheme();
  
  return (
    <button 
      style={{ backgroundColor: themeColor }}
      onClick={() => setTheme('accesibilidad')}
    >
      Tema actual: {themeLabel}
    </button>
  );
}
```

### API Routes
```typescript
// src/app/api/pins/route.ts
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

## 📦 Estado de Releases

### Release 1: Estructura Base y Visualización ✅
- ✅ Visualizar pins aleatorios en index
- ✅ Subir pins con imagen
- ✅ Guardar pins en biblioteca personal
- ✅ Añadir descripción técnica a pins

### Release 2: Interacción y Personalización ✅
- ✅ Crear tableros personalizados
- ✅ Sistema de temas (Usabilidad, No Usabilidad, Accesibilidad)
- ✅ Vista de detalle de pin
- ✅ Diseño Stitch implementado

### Release 3: Comunidad ✅
- ✅ Mostrar autor en pins
- ✅ Likes y comentarios
- ✅ Seguir usuarios

### Release 4: Búsqueda y Notificaciones ✅
- ✅ Buscador por palabras clave y etiquetas
- ✅ Sistema de notificaciones

---

## 👤 Usuarios de Prueba

Después de ejecutar `npm run db:seed`:

| Email | Password | Rol |
|-------|----------|-----|
| ana@devboards.com | password123 | Creator |
| carlos@devboards.com | password123 | Explorer |
| maria@devboards.com | password123 | Creator |
