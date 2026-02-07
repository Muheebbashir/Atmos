import { useNavigate } from "react-router-dom";
import { Home, Plus, Search, Library, X } from "lucide-react";
import PlayListCard from "./PlayListCard";
import { useAuthUser } from "../hooks/useAuthUser";

interface SideBarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

function SideBar({ isMobileMenuOpen, setIsMobileMenuOpen }: SideBarProps) {
  const navigate = useNavigate();
  const { user } = useAuthUser();

  // Check if user is premium
  // const isPremiumUser = user?.subscriptionType === "premium" && 
  //                       user?.subscriptionStatus === "active" &&
  //                       user?.subscriptionEndDate &&
  //                       new Date(user.subscriptionEndDate) > new Date();

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay - Spotify Style */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Spotify Style */}
      <div className={`
        fixed lg:relative
        w-[85vw] max-w-[320px] lg:w-[25%]
        h-full
        p-2 flex flex-col gap-2 text-white
        bg-black lg:bg-transparent
        transition-all duration-300 ease-out
        z-50 lg:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      style={{ 
        boxShadow: isMobileMenuOpen ? '8px 0 32px rgba(0, 0, 0, 0.6)' : 'none' 
      }}
      >
      {/* Close button for mobile - Modern Style */}
      <button
        onClick={() => setIsMobileMenuOpen(false)}
        className="lg:hidden absolute top-3 right-3 z-10 text-white bg-[#282828] hover:bg-[#3e3e3e] rounded-full p-2.5 transition-all hover:scale-110 active:scale-95 shadow-lg"
        aria-label="Close menu"
      >
        <X size={20} strokeWidth={2.5} />
      </button>

        {/* Logo Section */}
        <div className="flex items-center gap-3 px-4 py-3 mb-1 mt-12 lg:mt-0">
          <img 
            src="/logo.png" 
            alt="Atmos Premium" 
            className="w-10 h-10 object-contain"
          />
          <h1 className="text-2xl font-bold text-white">Atmos</h1>
        </div>

      {/* Top Navigation Section */}
      <div className="bg-[#121212] rounded-lg p-2 space-y-1 shrink-0">
        <div
          className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-[#1a1a1a] active:bg-[#252525] rounded-md transition-all group"
          onClick={() => handleNavigate("/")}
        >
          <Home className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
          <p className="font-semibold text-gray-300 group-hover:text-white transition-colors">Home</p>
        </div>
        <div
          className="flex items-center gap-4 px-4 py-3.5 cursor-pointer hover:bg-[#1a1a1a] active:bg-[#252525] rounded-md transition-all group"
          onClick={() => handleNavigate("/search")}
        >
          <Search className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
          <p className="font-semibold text-gray-300 group-hover:text-white transition-colors">Search</p>
        </div>
      </div>

      {/* Library Section - Flexible Layout */}
      <div className="bg-[#121212] flex-1 rounded-lg flex flex-col overflow-hidden min-h-0">
        <div className="p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 cursor-pointer hover:text-white transition-colors group">
            <Library className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
            <p className="font-semibold text-gray-300 group-hover:text-white transition-colors">Your Library</p>
          </div>
          <div className="flex items-center gap-2">
            <Plus className="w-9 h-9 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-full p-2 cursor-pointer transition-all active:scale-95" strokeWidth={2} />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-[#3e3e3e] hover:scrollbar-thumb-[#535353] scrollbar-track-transparent">
          <div onClick={() => handleNavigate("/playlist")} className="cursor-pointer">
            <PlayListCard />
          </div>

          {/* Admin Dashboard Button */}
          {user?.role === 'admin' && (
            <div className="mx-2 mb-4 bg-gradient-to-br from-[#1f5f3a] to-[#0a1f14] rounded-lg p-4 space-y-3 border border-green-500/20 shadow-lg">
              <h2 className="font-bold text-white text-base">
                Admin Panel
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Manage your music library
              </p>
              <button
                className="w-full px-5 py-2.5 bg-green-500 text-black text-sm font-bold rounded-full hover:scale-105 hover:bg-green-400 active:scale-95 transition-all shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate('/admin/dashboard');
                }}
              >
                Admin Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Legal Links Footer - Always Visible */}
        <div className="px-4 py-3 text-[11px] text-gray-500 space-y-2 border-t border-gray-800/50 shrink-0 bg-[#121212]">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-white hover:underline transition-colors">Legal</a>
            <a href="#" className="hover:text-white hover:underline transition-colors">Privacy Center</a>
            <a href="#" className="hover:text-white hover:underline transition-colors">Privacy Policy</a>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <a href="#" className="hover:text-white hover:underline transition-colors">Cookies</a>
            <a href="#" className="hover:text-white hover:underline transition-colors">About Ads</a>
          </div>
          <div className="text-gray-600 text-[10px] mt-2">
            © 2026 Atmos Clone
          </div>
        </div>
      </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

export default SideBar;
