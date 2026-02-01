import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Search,
  Eye,
  Trash2,
  X,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Building,
  GraduationCap,
  Briefcase,
  MapPin,
  Calendar,
  BookOpen
} from "lucide-react";

export default function AdminMentorsDashboard() {
  const [mentors, setMentors] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/mentor?search=${search}`);
      setMentors(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor?")) return;
    try {
      await axiosInstance.delete(`/mentor/${id}`);
      alert("Deleted Successfully");
      fetchMentors();
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      alert("Delete Failed");
    }
  };

  const toggle = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Applications Dashboard</h1>
        <p className="text-gray-600">Complete management of research mentor profiles</p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by mentor name, email, or research field..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button onClick={fetchMentors} className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE: MENTOR LIST */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/30">
              <h2 className="text-xl font-bold text-gray-800">Applications ({mentors.length})</h2>
              <button onClick={fetchMentors} className="text-sm font-medium text-blue-600 hover:text-blue-800">Refresh</button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-16 text-center">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto rounded-full"></div>
                  <p className="mt-4 text-gray-500 font-medium">Fetching mentors...</p>
                </div>
              ) : mentors.length === 0 ? (
                <div className="p-16 text-center text-gray-400 font-medium">No applications found.</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-gray-500 text-xs uppercase font-bold tracking-wider">
                      <th className="px-6 py-4 text-left">Mentor Details</th>
                      <th className="px-6 py-4 text-left">Contact</th>
                      <th className="px-6 py-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mentors.map((m) => (
                      <tr key={m._id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                              {m?.personalInfo?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{m?.personalInfo?.name}</p>
                              <p className="text-xs text-blue-600 font-bold">{m?.basicInfo?.areaOfResearch}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <p className="font-medium text-gray-700">{m?.contactInfo?.email}</p>
                          <p className="text-gray-400">{m?.contactInfo?.mobile}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setSelected(m)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200">
                              <Eye size={18} />
                            </button>
                            <button onClick={() => handleDelete(m._id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: QUICK PREVIEW */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
              <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Quick View</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 border-b pb-6">
                  <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-black">
                    {selected?.personalInfo?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 leading-tight">{selected?.personalInfo?.name}</h4>
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-tighter">{selected?.professionalInfo?.profession}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-gray-700 font-semibold">{selected?.basicInfo?.institution}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap size={16} className="text-gray-400" />
                    <span className="text-gray-700 font-semibold">{selected?.educationInfo?.phdBoard} (Ph.D)</span>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center gap-3 ${selected?.consent ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                   <CheckCircle size={20} className={selected?.consent ? "text-green-600" : "text-red-500"}/>
                   <span className="font-bold text-sm italic">Consent: {selected?.consent ? "Certified" : "Declined"}</span>
                </div>

                <button onClick={() => setSelected(selected)} className="w-full py-4 bg-gray-900 text-white rounded-xl font-black hover:bg-black transform transition-active active:scale-95 shadow-lg">
                  VIEW FULL PROFILE
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <User size={40} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold">Select a mentor to review complete application</p>
            </div>
          )}
        </div>
      </div>

      {/* FULL PROFILE MODAL (FETCHES ALL DATA INCLUDING EDUCATIONAL) */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto backdrop-blur-md">
          <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl my-6 overflow-hidden flex flex-col">
            
            {/* MODAL HEADER */}
            <div className="p-8 border-b bg-white flex justify-between items-center sticky top-0 z-30">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                   <FileText size={28}/>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">MN-{selected._id?.slice(-8).toUpperCase()}</h2>
                  <p className="text-gray-500 font-bold flex items-center gap-2">
                    <Calendar size={14}/> Submitted: {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-red-500"><X size={32}/></button>
            </div>

            {/* MODAL BODY */}
            <div className="p-8 space-y-10 bg-gray-50/50">
              
              {/* TOP GRID: PERSONAL & CONTACT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section>
                  <h3 className="text-xl font-black text-gray-900 mb-5 border-l-4 border-blue-600 pl-4">Mentor Identity</h3>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                    <ProfileField label="Full Name" value={selected?.personalInfo?.name} />
                    <ProfileField label="Father's Name" value={selected?.personalInfo?.father} />
                    <ProfileField label="Mother's Name" value={selected?.personalInfo?.mother} />
                    <ProfileField label="Date of Birth" value={formatDate(selected?.personalInfo?.dob)} />
                    <ProfileField label="Address" value={`${selected?.contactInfo?.presentAddress}, ${selected?.contactInfo?.presentZip}`} />
                    <ProfileField label="Mobile" value={selected?.contactInfo?.mobile} />
                    <ProfileField label="Email" value={selected?.contactInfo?.email} />
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-black text-gray-900 mb-5 border-l-4 border-blue-600 pl-4">Professional & Research</h3>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                    <ProfileField label="Institution" value={selected?.basicInfo?.institution} />
                    <ProfileField label="Department" value={selected?.basicInfo?.department} />
                    <ProfileField label="Profession" value={selected?.professionalInfo?.profession} />
                    <ProfileField label="Experience" value={`${selected?.professionalInfo?.experience} Years`} />
                    <ProfileField label="Research Area" value={selected?.basicInfo?.areaOfResearch} />
                    <ProfileField label="Total Papers" value={selected?.researchInfo?.papers} />
                  </div>
                </section>
              </div>

              {/* EDUCATIONAL DETAILS SECTION (NEWLY ADDED) */}
              <section>
                <h3 className="text-xl font-black text-gray-900 mb-5 border-l-4 border-blue-600 pl-4">Educational Qualification</h3>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left font-bold text-gray-600">
                        <th className="px-6 py-4">Standard</th>
                        <th className="px-6 py-4">Board / University / Institute</th>
                        <th className="px-6 py-4">Status / Grade</th>
                        <th className="px-6 py-4">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <EduRow label="10th / Senior Secondary" board={selected?.educationInfo?.class10Board} grade={selected?.educationInfo?.class10Grade} year={selected?.educationInfo?.class10Year} />
                      <EduRow label="12th / Higher Secondary" board={selected?.educationInfo?.class12Board} grade={selected?.educationInfo?.class12Grade} year={selected?.educationInfo?.class12Year} />
                      <EduRow label="Graduation" board={selected?.educationInfo?.gradBoard} grade={selected?.educationInfo?.gradGrade} year={selected?.educationInfo?.gradYear} />
                      <EduRow label="Post Graduation" board={selected?.educationInfo?.pgBoard} grade={selected?.educationInfo?.pgGrade} year={selected?.educationInfo?.pgYear} />
                      <EduRow label="Ph.D / Research" board={selected?.educationInfo?.phdBoard} grade={selected?.educationInfo?.phdGrade} year={selected?.educationInfo?.phdYear} highlight />
                    </tbody>
                  </table>
                </div>
              </section>

              {/* DETAILED RESPONSES (ACCORDIONS) */}
              <section className="space-y-4">
                <h3 className="text-xl font-black text-gray-900 mb-5 border-l-4 border-blue-600 pl-4">Assessment Responses</h3>
                <Accordion title="Experience with PhD Aspirants" data={selected.studentInteraction} id="qa1" expanded={expanded} onToggle={toggle} />
                <Accordion title="Guidance Challenges" data={selected.challengesSection} id="qa2" expanded={expanded} onToggle={toggle} />
                <Accordion title="Incident-Based Reflection" data={selected.incidentsSection} id="qa3" expanded={expanded} onToggle={toggle} />
                <Accordion title="Collaboration Intent" data={selected.intentSection} id="qa4" expanded={expanded} onToggle={toggle} />
                <Accordion title="Ecosystem Reflection" data={selected.reflectionSection} id="qa5" expanded={expanded} onToggle={toggle} />
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function ProfileField({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-gray-800 text-right">{value || "—"}</span>
    </div>
  );
}

function EduRow({ label, board, grade, year, highlight }) {
  if (!board) return null;
  return (
    <tr className={`${highlight ? 'bg-blue-50/50' : ''}`}>
      <td className="px-6 py-4 font-bold text-gray-700">{label}</td>
      <td className="px-6 py-4 text-gray-600 font-medium">{board}</td>
      <td className="px-6 py-4 text-gray-600 font-medium">{grade}</td>
      <td className="px-6 py-4 text-gray-600 font-bold">{year}</td>
    </tr>
  );
}

function Accordion({ title, data, id, expanded, onToggle }) {
  if (!data?.length) return null;
  const isOpen = expanded[id];

  return (
    <div className="border border-gray-100 rounded-2xl bg-white shadow-sm overflow-hidden transition-all">
      <button onClick={() => onToggle(id)} className="w-full flex justify-between items-center p-6 hover:bg-gray-50 font-bold text-gray-800">
        <span>{title}</span>
        {isOpen ? <ChevronUp className="text-blue-600"/> : <ChevronDown className="text-gray-400"/>}
      </button>
      {isOpen && (
        <div className="p-8 bg-gray-50 border-t border-gray-100 space-y-6">
          {data.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-sm font-black text-gray-900 leading-snug">{item.question}</p>
              <div className="p-4 bg-white rounded-xl border border-gray-100 text-sm text-gray-600 font-medium shadow-sm">
                 {Array.isArray(item.answer) ? item.answer.join(" • ") : item.answer || "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}