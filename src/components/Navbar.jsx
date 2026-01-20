import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Top Navbar (Sticky) */}
      <nav className="bg-blue-900 p-6 text-white flex justify-between items-center md:ml-64 fixed top-0 left-0 right-0 z-40">
        {/* Menu Icon for mobile */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars />
        </button>

        <div className="font-bold">dr Ankush Garg </div>
        <div>Profile | Logout</div>
      </nav>

      {/* Sidebar always visible on desktop */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64">
        <Sidebar className="h-screen" />
      </div>

      {/* Sidebar overlay on mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <Sidebar className="h-full w-64 bg-gray-800" />
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Spacer for navbar height */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
