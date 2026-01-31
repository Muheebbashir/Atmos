import { create } from 'zustand';

export interface Song {
  id: number;
  title: string;
  description: string;
  album_id: number;
  thumnail: string;
  audio: string;
  created_at: string;
}

interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  setQueue: (songs: Song[], startIndex: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  seek: (index: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  setQueue: (songs, startIndex) => set({ queue: songs, currentIndex: startIndex, isPlaying: true }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  next: () => {
    const { currentIndex, queue } = get();
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, isPlaying: true });
    }
  },
  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isPlaying: true });
    }
  },
  seek: (index) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      set({ currentIndex: index, isPlaying: true });
    }
  },
}));
