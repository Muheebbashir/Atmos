import Navbar from "./Navbar";
import Player from "./Player";
import SideBar from "./Sidebar";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <div className="h-screen">
      <div className="h-[90%] flex">
        <SideBar />
        <div className="w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w[75%] lg:ml-0">
            <Navbar />
            {children}
        </div>
      </div>
      <Player/>
    </div>
  );
}

export default Layout;
