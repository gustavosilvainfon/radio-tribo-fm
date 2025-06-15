export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  imageUrl: string;
  position: number;
  plays: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  isBlocked?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  category?: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
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

export interface AdBanner {
  id: string;
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

export interface Promotion {
  id: string;
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