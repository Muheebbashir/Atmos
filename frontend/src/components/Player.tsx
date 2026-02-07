import { usePlayerStore } from "../store/usePlayerStore";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1 } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { useAuthUser } from "../hooks/useAuthUser";
import type { Song } from "../types";
import { toast } from "react-hot-toast";

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { queue, currentIndex, isPlaying, play, pause, next, prev, seek } = usePlayerStore();
  const { user: authUser } = useAuthUser();
  const currentSong = queue[currentIndex];
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [previousVolume, setPreviousVolume] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const [loop, setLoop] = React.useState(false);
  const [currentSongId, setCurrentSongId] = React.useState<number | null>(null);

  // Check if user is premium
  const isPremiumUser = authUser?.subscriptionType === "premium" && 
                        authUser?.subscriptionStatus === "active" &&
                        authUser?.subscriptionEndDate &&
                        new Date(authUser.subscriptionEndDate) > new Date();

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
    if (muted) {
      // Unmuting: restore previous volume
      setVolume(previousVolume);
      setMuted(false);
    } else {
      // Muting: save current volume and set to 0
      setPreviousVolume(volume);
      setVolume(0);
      setMuted(true);
    }
  };

  // Handle song changes (load new audio only when song ID changes)
  useEffect(() => {
    if (!currentSong) return;
    
    // Only reload audio if it's a different song
    if (currentSong.id !== currentSongId) {
      setCurrentSongId(currentSong.id);
      
      if (audioRef.current) {
        audioRef.current.src = currentSong.audio;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(err => console.error("Playback error:", err));
        }
      }
    }
  }, [currentSong, isPlaying]);

  // Handle play/pause state changes (separate from song loading)
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Playback error:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

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
    if (loop) {
      // Restart the current song
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  };

  const handleToggleLoop = () => {
    setLoop((prev) => !prev);
    toast.success(loop ? "Loop disabled" : "Loop enabled");
  };

  // Handle next with premium check - skip premium songs for non-premium users
  const handleNext = () => {
    let nextIndex = currentIndex + 1;
    
    // If at the end of queue, stop
    if (nextIndex >= queue.length) {
      pause();
      return;
    }

    // If user is not premium, skip over premium songs
    if (!isPremiumUser) {
      while (nextIndex < queue.length) {
        const nextSong = queue[nextIndex] as Song;
        
        // If song is not premium or user is premium, play it
        if (!nextSong.isPremium) {
          seek(nextIndex);
          return;
        }
        
        // Otherwise, skip to next song
        nextIndex++;
      }
      
      // If we've reached the end and all remaining songs are premium
      toast.error("All remaining songs are premium. Please upgrade to continue.");
      pause();
      return;
    }
    
    // User is premium, play next song normally
    next();
  };

  // Handle previous with premium check - skip premium songs for non-premium users
  const handlePrev = () => {
    if (currentIndex === 0) return;
    
    let prevIndex = currentIndex - 1;
    
    // If user is not premium, skip over premium songs
    if (!isPremiumUser) {
      while (prevIndex >= 0) {
        const prevSong = queue[prevIndex] as Song;
        
        // If song is not premium or user is premium, play it
        if (!prevSong.isPremium) {
          seek(prevIndex);
          return;
        }
        
        // Otherwise, skip to previous song
        prevIndex--;
      }
      
      // If we've reached the beginning and all previous songs are premium
      toast.error("All previous songs are premium. Please upgrade to listen.");
      return;
    }
    
    // User is premium, play previous song normally
    prev();
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50">
      {/* Mobile Layout - Spotify Style */}
      <div className="md:hidden px-3 py-3 flex flex-col gap-2">
        {/* Song Info + Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img 
              src={currentSong.thumnail} 
              alt={currentSong.title} 
              className="w-12 h-12 rounded object-cover shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-sm truncate">{currentSong.title}</div>
              <div className="text-gray-400 text-xs truncate">{currentSong.description}</div>
            </div>
          </div>
          
          {/* Mobile Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={handleToggleLoop}
              className={`transition ${loop ? 'text-green-500' : 'text-gray-300 hover:text-white'}`}
              title={loop ? "Disable loop" : "Enable loop"}
            >
              {loop ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
            <button 
              onClick={handlePrev} 
              className="text-gray-300 hover:text-white transition"
            >
              <SkipBack size={22} />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full p-2 hover:scale-110 transition shadow-lg"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
            <button 
              onClick={handleNext} 
              className="text-gray-300 hover:text-white transition"
            >
              <SkipForward size={22} />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 w-10 text-right">
            {formatTime(progress)}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            value={progress}
            onChange={handleSeek}
            className="flex-1 accent-green-500 h-1 cursor-pointer"
          />
          <span className="text-xs text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Desktop Layout - Spotify Style */}
      <div className="hidden md:block px-4 py-2 h-[90px]">
        <div className="flex items-center justify-between h-full gap-4">
          {/* LEFT: Song Info - Fixed Width 30% */}
          <div className="flex items-center gap-3 min-w-0 w-[30%]">
            <img 
              src={currentSong.thumnail} 
              alt={currentSong.title} 
              className="w-14 h-14 rounded object-cover flex-shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-white font-semibold text-sm truncate">{currentSong.title}</div>
              <div className="text-gray-400 text-xs truncate">{currentSong.description}</div>
            </div>
          </div>

          {/* CENTER: Controls - Fixed Width 40% */}
          <div className="flex flex-col items-center w-[40%]">
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={handleToggleLoop}
                className={`transition ${loop ? 'text-green-500' : 'text-gray-300 hover:text-white'}`}
                title={loop ? "Disable loop" : "Enable loop"}
              >
                {loop ? <Repeat1 size={18} /> : <Repeat size={18} />}
              </button>
              <button onClick={handlePrev} className="text-gray-300 hover:text-white transition">
                <SkipBack size={20} />
              </button>
              <button
                onClick={handlePlayPause}
                className="bg-white text-black rounded-full p-2 hover:scale-110 transition shadow-lg"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button onClick={handleNext} className="text-gray-300 hover:text-white transition">
                <SkipForward size={20} />
              </button>
            </div>
            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-400 w-10 text-right">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min={0}
                max={duration}
                value={progress}
                onChange={handleSeek}
                className="flex-1 accent-green-500 h-1 cursor-pointer"
              />
              <span className="text-xs text-gray-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: Volume - Fixed Width 30% */}
          <div className="flex items-center justify-end gap-2 w-[30%]">
            <button 
              onClick={handleToggleMute} 
              className="text-gray-300 hover:text-white transition"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => {
                const newVolume = Number(e.target.value);
                setVolume(newVolume);
                if (newVolume === 0) {
                  setMuted(true);
                } else if (muted) {
                  setMuted(false);
                }
              }}
              className="w-24 accent-green-500 h-1 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
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