import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar space is handled inside Navbar */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 bg-gray-100 min-h-screen md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
