import { useQuery } from "@tanstack/react-query";
import { fetchAllAlbums } from "../api/albumApi";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import PageLoader from "./PageLoader";
import { Play } from "lucide-react";

interface Album {
  id: number;
  title: string;
  description: string;
  thumnail: string;
}

function Albums() {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAllAlbums,
  });

  useEffect(() => {
    if (error) {
      toast.error("Error loading albums");
    }
    if (isSuccess) {
      toast.success("Albums loaded!");
    }
  }, [error, isSuccess]);

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white mt-5">Featured Charts</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {data?.map((album: Album) => (
          <div
            key={album.id}
            className="group  hover:bg-[#282828] transition-all duration-300 p-4 rounded-lg cursor-pointer"
          >
            {/* Image wrapper */}
            <div className="relative mb-4">
              <img
                src={album.thumnail}
                alt={album.title}
                className="w-full aspect-square object-cover rounded mb-2"
              />

              {/* Play button */}
              <button
                className="absolute bottom-3 right-3
              bg-green-500 text-black
              rounded-full p-3
              opacity-0 translate-y-2
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300
              shadow-xl
            "
              >
                 <Play size={18} fill="black" />
              </button>
            </div>

            {/* Text */}
            <h3 className="font-semibold text-lg wrap-break-words">{album.title}</h3>

            <p className="text-sm text-gray-300 wrap-break-words">
              {album.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albums;
