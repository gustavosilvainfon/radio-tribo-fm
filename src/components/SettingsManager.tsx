'use client';

import { useState, useEffect } from 'react';
import { Save, Settings as SettingsIcon, Globe, Share2, Radio, Calendar, Code } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  category: 'general' | 'social' | 'streaming' | 'programming' | 'custom_code';
  description?: string;
}

export default function SettingsManager() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [activeCategory, setActiveCategory] = useState<'general' | 'social' | 'streaming' | 'programming' | 'custom_code'>('streaming');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categories = [
    { key: 'streaming', label: 'Streaming', icon: Radio, color: 'bg-red-600' },
    { key: 'general', label: 'Geral', icon: SettingsIcon, color: 'bg-blue-600' },
    { key: 'social', label: 'Redes Sociais', icon: Share2, color: 'bg-pink-600' },
    { key: 'programming', label: 'Programação', icon: Calendar, color: 'bg-green-600' },
    { key: 'custom_code', label: 'Código Custom', icon: Code, color: 'bg-purple-600' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => prev.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const saveSettings = async () => {
    setSaving(true);
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        alert('Configurações salvas com sucesso!');
        // Reload page to apply changes
        window.location.reload();
      } else {
        alert('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const getCurrentSettings = () => {
    return settings.filter(setting => setting.category === activeCategory);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Categories Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-bold text-white mb-4">Categorias</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.key}
                  onClick={() => setActiveCategory(category.key as any)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeCategory === category.key
                      ? `${category.color} text-white`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="lg:col-span-3">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {categories.find(c => c.key === activeCategory)?.label}
            </h2>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Salvando...' : 'Salvar Tudo'}</span>
            </button>
          </div>

          <div className="space-y-6">
            {getCurrentSettings().map((setting) => (
              <div key={setting.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {setting.description || setting.key}
                </label>
                
                {setting.category === 'custom_code' ? (
                  <textarea
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white font-mono text-sm"
                    rows={setting.key === 'custom_css' ? 10 : 5}
                    placeholder={
                      setting.key === 'custom_header' ? '<script>...</script> ou <style>...</style>' :
                      setting.key === 'custom_footer' ? '<script>...</script>' :
                      setting.key === 'custom_css' ? '/* CSS personalizado */\n.minha-classe {\n  color: #fff;\n}' :
                      setting.key === 'google_analytics' ? '<!-- Google Analytics -->\n<script async src="...">...'
                      : 'Digite o código...'
                    }
                  />
                ) : setting.key.includes('url') ? (
                  <input
                    type="url"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="https://exemplo.com"
                  />
                ) : setting.key.includes('phone') || setting.key.includes('number') ? (
                  <input
                    type="tel"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="5511999999999"
                  />
                ) : (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  />
                )}
                
                {setting.key === 'radio_stream_url' && (
                  <div className="mt-2 p-3 bg-blue-900/20 border border-blue-500/20 rounded">
                    <p className="text-blue-300 text-sm">
                      <strong>Dica:</strong> Cole aqui a URL exata do seu stream. Exemplo: https://stm21.srvstm.com:6874/stream
                    </p>
                  </div>
                )}
                
                {setting.category === 'custom_code' && (
                  <div className="mt-2 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded">
                    <p className="text-yellow-300 text-sm">
                      <strong>Atenção:</strong> Código personalizado pode afetar o funcionamento do site. Teste sempre em ambiente de desenvolvimento.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {activeCategory === 'streaming' && (
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Como configurar o streaming</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>1. <strong>Obtenha a URL</strong> do seu provedor de streaming</p>
                <p>2. <strong>Cole a URL completa</strong> no campo acima</p>
                <p>3. <strong>Clique em "Salvar Tudo"</strong></p>
                <p>4. <strong>Teste o player</strong> na página principal</p>
              </div>
            </div>
          )}

          {activeCategory === 'social' && (
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Redes Sociais</h4>
              <p className="text-sm text-gray-300">
                Configure os links das suas redes sociais. Eles aparecerão no footer do site e em outras seções.
              </p>
            </div>
          )}

          {activeCategory === 'programming' && (
            <div className="mt-8 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-lg font-semibold text-white mb-3">Programação da Rádio</h4>
              <p className="text-sm text-gray-300">
                Configure os horários e nomes dos seus programas. Eles aparecerão no footer e na seção da equipe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}