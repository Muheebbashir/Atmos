import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchSongById } from "../api/songApi";
import PageLoader from "../components/PageLoader";

const SongDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ["song", id],
    queryFn: () => fetchSongById(id!),
    enabled: !!id,
  });

  if (isLoading) return <PageLoader />;
  if (error) return <div className="text-red-500">Error loading song.</div>;
  if (!data) return <div className="text-gray-400">No song found.</div>;

  const song = data;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-[#181818] p-8 rounded-lg shadow-lg text-white">
      <img src={song.thumnail} alt={song.title} className="w-full h-64 object-cover rounded mb-6" />
      <h1 className="text-3xl font-bold mb-2">{song.title}</h1>
      <p className="text-lg text-gray-300 mb-4">{song.description}</p>
      <audio controls src={song.audio} className="w-full mt-4" />
      <div className="text-sm text-gray-400 mt-4">Album ID: {song.album_id}</div>
      <div className="text-sm text-gray-400">Uploaded: {new Date(song.created_at).toLocaleString()}</div>
    </div>
  );
};

export default SongDetails;
