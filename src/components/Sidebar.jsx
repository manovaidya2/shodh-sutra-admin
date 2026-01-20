import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/sodh-xjs7gDFq.png";
import {
  FaTachometerAlt,
  FaBook,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaFileAlt,
  FaCalendarAlt,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaWpforms,
} from "react-icons/fa";

const Sidebar = () => {
  const [openForms, setOpenForms] = useState(false);

  return (
    <div className="w-64 bg-yellow-500 text-black h-full p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-6">
        <img src={logo} alt="IIST Logo" className="w-40 h-15 object-contain" />
        {/* <span className="ml-3 text-xl font-bold text-blue-900">ShodhSutra</span> */}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ================= STUDENT ================= */}
        <div className="mb-6">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>

            <li className="mb-2">
              <Link
                to="/consultations"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaBook /> CONSULTATIONS DATA
              </Link>
            </li>

            <li className="mb-2">
              <Link
                to="/gallery"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaBook /> Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= ADMIN ================= */}
        {/* <div className="mb-6">
          <h3 className="text-blue-900 font-semibold mb-2 border-b border-blue-900 pb-1">
            Admin
          </h3>
          <ul>
            <li className="mb-2">
              <Link
                to="/admin_skill"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaUserGraduate /> Skill Program
              </Link>
            </li>

            <li className="mb-2">
              <Link
                to="/skill-program-details"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaUserGraduate /> Skill Program Details
              </Link>
            </li>

            <li className="mb-2">
              <Link
                to="/admin-gallery"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaChalkboardTeacher /> Gallery
              </Link>
            </li>

            <li className="mb-2">
              <Link
                to="/contact-list"
                className="flex items-center gap-2 px-2 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors duration-200"
              >
                <FaFileAlt /> Contact
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
