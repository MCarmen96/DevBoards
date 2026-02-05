import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
    html: 'bg-orange-100 text-orange-800',
    css: 'bg-blue-100 text-blue-800',
    javascript: 'bg-yellow-100 text-yellow-800',
    typescript: 'bg-blue-200 text-blue-900',
    react: 'bg-cyan-100 text-cyan-800',
  };
  return colors[language.toLowerCase()] || 'bg-gray-100 text-gray-800';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateRandomColor(): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
