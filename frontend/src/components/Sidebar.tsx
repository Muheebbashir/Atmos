import { useNavigate } from "react-router-dom";
import { Home, Plus, Search, Library } from "lucide-react";

import PlayListCard from "./PlayListCard";
import { useAuthUser } from "../hooks/useAuthUser";

function SideBar() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  return (
    <div className="w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex">
      {/* Top Navigation Section */}
      <div className="bg-[#121212] rounded-lg p-2 space-y-1">
        <div
          className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-[#1a1a1a] rounded-md transition-colors group"
          onClick={() => navigate("/")}
        >
          <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          <p className="font-bold text-gray-300 group-hover:text-white transition-colors">Home</p>
        </div>
        <div className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-[#1a1a1a] rounded-md transition-colors group">
          <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
          <p className="font-bold text-gray-300 group-hover:text-white transition-colors">Search</p>
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-[#121212] h-[85%] rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors group">
            <Library className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
            <p className="font-bold text-gray-300 group-hover:text-white transition-colors">Your Library</p>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-full p-1 cursor-pointer transition-all" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div onClick={() => navigate("/playlist")} className="cursor-pointer">
            <PlayListCard />
          </div>

          {/* Podcast Card */}
          <div className="mx-2 my-4 bg-linear-to-br from-[#1e3a5f] to-[#121212] rounded-lg p-4 space-y-3">
            <h2 className="font-bold text-white text-base">
              Let's find some podcasts to follow
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              We'll keep you updated on new episodes
            </p>
            <button className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:scale-105 hover:bg-gray-100 transition-transform">
              Browse Podcasts
            </button>
          </div>

          {/* Admin Dashboard Button */}
          {user?.role === 'admin' && (
            <div className="mx-2 mb-4 bg-linear-to-br from-[#1f5f3a] to-[#121212] rounded-lg p-4 space-y-3">
              <h2 className="font-bold text-white text-base">
                Admin Panel
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Manage your music library
              </p>
              <button
                className="w-full px-5 py-2 bg-green-500 text-white text-sm font-bold rounded-full hover:scale-105 hover:bg-green-400 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/admin/dashboard');
                }}
              >
                Admin Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Legal Links Footer */}
        <div className="px-6 py-4 text-xs text-gray-400 space-y-2 border-t border-gray-800">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a href="#" className="hover:text-white transition-colors">Legal</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Center</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
          <div>
            <a href="#" className="hover:text-white transition-colors">About Ads</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
