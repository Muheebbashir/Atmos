import { useState } from "react";
import Layout from "../components/Layout";
import { Search as SearchIcon, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { useSongs } from "../hooks/useSongs";
import { useAlbums } from "../hooks/useAlbums";
import PageLoader from "../components/PageLoader";
import type { Song, Album } from "../types";
import { toast } from "react-hot-toast";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuthUser();
  const { songs, isLoading: songsLoading } = useSongs();
  const { albums, isLoading: albumsLoading } = useAlbums();

  // Check if user is premium
  const isPremiumUser = authUser?.subscriptionType === "premium" && 
                        authUser?.subscriptionStatus === "active" &&
                        authUser?.subscriptionEndDate &&
                        new Date(authUser.subscriptionEndDate) > new Date();

  if (songsLoading || albumsLoading) return <PageLoader />;

  // Filter songs and albums based on search query
  const filteredSongs = songs?.filter((song: Song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredAlbums = albums?.filter((album: Album) =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSongClick = (song: Song) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (song.isPremium && !isPremiumUser) {
      toast.error("This is a premium song. Please upgrade to premium to listen.");
      navigate("/pricing");
      return;
    }
    
    navigate(`/song/${song.id}`);
  };

  const handleAlbumClick = (album: Album) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (album.isPremium && !isPremiumUser) {
      toast.error("This is a premium album. Please upgrade to premium to listen.");
      navigate("/pricing");
      return;
    }
    
    navigate(`/album/${album.id}`);
  };

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
        
        {/* Search Input */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white text-black rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            autoFocus
          />
        </div>

        {/* Search Results */}
        {searchQuery.trim() === "" ? (
          <div className="text-center py-20">
            <SearchIcon className="mx-auto mb-4 text-gray-500" size={64} />
            <p className="text-gray-400 text-lg">Search for songs and albums</p>
            <p className="text-gray-500 text-sm mt-2">Start typing to see results</p>
          </div>
        ) : (
          <>
            {/* No Results */}
            {filteredSongs.length === 0 && filteredAlbums.length === 0 && (
              <div className="text-center py-20">
                <SearchIcon className="mx-auto mb-4 text-gray-500" size={64} />
                <p className="text-white text-lg mb-2">No results found for "{searchQuery}"</p>
                <p className="text-gray-400 text-sm">Try searching with different keywords</p>
              </div>
            )}

            {/* Albums Results */}
            {filteredAlbums.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Albums ({filteredAlbums.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
                  {filteredAlbums.map((album: Album) => (
                    <div
                      key={album.id}
                      onClick={() => handleAlbumClick(album)}
                      className="group hover:bg-[#282828] transition-all duration-300 p-2 sm:p-4 rounded-lg cursor-pointer"
                    >
                      <div className="relative mb-4">
                        <img
                          src={album.thumnail}
                          alt={album.title}
                          className="w-full aspect-square object-cover rounded"
                        />
                        {album.isPremium && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
                            <Crown size={12} fill="black" />
                            <span>PREMIUM</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-white truncate mb-1">
                        {album.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {album.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Songs Results */}
            {filteredSongs.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Songs ({filteredSongs.length})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
                  {filteredSongs.map((song: Song) => (
                    <div
                      key={song.id}
                      onClick={() => handleSongClick(song)}
                      className="group rounded-md p-2 sm:p-4 hover:bg-[#282828] transition-colors cursor-pointer"
                    >
                      <div className="relative mb-4">
                        <img
                          src={song.thumnail}
                          alt={song.title}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        {song.isPremium && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
                            <Crown size={12} fill="black" />
                            <span>PREMIUM</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-sm truncate mb-1">
                        {song.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {song.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Search;
