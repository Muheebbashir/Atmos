import { usePlayerStore } from "../store/usePlayerStore";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Repeat1, ChevronDown, ListPlus } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { useAuthUser } from "../hooks/useAuthUser";
import { useAddToPlaylist } from "../hooks/useAddToPlaylist";
import type { Song } from "../types";
import { toast } from "react-hot-toast";

const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { queue, currentIndex, isPlaying, play, pause, seek } = usePlayerStore();
  const { user: authUser } = useAuthUser();
  const { mutate: addToPlaylistMutate } = useAddToPlaylist();
  const currentSong = queue[currentIndex];
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [previousVolume, setPreviousVolume] = React.useState(1);
  const [muted, setMuted] = React.useState(false);
  const [loop, setLoop] = React.useState(false);
  const currentSongIdRef = useRef<number | null>(null);
  const [isExpanded, setIsExpanded] = React.useState(false);

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
    if (currentSong.id !== currentSongIdRef.current) {
      currentSongIdRef.current = currentSong.id;
      
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
    // If only one song, restart it
    if (queue.length === 1) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    let nextIndex = currentIndex + 1;
    
    // If at the end of queue, loop back to start
    if (nextIndex >= queue.length) {
      nextIndex = 0; // Always loop back to first song
    }

    // If user is not premium, skip over premium songs
    if (!isPremiumUser) {
      const startIndex = nextIndex;
      let attempts = 0;
      
      while (attempts < queue.length) {
        const nextSong = queue[nextIndex] as Song;
        
        // If song is not premium, play it
        if (!nextSong.isPremium) {
          seek(nextIndex);
          return;
        }
        
        // Try next song
        nextIndex++;
        if (nextIndex >= queue.length) {
          nextIndex = 0; // Loop back
        }
        
        attempts++;
        
        // If we've checked all songs and back to start, all are premium
        if (nextIndex === startIndex) {
          toast.error("All songs are premium. Please upgrade to listen.");
          return;
        }
      }
      
      toast.error("All remaining songs are premium. Please upgrade to continue.");
      return;
    }
    
    // User is premium, play next song normally
    seek(nextIndex);
  };

  // Handle previous with premium check - skip premium songs for non-premium users
  const handlePrev = () => {
    // If only one song, restart it
    if (queue.length === 1) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }

    // If more than 3 seconds played, restart current song
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    // If at the beginning, go to last song
    let prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    
    // If user is not premium, skip over premium songs
    if (!isPremiumUser) {
      const startIndex = prevIndex;
      let attempts = 0;
      
      while (attempts < queue.length) {
        const prevSong = queue[prevIndex] as Song;
        
        // If song is not premium, play it
        if (!prevSong.isPremium) {
          seek(prevIndex);
          return;
        }
        
        // Try previous song
        prevIndex--;
        if (prevIndex < 0) {
          prevIndex = queue.length - 1; // Loop to end
        }
        
        attempts++;
        
        // If we've checked all songs and back to start, all are premium
        if (prevIndex === startIndex) {
          toast.error("All songs are premium. Please upgrade to listen.");
          return;
        }
      }
      
      toast.error("All previous songs are premium. Please upgrade to listen.");
      return;
    }
    
    // User is premium, play previous song normally
    seek(prevIndex);
  };

  const handleAddToPlaylist = () => {
    if (!currentSong) return;
    
    // Check if song is premium and user is not premium
    if (currentSong.isPremium && !isPremiumUser) {
      toast.error("This is a premium song. Please upgrade to add to playlist.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add songs to playlist");
      return;
    }

    addToPlaylistMutate({ songId: currentSong.id.toString(), token });
  };

  if (!currentSong) return null;

  return (
    <>
      {/* Minimized Mobile Player Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50">
        <div 
          onClick={() => setIsExpanded(true)}
          className="px-3 py-2 flex items-center justify-between gap-3 cursor-pointer active:bg-[#282828] transition"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
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
          
          {/* Only Play/Pause in minimized view */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            className="bg-white text-black rounded-full p-2 hover:scale-110 transition shadow-lg shrink-0"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
          </button>
        </div>
        
        {/* Thin Progress Bar */}
        <div className="h-1 bg-gray-800">
          <div 
            className="h-full bg-green-500 transition-all"
            style={{ width: `${(progress / duration) * 100}%` }}
          />
        </div>
      </div>

      {/* Full-Screen Mobile Player Modal */}
      {isExpanded && (
        <div className="md:hidden fixed inset-0 bg-gradient-to-b from-[#282828] to-black z-[100] flex flex-col safe-area-inset">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 pt-safe">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white p-1.5 hover:bg-white/10 rounded-full transition"
            >
              <ChevronDown size={26} />
            </button>
            <div className="text-white text-xs font-semibold uppercase tracking-wide">Now Playing</div>
            <button
              onClick={handleAddToPlaylist}
              className="text-white p-1.5 hover:bg-white/10 rounded-full transition"
              title="Add to playlist"
            >
              <ListPlus size={24} />
            </button>
          </div>

          {/* Song Image - Optimized for small screens */}
          <div className="flex-1 flex items-center justify-center px-5 py-4 min-h-0">
            <img 
              src={currentSong.thumnail} 
              alt={currentSong.title}
              className="w-full max-w-[340px] aspect-square rounded-lg shadow-2xl object-cover"
            />
          </div>

          {/* Song Info - Compact */}
          <div className="px-5 py-3">
            <h2 className="text-white text-xl font-bold truncate leading-tight">{currentSong.title}</h2>
            <p className="text-gray-400 text-sm truncate mt-0.5">{currentSong.description}</p>
          </div>

          {/* Progress Bar - Compact */}
          <div className="px-5 py-2">
            <input
              type="range"
              min={0}
              max={duration}
              value={progress}
              onChange={handleSeek}
              className="w-full accent-green-500 h-1 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls - Optimized spacing */}
          <div className="px-5 py-4 pb-6 pb-safe">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <button 
                onClick={handleToggleLoop}
                className={`transition p-1 ${loop ? 'text-green-500' : 'text-gray-300'}`}
                title={loop ? "Disable loop" : "Enable loop"}
              >
                {loop ? <Repeat1 size={22} /> : <Repeat size={22} />}
              </button>
              
              <button 
                onClick={handlePrev} 
                className="text-gray-300 hover:text-white transition p-1"
              >
                <SkipBack size={28} />
              </button>
              
              <button
                onClick={handlePlayPause}
                className="bg-white text-black rounded-full p-3.5 hover:scale-105 transition shadow-2xl"
              >
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-0.5" />}
              </button>
              
              <button 
                onClick={handleNext} 
                className="text-gray-300 hover:text-white transition p-1"
              >
                <SkipForward size={28} />
              </button>
              
              <button 
                onClick={handleToggleMute}
                className="text-gray-300 hover:text-white transition p-1"
              >
                {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - Spotify Style */}
      <div className="hidden md:block fixed bottom-0 left-0 w-full bg-[#181818] border-t border-[#282828] z-50">
        <div className="px-4 py-2 h-[90px]">
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
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </>
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