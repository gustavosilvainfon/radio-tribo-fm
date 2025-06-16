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

// Lista de músicas diversas para simular programação real (não apenas top 10)
const radioPlaylist = [
  // Sertanejo
  { title: 'Evidências', artist: 'Chitãozinho & Xororó', album: 'Clássicos Sertanejos', duration: 210, genres: ['Sertanejo'] },
  { title: 'Ai Se Eu Te Pego', artist: 'Michel Teló', album: 'Na Balada', duration: 180, genres: ['Sertanejo'] },
  { title: 'Fico Assim Sem Você', artist: 'Adriana Calcanhotto', album: 'Senhas', duration: 195, genres: ['MPB'] },
  
  // Pop Nacional
  { title: 'Masculino Feminino', artist: 'Pepeu Gomes', album: 'Rock Nacional', duration: 240, genres: ['Rock'] },
  { title: 'Toda Forma de Amor', artist: 'Lulu Santos', album: 'Pop Rock', duration: 225, genres: ['Pop', 'Rock'] },
  { title: 'Sozinho', artist: 'Caetano Veloso', album: 'MPB Moderna', duration: 200, genres: ['MPB'] },
  
  // Internacional 
  { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, genres: ['Pop'] },
  { title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: 174, genres: ['Pop'] },
  { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: 203, genres: ['Pop', 'Dance'] },
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', album: 'SOUR', duration: 178, genres: ['Pop', 'Rock'] },
  { title: 'Industry Baby', artist: 'Lil Nas X ft. Jack Harlow', album: 'MONTERO', duration: 212, genres: ['Hip-Hop'] },
  
  // Clássicos
  { title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', duration: 391, genres: ['Rock'] },
  { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', duration: 355, genres: ['Rock'] },
  { title: 'Imagine', artist: 'John Lennon', album: 'Imagine', duration: 183, genres: ['Rock'] },
  
  // Brasileiros Diversos
  { title: 'Aquarela', artist: 'Toquinho', album: 'MPB Infantil', duration: 190, genres: ['MPB'] },
  { title: 'O Sol', artist: 'Jota Quest', album: 'Rock Pop BR', duration: 210, genres: ['Pop', 'Rock'] },
  { title: 'Skank', artist: 'É Uma Partida de Futebol', album: 'Rock Mineiro', duration: 195, genres: ['Rock'] },
];

// Função para tentar buscar metadados reais do stream
async function tryGetStreamMetadata(): Promise<CurrentSong | null> {
  try {
    // Buscar configurações do stream
    await dbConnect();
    const settings = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/settings?category=streaming`);
    const streamSettings = await settings.json();
    const streamUrl = streamSettings.find((s: any) => s.key === 'radio_stream_url')?.value || 'https://stm21.srvstm.com:6874/stream';
    
    // Tentar formatos diferentes de metadados
    const metadataAttempts = [
      streamUrl.replace('/stream', '/7.html'),
      streamUrl.replace('/stream', '/stats'),
      streamUrl.replace('/stream', '/currentsong'),
      streamUrl + '/7.html',
    ];
    
    for (const metadataUrl of metadataAttempts) {
      try {
        const response = await fetch(metadataUrl + '?cb=' + Date.now(), {
          headers: {
            'User-Agent': 'RadioTriboFM/1.0',
            'Cache-Control': 'no-cache'
          },
          timeout: 5000
        });
        
        if (response.ok) {
          const text = await response.text();
          
          // Parse diferentes formatos
          if (text.includes(',')) {
            // Formato Shoutcast 7.html
            const parts = text.split(',');
            if (parts.length >= 7 && parts[6].trim()) {
              const songInfo = parts[6].trim();
              return parseStreamMetadata(songInfo);
            }
          } else if (text.includes('TITLE')) {
            // Formato JSON ou XML
            const match = text.match(/TITLE['":\s]*([^'",\n]+)/i);
            if (match && match[1]) {
              return parseStreamMetadata(match[1]);
            }
          }
        }
      } catch (error) {
        console.log(`Tentativa falhou para ${metadataUrl}:`, error);
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar metadados do stream:', error);
    return null;
  }
}

// Função para fazer parse dos metadados do stream
function parseStreamMetadata(songInfo: string): CurrentSong {
  // Tentar diferentes formatos: "Artist - Title", "Title - Artist", "Artist: Title"
  let artist = 'Rádio Tribo FM';
  let title = songInfo;
  
  if (songInfo.includes(' - ')) {
    const parts = songInfo.split(' - ');
    if (parts.length >= 2) {
      artist = parts[0].trim();
      title = parts.slice(1).join(' - ').trim();
    }
  } else if (songInfo.includes(': ')) {
    const parts = songInfo.split(': ');
    if (parts.length >= 2) {
      artist = parts[0].trim();
      title = parts.slice(1).join(': ').trim();
    }
  }
  
  return {
    id: 'stream-' + Date.now(),
    title: title || 'Música Ao Vivo',
    artist: artist || 'Artista Desconhecido',
    playedAt: new Date(),
    duration: 180, // Duração padrão
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  };
}

// Função para gerar uma música atual realista
async function generateCurrentSong(): Promise<CurrentSong> {
  try {
    await dbConnect();
    
    // 20% chance de usar uma música do banco (top songs)
    if (Math.random() < 0.2) {
      const songs = await Song.find({}).sort({ position: 1 }).limit(20);
      if (songs.length > 0) {
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        return {
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
    
    // 80% chance de usar música da playlist variada
    const randomSong = radioPlaylist[Math.floor(Math.random() * radioPlaylist.length)];
    return {
      id: 'playlist-' + Date.now(),
      title: randomSong.title,
      artist: randomSong.artist,
      album: randomSong.album,
      playedAt: new Date(),
      duration: randomSong.duration,
      genres: randomSong.genres,
      imageUrl: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&auto=format&q=80&seed=${Date.now()}`
    };
  } catch (error) {
    console.error('Erro ao gerar música atual:', error);
    
    // Fallback final
    const fallbackSong = radioPlaylist[0];
    return {
      id: 'fallback-' + Date.now(),
      title: fallbackSong.title,
      artist: fallbackSong.artist,
      playedAt: new Date(),
      duration: fallbackSong.duration,
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
    };
  }
}

export async function GET() {
  try {
    // 1. Primeiro tenta buscar do stream real
    const streamMetadata = await tryGetStreamMetadata();
    if (streamMetadata) {
      currentSongData = streamMetadata;
    }
    
    // 2. Se não há música atual ou falhou, gerar uma nova
    if (!currentSongData) {
      currentSongData = await generateCurrentSong();
    }

    // 3. Verificar se a música "terminou" e precisa trocar
    let timeSinceLastPlay = Date.now() - currentSongData.playedAt.getTime();
    let songDuration = (currentSongData.duration || 180) * 1000;
    
    if (timeSinceLastPlay > songDuration) {
      // Gerar nova música
      currentSongData = await generateCurrentSong();
      // Recalcular após gerar nova música
      timeSinceLastPlay = Date.now() - currentSongData.playedAt.getTime();
      songDuration = (currentSongData.duration || 180) * 1000;
    }

    // Calcular progresso
    const progress = Math.min((timeSinceLastPlay / songDuration) * 100, 100);

    return NextResponse.json({
      ...currentSongData,
      progress: progress
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

// Endpoint para forçar nova música ou buscar metadados
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.forceNew) {
      // Forçar uma nova música
      currentSongData = await generateCurrentSong();
      return NextResponse.json(currentSongData);
    }
    
    // Buscar metadados do stream
    const streamMetadata = await tryGetStreamMetadata();
    if (streamMetadata) {
      currentSongData = streamMetadata;
      return NextResponse.json(currentSongData);
    }

    // Fallback
    return NextResponse.json({
      id: 'live',
      title: 'Transmissão Ao Vivo',
      artist: 'Rádio Tribo FM',
      playedAt: new Date(),
      progress: 0
    });
    
  } catch (error) {
    console.error('Error in PUT endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to update current song' },
      { status: 500 }
    );
  }
}