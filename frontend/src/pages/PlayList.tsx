import Layout from "../components/Layout"
import PageLoader from "../components/PageLoader";
import {useAuthUser} from "../hooks/useAuthUser";
import { useUserPlaylist } from "../hooks/useUserPlaylist";
import { useQuery } from "@tanstack/react-query";
import { fetchSongById } from "../api/songApi";
import { usePlayerStore, type Song } from "../store/usePlayerStore";
import { useAddToPlaylist } from "../hooks/useAddToPlaylist";
import { toast } from "react-hot-toast";


function PlayList() {
  const {token, user}=useAuthUser();
  const {data: playlistData, isLoading}=useUserPlaylist(token);
  const playerStore = usePlayerStore();
  const {mutate: addToPlaylistMutate} = useAddToPlaylist();
  
  // Fetch all songs details from playlist IDs
  const songIds = playlistData?.playlist || [];
  
  const { data: songsData, isLoading: songsLoading, error: songsError } = useQuery({
    queryKey: ['playlistSongs', songIds],
    queryFn: async () => {
      if (!songIds.length) return [];
      const songPromises = songIds.map((id: string) => 
        fetchSongById(id).catch((error) => {
          console.error(`Failed to fetch song ${id}:`, error);
          return null; // Return null for failed fetches
        })
      );
      const results = await Promise.all(songPromises);
      // Filter out null values (failed fetches) and undefined
      return results.filter((song): song is Song => song !== null && song !== undefined);
    },
    enabled: !!songIds.length,
  });

  if(isLoading || songsLoading) {
    return (
      <Layout>
        <PageLoader />
      </Layout>
    );
  }

  const songs: Song[] = songsData || [];

  const handlePlay = (song: Song) => {
    if (!songs || songs.length === 0) {
      toast.error("No songs available to play");
      return;
    }
    const idx = songs.findIndex((s: Song) => s.id === song.id);
    if (idx === -1) {
      console.error("Song not found in playlist");
      return;
    }
    playerStore.setQueue(songs, idx);
  };

  const handleRemoveFromPlaylist = (song: Song) => {
    if (!token) {
      toast.error("Please login to remove from playlist");
      return;
    }
    addToPlaylistMutate({ songId: song.id.toString(), token });
  };

  return (
    <Layout>
      <div className="pb-32 pt-10">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6 p-4 md:p-6 bg-linear-to-b from-purple-800/50 to-transparent rounded-lg mb-4">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center rounded-md shadow-2xl mx-auto md:mx-0">
            <svg className="w-16 h-16 md:w-24 md:h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
          <div className="flex flex-col justify-end w-full md:w-auto text-center md:text-left">
            <span className="uppercase text-xs font-bold text-purple-400 tracking-widest mb-1 md:mb-2">Playlist</span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-3 leading-tight">My Playlist</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 md:gap-2 text-xs md:text-sm mt-1 md:mt-2">
              <span className="text-white font-semibold">{user?.username || "User"}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">{songs.length} songs</span>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {songs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-16 h-16 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <h2 className="text-xl font-semibold text-white mb-2">Your playlist is empty</h2>
            <p className="text-gray-400 text-sm">Start adding songs to your playlist!</p>
          </div>
        ) : (
          /* Song List Section */
          <div className="px-2 md:px-4">
            <div className="hidden md:grid grid-cols-[32px_3fr_2fr_80px] gap-3 px-3 py-2 text-xs text-gray-400 border-b border-gray-800/50 mb-1 font-semibold">
              <div className="text-center">#</div>
              <div>Title</div>
              <div className="hidden lg:block">Date added</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="flex flex-col gap-1">
              {songs.map((song: Song, index: number) => (
                <div
                  key={song.id}
                  className="grid grid-cols-[32px_1fr_60px] md:grid-cols-[32px_3fr_2fr_80px] gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-md hover:bg-[#2a2a2a] transition-all group cursor-pointer"
                  onClick={() => handlePlay(song)}
                >
                  <div className="flex items-center justify-center text-gray-400 group-hover:text-purple-500">
                    <span className="group-hover:hidden font-medium text-sm">{index + 1}</span>
                    <svg className="hidden group-hover:block" width="16" height="16" viewBox="0 0 18 18" fill="none">
                      <path d="M6 4L14 9L6 14V4Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <img
                      src={song.thumnail}
                      alt={song.title}
                      className="w-10 h-10 md:w-12 md:h-12 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-white text-sm md:text-base truncate">{song.title}</div>
                      <div className="text-xs text-gray-400 truncate">{song.description}</div>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center text-gray-400 text-xs">
                    {new Date(song.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromPlaylist(song);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1"
                      title="Remove from playlist"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default PlayList