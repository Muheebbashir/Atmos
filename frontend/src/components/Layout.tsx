import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import React, { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen pb-15 lg:pb-21 bg-black">
      <div className="h-full flex">
        <SideBar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="w-full m-2 lg:m-0 lg:mt-2 lg:mb-2 px-3 sm:px-6 lg:pl-6 lg:pr-0 pt-4 rounded lg:rounded-l-lg lg:rounded-r-none bg-[#121212] text-white overflow-auto flex-1">
            <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <div className="lg:pr-4">
              {children}
            </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
