import { create } from 'zustand';
import type { PlayerState } from '../types';

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
  previous: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, isPlaying: true });
    }
  },
  seek: (index: number) => {
    const { queue } = get();
    if (index >= 0 && index < queue.length) {
      set({ currentIndex: index, isPlaying: true });
    }
  },
}));
