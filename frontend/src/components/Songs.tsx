// ...existing code...
import { Play, ListPlus, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { usePlayerStore } from "../store/usePlayerStore";
import  {useAddToPlaylist}  from "../hooks/useAddToPlaylist";
import { useSongs } from "../hooks/useSongs";
import type { Song } from "../types";
import { toast } from "react-hot-toast";

function Songs() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, token, user: authUser } = useAuthUser();
  const playerStore = usePlayerStore();
  const { mutate: addToPlaylistMutate } = useAddToPlaylist();

  const { songs } = useSongs();

  // 🔒 Auth guard (reusable)
  const requireAuth = (action: () => void) => {
    if (authLoading) return;

    if (!isAuthenticated) {
    //  toast.error("Please login to play songs");
      navigate("/login");
      return;
    }

    action();
  };

  // Check if user is premium
  const isPremiumUser = authUser?.subscriptionType === "premium" && 
                        authUser?.subscriptionStatus === "active" &&
                        authUser?.subscriptionEndDate &&
                        new Date(authUser.subscriptionEndDate) > new Date();

  // ▶️ Play handler
  // In Songs.tsx, update the handlePlay function:
const handlePlay = (song: Song) => {
  requireAuth(() => {
    // Check if song is premium and user is not premium
    if (song.isPremium && !isPremiumUser) {
      toast.error("This is a premium song. Please upgrade to premium to listen.");
      navigate("/pricing");
      return;
    }
    
    // Set the entire songs list as queue and start with clicked song
    if (songs) {
      const allSongs = songs;
      const songIndex = allSongs.findIndex((s: Song) => s.id === song.id);
      playerStore.setQueue(allSongs, songIndex);
    }
  });
};

  // ➕ Playlist handler
  const handleAddToPlaylist = (song: Song) => {
    requireAuth(() => {
      addToPlaylistMutate({ songId: song.id.toString(), token: token as string });
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 mt-4">
        Today's Biggest Hits
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
        {songs?.map((song: Song) => (
          <div
            key={song.id}
            onClick={() => navigate(`/song/${song.id}`)}
            className="group rounded-md p-2 sm:p-4 hover:bg-[#282828] transition-colors cursor-pointer"
          >
            <div className="relative mb-4">
              <img
                src={song.thumnail}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md hover:opacity-80 transition"
              />
              
              {/* PREMIUM BADGE */}
              {song.isPremium && (
                <div className="absolute top-2 left-2 bg-linear-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
                  <Crown size={12} fill="black" />
                  <span>PREMIUM</span>
                </div>
              )}
              
              {/* ACTION BUTTONS - Desktop only */}
              <div
                className="
                  hidden lg:flex
                  absolute bottom-3 right-3
                  gap-2
                  opacity-0 translate-y-2
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300
                "
              >
                {/* PLAY */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(song);
                  }}
                  className="
                    bg-green-500 text-black
                    rounded-full p-3
                    shadow-xl
                    hover:scale-105
                    transition
                  "
                >
                  <Play size={18} fill="black" />
                </button>

                {/* ADD TO PLAYLIST */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToPlaylist(song);
                  }}
                  disabled={song.isPremium && !isPremiumUser}
                  className={`
                    rounded-full p-3
                    shadow-xl
                    hover:scale-105
                    transition
                    ${song.isPremium && !isPremiumUser 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                      : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                    }
                  `}
                  title={song.isPremium && !isPremiumUser ? "Premium subscription required" : "Add to playlist"}
                >
                  <ListPlus size={18} />
                </button>
              </div>
            </div>

            <h3 
              className="text-white font-semibold text-sm truncate mb-1 hover:text-green-500 transition"
            >
              {song.title}
            </h3>
            <p className="text-xs text-gray-400 line-clamp-2">
              {song.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Songs;
