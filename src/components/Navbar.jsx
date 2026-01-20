import React, { useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import logo from "../assets/sodh-xjs7gDFq.png";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Top Navbar (Sticky) */}
      <nav className="bg-yellow-500 p-4 md:p-6 text-white flex justify-between items-center md:ml-64 fixed top-0 left-0 right-0 z-40">
        {/* Left: Menu icon + Logo */}
        <div className="flex items-center gap-4">
          {/* Menu Icon for mobile */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars />
          </button>

          {/* Logo */}
          <img
            src={logo}
            alt="ShodhSutra Logo"
            className="w-40 h-10 object-contain"
          />
          {/* <span className="font-bold text-lg">Dr Ankush Garg</span> */}
        </div>

        {/* Right: Profile/Logout */}
        <div className="flex items-center gap-4">
          <span>Profile</span>
          <span>|</span>
          <button className="flex items-center gap-1 hover:text-gray-300">
            <FaSignOutAlt /> Logout
          </button>
        </div>
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
