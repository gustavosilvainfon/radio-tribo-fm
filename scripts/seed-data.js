const mongoose = require('mongoose');

// Song Schema (similar to the one in models.ts)
const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  imageUrl: { type: String, required: true },
  position: { type: Number, required: true, unique: true },
  plays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.model('Song', SongSchema);

const sampleSongs = [
  {
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    position: 1,
    plays: 1500,
  },
  {
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=200&h=200&fit=crop',
    position: 2,
    plays: 1420,
  },
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    position: 3,
    plays: 1380,
  },
  {
    title: 'Unholy',
    artist: 'Sam Smith ft. Kim Petras',
    album: 'Gloria',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    position: 4,
    plays: 1290,
  },
  {
    title: 'Bad Habit',
    artist: 'Steve Lacy',
    album: 'Gemini Rights',
    imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=200&h=200&fit=crop',
    position: 5,
    plays: 1250,
  },
  {
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    position: 6,
    plays: 1180,
  },
  {
    title: 'Shivers',
    artist: 'Ed Sheeran',
    album: '=',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    position: 7,
    plays: 1120,
  },
  {
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    imageUrl: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=200&h=200&fit=crop',
    position: 8,
    plays: 1080,
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
    position: 9,
    plays: 1020,
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    position: 10,
    plays: 980,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/radio-tribo-fm');
    console.log('Connected to MongoDB');

    // Clear existing songs
    await Song.deleteMany({});
    console.log('Cleared existing songs');

    // Insert sample songs
    await Song.insertMany(sampleSongs);
    console.log('Inserted sample songs');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();