'use client';

import { useState, useEffect } from 'react';
import { Music, TrendingUp, Eye, EyeOff, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Song } from '@/types';

export default function TopSongsSidebar() {
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

  const displayedSongs = showAll ? songs : songs.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 sticky top-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-bold text-white">Top Músicas</h3>
        </div>
        <p className="text-gray-400 text-sm">Mais tocadas na rádio</p>
      </div>

      {displayedSongs.length === 0 ? (
        <div className="text-center py-8">
          <Music className="w-12 h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Nenhuma música encontrada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {song.position}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Image
                  src={song.imageUrl}
                  alt={`${song.title} - ${song.artist}`}
                  width={40}
                  height={40}
                  className="rounded-md object-cover"
                  priority={index < 3}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/40x40/374151/ffffff?text=♪';
                  }}
                />
              </div>

              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                  {song.title}
                </h4>
                <p className="text-gray-400 text-xs truncate">{song.artist}</p>
              </div>

              <div className="flex-shrink-0">
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {songs.length > 5 && (
        <div className="mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
          >
            {showAll ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Ver Menos</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Ver Todos ({songs.length})</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-700">
        <Link
          href="#top-songs"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors flex items-center justify-center space-x-1"
        >
          <span>Ver ranking completo</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}