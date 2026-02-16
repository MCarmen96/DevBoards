# DevBoards

**Aplicación tipo Pinterest para desarrolladores web** - Colecciona y comparte código de UI, CSS, HTML, JavaScript y TypeScript mediante un sistema de pins y tableros temáticos.

## Características Principales

- **Feed de Pins**: Visualización estilo Pinterest con scroll infinito
- **Sistema de Temas**: 3 modos de interfaz (Usabilidad, No Usabilidad, Accesibilidad)
- **Código Integrado**: Cada pin puede incluir snippets de código con resaltado de sintaxis
- **Tableros Personalizados**: Organiza pins en colecciones temáticas
- **Autenticación Completa**: Login/Registro con NextAuth.js
- **Diseño Responsive**: Adaptado a móvil, tablet y desktop
- **Diseño Stitch**: Interfaz moderna con sistema de diseño consistente
- **Likes y Comentarios**: Interacción social con pins
- **Seguir Usuarios**: Sistema de seguimiento y feed personalizado
- **Búsqueda Avanzada**: Por palabras clave, etiquetas y lenguaje
- **Notificaciones**: Sistema de notificaciones en tiempo real

## Sistema de Temas

La aplicación incluye 3 temas seleccionables para demostrar diferentes enfoques de UX:

| Tema | Color | Descripción |
|------|-------|-------------|
| **Usabilidad** | Azul (#0d33f2) | Diseño equilibrado y fácil de usar |
| **No Usabilidad** | Naranja (#f59e0b) | Ejemplos de anti-patrones UX |
| **Accesibilidad** | Verde (#10b981) | Optimizado para accesibilidad WCAG |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Base de Datos**: SQLite + Prisma ORM
- **Autenticación**: NextAuth.js
- **Estilos**: Bootstrap 5 + CSS personalizado
- **Lenguaje**: TypeScript

## Inicio Rápido

```bash
# Instalar dependencias
cd devboards
npm install

# Configurar base de datos
npm run db:push
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar producción |
| `npm run db:push` | Sincronizar esquema Prisma |
| `npm run db:seed` | Poblar datos de prueba |
| `npm run db:studio` | Abrir Prisma Studio |
| `npm run db:reset` | Resetear y repoblar BD |

## Estructura del Proyecto

```
devboards/
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos de prueba
├── src/
│   ├── app/             # Rutas (App Router)
│   │   ├── api/         # API endpoints
│   │   ├── login/       # Página de login
│   │   ├── register/    # Página de registro
│   │   ├── pin/         # Detalle de pin
│   │   ├── profile/     # Perfil de usuario
│   │   └── ...
│   ├── components/      # Componentes React
│   │   ├── layout/      # Header, Footer
│   │   ├── pins/        # PinCard, PinGrid
│   │   └── ui/          # Botones, formularios
│   ├── context/
│   │   └── ThemeContext.tsx  # Sistema de temas
│   └── lib/
│       ├── prisma.ts    # Cliente Prisma
│       └── auth.ts      # Configuración auth
└── package.json
```

## Usuarios de Prueba

Después de ejecutar `npm run db:seed`:

| Email | Password | Rol |
|-------|----------|-----|
| ana@devboards.com | password123 | Creator |
| carlos@devboards.com | password123 | Explorer |
| maria@devboards.com | password123 | Creator |

## Licencia

MIT
