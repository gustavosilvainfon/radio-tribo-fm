import mongoose, { Schema, Document } from 'mongoose';

// Song Model
interface ISong extends Document {
  title: string;
  artist: string;
  album?: string;
  imageUrl: string;
  position: number;
  plays: number;
  createdAt: Date;
}

const SongSchema = new Schema<ISong>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String },
  imageUrl: { type: String, required: true },
  position: { type: Number, required: true, unique: true },
  plays: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Chat Message Model
interface IChatMessage extends Document {
  username: string;
  message: string;
  timestamp: Date;
  isBlocked: boolean;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  username: { type: String, required: true },
  message: { type: String, required: true, maxlength: 500 },
  timestamp: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
});

// News Model
interface INews extends Document {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  description: { type: String },
  pubDate: { type: Date, required: true },
  category: { type: String },
});

// Admin User Model
interface IAdmin extends Document {
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Song = mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);
export const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
export const News = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);