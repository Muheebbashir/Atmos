import type { Song } from "./Song";

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  setQueue: (songs: Song[], startIndex: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  prev: () => void;
  seek: (index: number) => void;
}
