# DevBoards

**Aplicación tipo Pinterest para desarrolladores web** - Colecciona y comparte código de UI, CSS, HTML, JavaScript y TypeScript mediante un sistema de pins y tableros temáticos.

## Características Principales

- **Feed de Pins**: Visualización estilo Pinterest con scroll infinito.
- **Sistema de Temas Dinámico**: 3 modos de interfaz (Usabilidad, No Usabilidad, Accesibilidad) seleccionables en la tarjeta de login/registro.
- **No-Usabilidad UX**: Implementa anti-patrones como búsquedas silenciosas, desplazamientos de contenido exagerados y menús móviles erráticos.
- **Accesibilidad WCAG**: IDs específicos en componentes interactivos y estructuras preparadas para lectores (con pruebas de jerarquía de encabezados).
- **Diseño Responsive Progresivo**: 
  - **Masonry Grid**: Rejilla fluida de 1 a 6 columnas según el ancho de pantalla.
  - **Navegación Móvil**: Menú hamburguesa interactivo con enlaces de perfil.
  - **Responsive Sidebar**: Detalles de pins con barra lateral que baja debajo de la imagen en móviles.
  - **Media Queries Ultra-Wide**: Soporte hasta monitores de 2400px.
- **Autenticación Completa**: Login/Registro con NextAuth.js.
- **Diseño Stitch**: Interfaz moderna con sistema de diseño consistente basado en Bootstrap 5.
- **Likes y Comentarios**: Interacción social con pins.
- **Seguir Usuarios**: Sistema de seguimiento y feed personalizado.
- **Notificaciones**: Sistema de alertas integradas.

## Sistema de Temas

La aplicación incluye 3 temas seleccionables para demostrar diferentes enfoques de UX:

| Tema | Color | Propósito | Características Clave |
|------|-------|-----------|-----------------------|
| **Usabilidad** | Azul (`#0d33f2`) | Diseño equilibrado | Sigue mejores prácticas de UX. |
| **No Usabilidad** | Naranja (`#f59e0b`) | Anti-patrones UX | Búsqueda sin feedback, huecos gigantescos, menú móvil desubicado. |
| **Accesibilidad** | Verde (`#10b981`) | Optimizado WCAG | IDs específicos de filtro, pruebas de jerarquía de encabezados (`h1` -> `h4`). |

La elección del tema ahora se encuentra **dentro del cuadro de registro y login, en la parte inferior**, para que sea la primera y última decisión del usuario antes de entrar.

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
