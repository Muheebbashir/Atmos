import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Crown, Menu } from "lucide-react";
import { useAuthUser } from "../hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ConfirmLogout from "./ConfirmLogout";

interface NavbarProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

function Navbar({ setIsMobileMenuOpen }: NavbarProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const { isAuthenticated, isLoading, user: authUser } = useAuthUser();

  // Check if user is premium
  const isPremiumUser = authUser?.subscriptionType === "premium" && 
                        authUser?.subscriptionStatus === "active" &&
                        authUser?.subscriptionEndDate &&
                        new Date(authUser.subscriptionEndDate) > new Date();

  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.removeQueries({ queryKey: ["authUser"] });
    window.location.reload(); // Force re-evaluation everywhere
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="w-full flex justify-between items-center lg:pr-6">
        {/* LEFT NAV BUTTONS */}
        <div className="flex items-center gap-2">
          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden bg-black/70 hover:bg-black rounded-full p-2 transition cursor-pointer"
          >
            <Menu className="text-white w-5 h-5" />
          </button>
          
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
        <div className="flex items-center gap-2 md:gap-6 text-sm font-medium">
          {/* TEXT LINKS */}
          <div className="hidden md:flex items-center gap-5 text-gray-400">
            <span 
              onClick={() => navigate("/support")}
              className="cursor-pointer hover:text-white transition"
            >
              Support
            </span>
            <span className="cursor-pointer hover:text-white transition">
              Download
            </span>
          </div>

          {/* Premium Badge - All Devices */}
          {isAuthenticated && isPremiumUser && (
            <div 
              onClick={() => navigate("/pricing")}
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 md:px-3 py-1 rounded-full font-bold cursor-pointer hover:scale-105 transition text-xs md:text-sm"
            >
              <Crown size={12} className="md:w-3.5 md:h-3.5" fill="black" />
              <span>Premium</span>
            </div>
          )}

          {isAuthenticated && !isPremiumUser && (
            <span 
              onClick={() => navigate("/pricing")}
              className="text-gray-400 cursor-pointer hover:text-white transition text-xs md:text-sm"
            >
              Premium
            </span>
          )}

          {!isAuthenticated && (
            <span 
              onClick={() => navigate("/pricing")}
              className="hidden sm:block text-gray-400 cursor-pointer hover:text-white transition text-xs md:text-sm"
            >
              Premium
            </span>
          )}

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
                className="text-gray-400 cursor-pointer hover:text-white transition text-sm"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>

              <button
                onClick={() => navigate("/login")}
                className="bg-white text-black px-4 sm:px-6 py-1.5 rounded-full hover:scale-105 transition font-bold cursor-pointer text-sm sm:text-base "
              >
                Log in
              </button>
            </>
          )}

          {!isLoading && isAuthenticated && (
            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              className="bg-white text-black px-4 sm:px-6 py-1.5 rounded-full hover:scale-105 transition font-bold cursor-pointer text-sm sm:text-base"
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
      </div>
      <ConfirmLogout
        isOpen={isLogoutConfirmOpen}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </>
  );
}

export default Navbar;
