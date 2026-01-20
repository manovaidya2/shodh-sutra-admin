import React, { useState } from "react";

export default function Dashboard() {
  const [role, setRole] = useState("admin");

  return (
    <div className="relative min-h-screen bg-gray-50 p-8 overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>

      {/* Role Buttons */}
      <div className="flex justify-center gap-4 mb-10">
        <button
          onClick={() => setRole("student")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            role === "student"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-gray-700 border"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setRole("teacher")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            role === "teacher"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-white text-gray-700 border"
          }`}
        >
          Teacher
        </button>
        <button
          onClick={() => setRole("admin")}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            role === "admin"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-white text-gray-700 border"
          }`}
        >
          Admin
        </button>
      </div>

      {/* Dashboard Header */}
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
        📊 {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h2>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Orders */}
        <div className="relative bg-white rounded-2xl p-6 shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-4">
            {role === "student" ? "120" : role === "teacher" ? "340" : "1,245"}
          </p>
        </div>

        {/* Revenue */}
        <div className="relative bg-white rounded-2xl p-6 shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-green-100 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
          <p className="text-3xl font-bold text-green-600 mt-4">
            {role === "student"
              ? "$2,500"
              : role === "teacher"
              ? "$15,000"
              : "$45,000"}
          </p>
        </div>

        {/* Users */}
        <div className="relative bg-white rounded-2xl p-6 shadow-lg overflow-hidden transform transition hover:scale-105">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl"></div>
          <h3 className="text-lg font-semibold text-gray-700">Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-4">
            {role === "student" ? "50" : role === "teacher" ? "120" : "650"}
          </p>
        </div>
      </div>
    </div>
  );
}
