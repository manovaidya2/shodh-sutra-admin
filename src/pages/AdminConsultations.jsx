import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const result = consultations.filter(
      (item) =>
        item.fullName.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase()) ||
        item.phone.includes(search)
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [search, consultations]);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://api.shodhsutra.com/api/consultation");
      setConsultations(res.data.data);
      setFiltered(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const deleteConsultation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(
        `https://api.shodhsutra.com/api/consultation/${id}`
      );
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 md:p-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all PhD consultation requests
        </p>
      </div>

      {/* Stats & Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow flex-1">
          <p className="text-sm text-gray-500">Total Requests</p>
          <h2 className="text-3xl font-bold text-indigo-600">
            {consultations.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex-1">
          <p className="text-sm text-gray-500 mb-2">Search</p>
          <input
            type="text"
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-indigo-600">
            <tr>
              {["#", "Name", "Email", "Phone", "Date", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-sm font-semibold text-white"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-indigo-50 transition"
                >
                  <td className="px-6 py-4">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {item.fullName}
                  </td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">{item.phone}</td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => setSelected(item)}
                      className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => deleteConsultation(item._id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">
              {selected.fullName}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selected.email} | {selected.phone}
            </p>
            <p className="text-gray-700 mb-6">
              {selected.message || "No message"}
            </p>
            <button
              onClick={() => setSelected(null)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsultations;
