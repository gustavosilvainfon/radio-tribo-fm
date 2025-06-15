'use client';

import { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, Eye } from 'lucide-react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

const defaultThemes = {
  default: {
    primary: '#3b82f6', // blue-500
    secondary: '#1f2937', // gray-800
    accent: '#10b981', // emerald-500
    background: '#111827', // gray-900
    surface: '#374151', // gray-700
    text: '#ffffff',
  },
  purple: {
    primary: '#8b5cf6', // violet-500
    secondary: '#1e1b4b', // indigo-900
    accent: '#f59e0b', // amber-500
    background: '#0f0c29', // dark purple
    surface: '#2d1b69', // purple-800
    text: '#ffffff',
  },
  green: {
    primary: '#10b981', // emerald-500
    secondary: '#064e3b', // emerald-900
    accent: '#f59e0b', // amber-500
    background: '#022c22', // dark green
    surface: '#065f46', // emerald-800
    text: '#ffffff',
  },
  red: {
    primary: '#ef4444', // red-500
    secondary: '#7f1d1d', // red-900
    accent: '#3b82f6', // blue-500
    background: '#1a0a0a', // dark red
    surface: '#991b1b', // red-800
    text: '#ffffff',
  },
  orange: {
    primary: '#f97316', // orange-500
    secondary: '#9a3412', // orange-800
    accent: '#3b82f6', // blue-500
    background: '#1c1917', // stone-900
    surface: '#78350f', // amber-800
    text: '#ffffff',
  },
};

export default function ThemeCustomizer() {
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(defaultThemes.default);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('radioTheme');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setCurrentTheme(parsed);
        applyTheme(parsed);
      } catch (error) {
        console.error('Error loading saved theme:', error);
      }
    }
  }, []);

  const applyTheme = (theme: ThemeColors) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-text', theme.text);
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = defaultThemes[presetName as keyof typeof defaultThemes];
    setCurrentTheme(preset);
    if (isPreviewMode) {
      applyTheme(preset);
    }
  };

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newTheme = { ...currentTheme, [colorKey]: value };
    setCurrentTheme(newTheme);
    if (isPreviewMode) {
      applyTheme(newTheme);
    }
  };

  const saveTheme = () => {
    localStorage.setItem('radioTheme', JSON.stringify(currentTheme));
    applyTheme(currentTheme);
    alert('Tema salvo com sucesso!');
  };

  const resetTheme = () => {
    const defaultTheme = defaultThemes.default;
    setCurrentTheme(defaultTheme);
    setSelectedPreset('default');
    localStorage.removeItem('radioTheme');
    applyTheme(defaultTheme);
    alert('Tema resetado para o padrão!');
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
    if (!isPreviewMode) {
      applyTheme(currentTheme);
    } else {
      // Reset to saved theme or default
      const savedTheme = localStorage.getItem('radioTheme');
      if (savedTheme) {
        applyTheme(JSON.parse(savedTheme));
      } else {
        applyTheme(defaultThemes.default);
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
        <Palette className="w-5 h-5 text-blue-500" />
        <span>Personalização do Tema</span>
      </h2>

      {/* Preset Themes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Temas Predefinidos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(defaultThemes).map(([name, theme]) => (
            <button
              key={name}
              onClick={() => handlePresetChange(name)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedPreset === name
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex space-x-1 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                ></div>
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                ></div>
              </div>
              <span className="text-white text-sm capitalize">{name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Cores Personalizadas</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {(Object.keys(currentTheme) as Array<keyof ThemeColors>).map((colorKey) => (
            <div key={colorKey} className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 capitalize">
                {colorKey === 'primary' && '🎵 Cor Principal'}
                {colorKey === 'secondary' && '🎨 Cor Secundária'}
                {colorKey === 'accent' && '✨ Cor de Destaque'}
                {colorKey === 'background' && '🌑 Cor de Fundo'}
                {colorKey === 'surface' && '📱 Cor de Superfície'}
                {colorKey === 'text' && '📝 Cor do Texto'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={currentTheme[colorKey]}
                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-600 bg-gray-700"
                />
                <input
                  type="text"
                  value={currentTheme[colorKey]}
                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Preview */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-3">Prévia do Tema</h3>
        <div 
          className="p-4 rounded-lg"
          style={{ 
            backgroundColor: currentTheme.background,
            color: currentTheme.text 
          }}
        >
          <div 
            className="p-3 rounded mb-3"
            style={{ backgroundColor: currentTheme.surface }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: currentTheme.primary }}
              ></div>
              <span style={{ color: currentTheme.text }}>Rádio Tribo FM</span>
            </div>
            <button 
              className="px-4 py-2 rounded text-sm"
              style={{ 
                backgroundColor: currentTheme.primary,
                color: currentTheme.text 
              }}
            >
              Botão Exemplo
            </button>
          </div>
          <div 
            className="text-sm p-2 rounded"
            style={{ backgroundColor: currentTheme.accent + '20' }}
          >
            <span style={{ color: currentTheme.accent }}>
              Elemento de destaque
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={togglePreview}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isPreviewMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>{isPreviewMode ? 'Aplicando Preview' : 'Visualizar'}</span>
        </button>

        <button
          onClick={saveTheme}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Tema</span>
        </button>

        <button
          onClick={resetTheme}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Resetar</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
        <p className="text-blue-300 text-sm">
          💡 <strong>Dica:</strong> Use o botão "Visualizar" para testar as cores antes de salvar. 
          As mudanças serão aplicadas em tempo real no site!
        </p>
      </div>
    </div>
  );
}