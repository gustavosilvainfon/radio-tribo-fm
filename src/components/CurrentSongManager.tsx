'use client';

import { useState, useEffect } from 'react';
import { Save, Music, Clock, RefreshCw } from 'lucide-react';

interface CurrentSongData {
  id: string;
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  playedAt: Date;
  duration?: number;
  genres?: string[];
  progress?: number;
}

export default function CurrentSongManager() {
  const [currentSong, setCurrentSong] = useState<CurrentSongData | null>(null);
  const [manualSong, setManualSong] = useState({
    title: '',
    artist: '',
    album: '',
    duration: 180
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchCurrentSong();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchCurrentSong, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchCurrentSong = async () => {
    try {
      const response = await fetch('/api/current-song');
      if (response.ok) {
        const data = await response.json();
        setCurrentSong(data);
      }
    } catch (error) {
      console.error('Erro ao buscar música atual:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetManualSong = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualSong.title || !manualSong.artist) {
      alert('Título e artista são obrigatórios');
      return;
    }

    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch('/api/current-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: manualSong.title,
          artist: manualSong.artist,
          album: manualSong.album,
          duration: manualSong.duration,
          imageUrl: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format&q=80&seed=${Date.now()}`
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchCurrentSong();
        setManualSong({ title: '', artist: '', album: '', duration: 180 });
      } else {
        alert('Erro ao definir música atual');
      }
    } catch (error) {
      console.error('Erro ao definir música:', error);
      alert('Erro ao definir música atual');
    }
  };

  const handleForceRefresh = async () => {
    setLoading(true);
    
    try {
      // Força uma nova música chamando o endpoint PUT
      const response = await fetch('/api/current-song', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ forceNew: true }),
      });

      if (response.ok) {
        fetchCurrentSong();
      }
    } catch (error) {
      console.error('Erro ao atualizar música:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    if (!currentSong) return '0:00';
    const elapsed = Math.floor((Date.now() - new Date(currentSong.playedAt).getTime()) / 1000);
    return formatTime(elapsed);
  };

  const getTotalTime = () => {
    return formatTime(currentSong?.duration || 180);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Música Atual</h2>
        </div>
        <button
          onClick={handleForceRefresh}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Música Atual */}
      {currentSong && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🎵 Tocando Agora</h3>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-xl font-bold text-white">{currentSong.title}</h4>
              <p className="text-gray-300">{currentSong.artist}</p>
              {currentSong.album && (
                <p className="text-gray-400 text-sm">{currentSong.album}</p>
              )}
              
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{getCurrentTime()} / {getTotalTime()}</span>
                </div>
                {currentSong.progress && (
                  <span>{Math.round(currentSong.progress)}% concluído</span>
                )}
              </div>
              
              {currentSong.progress && (
                <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${currentSong.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Definir Música Manual */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🎛️ Definir Música Manualmente</h3>
        <p className="text-gray-400 text-sm mb-4">
          Use esta opção para definir manualmente qual música está tocando, 
          substituindo a detecção automática.
        </p>
        
        <form onSubmit={handleSetManualSong} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Título da Música *
              </label>
              <input
                type="text"
                value={manualSong.title}
                onChange={(e) => setManualSong(prev => ({...prev, title: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Nome da música"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Artista *
              </label>
              <input
                type="text"
                value={manualSong.artist}
                onChange={(e) => setManualSong(prev => ({...prev, artist: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Nome do artista"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Álbum (opcional)
              </label>
              <input
                type="text"
                value={manualSong.album}
                onChange={(e) => setManualSong(prev => ({...prev, album: e.target.value}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Nome do álbum"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duração (segundos)
              </label>
              <input
                type="number"
                min="30"
                max="600"
                value={manualSong.duration}
                onChange={(e) => setManualSong(prev => ({...prev, duration: parseInt(e.target.value)}))}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg transition-colors ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save className="w-4 h-4 inline mr-2" />
            {saved ? 'Música Definida!' : 'Definir Como Música Atual'}
          </button>
        </form>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <h4 className="text-blue-300 font-semibold mb-2">ℹ️ Como Funciona</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• <strong>Automático:</strong> Tenta buscar do stream real primeiro</li>
          <li>• <strong>Playlist Variada:</strong> Usa músicas diversas (não só top 10)</li>
          <li>• <strong>Manual:</strong> Você pode definir qualquer música</li>
          <li>• <strong>Rotação:</strong> Muda automaticamente baseado na duração</li>
        </ul>
      </div>
    </div>
  );
}