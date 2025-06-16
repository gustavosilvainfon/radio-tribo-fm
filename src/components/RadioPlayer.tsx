'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio } from 'lucide-react';
import { useRadio } from '@/context/RadioContext';

interface RadioPlayerProps {
  streamUrl?: string;
}

export default function RadioPlayer({ streamUrl }: RadioPlayerProps) {
  const { isPlaying, setIsPlaying, volume, setVolume, isMuted, setIsMuted } = useRadio();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [radioName, setRadioName] = useState('Rádio Tribo FM');
  const [currentStreamUrl, setCurrentStreamUrl] = useState('https://stm21.srvstm.com:6874/stream');
  const [currentSong, setCurrentSong] = useState('Clique para ouvir ao vivo');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentSongData, setCurrentSongData] = useState<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Load settings from API
    fetchSettings();
    
    // Try autoplay after user interaction
    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      if (!isPlaying && !hasError) {
        setTimeout(() => {
          togglePlay();
        }, 1000);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    // Fetch current song info periodically
    if (isPlaying) {
      fetchCurrentSong();
      const songInterval = setInterval(fetchCurrentSong, 30000); // Every 30 seconds
      return () => clearInterval(songInterval);
    }
  }, [isPlaying]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings?category=streaming');
      const settings = await response.json();
      
      const streamSetting = settings.find((s: any) => s.key === 'radio_stream_url');
      const nameSetting = settings.find((s: any) => s.key === 'radio_name');
      
      if (streamSetting?.value) {
        setCurrentStreamUrl(streamSetting.value);
      }
      if (nameSetting?.value) {
        setRadioName(nameSetting.value);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const fetchCurrentSong = async () => {
    try {
      // First try to get current song from our API
      const response = await fetch('/api/current-song');
      if (response.ok) {
        const songData = await response.json();
        setCurrentSongData(songData);
        setCurrentSong(`${songData.artist} - ${songData.title}`);
        return;
      }
    } catch (error) {
      console.error('Error fetching current song:', error);
    }

    try {
      // Fallback: Try to get current song from stream metadata
      const targetStreamUrl = streamUrl || currentStreamUrl;
      
      // For Shoutcast streams, try to get metadata
      const metadataUrl = targetStreamUrl.replace('/stream', '/7.html') + '?cb=' + Date.now();
      
      const response = await fetch(`/api/stream?url=${encodeURIComponent(metadataUrl)}`);
      if (response.ok) {
        const text = await response.text();
        
        // Parse Shoutcast 7.html format
        if (text.includes(',')) {
          const parts = text.split(',');
          if (parts.length >= 7) {
            const songTitle = parts[6];
            if (songTitle && songTitle.trim() !== '') {
              setCurrentSong(songTitle.trim());
              return;
            }
          }
        }
      }
    } catch (error) {
      // Final fallback to simulated current song
      const fallbackSongs = [
        'Ao Vivo na Rádio Tribo FM',
        'Sua música favorita está tocando',
        'Música ao vivo - Rádio Tribo FM',
        'Sintonize na melhor música',
        'Transmissão ao vivo',
      ];
      
      setCurrentSong(fallbackSongs[Math.floor(Math.random() * fallbackSongs.length)]);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      setIsLoading(true);
      setHasError(false);
      
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const targetUrl = streamUrl || currentStreamUrl;
        console.log('Tentando conectar ao stream:', targetUrl);
        
        // Method 1: Direct connection with cache busting
        await tryDirectConnection(targetUrl);
      }
    } catch (error) {
      console.error('Erro ao reproduzir stream:', error);
      setHasError(true);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const tryDirectConnection = async (url: string) => {
    if (!audioRef.current) return;
    
    try {
      // For Shoutcast/Icecast servers, try multiple approaches
      const attempts = [
        // Method 1: Direct URL with cache buster
        url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now(),
        
        // Method 2: Without cache buster
        url,
        
        // Method 3: Try with different port format (remove :6874 and add /stream)
        url.replace(':6874/stream', '/stream'),
        
        // Method 4: Try with listen.pls format
        url.replace('/stream', '/listen.pls'),
        
        // Method 5: Try with different stream format
        url.replace('/stream', '/;stream.mp3'),
        
        // Method 6: Our own proxy API
        `/api/stream?url=${encodeURIComponent(url)}`,
        
        // Method 7: CORS proxy
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      ];

      for (let i = 0; i < attempts.length; i++) {
        try {
          console.log(`Tentativa ${i + 1}: ${attempts[i]}`);
          
          audioRef.current.src = attempts[i];
          audioRef.current.load();
          
          // Wait a bit for the stream to load
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          await audioRef.current.play();
          
          console.log(`✅ Sucesso na tentativa ${i + 1}`);
          setIsPlaying(true);
          setHasError(false);
          return;
          
        } catch (attemptError) {
          console.log(`❌ Tentativa ${i + 1} falhou:`, attemptError);
          
          if (i === attempts.length - 1) {
            throw new Error('Todas as tentativas falharam');
          }
        }
      }
    } catch (error) {
      console.error('Todas as tentativas de conexão falharam:', error);
      throw error;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow min-w-0">
          <div className="flex items-center space-x-3">
            <Radio className="w-6 h-6 text-blue-500" />
            
            {/* Song Info */}
            <div className="flex flex-col min-w-0 flex-grow">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">{radioName}</span>
                {hasError ? (
                  <span className="text-xs bg-red-600 px-2 py-1 rounded text-white">OFFLINE</span>
                ) : isPlaying ? (
                  <span className="text-xs bg-green-600 px-2 py-1 rounded text-white animate-pulse">AO VIVO</span>
                ) : (
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded text-gray-300">PARADO</span>
                )}
              </div>
              
              {isPlaying ? (
                <span className="text-xs text-gray-300 truncate max-w-xs">
                  Ouvindo ao vivo
                </span>
              ) : (
                <span className="text-xs text-gray-400">Clique para ouvir</span>
              )}
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-3">
              {hasError ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-400">Stream indisponível</span>
                  <button
                    onClick={() => window.open('/admin', '_blank')}
                    className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded transition-colors"
                  >
                    Configurar
                  </button>
                </div>
              ) : isPlaying ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-4 bg-green-500 animate-pulse"></div>
                    <div className="w-1 h-4 bg-green-500 animate-pulse delay-100"></div>
                    <div className="w-1 h-4 bg-green-500 animate-pulse delay-200"></div>
                  </div>

                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors radio-glow disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>
        </div>

        <audio
          ref={audioRef}
          preload="none"
          crossOrigin="anonymous"
          onLoadStart={() => {
            console.log('🔄 Iniciando carregamento do stream...');
            setIsLoading(true);
          }}
          onCanPlay={() => {
            console.log('✅ Stream pronto para reproduzir');
            setIsLoading(false);
            setHasError(false);
          }}
          onCanPlayThrough={() => {
            console.log('✅ Stream completamente carregado');
            setIsLoading(false);
            setHasError(false);
          }}
          onPlaying={() => {
            console.log('▶️ Stream tocando');
            setIsPlaying(true);
            setIsLoading(false);
            setHasError(false);
          }}
          onPause={() => {
            console.log('⏸️ Stream pausado');
            setIsPlaying(false);
          }}
          onEnded={() => {
            console.log('⏹️ Stream finalizado');
            setIsPlaying(false);
          }}
          onError={(e) => {
            const error = e.currentTarget.error;
            console.error('❌ Erro no stream:', {
              code: error?.code,
              message: error?.message,
              src: e.currentTarget.src
            });
            setIsLoading(false);
            setIsPlaying(false);
            setHasError(true);
          }}
          onStalled={() => {
            console.log('⚠️ Stream travado, tentando reconectar...');
            if (isPlaying && audioRef.current) {
              setTimeout(() => {
                audioRef.current?.load();
              }, 2000);
            }
          }}
          onWaiting={() => {
            console.log('⏳ Aguardando dados do stream...');
            setIsLoading(true);
          }}
          onLoadedData={() => {
            console.log('📦 Dados do stream carregados');
            setIsLoading(false);
          }}
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}