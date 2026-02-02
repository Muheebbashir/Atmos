import { useState, useEffect } from "react";
import { useAuthUser } from "../hooks/useAuthUser";
import { useCreateAlbum } from "../hooks/useCreateAlbum";
import { useDeleteAlbum } from "../hooks/useDeleteAlbum";
import { useCreateSong } from "../hooks/useCreateSong";
import { useDeleteSong } from "../hooks/useDeleteSong";
import { useUploadSongThumbnail } from "../hooks/useUploadSongThumbnail";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAlbums } from "../api/albumApi";
import { fetchAllSongs } from "../api/songApi";

function AdminDashboard() {
  const { user, token } = useAuthUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"album" | "song">("album");

  // Album
  const [album, setAlbum] = useState<{ title: string; description: string; thumnail: File | null }>({ title: "", description: "", thumnail: null });
  const [albumIdToDelete, setAlbumIdToDelete] = useState("");
  const { mutate: createAlbumMutate, isPending: isCreatingAlbum } = useCreateAlbum(token);
  const { mutate: deleteAlbumMutate, isPending: isDeletingAlbum } = useDeleteAlbum();

  // Song
  const [song, setSong] = useState<{ title: string; description: string; audio: File | null }>({ title: "", description: "", audio: null });
  const [songIdToDelete, setSongIdToDelete] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState<{ id: number; title: string; thumnail: string } | null>(null);
  const { mutate: createSongMutate, isPending: isCreatingSong } = useCreateSong();
  const { mutate: deleteSongMutate, isPending: isDeletingSong } = useDeleteSong();
  
  // Fetch all albums for song creation
  const { data: albums, isLoading: isLoadingAlbums } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAllAlbums,
  });
  
  // Fetch all songs for deletion
  const { data: songs, isLoading: isLoadingSongs } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchAllSongs,
  });

  // Song thumbnail
  const [thumbSongId, setThumbSongId] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { mutate: uploadThumbMutate, isPending: isUploadingThumb } = useUploadSongThumbnail();

  // Protect the page - redirect non-admin users
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return null;
  }

  // Album form submit
  const handleAlbumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", album.title);
    formData.append("description", album.description);
    if (album.thumnail) formData.append("thumnail", album.thumnail);
    createAlbumMutate(formData, {
      onSuccess: () => setAlbum({ title: "", description: "", thumnail: null }),
      onError: (error: unknown) => {
        toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create album");
      },
    });
  };

  // Album delete
  const handleAlbumDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumIdToDelete) {
      toast.error("Please select an album");
      return;
    }
    deleteAlbumMutate(
      { token: token ?? "", albumId: albumIdToDelete },
      {
        onSuccess: () => setAlbumIdToDelete(""),
        onError: (error: unknown) => {
          toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Album not found or failed to delete");
        },
      }
    );
  };

  // Song form submit
  const handleSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) {
      toast.error("Please select an album");
      return;
    }
    const formData = new FormData();
    formData.append("title", song.title);
    formData.append("description", song.description);
    formData.append("album_id", selectedAlbum.id.toString());
    if (song.audio) formData.append("audio", song.audio);
    createSongMutate(
      { token: token ?? "", songData: formData },
      {
        onSuccess: () => {
          setSong({ title: "", description: "", audio: null });
          setSelectedAlbum(null);
        },
        onError: (error: unknown) => {
          toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Album does not exist or failed to create song");
        },
      }
    );
  };

  // Song delete
  const handleSongDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songIdToDelete) {
      toast.error("Please select a song");
      return;
    }
    deleteSongMutate(
      { token: token ?? "", songId: songIdToDelete },
      {
        onSuccess: () => setSongIdToDelete(""),
        onError: (error: unknown) => {
          toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Song not found or failed to delete");
        },
      }
    );
  };

  // Song thumbnail upload
  const handleThumbnailUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbSongId || !thumbnail) {
      toast.error("Please enter song ID and select a thumbnail");
      return;
    }
    uploadThumbMutate(
      { token: token ?? "", songId: thumbSongId, thumbnail },
      {
        onSuccess: () => {
          setThumbSongId("");
          setThumbnail(null);
        },
        onError: (error: unknown) => {
          toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Song not found or failed to upload thumbnail");
        },
      }
    );
  };

  return (
    <Layout>
      <div className="pb-32 pt-10 px-4 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage albums, songs, and media</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("album")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "album"
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Albums
          </button>
          <button
            onClick={() => setActiveTab("song")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "song"
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Songs
          </button>
        </div>

        {/* Album Tab */}
        {activeTab === "album" && (
          <div className="space-y-6">
            {/* Create Album */}
            <form onSubmit={handleAlbumSubmit} className="bg-[#282828] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Create Album
              </h2>
              <div className="space-y-4">
                <input
                  className="w-full p-3 rounded bg-[#3e3e3e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Album Title"
                  value={album.title}
                  onChange={e => setAlbum({ ...album, title: e.target.value })}
                  required
                />
                <textarea
                  className="w-full p-3 rounded bg-[#3e3e3e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Album Description"
                  rows={3}
                  value={album.description}
                  onChange={e => setAlbum({ ...album, description: e.target.value })}
                />
                <div className="relative">
                  <input
                    className="w-full p-3 rounded bg-[#3e3e3e] text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white file:cursor-pointer hover:file:bg-green-700"
                    type="file"
                    accept="image/*"
                    onChange={e => setAlbum({ ...album, thumnail: e.target.files?.[0] || null })}
                    required
                  />
                </div>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isCreatingAlbum}
                >
                  {isCreatingAlbum ? "Creating..." : "Create Album"}
                </button>
              </div>
            </form>

            {/* Delete Album */}
            <form onSubmit={handleAlbumDelete} className="bg-[#282828] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Album
              </h2>
              <div className="space-y-4">
                {isLoadingAlbums ? (
                  <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                    Loading albums...
                  </div>
                ) : albums && albums.length > 0 ? (
                  <select
                    className="w-full p-3 rounded bg-[#3e3e3e] text-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    value={albumIdToDelete}
                    onChange={(e) => setAlbumIdToDelete(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select album to delete...</option>
                    {albums.map((album: { id: number; title: string }) => (
                      <option key={album.id} value={album.id}>
                        {album.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                    No albums available.
                  </div>
                )}
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isDeletingAlbum}
                >
                  {isDeletingAlbum ? "Deleting..." : "Delete Album"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Song Tab */}
        {activeTab === "song" && (
          <div className="space-y-6">
            {/* Create Song */}
            <form onSubmit={handleSongSubmit} className="bg-[#282828] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
                Create Song
              </h2>
              <div className="space-y-4">
                <input
                  className="w-full p-3 rounded bg-[#3e3e3e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Song Title"
                  value={song.title}
                  onChange={e => setSong({ ...song, title: e.target.value })}
                  required
                />
                
                {/* Album Selection Dropdown */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Select Album *</label>
                  {isLoadingAlbums ? (
                    <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                      Loading albums...
                    </div>
                  ) : albums && albums.length > 0 ? (
                    <select
                      className="w-full p-3 rounded bg-[#3e3e3e] text-white focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                      value={selectedAlbum?.id || ""}
                      onChange={(e) => {
                        const album = albums.find((a: { id: number }) => a.id === parseInt(e.target.value));
                        setSelectedAlbum(album || null);
                      }}
                      required
                    >
                      <option value="" disabled>Choose an album...</option>
                      {albums.map((album: { id: number; title: string; description: string }) => (
                        <option key={album.id} value={album.id}>
                          {album.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                      No albums available. Create an album first.
                    </div>
                  )}
                </div>
                
                <textarea
                  className="w-full p-3 rounded bg-[#3e3e3e] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Song Description"
                  rows={3}
                  value={song.description}
                  onChange={e => setSong({ ...song, description: e.target.value })}
                />
                
                <input
                  className="w-full p-3 rounded bg-[#3e3e3e] text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white file:cursor-pointer hover:file:bg-green-700"
                  type="file"
                  accept="audio/*"
                  onChange={e => setSong({ ...song, audio: e.target.files?.[0] || null })}
                  required
                />
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isCreatingSong}
                >
                  {isCreatingSong ? "Creating..." : "Create Song"}
                </button>
              </div>
            </form>

            {/* Delete Song */}
            <form onSubmit={handleSongDelete} className="bg-[#282828] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Song
              </h2>
              <div className="space-y-4">
                {isLoadingSongs ? (
                  <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                    Loading songs...
                  </div>
                ) : songs && songs.length > 0 ? (
                  <select
                    className="w-full p-3 rounded bg-[#3e3e3e] text-white focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    value={songIdToDelete}
                    onChange={(e) => setSongIdToDelete(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select song to delete...</option>
                    {songs.map((song: { id: number; title: string }) => (
                      <option key={song.id} value={song.id}>
                        {song.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                    No songs available.
                  </div>
                )}
                <button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isDeletingSong}
                >
                  {isDeletingSong ? "Deleting..." : "Delete Song"}
                </button>
              </div>
            </form>

            {/* Upload Song Thumbnail */}
            <form onSubmit={handleThumbnailUpload} className="bg-[#282828] p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Upload Song Thumbnail
              </h2>
              <div className="space-y-4">
                {isLoadingSongs ? (
                  <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                    Loading songs...
                  </div>
                ) : songs && songs.length > 0 ? (
                  <select
                    className="w-full p-3 rounded bg-[#3e3e3e] text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={thumbSongId}
                    onChange={(e) => setThumbSongId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select song...</option>
                    {songs.map((song: { id: number; title: string }) => (
                      <option key={song.id} value={song.id}>
                        {song.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full p-3 rounded bg-[#3e3e3e] text-gray-400">
                    No songs available.
                  </div>
                )}
                <input
                  className="w-full p-3 rounded bg-[#3e3e3e] text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
                  type="file"
                  accept="image/*"
                  onChange={e => setThumbnail(e.target.files?.[0] || null)}
                  required
                />
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isUploadingThumb}
                >
                  {isUploadingThumb ? "Uploading..." : "Upload Thumbnail"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AdminDashboard;