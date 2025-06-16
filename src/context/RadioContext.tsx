'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface RadioContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentSong: string;
  setCurrentSong: (song: string) => void;
  volume: number;
  setVolume: (volume: number) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState('');
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <RadioContext.Provider value={{
      isPlaying,
      setIsPlaying,
      currentSong,
      setCurrentSong,
      volume,
      setVolume,
      isMuted,
      setIsMuted
    }}>
      {children}
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
}