'use client';

import { useState, useEffect } from 'react';
import { Lock, Music, Settings, Save, Plus, Trash2, Edit, ArrowLeft, Palette, Users, Image as ImageIcon, Gift, Cog, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import TeamManager from '@/components/TeamManager';
import BannerManager from '@/components/BannerManager';
import PromotionManager from '@/components/PromotionManager';
import SettingsManager from '@/components/SettingsManager';
import SEOManager from '@/components/SEOManager';
import { Song } from '@/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [activeTab, setActiveTab] = useState<'songs' | 'team' | 'banners' | 'promotions' | 'settings' | 'theme' | 'seo'>('songs');
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    imageUrl: '',
    position: 1,
  });

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/auth', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        loadSongs();
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('adminToken');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        loadSongs();
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Error loading songs:', error);
    }
  };

  const handleSaveSong = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const songData = editingSong 
        ? { ...editingSong, ...newSong }
        : { ...newSong, plays: 0 };

      const response = await fetch('/api/songs', {
        method: editingSong ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(songData),
      });

      if (response.ok) {
        loadSongs();
        setEditingSong(null);
        setNewSong({
          title: '',
          artist: '',
          album: '',
          imageUrl: '',
          position: songs.length + 1,
        });
        alert(editingSong ? 'Música atualizada!' : 'Música adicionada!');
      } else {
        alert('Erro ao salvar música');
      }
    } catch (error) {
      console.error('Error saving song:', error);
      alert('Erro ao salvar música');
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta música?')) return;

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`/api/songs?id=${songId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        loadSongs();
        alert('Música deletada!');
      } else {
        alert('Erro ao deletar música');
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Erro ao deletar música');
    }
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setNewSong({
      title: song.title,
      artist: song.artist,
      album: song.album || '',
      imageUrl: song.imageUrl,
      position: song.position,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white">Área Administrativa</h1>
              <p className="text-gray-400 mt-2">Entre com suas credenciais</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao site</span>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Credenciais padrão:</strong><br />
                Usuário: admin<br />
                Senha: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('songs')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'songs'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Music className="w-5 h-5" />
            <span>Músicas</span>
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'team'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Equipe</span>
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'banners'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Banners</span>
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'promotions'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Gift className="w-5 h-5" />
            <span>Promoções</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Cog className="w-5 h-5" />
            <span>Configurações</span>
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'theme'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Palette className="w-5 h-5" />
            <span>Tema</span>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              activeTab === 'seo'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>SEO</span>
          </button>
        </div>

        {/* Songs Management */}
        {activeTab === 'songs' && (
          <div className="grid lg:grid-cols-2 gap-8">
          {/* Song Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>{editingSong ? 'Editar Música' : 'Adicionar Música'}</span>
            </h2>

            <form onSubmit={handleSaveSong} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newSong.title}
                  onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Artista
                </label>
                <input
                  type="text"
                  value={newSong.artist}
                  onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Álbum (opcional)
                </label>
                <input
                  type="text"
                  value={newSong.album}
                  onChange={(e) => setNewSong({ ...newSong, album: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  value={newSong.imageUrl}
                  onChange={(e) => setNewSong({ ...newSong, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Posição no Ranking
                </label>
                <input
                  type="number"
                  min="1"
                  value={newSong.position}
                  onChange={(e) => setNewSong({ ...newSong, position: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingSong ? 'Atualizar' : 'Adicionar'}</span>
                </button>
                {editingSong && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSong(null);
                      setNewSong({
                        title: '',
                        artist: '',
                        album: '',
                        imageUrl: '',
                        position: songs.length + 1,
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

          {/* Songs List */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Music className="w-5 h-5" />
              <span>Ranking Atual ({songs.length} músicas)</span>
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {songs.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Nenhuma música cadastrada</p>
              ) : (
                songs.map((song) => (
                  <div key={song.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {song.position}
                    </div>
                    
                    <Image
                      src={song.imageUrl}
                      alt={song.title}
                      width={50}
                      height={50}
                      className="rounded-lg object-cover"
                      priority={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/50x50/374151/ffffff?text=♪';
                      }}
                    />

                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-gray-400 truncate">{song.artist}</p>
                      <p className="text-xs text-gray-500">{song.plays} plays</p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditSong(song)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSong(song.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Deletar"
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
        )}

        {/* Team Management */}
        {activeTab === 'team' && (
          <div className="max-w-7xl mx-auto">
            <TeamManager />
          </div>
        )}

        {/* Banner Management */}
        {activeTab === 'banners' && (
          <div className="max-w-7xl mx-auto">
            <BannerManager />
          </div>
        )}

        {/* Promotion Management */}
        {activeTab === 'promotions' && (
          <div className="max-w-7xl mx-auto">
            <PromotionManager />
          </div>
        )}

        {/* Settings Management */}
        {activeTab === 'settings' && (
          <div className="max-w-7xl mx-auto">
            <SettingsManager />
          </div>
        )}

        {/* Theme Customization */}
        {activeTab === 'theme' && (
          <div className="max-w-4xl mx-auto">
            <ThemeCustomizer />
          </div>
        )}

        {/* SEO Management */}
        {activeTab === 'seo' && (
          <div className="max-w-7xl mx-auto">
            <SEOManager />
          </div>
        )}
      </div>
    </div>
  );
}