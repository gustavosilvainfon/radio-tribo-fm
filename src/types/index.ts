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