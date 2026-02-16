import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    html: 'badge-html',
    css: 'badge-css',
    javascript: 'badge-javascript',
    typescript: 'badge-typescript',
    react: 'badge-react',
  };
  return colors[language.toLowerCase()] || 'bg-secondary';
}

export function getLanguageBadgeClass(language: string): string {
  const classes: Record<string, string> = {
    javascript: 'badge-javascript',
    typescript: 'badge-typescript',
    html: 'badge-html',
    css: 'badge-css',
    react: 'badge-react',
    vue: 'bg-success-subtle text-success',
  };
  return classes[language.toLowerCase()] || 'bg-secondary-subtle text-secondary';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateRandomColor(): string {
  const colors = [
    'bg-danger',
    'bg-primary',
    'bg-success',
    'bg-warning',
    'bg-info',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  
  return formatDate(date);
}
