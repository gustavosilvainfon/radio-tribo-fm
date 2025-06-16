'use client';

import { useState, useEffect } from 'react';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';

export default function BrandingManager() {
  const [branding, setBranding] = useState({
    logo: '',
    favicon: '',
    radioName: 'Rádio Tribo FM',
    tagline: 'A Sua Música, A Sua Tribo'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadBranding();
  }, []);

  const loadBranding = async () => {
    try {
      const response = await fetch('/api/settings?category=branding');
      const settings = await response.json();
      
      const brandingData: any = {};
      settings.forEach((setting: any) => {
        brandingData[setting.key] = setting.value;
      });
      
      setBranding(prev => ({ ...prev, ...brandingData }));
    } catch (error) {
      console.error('Erro ao carregar branding:', error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    
    try {
      const promises = Object.entries(branding).map(([key, value]) =>
        fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            key,
            value,
            category: 'branding',
            description: getBrandingDescription(key)
          }),
        })
      );

      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Recarregar página para aplicar mudanças
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao salvar branding:', error);
      alert('Erro ao salvar configurações de marca');
    }
  };

  const getBrandingDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      logo: 'URL da logo da rádio',
      favicon: 'URL do favicon (ícone do site)',
      radioName: 'Nome da rádio',
      tagline: 'Slogan/tagline da rádio'
    };
    return descriptions[key] || '';
  };

  const logoSuggestions = [
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=80&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=80&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=80&fit=crop&auto=format&q=80'
  ];

  const faviconSuggestions = [
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=32&h=32&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=32&h=32&fit=crop&auto=format&q=80',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=32&h=32&fit=crop&auto=format&q=80'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ImageIcon className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Logo e Identidade</h2>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg transition-colors ${
            saved 
              ? 'bg-green-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save className="w-4 h-4 inline mr-2" />
          {saved ? 'Salvo!' : 'Salvar'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Logo */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Logo da Rádio</h3>
          
          {/* Preview */}
          {branding.logo && (
            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">Preview:</p>
              <img
                src={branding.logo}
                alt="Logo preview"
                className="h-12 max-w-full object-contain bg-white rounded p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL da Logo
              </label>
              <input
                type="url"
                value={branding.logo}
                onChange={(e) => setBranding(prev => ({...prev, logo: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="https://exemplo.com/logo.png"
              />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Logos sugeridas:</p>
              <div className="grid grid-cols-3 gap-2">
                {logoSuggestions.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setBranding(prev => ({...prev, logo: url}))}
                    className="relative h-16 border-2 border-gray-600 hover:border-blue-500 rounded-lg overflow-hidden transition-colors"
                  >
                    <img
                      src={url}
                      alt={`Logo opção ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Favicon</h3>
          
          {/* Preview */}
          {branding.favicon && (
            <div className="mb-4 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">Preview:</p>
              <img
                src={branding.favicon}
                alt="Favicon preview"
                className="w-8 h-8 rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL do Favicon
              </label>
              <input
                type="url"
                value={branding.favicon}
                onChange={(e) => setBranding(prev => ({...prev, favicon: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="https://exemplo.com/favicon.ico"
              />
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-2">Favicons sugeridos:</p>
              <div className="grid grid-cols-3 gap-2">
                {faviconSuggestions.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setBranding(prev => ({...prev, favicon: url}))}
                    className="relative w-12 h-12 border-2 border-gray-600 hover:border-blue-500 rounded-lg overflow-hidden transition-colors flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt={`Favicon opção ${index + 1}`}
                      className="w-8 h-8 object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nome da Rádio */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Nome da Rádio</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome
              </label>
              <input
                type="text"
                value={branding.radioName}
                onChange={(e) => setBranding(prev => ({...prev, radioName: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slogan/Tagline
              </label>
              <input
                type="text"
                value={branding.tagline}
                onChange={(e) => setBranding(prev => ({...prev, tagline: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        {/* Preview Geral */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Preview da Marca</h3>
          
          <div className="space-y-4">
            {/* Header Preview */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {branding.logo ? (
                  <img
                    src={branding.logo}
                    alt="Logo"
                    className="h-8 max-w-24 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📻</span>
                  </div>
                )}
                
                <div>
                  <h4 className="text-white font-semibold">{branding.radioName}</h4>
                  <p className="text-gray-400 text-sm">{branding.tagline}</p>
                </div>
              </div>
            </div>

            {/* Browser Tab Preview */}
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-2">Como aparece na aba do navegador:</p>
              <div className="flex items-center space-x-2 bg-gray-600 rounded p-2">
                {branding.favicon ? (
                  <img
                    src={branding.favicon}
                    alt="Favicon"
                    className="w-4 h-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                )}
                <span className="text-white text-sm">{branding.radioName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <h4 className="text-blue-300 font-semibold mb-2">📝 Instruções</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• <strong>Logo:</strong> Use imagem PNG/SVG com fundo transparente (recomendado: 200x80px)</li>
          <li>• <strong>Favicon:</strong> Use imagem quadrada 32x32px ou 64x64px</li>
          <li>• <strong>URLs:</strong> Use links diretos do Unsplash, Imgur ou seu próprio servidor</li>
          <li>• <strong>Aplicação:</strong> Mudanças são aplicadas após salvar e recarregar a página</li>
        </ul>
      </div>
    </div>
  );
}