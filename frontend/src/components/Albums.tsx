import { useQuery } from "@tanstack/react-query";
import { fetchAllAlbums } from "../api/albumApi";
//import { useEffect } from "react";
//import { toast } from "react-hot-toast";
import PageLoader from "./PageLoader";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

interface Album {
  id: number;
  title: string;
  description: string;
  thumnail: string;
}

function Albums() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthUser();

  const { data, isLoading } = useQuery({
    queryKey: ["albums"],
    queryFn: fetchAllAlbums,
  });

  /*useEffect(() => {
    if (error) toast.error("Error loading albums");
    if (isSuccess) toast.success("Albums loaded!");
  }, [error, isSuccess]);*/

  if (isLoading) return <PageLoader />;

  // 🔒 auth guard
  const requireAuth = (action: () => void) => {
    if (authLoading) return;

    if (!isAuthenticated) {
     // toast.error("Please login to play albums");
      navigate("/login");
      return;
    }

    action();
  };

  // ▶️ play album
  const handlePlayAlbum = (album: Album) => {
    requireAuth(() => {
      console.log("Playing album:", album);
      // TODO: navigate to album page or start playback
      // navigate(`/album/${album.id}`);
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white mt-5">
        Featured Charts
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {data?.map((album: Album) => (
          <div
            key={album.id}
            className="group hover:bg-[#282828] transition-all duration-300 p-4 rounded-lg"
          >
            {/* Image */}
            <div className="relative mb-4">
              <img
                src={album.thumnail}
                alt={album.title}
                className="w-full aspect-square object-cover rounded mb-2"
              />

              {/* PLAY BUTTON */}
              <button
                onClick={() => handlePlayAlbum(album)}
                className="
                  absolute bottom-3 right-3
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

            {/* TEXT */}
            <h3 className="font-semibold text-lg text-white wrap-break-words">
              {album.title}
            </h3>

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
