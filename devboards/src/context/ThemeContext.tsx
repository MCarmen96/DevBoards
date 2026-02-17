'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppTheme = 'usabilidad' | 'no-usabilidad' | 'accesibilidad';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  themeLabel: string;
  themeColor: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'devboards-theme';

const themeLabels: Record<AppTheme, string> = {
  'usabilidad': 'Usabilidad',
  'no-usabilidad': 'No Usabilidad',
  'accesibilidad': 'Accesibilidad',
};

const themeColors: Record<AppTheme, string> = {
  'usabilidad': '#0d33f2',
  'no-usabilidad': '#f59e0b',
  'accesibilidad': '#10b981',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>('usabilidad');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Cargar tema de localStorage al montar
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as AppTheme | null;
    if (savedTheme && ['usabilidad', 'no-usabilidad', 'accesibilidad'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Añadir atributo data-app-theme al body para estilos CSS condicionales
    document.body.setAttribute('data-app-theme', theme);
    
    // Para tema accesibilidad, bloquear zoom modificando viewport
    const viewport = document.querySelector('meta[name="viewport"]');
    if (theme === 'accesibilidad') {
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
    } else {
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
      }
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  // Evitar flash de contenido incorrecto
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        themeLabel: themeLabels[theme],
        themeColor: themeColors[theme],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}
