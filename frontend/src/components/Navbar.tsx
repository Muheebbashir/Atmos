import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useAuthUser } from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";

function Navbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { isAuthenticated, isLoading } = useAuthUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: ["authUser"] });
    navigate("/login");
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full flex justify-between items-center">
        {/* LEFT NAV BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/70 hover:bg-black rounded-full p-2 transition cursor-pointer"
          >
            <ChevronLeft className="text-white w-4 h-4" />
          </button>

          <button
            onClick={() => navigate(1)}
            className="bg-black/70 hover:bg-black rounded-full p-2 transition cursor-pointer"
          >
            <ChevronRight className="text-white w-4 h-4" />
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {/* TEXT LINKS */}
          <div className="hidden md:flex items-center gap-5 text-gray-400">
            <span className="cursor-pointer hover:text-white transition">
              Premium
            </span>
            <span className="cursor-pointer hover:text-white transition">
              Support
            </span>
            <span className="cursor-pointer hover:text-white transition">
              Download
            </span>
          </div>

          {/* DIVIDER */}
          <div className="hidden md:block h-6 w-px bg-white/20" />

          {/* INSTALL APP */}
          <button className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white transition cursor-pointer">
            <span className="bg-black rounded-full p-1.5">
              <Download size={14} />
            </span>
            Install App
          </button>

          {/* AUTH SECTION */}
          {!isLoading && !isAuthenticated && (
            <>
              <span
                className="text-gray-400 cursor-pointer hover:text-white transition"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>

              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black px-6 py-1.5 rounded-full hover:scale-105 transition font-bold cursor-pointer"
              >
                Log in
              </button>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-white text-black px-6 py-1.5 rounded-full hover:scale-105 transition font-bold cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY BAR */}
      <div className="flex items-center gap-2 mt-4">
        <button className="bg-white text-black px-4 py-1 rounded-full text-sm">
          All
        </button>
        <button className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full text-sm hidden md:block">
          Music
        </button>
        <button className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full text-sm hidden md:block">
          Podcasts
        </button>
        <button
          className="bg-[#2a2a2a] text-white px-4 py-1 rounded-full text-sm md:hidden"
          onClick={() => navigate("/playlist")}
        >
          Playlist
        </button>
      </div>
    </>
  );
}

export default Navbar;
