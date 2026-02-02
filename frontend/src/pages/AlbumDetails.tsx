import {useQuery} from "@tanstack/react-query";
import {fetchAlbumById} from "../api/albumApi";
import { useParams, useNavigate } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { usePlayerStore } from "../store/usePlayerStore";
import type { Song } from "../types";
import { useAuthUser } from "../hooks/useAuthUser";
import { useEffect } from "react";
import { useAddToPlaylist } from "../hooks/useAddToPlaylist";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";


function AlbumDetails() {

    const {id}=useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token } = useAuthUser();
    useEffect(() => {
      if (!isAuthenticated) {
        navigate("/", { replace: true });
      }
    }, [isAuthenticated, navigate]);
    const {data,isLoading}=useQuery({
        queryKey:['albumDetails', id],
        queryFn:() => fetchAlbumById(id as string),
        enabled: !!id,
    });
    // token is already destructured above
    const {mutate: addToPlaylistMutate}=useAddToPlaylist();
    const playerStore = usePlayerStore(); // <-- Top level
    if(isLoading) return <PageLoader />;
    const album=data?.album;
    const songs=data?.songs || [];
    const handlePlay=(song: Song)=>{
      if (!songs || songs.length === 0) {
        console.error("No songs available");
        toast.error("No songs available to play");
        return;
      }
      const idx = songs.findIndex((s:Song) => s.id===song.id);
      console.log("handlePlay called", { song, idx, songs, hasSongs: songs.length });
      if (idx === -1) {
        console.error("Song not found in album");
        return;
      }
      playerStore.setQueue(songs, idx);
    }
    const handleAddToPlaylist= (song:Song) => {
      if(!token) {
        toast.error("Please login to add to playlist");
        return;
      }
      addToPlaylistMutate(
        { songId: song.id.toString(), token },
        
      );
    }

  return (
    <Layout>
    <div className="pb-32 pt-10">
      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-end gap-4 md:gap-6 p-4 md:p-6 bg-linear-to-b from-[#282828]/50 to-transparent rounded-lg mb-4">
        <img
          src={album?.thumnail || "/placeholder-album.png"}
          alt={album?.title}
          className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-md shadow-2xl mx-auto md:mx-0"
        />
        <div className="flex flex-col justify-end w-full md:w-auto text-center md:text-left">
          <span className="uppercase text-xs font-bold text-green-500 tracking-widest mb-1 md:mb-2">Album</span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-3 leading-tight">{album?.title}</h1>
          <p className="text-gray-300 text-sm md:text-base mb-2 line-clamp-2">{album?.description}</p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1 md:gap-2 text-xs md:text-sm mt-1 md:mt-2">
            <span className="text-gray-400">{album?.created_at ? new Date(album.created_at).getFullYear() : ""}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400">{songs?.length || 0} songs</span>
          </div>
        </div>
      </div>

      {/* Song List Section */}
      <div className="px-2 md:px-4">
        <div className="hidden md:grid grid-cols-[32px_3fr_2fr_80px] gap-3 px-3 py-2 text-xs text-gray-400 border-b border-gray-800/50 mb-1 font-semibold">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden lg:block">Date added</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="flex flex-col gap-1">
          {songs?.map((song: Song, index: number) => (
            <div
              key={song.id}
              className="grid grid-cols-[32px_1fr_60px] md:grid-cols-[32px_3fr_2fr_80px] gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-3 rounded-md hover:bg-[#2a2a2a] transition-all group cursor-pointer"
              onClick={() => handlePlay(song)}
            >
              <div className="flex items-center justify-center text-gray-400 group-hover:text-green-500">
                <span className="group-hover:hidden font-medium text-sm">{index + 1}</span>
                <svg className="hidden group-hover:block" width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M6 4L14 9L6 14V4Z" fill="currentColor"/></svg>
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
                    handleAddToPlaylist(song);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-green-500 transition p-1"
                  title="Add to playlist"
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M17 8V6C17 4.89543 16.1046 4 15 4H5C3.89543 4 3 4.89543 3 6V14C3 15.1046 3.89543 16 5 16H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12V19M12 16H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Layout>
  )
}

export default AlbumDetails