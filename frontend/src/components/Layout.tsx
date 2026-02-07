import Navbar from "./Navbar";
import SideBar from "./Sidebar";
import React, { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen pb-24">
      <div className="h-full flex">
        <SideBar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="w-full m-2 px-3 sm:px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0">
            <Navbar setIsMobileMenuOpen={setIsMobileMenuOpen} />
            {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
