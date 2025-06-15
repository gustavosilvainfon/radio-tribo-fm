import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Song } from '@/lib/models';

export async function GET() {
  try {
    await dbConnect();
    const songs = await Song.find({}).sort({ position: 1 }).limit(50);
    
    // If no songs in database, return mock data
    if (songs.length === 0) {
      const mockSongs = [
        {
          id: '1',
          title: 'Flowers',
          artist: 'Miley Cyrus',
          album: 'Endless Summer Vacation',
          imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
          position: 1,
          plays: 1500,
        },
        {
          id: '2',
          title: 'Anti-Hero',
          artist: 'Taylor Swift',
          album: 'Midnights',
          imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=200&h=200&fit=crop',
          position: 2,
          plays: 1420,
        },
        {
          id: '3',
          title: 'As It Was',
          artist: 'Harry Styles',
          album: 'Harry\'s House',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          position: 3,
          plays: 1380,
        },
        {
          id: '4',
          title: 'Unholy',
          artist: 'Sam Smith ft. Kim Petras',
          album: 'Gloria',
          imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
          position: 4,
          plays: 1290,
        },
        {
          id: '5',
          title: 'Bad Habit',
          artist: 'Steve Lacy',
          album: 'Gemini Rights',
          imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=200&h=200&fit=crop',
          position: 5,
          plays: 1250,
        },
        {
          id: '6',
          title: 'Heat Waves',
          artist: 'Glass Animals',
          album: 'Dreamland',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          position: 6,
          plays: 1180,
        },
        {
          id: '7',
          title: 'Shivers',
          artist: 'Ed Sheeran',
          album: '=',
          imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
          position: 7,
          plays: 1120,
        },
        {
          id: '8',
          title: 'Good 4 U',
          artist: 'Olivia Rodrigo',
          album: 'SOUR',
          imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=200&h=200&fit=crop',
          position: 8,
          plays: 1080,
        },
        {
          id: '9',
          title: 'Levitating',
          artist: 'Dua Lipa',
          album: 'Future Nostalgia',
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
          position: 9,
          plays: 1020,
        },
        {
          id: '10',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
          position: 10,
          plays: 980,
        },
      ];
      return NextResponse.json(mockSongs);
    }

    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const song = new Song(body);
    await song.save();
    
    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error('Error creating song:', error);
    return NextResponse.json(
      { error: 'Failed to create song' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const song = await Song.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!song) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(song);
  } catch (error) {
    console.error('Error updating song:', error);
    return NextResponse.json(
      { error: 'Failed to update song' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Song ID is required' },
        { status: 400 }
      );
    }
    
    const song = await Song.findByIdAndDelete(id);
    
    if (!song) {
      return NextResponse.json(
        { error: 'Song not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json(
      { error: 'Failed to delete song' },
      { status: 500 }
    );
  }
}