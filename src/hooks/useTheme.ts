'use client';

import { useEffect, useState } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

const defaultTheme: ThemeColors = {
  primary: '#3b82f6',
  secondary: '#1f2937',
  accent: '#10b981',
  background: '#111827',
  surface: '#374151',
  text: '#ffffff',
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('radioTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(parsedTheme);
        applyTheme(parsedTheme);
      } catch (error) {
        console.error('Error loading theme:', error);
        applyTheme(defaultTheme);
      }
    } else {
      applyTheme(defaultTheme);
    }
  }, []);

  const applyTheme = (newTheme: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', newTheme.primary);
    root.style.setProperty('--color-secondary', newTheme.secondary);
    root.style.setProperty('--color-accent', newTheme.accent);
    root.style.setProperty('--color-background', newTheme.background);
    root.style.setProperty('--color-surface', newTheme.surface);
    root.style.setProperty('--color-text', newTheme.text);
  };

  const updateTheme = (newTheme: ThemeColors) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('radioTheme', JSON.stringify(newTheme));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    applyTheme(defaultTheme);
    localStorage.removeItem('radioTheme');
  };

  return {
    theme,
    updateTheme,
    resetTheme,
    applyTheme,
  };
}