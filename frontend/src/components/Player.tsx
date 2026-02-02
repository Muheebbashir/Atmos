import { usePlayerStore } from "../store/usePlayerStore";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import React, { useRef, useEffect } from "react";

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { queue, currentIndex, isPlaying, play, pause, next, prev } = usePlayerStore();
  const currentSong = queue[currentIndex];
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [muted, setMuted] = React.useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);
  const handleToggleMute = () => {
    setMuted((prev) => !prev);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const handlePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) pause();
    else play();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setProgress(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
      setProgress(Number(e.target.value));
    }
  };

  const handleEnded = () => {
    next();
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50 px-2 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
      {/* Song Info */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 w-full sm:w-auto justify-center sm:justify-start">
        <img src={currentSong.thumnail} alt={currentSong.title} className="w-10 h-10 sm:w-14 sm:h-14 rounded object-cover" />
        <div className="min-w-0">
          <div className="text-white font-semibold truncate max-w-[120px] sm:max-w-none">{currentSong.title}</div>
          <div className="text-gray-400 text-xs truncate max-w-[120px] sm:max-w-none">{currentSong.description}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center flex-1 max-w-xl mx-0 sm:mx-8 w-full sm:w-auto">
        <div className="flex items-center gap-4 sm:gap-6 mb-1 justify-center">
          <button onClick={prev} className="text-gray-300 hover:text-white"><SkipBack size={22} /></button>
          <button
            onClick={handlePlayPause}
            className="bg-white text-black rounded-full p-2 mx-2 hover:scale-105 transition shadow-lg"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button onClick={next} className="text-gray-300 hover:text-white"><SkipForward size={22} /></button>
        </div>
        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-400 min-w-10">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={handleSeek}
            className="w-full accent-green-500 h-1"
          />
          <span className="text-xs text-gray-400 min-w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end mt-2 sm:mt-0">
        <button onClick={handleToggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? (
            <VolumeX className="text-gray-300" />
          ) : (
            <Volume2 className="text-gray-300" />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="accent-green-500 h-1 w-20 sm:w-24"
          disabled={muted}
        />
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay={isPlaying}
      />
    </div>
  );
};

function formatTime(time: number) {
  if (!time || isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default Player;