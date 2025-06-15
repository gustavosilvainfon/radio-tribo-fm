'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Edit, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  sponsor: string;
  category: string;
  position: 'top' | 'side' | 'bottom' | 'inline';
  isActive: boolean;
  order: number;
  clickCount: number;
}

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    sponsor: '',
    category: '',
    position: 'top' as 'top' | 'side' | 'bottom' | 'inline',
    order: 1,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const bannerData = editingBanner 
        ? { ...editingBanner, ...newBanner }
        : { ...newBanner, isActive: true, clickCount: 0 };

      const response = await fetch('/api/banners', {
        method: editingBanner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bannerData),
      });

      if (response.ok) {
        loadBanners();
        setEditingBanner(null);
        setNewBanner({
          title: '',
          description: '',
          imageUrl: '',
          link: '',
          sponsor: '',
          category: '',
          position: 'top',
          order: banners.length + 1,
        });
        alert(editingBanner ? 'Banner atualizado!' : 'Banner adicionado!');
      } else {
        alert('Erro ao salvar banner');
      }
    } catch (error) {
      console.error('Erro ao salvar banner:', error);
      alert('Erro ao salvar banner');
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm('Tem certeza que deseja remover este banner?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/banners?id=${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadBanners();
        alert('Banner removido!');
      } else {
        alert('Erro ao remover banner');
      }
    } catch (error) {
      console.error('Erro ao remover banner:', error);
      alert('Erro ao remover banner');
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setNewBanner({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      link: banner.link,
      sponsor: banner.sponsor,
      category: banner.category,
      position: banner.position,
      order: banner.order,
    });
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      top: 'Topo da Página',
      side: 'Barra Lateral',
      inline: 'Entre Seções',
      bottom: 'Rodapé',
    };
    return labels[position] || position;
  };

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      top: 'bg-blue-600',
      side: 'bg-green-600',
      inline: 'bg-yellow-600',
      bottom: 'bg-purple-600',
    };
    return colors[position] || 'bg-gray-600';
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Banner Form */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>{editingBanner ? 'Editar Banner' : 'Adicionar Banner'}</span>
        </h2>

        <form onSubmit={handleSaveBanner} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título do Anúncio
            </label>
            <input
              type="text"
              value={newBanner.title}
              onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={newBanner.description}
              onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              rows={3}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Patrocinador
              </label>
              <input
                type="text"
                value={newBanner.sponsor}
                onChange={(e) => setNewBanner({ ...newBanner, sponsor: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                placeholder="Nome da empresa"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoria
              </label>
              <select
                value={newBanner.category}
                onChange={(e) => setNewBanner({ ...newBanner, category: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                required
              >
                <option value="">Selecione...</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Música">Música</option>
                <option value="Educação">Educação</option>
                <option value="Saúde">Saúde</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Varejo">Varejo</option>
                <option value="Serviços">Serviços</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL da Imagem
            </label>
            <input
              type="url"
              value={newBanner.imageUrl}
              onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="https://exemplo.com/banner.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Link de Destino
            </label>
            <input
              type="url"
              value={newBanner.link}
              onChange={(e) => setNewBanner({ ...newBanner, link: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
              placeholder="https://exemplo.com"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Posição no Site
              </label>
              <select
                value={newBanner.position}
                onChange={(e) => setNewBanner({ ...newBanner, position: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                required
              >
                <option value="top">Topo da Página</option>
                <option value="side">Barra Lateral</option>
                <option value="inline">Entre Seções</option>
                <option value="bottom">Rodapé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ordem de Exibição
              </label>
              <input
                type="number"
                min="1"
                value={newBanner.order}
                onChange={(e) => setNewBanner({ ...newBanner, order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{editingBanner ? 'Atualizar' : 'Adicionar'}</span>
            </button>
            {editingBanner && (
              <button
                type="button"
                onClick={() => {
                  setEditingBanner(null);
                  setNewBanner({
                    title: '',
                    description: '',
                    imageUrl: '',
                    link: '',
                    sponsor: '',
                    category: '',
                    position: 'top',
                    order: banners.length + 1,
                  });
                }}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Banners List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <ImageIcon className="w-5 h-5" />
          <span>Banners Ativos ({banners.length})</span>
        </h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {banners.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Nenhum banner cadastrado</p>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {banner.order}
                </div>
                
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  width={60}
                  height={30}
                  className="rounded object-cover"
                  priority={false}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/60x30/374151/ffffff?text=IMG';
                  }}
                />

                <div className="flex-grow min-w-0">
                  <h3 className="font-semibold text-white truncate">{banner.title}</h3>
                  <p className="text-gray-400 truncate text-sm">{banner.sponsor}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded ${getPositionColor(banner.position)} text-white`}>
                      {getPositionLabel(banner.position)}
                    </span>
                    <span className="text-xs text-gray-500">{banner.clickCount} cliques</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Abrir link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}