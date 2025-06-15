'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

interface ThemeContextType {
  theme: ThemeColors;
  updateTheme: (newTheme: ThemeColors) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#1f2937',
  accent: '#10b981',
  background: '#111827',
  surface: '#374151',
  text: '#ffffff',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
  resetTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    // Load theme on client-side only
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('radioTheme');
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme);
          setTheme(parsedTheme);
          applyTheme(parsedTheme);
        } catch (error) {
          console.error('Error loading theme:', error);
        }
      }
    }
  }, []);

  const applyTheme = (newTheme: ThemeColors) => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', newTheme.primary);
      root.style.setProperty('--color-secondary', newTheme.secondary);
      root.style.setProperty('--color-accent', newTheme.accent);
      root.style.setProperty('--color-background', newTheme.background);
      root.style.setProperty('--color-surface', newTheme.surface);
      root.style.setProperty('--color-text', newTheme.text);
    }
  };

  const updateTheme = (newTheme: ThemeColors) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('radioTheme', JSON.stringify(newTheme));
    }
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    applyTheme(defaultTheme);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('radioTheme');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}