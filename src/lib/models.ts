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

// Team Member Model
interface ITeamMember extends Document {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  schedule: string;
  specialty: string;
  icon: string;
  order: number;
  isActive: boolean;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  schedule: { type: String, required: true },
  specialty: { type: String, required: true },
  icon: { type: String, default: '🎵' },
  order: { type: Number, required: true, unique: true },
  isActive: { type: Boolean, default: true },
});

// Ad Banner Model
interface IAdBanner extends Document {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  sponsor: string;
  category: string;
  position: 'top' | 'side' | 'bottom' | 'inline';
  isActive: boolean;
  order: number;
  clickCount: number;
}

const AdBannerSchema = new Schema<IAdBanner>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  link: { type: String, required: true },
  sponsor: { type: String, required: true },
  category: { type: String, required: true },
  position: { type: String, enum: ['top', 'side', 'bottom', 'inline'], required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, required: true },
  clickCount: { type: Number, default: 0 },
});

// Promotion Model
interface IPromotion extends Document {
  title: string;
  description: string;
  prize: string;
  endDate: Date;
  howToParticipate: string;
  phone: string;
  status: 'active' | 'inactive' | 'ended';
  color: string;
  icon: string;
  order: number;
}

const PromotionSchema = new Schema<IPromotion>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  prize: { type: String, required: true },
  endDate: { type: Date, required: true },
  howToParticipate: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive', 'ended'], default: 'active' },
  color: { type: String, default: 'from-blue-600 to-cyan-600' },
  icon: { type: String, default: '🎵' },
  order: { type: Number, required: true },
});

// Settings Model
interface ISettings extends Document {
  key: string;
  value: string;
  category: 'general' | 'social' | 'streaming' | 'programming' | 'custom_code';
  description?: string;
}

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  category: { type: String, enum: ['general', 'social', 'streaming', 'programming', 'custom_code'], required: true },
  description: { type: String },
});

export const Song = mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);
export const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
export const News = mongoose.models.News || mongoose.model<INews>('News', NewsSchema);
export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
export const TeamMember = mongoose.models.TeamMember || mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
export const AdBanner = mongoose.models.AdBanner || mongoose.model<IAdBanner>('AdBanner', AdBannerSchema);
export const Promotion = mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', PromotionSchema);
export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);