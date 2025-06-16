import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Song } from '@/lib/models';

interface CurrentSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  imageUrl?: string;
  playedAt: Date;
  duration?: number;
  genres?: string[];
}

// Simulação de música atual (em produção viria do sistema de automação da rádio)
let currentSongData: CurrentSong | null = null;

export async function GET() {
  try {
    await dbConnect();
    
    // Se não há música atual definida, buscar uma aleatória do top 10
    if (!currentSongData) {
      const songs = await Song.find({}).sort({ position: 1 }).limit(10);
      
      if (songs.length === 0) {
        // Usar dados mock se não há músicas no banco
        const mockSongs = [
          {
            id: '1',
            title: 'Flowers',
            artist: 'Miley Cyrus',
            album: 'Endless Summer Vacation',
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
            playedAt: new Date(),
            duration: 200,
            genres: ['Pop', 'Dance']
          },
          {
            id: '2',
            title: 'Anti-Hero',
            artist: 'Taylor Swift',
            album: 'Midnights',
            imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop',
            playedAt: new Date(),
            duration: 180,
            genres: ['Pop', 'Alternative']
          },
          {
            id: '3',
            title: 'As It Was',
            artist: 'Harry Styles',
            album: 'Harry\'s House',
            imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
            playedAt: new Date(),
            duration: 165,
            genres: ['Pop', 'Rock']
          },
          {
            id: '4',
            title: 'Unholy',
            artist: 'Sam Smith ft. Kim Petras',
            album: 'Gloria',
            imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
            playedAt: new Date(),
            duration: 195,
            genres: ['Pop', 'Dance']
          },
          {
            id: '5',
            title: 'Bad Habit',
            artist: 'Steve Lacy',
            album: 'Gemini Rights',
            imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&h=400&fit=crop',
            playedAt: new Date(),
            duration: 170,
            genres: ['R&B', 'Alternative']
          }
        ];
        
        const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)];
        currentSongData = {
          ...randomSong,
          playedAt: new Date()
        };
      } else {
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        currentSongData = {
          id: randomSong._id.toString(),
          title: randomSong.title,
          artist: randomSong.artist,
          album: randomSong.album,
          imageUrl: randomSong.imageUrl,
          playedAt: new Date(),
          duration: randomSong.duration || 180,
          genres: randomSong.genres || ['Pop']
        };
      }
    }

    // Simular mudança de música a cada 3 minutos
    const timeSinceLastPlay = Date.now() - currentSongData.playedAt.getTime();
    const songDuration = (currentSongData.duration || 180) * 1000; // Convert to milliseconds
    
    if (timeSinceLastPlay > songDuration) {
      // Força uma nova música
      currentSongData = null;
      return GET(); // Recursive call to get new song
    }

    return NextResponse.json({
      ...currentSongData,
      progress: Math.min((timeSinceLastPlay / songDuration) * 100, 100)
    });
  } catch (error) {
    console.error('Error fetching current song:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch current song',
        fallback: {
          id: 'fallback',
          title: 'Ao Vivo',
          artist: 'Rádio Tribo FM',
          playedAt: new Date(),
          progress: 0
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar dados da música
    if (!body.title || !body.artist) {
      return NextResponse.json(
        { error: 'Title and artist are required' },
        { status: 400 }
      );
    }

    currentSongData = {
      id: body.id || Date.now().toString(),
      title: body.title,
      artist: body.artist,
      album: body.album,
      imageUrl: body.imageUrl,
      playedAt: new Date(),
      duration: body.duration || 180,
      genres: body.genres || ['Unknown']
    };

    return NextResponse.json(currentSongData, { status: 201 });
  } catch (error) {
    console.error('Error updating current song:', error);
    return NextResponse.json(
      { error: 'Failed to update current song' },
      { status: 500 }
    );
  }
}

// Endpoint para buscar metadados do stream (se disponível)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const streamUrl = searchParams.get('url');
    
    if (!streamUrl) {
      return NextResponse.json(
        { error: 'Stream URL is required' },
        { status: 400 }
      );
    }

    // Tentar buscar metadados do stream
    try {
      // Para streams Shoutcast/Icecast
      const metadataUrl = streamUrl.replace('/stream', '/7.html');
      const response = await fetch(metadataUrl + '?cb=' + Date.now(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RadioTriboFM/1.0)',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        
        // Parse formato 7.html do Shoutcast
        if (text.includes(',')) {
          const parts = text.split(',');
          if (parts.length >= 7) {
            const songInfo = parts[6].trim();
            
            if (songInfo && songInfo !== '') {
              // Tentar fazer parse do formato "Artist - Title"
              const [artist, title] = songInfo.includes(' - ') 
                ? songInfo.split(' - ', 2)
                : ['Rádio Tribo FM', songInfo];
              
              currentSongData = {
                id: Date.now().toString(),
                title: title || songInfo,
                artist: artist || 'Artista Desconhecido',
                playedAt: new Date(),
                duration: 180,
                imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
              };
              
              return NextResponse.json(currentSongData);
            }
          }
        }
      }
    } catch (metadataError) {
      console.log('Metadata fetch failed, using fallback');
    }

    // Fallback para música genérica
    return NextResponse.json({
      id: 'live',
      title: 'Transmissão Ao Vivo',
      artist: 'Rádio Tribo FM',
      playedAt: new Date(),
      progress: 0
    });
    
  } catch (error) {
    console.error('Error fetching stream metadata:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stream metadata' },
      { status: 500 }
    );
  }
}