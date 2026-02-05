import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Search, Eye, Trash2, X, User, Mail, Phone, FileText, CheckCircle,
  ChevronDown, ChevronUp, Building, GraduationCap, Briefcase,
  Calendar, BookOpen, Download, Image as ImageIcon, File, Award
} from "lucide-react";

export default function AdminMentorsDashboard() {
  const [mentors, setMentors] = useState([]);
  const [selected, setSelected] = useState(null); // Sidebar data
  const [showModal, setShowModal] = useState(false); // Modal visibility
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

  useEffect(() => { fetchMentors(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this mentor?")) return;
    try {
      await axiosInstance.delete(`/mentor/${id}`);
      fetchMentors();
      if (selected?._id === id) {
        setSelected(null);
        setShowModal(false);
      }
    } catch (err) { alert("Delete Failed"); }
  };

  const toggleAccordion = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const getFileUrl = (path) => {
    if (!path) return "";
    const baseUrl = "https://api.shodhsutra.com/"; // Apne backend ka URL yahan check karein
    return `${baseUrl}${path.replace(/\\/g, "/")}`;
  };

  const openFullProfile = (mentor) => {
    setSelected(mentor);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Applications Dashboard</h1>
        <p className="text-gray-600">Review all details, educational records, and documents</p>
      </div>

      {/* SEARCH SECTION */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button onClick={fetchMentors} className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIST SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">Mentors List</h2>
              <button onClick={fetchMentors} className="text-sm font-medium text-blue-600">Refresh</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-xs uppercase font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Mentor</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mentors.map((m) => (
                    <tr key={m._id} className={`hover:bg-blue-50/30 transition-colors ${selected?._id === m._id ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold uppercase">
                            {m?.personalInfo?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{m?.personalInfo?.name}</p>
                            <p className="text-xs text-blue-600 font-bold uppercase">{m?.basicInfo?.areaOfResearch}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-medium text-gray-700">{m?.contactInfo?.email}</p>
                        <p className="text-gray-400">{m?.contactInfo?.mobile}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
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
            </div>
          </div>
        </div>

        {/* SIDE PREVIEW */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
              <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Quick View</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gray-100 rounded-2xl flex items-center justify-center text-blue-600 text-xl font-black shadow-inner">
                    {selected?.personalInfo?.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 leading-tight">{selected?.personalInfo?.name}</h4>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{selected?.professionalInfo?.profession}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                   <SidebarItem icon={<Building size={16}/>} label="Institution" value={selected?.basicInfo?.institution} />
                   <SidebarItem icon={<GraduationCap size={16}/>} label="Highest Qual." value={selected?.educationInfo?.phdBoard} />
                </div>

                <button 
                  onClick={() => openFullProfile(selected)} 
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-black hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  OPEN FULL PROFILE
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200">
              <User size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">Select a mentor to review data</p>
            </div>
          )}
        </div>
      </div>

      {/* FULL PROFILE MODAL */}
      {showModal && selected && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl my-6 overflow-hidden flex flex-col relative">
            
            {/* MODAL HEADER */}
            <div className="p-8 border-b bg-white flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                   <FileText size={28}/>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selected?.personalInfo?.name}</h2>
                  <p className="text-gray-500 font-bold text-xs uppercase flex items-center gap-2">
                    <Calendar size={14}/> ID: MN-{selected._id?.slice(-8).toUpperCase()} • Submitted: {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-all"><X size={32}/></button>
            </div>

            {/* MODAL BODY */}
            <div className="p-8 space-y-12 bg-gray-50/50">
              
              {/* BASIC INFORMATION TILES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Personal & Contact</h3>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
                    <DataRow label="Father's Name" value={selected?.personalInfo?.father} />
                    <DataRow label="Mother's Name" value={selected?.personalInfo?.mother} />
                    <DataRow label="DOB" value={formatDate(selected?.personalInfo?.dob)} />
                    <DataRow label="Nationality" value={selected?.personalInfo?.nationality} />
                    <DataRow label="Mobile" value={selected?.contactInfo?.mobile} />
                    <DataRow label="Email" value={selected?.contactInfo?.email} />
                    <DataRow label="Perm. Address" value={`${selected?.contactInfo?.permanentAddress}, ${selected?.contactInfo?.permanentZip}`} />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Professional & Research</h3>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
                    <DataRow label="Profession" value={selected?.professionalInfo?.profession} />
                    <DataRow label="Work Experience" value={`${selected?.professionalInfo?.experience} Years`} />
                    <DataRow label="Institution" value={selected?.basicInfo?.institution} />
                    <DataRow label="Department" value={selected?.basicInfo?.department} />
                    <DataRow label="Research Area" value={selected?.basicInfo?.areaOfResearch} />
                    <DataRow label="Thesis Title" value={selected?.researchInfo?.thesis} />
                  </div>
                </section>
              </div>

              {/* EDUCATIONAL TABLE */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Academic Background</h3>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                        <th className="px-6 py-4">Standard</th>
                        <th className="px-6 py-4">Board / University</th>
                        <th className="px-6 py-4 text-center">Grade</th>
                        <th className="px-6 py-4 text-center">Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <AcademicRow label="10th Std" board={selected?.educationInfo?.class10Board} grade={selected?.educationInfo?.class10Grade} year={selected?.educationInfo?.class10Year} />
                      <AcademicRow label="12th Std" board={selected?.educationInfo?.class12Board} grade={selected?.educationInfo?.class12Grade} year={selected?.educationInfo?.class12Year} />
                      <AcademicRow label="Graduation" board={selected?.educationInfo?.gradBoard} grade={selected?.educationInfo?.gradGrade} year={selected?.educationInfo?.gradYear} />
                      <AcademicRow label="Post Graduation" board={selected?.educationInfo?.pgBoard} grade={selected?.educationInfo?.pgGrade} year={selected?.educationInfo?.pgYear} />
                      <AcademicRow label="Ph.D / Research" board={selected?.educationInfo?.phdBoard} grade={selected?.educationInfo?.phdGrade} year={selected?.educationInfo?.phdYear} highlight />
                    </tbody>
                  </table>
                </div>
              </section>

              {/* DOCUMENTS & SIGNATURE */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Research Files (PDF)</h3>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
                    {selected?.researchFiles?.length > 0 ? selected.researchFiles.map((file, idx) => (
                      <a 
                        key={idx} 
                        href={getFileUrl(file)} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 border transition-colors group"
                      >
                        <File className="text-red-500 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold text-gray-700 truncate">Document_0{idx + 1}.pdf</span>
                        <Download size={16} className="ml-auto text-gray-400" />
                      </a>
                    )) : <p className="text-center text-gray-400 italic py-4">No documents available</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Signature / Photo</h3>
                  <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col items-center justify-center min-h-[160px]">
                    {selected?.signatureFile ? (
                      <img src={getFileUrl(selected.signatureFile)} alt="Signature" className="max-h-32 object-contain rounded-lg border p-1" />
                    ) : (
                      <div className="text-gray-300 flex flex-col items-center gap-2">
                        <ImageIcon size={40}/>
                        <span className="text-xs font-bold uppercase tracking-widest">No Signature File</span>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* DYNAMIC Q&A ACCORDIONS */}
              <section className="space-y-4 pb-20">
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Detailed Assessment</h3>
                <QAccordion title="Mentor Identity & Experience" data={selected.mentorIdentity} id="acc1" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Student Interaction Guidance" data={selected.studentInteraction} id="acc2" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Guidance Challenges" data={selected.challengesSection} id="acc3" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Incident-Based Reflection" data={selected.incidentsSection} id="acc4" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Mentor Role Perception" data={selected.mentorRoleSection} id="acc5" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Collaboration Alignment" data={selected.collaborationSection} id="acc6" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Collaboration Intent" data={selected.intentSection} id="acc7" expanded={expanded} onToggle={toggleAccordion} />
                <QAccordion title="Ecosystem Reflection" data={selected.reflectionSection} id="acc8" expanded={expanded} onToggle={toggleAccordion} />
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- UI COMPONENTS --- */

function SidebarItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value || "Not specified"}</p>
      </div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-50 pb-2 last:border-0">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-gray-800 sm:text-right">{value || "—"}</span>
    </div>
  );
}

function AcademicRow({ label, board, grade, year, highlight }) {
  if (!board && !grade && !year) return null;
  return (
    <tr className={highlight ? 'bg-blue-50/70 font-bold' : ''}>
      <td className="px-6 py-4 text-gray-700 font-black">{label}</td>
      <td className="px-6 py-4 text-gray-600 font-bold">{board || "—"}</td>
      <td className="px-6 py-4 text-center text-gray-600 font-black">{grade || "—"}</td>
      <td className="px-6 py-4 text-center text-gray-600 font-black">{year || "—"}</td>
    </tr>
  );
}

function QAccordion({ title, data, id, expanded, onToggle }) {
  if (!data || data.length === 0) return null;
  const isOpen = expanded[id];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
      <button 
        onClick={() => onToggle(id)}
        className={`w-full flex justify-between items-center p-6 text-left transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-800'}`}
      >
        <span className="font-black text-sm uppercase tracking-wider">{title}</span>
        {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
      </button>
      {isOpen && (
        <div className="p-8 space-y-8 animate-in slide-in-from-top-2 duration-300">
          {data.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-1 bg-blue-600 rounded-full mt-1 shrink-0"></div>
                <p className="text-sm font-black text-gray-900 leading-snug">{item.question}</p>
              </div>
              <div className="ml-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-700 font-bold shadow-inner">
                {Array.isArray(item.answer) ? (
                  <div className="flex flex-wrap gap-2">
                    {item.answer.map((ans, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase">{ans}</span>
                    ))}
                  </div>
                ) : item.answer || "N/A"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}