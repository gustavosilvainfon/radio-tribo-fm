'use client';

import { useState, useEffect } from 'react';
import { Save, Search, Globe, Tag, FileText } from 'lucide-react';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData: string;
  robots: string;
  canonicalUrl: string;
  author: string;
  language: string;
  themeColor: string;
}

export default function SEOManager() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: 'Rádio Tribo FM - A Sua Música, A Sua Tribo',
    description: 'Rádio Tribo FM - A melhor música, chat ao vivo, notícias atualizadas e programação especial. Ouça ao vivo 24/7 e junte-se à nossa tribo musical!',
    keywords: 'radio, música, ao vivo, streaming, chat, notícias, sertanejo, pop, rock, tribo fm',
    ogTitle: 'Rádio Tribo FM - Música Ao Vivo 24/7',
    ogDescription: 'A melhor música está aqui! Chat interativo, notícias em tempo real e os maiores sucessos. Faça parte da nossa tribo!',
    ogImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Rádio Tribo FM 🎵',
    twitterDescription: 'Sua música favorita ao vivo! Participe do chat e descubra novos hits todos os dias.',
    twitterImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=630&fit=crop',
    structuredData: '',
    robots: 'index, follow',
    canonicalUrl: '',
    author: 'Rádio Tribo FM',
    language: 'pt-BR',
    themeColor: '#1f2937'
  });

  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSEOSettings();
  }, []);

  const loadSEOSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=seo');
      const settings = await response.json();
      
      if (settings.length > 0) {
        const seoData: any = {};
        settings.forEach((setting: any) => {
          seoData[setting.key] = setting.value;
        });
        setSeoSettings(prev => ({ ...prev, ...seoData }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de SEO:', error);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    
    try {
      const promises = Object.entries(seoSettings).map(([key, value]) =>
        fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            key,
            value,
            category: 'seo',
            description: getFieldDescription(key)
          }),
        })
      );

      await Promise.all(promises);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Atualizar meta tags dinâmicamente
      updateMetaTags();
      
    } catch (error) {
      console.error('Erro ao salvar configurações de SEO:', error);
      alert('Erro ao salvar configurações de SEO');
    }
  };

  const updateMetaTags = () => {
    // Atualizar title
    document.title = seoSettings.title;
    
    // Atualizar meta description
    updateMetaTag('description', seoSettings.description);
    updateMetaTag('keywords', seoSettings.keywords);
    updateMetaTag('author', seoSettings.author);
    updateMetaTag('robots', seoSettings.robots);
    
    // Open Graph
    updateMetaTag('og:title', seoSettings.ogTitle, 'property');
    updateMetaTag('og:description', seoSettings.ogDescription, 'property');
    updateMetaTag('og:image', seoSettings.ogImage, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:locale', seoSettings.language, 'property');
    
    // Twitter
    updateMetaTag('twitter:card', seoSettings.twitterCard);
    updateMetaTag('twitter:title', seoSettings.twitterTitle);
    updateMetaTag('twitter:description', seoSettings.twitterDescription);
    updateMetaTag('twitter:image', seoSettings.twitterImage);
    
    // Theme color
    updateMetaTag('theme-color', seoSettings.themeColor);
  };

  const updateMetaTag = (name: string, content: string, attribute = 'name') => {
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  const getFieldDescription = (key: string): string => {
    const descriptions: { [key: string]: string } = {
      title: 'Título principal da página (60 caracteres)',
      description: 'Descrição da página (150-160 caracteres)',
      keywords: 'Palavras-chave separadas por vírgula',
      ogTitle: 'Título para redes sociais',
      ogDescription: 'Descrição para redes sociais',
      ogImage: 'Imagem para compartilhamento (1200x630px)',
      twitterCard: 'Tipo de card do Twitter',
      twitterTitle: 'Título específico para Twitter',
      twitterDescription: 'Descrição específica para Twitter',
      twitterImage: 'Imagem específica para Twitter',
      robots: 'Instruções para robôs de busca',
      canonicalUrl: 'URL canônica da página',
      author: 'Autor do conteúdo',
      language: 'Idioma do site',
      themeColor: 'Cor do tema do navegador'
    };
    return descriptions[key] || '';
  };

  const generateStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RadioStation",
      "name": "Rádio Tribo FM",
      "description": seoSettings.description,
      "url": seoSettings.canonicalUrl || "https://radiotribofm.com.br",
      "logo": seoSettings.ogImage,
      "sameAs": [
        "https://facebook.com/radiotribofm",
        "https://instagram.com/radiotribofm",
        "https://twitter.com/radiotribofm"
      ],
      "broadcastAffiliateOf": {
        "@type": "Organization",
        "name": "Rádio Tribo FM"
      },
      "genre": ["Pop", "Sertanejo", "Rock", "MPB"],
      "audience": {
        "@type": "Audience",
        "geographicArea": "Brasil"
      }
    };
    
    setSeoSettings(prev => ({
      ...prev,
      structuredData: JSON.stringify(structuredData, null, 2)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Search className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Configurações de SEO</h2>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreview(!preview)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {preview ? 'Ocultar' : 'Preview'}
          </button>
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
      </div>

      {/* Preview do Google */}
      {preview && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Preview do Google</h3>
          <div className="bg-white rounded-lg p-4 text-black">
            <div className="text-blue-600 text-xl hover:underline cursor-pointer">
              {seoSettings.title}
            </div>
            <div className="text-green-700 text-sm">
              {seoSettings.canonicalUrl || 'https://radiotribofm.com.br'}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              {seoSettings.description}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Meta Tags Básicas */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Meta Tags Básicas
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título da Página ({seoSettings.title.length}/60)
              </label>
              <input
                type="text"
                value={seoSettings.title}
                onChange={(e) => setSeoSettings(prev => ({...prev, title: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descrição ({seoSettings.description.length}/160)
              </label>
              <textarea
                value={seoSettings.description}
                onChange={(e) => setSeoSettings(prev => ({...prev, description: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={3}
                maxLength={160}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Palavras-chave (separadas por vírgula)
              </label>
              <input
                type="text"
                value={seoSettings.keywords}
                onChange={(e) => setSeoSettings(prev => ({...prev, keywords: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Robots
                </label>
                <select
                  value={seoSettings.robots}
                  onChange={(e) => setSeoSettings(prev => ({...prev, robots: e.target.value}))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, nofollow">NoIndex, NoFollow</option>
                  <option value="index, nofollow">Index, NoFollow</option>
                  <option value="noindex, follow">NoIndex, Follow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Idioma
                </label>
                <select
                  value={seoSettings.language}
                  onChange={(e) => setSeoSettings(prev => ({...prev, language: e.target.value}))}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Open Graph */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Open Graph (Facebook)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OG Título
              </label>
              <input
                type="text"
                value={seoSettings.ogTitle}
                onChange={(e) => setSeoSettings(prev => ({...prev, ogTitle: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OG Descrição
              </label>
              <textarea
                value={seoSettings.ogDescription}
                onChange={(e) => setSeoSettings(prev => ({...prev, ogDescription: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OG Imagem (1200x630px)
              </label>
              <input
                type="url"
                value={seoSettings.ogImage}
                onChange={(e) => setSeoSettings(prev => ({...prev, ogImage: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>
        </div>

        {/* Twitter Cards */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Twitter Cards
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Card
              </label>
              <select
                value={seoSettings.twitterCard}
                onChange={(e) => setSeoSettings(prev => ({...prev, twitterCard: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Twitter Título
              </label>
              <input
                type="text"
                value={seoSettings.twitterTitle}
                onChange={(e) => setSeoSettings(prev => ({...prev, twitterTitle: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Twitter Descrição
              </label>
              <textarea
                value={seoSettings.twitterDescription}
                onChange={(e) => setSeoSettings(prev => ({...prev, twitterDescription: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Twitter Imagem
              </label>
              <input
                type="url"
                value={seoSettings.twitterImage}
                onChange={(e) => setSeoSettings(prev => ({...prev, twitterImage: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>
          </div>
        </div>

        {/* Dados Estruturados */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Schema.org / Dados Estruturados
          </h3>
          
          <div className="space-y-4">
            <button
              onClick={generateStructuredData}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Gerar Schema Automático
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                JSON-LD Schema
              </label>
              <textarea
                value={seoSettings.structuredData}
                onChange={(e) => setSeoSettings(prev => ({...prev, structuredData: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-xs"
                rows={8}
                placeholder="JSON-LD será gerado automaticamente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL Canônica
              </label>
              <input
                type="url"
                value={seoSettings.canonicalUrl}
                onChange={(e) => setSeoSettings(prev => ({...prev, canonicalUrl: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="https://radiotribofm.com.br"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cor do Tema
              </label>
              <input
                type="color"
                value={seoSettings.themeColor}
                onChange={(e) => setSeoSettings(prev => ({...prev, themeColor: e.target.value}))}
                className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dicas de SEO */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">💡 Dicas de SEO</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-200">
          <ul className="space-y-2">
            <li>• Título: máximo 60 caracteres</li>
            <li>• Descrição: entre 150-160 caracteres</li>
            <li>• Use palavras-chave relevantes</li>
            <li>• Imagens OG: 1200x630 pixels</li>
          </ul>
          <ul className="space-y-2">
            <li>• Mantenha URLs limpa e descritiva</li>
            <li>• Atualize conteúdo regularmente</li>
            <li>• Use dados estruturados</li>
            <li>• Configure sitemap.xml</li>
          </ul>
        </div>
      </div>
    </div>
  );
}