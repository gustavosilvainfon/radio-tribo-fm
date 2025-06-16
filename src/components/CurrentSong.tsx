'use client';

import { useState, useEffect } from 'react';
import { Music, Clock, User, Disc3 } from 'lucide-react';
import Image from 'next/image';
import { useRadio } from '@/context/RadioContext';

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

interface CurrentSongProps {
  className?: string;
}

export default function CurrentSong({ className = '' }: CurrentSongProps) {
  const { isPlaying } = useRadio();
  const [currentSong, setCurrentSong] = useState<CurrentSongData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchCurrentSong();
    
    // Atualizar a cada 30 segundos quando tocando
    if (isPlaying) {
      const interval = setInterval(fetchCurrentSong, 30000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  useEffect(() => {
    // Atualizar progresso da música a cada segundo
    if (currentSong && isPlaying) {
      const progressInterval = setInterval(() => {
        const timeSincePlay = Date.now() - new Date(currentSong.playedAt).getTime();
        const duration = (currentSong.duration || 180) * 1000;
        const newProgress = Math.min((timeSincePlay / duration) * 100, 100);
        setProgress(newProgress);
        
        // Se a música terminou, buscar nova
        if (newProgress >= 100) {
          fetchCurrentSong();
        }
      }, 1000);
      
      return () => clearInterval(progressInterval);
    }
  }, [currentSong, isPlaying]);

  const fetchCurrentSong = async () => {
    try {
      const response = await fetch('/api/current-song');
      if (response.ok) {
        const data = await response.json();
        setCurrentSong(data);
        setProgress(data.progress || 0);
      }
    } catch (error) {
      console.error('Error fetching current song:', error);
      // Fallback data
      setCurrentSong({
        id: 'fallback',
        title: 'Rádio Tribo FM',
        artist: 'Transmissão Ao Vivo',
        playedAt: new Date(),
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
      });
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 animate-pulse ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-gray-400">
          <Music className="w-5 h-5" />
          <span>Nenhuma música tocando</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-4 shadow-lg ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Album Art */}
        <div className="relative w-16 h-16 flex-shrink-0">
          {currentSong.imageUrl ? (
            <Image
              src={currentSong.imageUrl}
              alt={`${currentSong.title} - ${currentSong.artist}`}
              width={64}
              height={64}
              className="rounded-lg object-cover"
              unoptimized
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
          )}
          
          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-white font-semibold truncate text-lg">
              {currentSong.title}
            </h3>
            {isPlaying && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                <div className="w-1 h-4 bg-green-500 animate-pulse delay-100"></div>
                <div className="w-1 h-4 bg-green-500 animate-pulse delay-200"></div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-gray-300 mb-2">
            <User className="w-4 h-4" />
            <span className="truncate">{currentSong.artist}</span>
          </div>
          
          {currentSong.album && (
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-2">
              <Disc3 className="w-3 h-3" />
              <span className="truncate">{currentSong.album}</span>
            </div>
          )}

          {/* Progress Bar */}
          {isPlaying && currentSong.duration && (
            <div className="space-y-1">
              <div className="w-full bg-gray-600 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{getCurrentTime()}</span>
                </span>
                <span>{getTotalTime()}</span>
              </div>
            </div>
          )}

          {/* Genres */}
          {currentSong.genres && currentSong.genres.length > 0 && (
            <div className="flex space-x-1 mt-2">
              {currentSong.genres.slice(0, 2).map((genre, index) => (
                <span 
                  key={index}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Now Playing Label */}
      {isPlaying && (
        <div className="mt-3 pt-3 border-t border-gray-600">
          <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-medium">TOCANDO AGORA</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}