'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppTheme } from '@/context/ThemeContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

// Mapeo de rutas a labels amigables
const routeLabels: Record<string, string> = {
  '/': 'Inicio',
  '/feed': 'Siguiendo',
  '/profile': 'Mi Perfil',
  '/boards': 'Mis Tableros',
  '/saved': 'Guardados',
  '/create': 'Crear Pin',
  '/pin': 'Pin',
  '/search': 'Búsqueda',
};

export function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  const { theme } = useAppTheme();
  const pathname = usePathname();

  // Solo mostrar en tema Usabilidad
  if (theme !== 'usabilidad') {
    return null;
  }

  // Si se proporcionan items personalizados, usarlos
  if (items && items.length > 0) {
    return (
      <nav aria-label="Ubicación actual" className="mb-3">
        <ol className="breadcrumb mb-0 small bg-body-tertiary rounded-2 px-3 py-2">
          <li className="breadcrumb-item">
            <Link href="/" className="text-decoration-none d-flex align-items-center gap-1">
              <i className="bi bi-house-door"></i>
              <span>Inicio</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li 
              key={index} 
              className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {item.href && index !== items.length - 1 ? (
                <Link href={item.href} className="text-decoration-none">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary fw-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Auto-generar breadcrumbs basados en la ruta actual
  const pathSegments = pathname.split('/').filter(Boolean);
  
  // No mostrar breadcrumb en la página principal
  if (pathSegments.length === 0) {
    return null;
  }

  const breadcrumbItems: BreadcrumbItem[] = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Obtener label personalizado o usar el segmento capitalizado
    let label = routeLabels[currentPath];
    
    if (!label) {
      // Si es un ID (UUID o similar), usar label genérico
      if (segment.length > 20 || /^[a-z0-9-]{20,}$/i.test(segment)) {
        const parentPath = `/${pathSegments[index - 1] || ''}`;
        if (parentPath === '/pin') {
          label = currentPage || 'Detalle Pin';
        } else if (parentPath === '/boards') {
          label = currentPage || 'Tablero';
        } else if (parentPath === '/profile') {
          label = currentPage || 'Perfil';
        } else {
          label = currentPage || 'Detalle';
        }
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
    }

    breadcrumbItems.push({
      label,
      href: index < pathSegments.length - 1 ? currentPath : undefined,
    });
  });

  return (
    <nav aria-label="Ubicación actual" className="mb-3">
      <ol className="breadcrumb mb-0 small bg-body-tertiary rounded-2 px-3 py-2 d-inline-flex">
        <li className="breadcrumb-item">
          <Link href="/" className="text-decoration-none d-flex align-items-center gap-1">
            <i className="bi bi-house-door"></i>
            <span className="d-none d-sm-inline">Inicio</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <li 
            key={index} 
            className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}
            aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
          >
            {item.href ? (
              <Link href={item.href} className="text-decoration-none">
                {item.label}
              </Link>
            ) : (
              <span className="text-primary fw-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
