import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Phone, MapPin, Calendar, MessageCircle } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/admin/all");
        setAppointments(res.data.appointments || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* LOADING STATE */
  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  /* EMPTY STATE */
  if (!appointments.length) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-2">
          No Appointments
        </h2>
        <p className="text-gray-500">
          New appointment requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            Appointments
          </h2>
          <p className="text-gray-500 mt-1">
            Total: {appointments.length}
          </p>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-100 to-purple-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr
                key={item._id}
                className="border-t hover:bg-purple-50 transition"
              >
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.phone}</td>
                <td className="p-4">{item.location}</td>
                <td className="p-4">
                  {new Date(item.date).toLocaleDateString()}
                </td>
                <td className="p-4 text-gray-600">
                  {item.message || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-5 md:hidden">
        {appointments.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow p-5 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-purple-700">
                {item.name}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={16} />
              {item.phone}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              {item.location}
            </div>

            {item.message && (
              <div className="flex gap-2 text-gray-600">
                <MessageCircle size={16} className="mt-1" />
                <p className="text-sm">{item.message}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
