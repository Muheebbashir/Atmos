import PageLoader from "./PageLoader";
import { Play, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { useAlbums } from "../hooks/useAlbums";
import type { Album } from "../types";
import { toast } from "react-hot-toast";

function Albums() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuthUser();
  const { albums, isLoading } = useAlbums();

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

  // Check if user is premium
  const isPremiumUser = authUser?.subscriptionType === "premium" && 
                        authUser?.subscriptionStatus === "active" &&
                        authUser?.subscriptionEndDate &&
                        new Date(authUser.subscriptionEndDate) > new Date();

  // ▶️ play album
  const handlePlayAlbum = (album: Album) => {
    requireAuth(() => {
      // Check if album is premium and user is not premium
      if (album.isPremium && !isPremiumUser) {
        toast.error("This is a premium album. Please upgrade to premium to listen.");
        navigate("/pricing");
        return;
      }
      
      navigate(`/album/${album.id}`);
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white mt-5">
        Featured Charts
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {albums?.map((album: Album) => (
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

              {/* PREMIUM BADGE */}
              {album.isPremium && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold shadow-lg">
                  <Crown size={12} fill="black" />
                  <span>PREMIUM</span>
                </div>
              )}

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
