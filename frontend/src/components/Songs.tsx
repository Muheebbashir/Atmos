import { useQuery } from "@tanstack/react-query";
import { fetchAllSongs } from "../api/songApi";
//import { useEffect } from "react";
//import { toast } from "react-hot-toast";
import PageLoader from "./PageLoader";
import { Play, ListPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { usePlayerStore } from "../store/usePlayerStore";
import  {useAddToPlaylist}  from "../hooks/useAddtoPlaylist";

interface Song {
  id: number;
  title: string;
  description: string;
  album_id: number;
  thumnail: string;
  audio: string;
  created_at: string;
}

function Songs() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, token } = useAuthUser();
  const playerStore = usePlayerStore();
  const { mutate: addToPlaylistMutate } = useAddToPlaylist();
  const { data, isLoading } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchAllSongs,
  });

  /*useEffect(() => {
    if (error) toast.error("Error loading songs");
    if (isSuccess) toast.success("Songs loaded!");
  }, [error, isSuccess]);*/

  if (isLoading) return <PageLoader />;

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

  // ▶️ Play handler
  // In Songs.tsx, update the handlePlay function:
const handlePlay = (song: Song) => {
  requireAuth(() => {
    // Set the entire songs list as queue and start with clicked song
    if (data) {
      const allSongs = data;
      const songIndex = allSongs.findIndex((s: Song) => s.id === song.id);
      playerStore.setQueue(allSongs, songIndex);
    }
  });
};

  // ➕ Playlist handler
  const handleAddToPlaylist = (song: Song) => {
    requireAuth(() => {
      console.log("Add to playlist:", song);
      // TODO: playlist logic
      addToPlaylistMutate({ songId: song.id.toString(), token: token as string });
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 mt-4">
        Today's Biggest Hits
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data?.map((song: Song) => (
          <div
            key={song.id}
            className="group rounded-md p-4 hover:bg-[#282828] transition-colors"
          >
            <div className="relative mb-4">
              <img
                src={song.thumnail}
                alt={song.title}
                className="w-full aspect-square object-cover rounded-md hover:opacity-80 transition"
              />
              {/* ACTION BUTTONS */}
              <div
                className="
                  absolute bottom-3 right-3
                  flex gap-2
                  opacity-0 translate-y-2
                  group-hover:opacity-100 group-hover:translate-y-0
                  transition-all duration-300
                "
              >
                {/* PLAY */}
                <button
                  onClick={() => handlePlay(song)}
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
                  onClick={() => handleAddToPlaylist(song)}
                  className="
                    bg-[#2a2a2a] text-white
                    rounded-full p-3
                    shadow-xl
                    hover:bg-[#3a3a3a]
                    hover:scale-105
                    transition
                  "
                  title="Add to playlist"
                >
                  <ListPlus size={18} />
                </button>
              </div>
            </div>

            <h3 className="text-white font-semibold truncate">
              {song.title}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {song.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Songs;
