'use client';

import { useState, useEffect } from 'react';
import { Music, TrendingUp, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { Song } from '@/types';

export default function TopSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSongs();
  }, []);

  const fetchTopSongs = async () => {
    try {
      const response = await fetch('/api/songs');
      const data = await response.json();
      setSongs(data);
    } catch (error) {
      console.error('Erro ao buscar músicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayedSongs = showAll ? songs : songs.slice(0, 10);

  if (loading) {
    return (
      <section id="top-songs" className="py-12 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Carregando top músicas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="top-songs" className="py-12 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold">Top Músicas</h2>
          </div>
          <p className="text-gray-400">As mais tocadas na Rádio Tribo FM</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {displayedSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma música encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedSongs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer group"
                  onClick={() => {
                    console.log(`Tocando: ${song.title} - ${song.artist}`);
                    // Aqui você pode adicionar integração com Spotify/Apple Music
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {song.position}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <Image
                      src={song.imageUrl}
                      alt={`${song.title} - ${song.artist}`}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                      priority={index < 3}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/60x60/374151/ffffff?text=♪';
                      }}
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-white truncate">{song.title}</h3>
                    <p className="text-gray-400 truncate">{song.artist}</p>
                    {song.album && (
                      <p className="text-sm text-gray-500 truncate">{song.album}</p>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm text-gray-400">
                      {song.plays.toLocaleString()} plays
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {songs.length > 10 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {showAll ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    <span>Ver Menos</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    <span>Ver Ranking Completo</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}