import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSongById } from "../api/songApi";
import PageLoader from "../components/PageLoader";
import Layout from "../components/Layout";
import { usePlayerStore } from "../store/usePlayerStore";
import { useAuthUser } from "../hooks/useAuthUser";
import { useAddToPlaylist } from "../hooks/useAddToPlaylist";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import type { Song } from "../types";

const SongDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthUser();
  const playerStore = usePlayerStore();
  const { mutate: addToPlaylistMutate } = useAddToPlaylist();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["song", id],
    queryFn: () => fetchSongById(id!),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader />;
  if (error) return <div className="text-red-500 p-4">Error loading song.</div>;
  if (!data) return <div className="text-gray-400 p-4">No song found.</div>;

  const song = data as Song;

  const handlePlay = () => {
    playerStore.setQueue([song], 0);
  };

  const handleAddToPlaylist = () => {
    if (!token) {
      toast.error("Please login to add to playlist");
      return;
    }
    addToPlaylistMutate({ songId: song.id.toString(), token });
  };

  return (
    <Layout>
      <div className="pb-32 pt-10">
        {/* Song Header */}
        <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6 p-4 md:p-6 bg-linear-to-b from-[#282828]/50 to-transparent rounded-lg mb-8">
          <img
            src={song.thumnail || "/placeholder-album.png"}
            alt={song.title}
            className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-md shadow-2xl mx-auto md:mx-0"
          />
          <div className="flex flex-col justify-end w-full md:w-auto text-center md:text-left">
            <span className="uppercase text-xs font-bold text-green-500 tracking-widest mb-2 md:mb-3">Song</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 md:mb-4 leading-tight wrap-break-words">
              {song.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base mb-4 line-clamp-3">{song.description}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3 text-xs md:text-sm mt-2 md:mt-3">
              <span className="text-gray-400">
                {new Date(song.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6 md:mt-8">
              <button
                onClick={handlePlay}
                className="px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition transform hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M6 4L14 9L6 14V4Z" />
                </svg>
                Play
              </button>
              <button
                onClick={handleAddToPlaylist}
                className="px-6 py-3 border-2 border-gray-500 hover:border-white text-white font-semibold rounded-full transition hover:bg-white/10 flex items-center gap-2"
                title="Add to playlist"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M17 8V6C17 4.89543 16.1046 4 15 4H5C3.89543 4 3 4.89543 3 6V14C3 15.1046 3.89543 16 5 16H10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M15 12V19M12 16H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add to Playlist
              </button>
            </div>
          </div>
        </div>

        {/* Song Information */}
        <div className="px-4 md:px-6">
          <div className="bg-[#1a1a1a] rounded-lg p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Song Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Title</p>
                <p className="text-base md:text-lg text-white">{song.title}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Released</p>
                <p className="text-base md:text-lg text-white">
                  {new Date(song.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Description</p>
                <p className="text-base md:text-lg text-gray-300">{song.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SongDetails;
