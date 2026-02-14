import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Search, Eye, Trash2, X, User, Mail, Phone, FileText, CheckCircle,
  ChevronDown, ChevronUp, Building, GraduationCap, Briefcase,
  Calendar, BookOpen, Download, Image as ImageIcon, File, Award,
  MapPin, DollarSign, CreditCard, FolderOpen, Upload, UserCircle,
  Hash, Clock, AlertCircle, Check, Shield, Globe, Bookmark,
  Users, PenTool, Target, Layers, Zap, Heart, ThumbsUp,
  Paperclip, Link, ExternalLink, Camera, Video, Mic
} from "lucide-react";

export default function AdminPhdDashboard() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null); // Sidebar data
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUniversity, setFilterUniversity] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/phd-admission/all?search=${search}`);
      setApplications(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load PhD applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this PhD application?")) return;
    try {
      await axiosInstance.delete(`/phd-admission/${id}`);
      fetchApplications();
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

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getFileUrl = (path) => {
    if (!path) return "";
    const baseUrl = "https://api.shodhsutra.com/"; // Apne backend ka URL yahan check karein
    return `${baseUrl}${path.replace(/\\/g, "/")}`;
  };

  const openFullProfile = (application) => {
    setSelected(application);
    setShowModal(true);
  };

  const getDocumentCount = (app) => {
    if (!app.documentUploads) return 0;
    return Object.values(app.documentUploads).filter(v => v && typeof v === 'string' && v.startsWith('/uploads')).length;
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus !== "all" && app.phdOfferDetails?.entranceResult !== filterStatus) return false;
    if (filterUniversity !== "all" && app.phdOfferDetails?.universityType !== filterUniversity) return false;
    return true;
  });

  // Unique values for filters
  const entranceResults = [...new Set(applications.map(app => app.phdOfferDetails?.entranceResult).filter(Boolean))];
  const universityTypes = [...new Set(applications.map(app => app.phdOfferDetails?.universityType).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">PhD Admissions Dashboard</h1>
        <p className="text-gray-600">Review all PhD applications, academic records, and documents</p>
      </div>

      {/* SEARCH AND FILTER SECTION */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, research area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
          >
            <option value="all">All Results</option>
            {entranceResults.map(result => (
              <option key={result} value={result}>{result}</option>
            ))}
          </select>
          
          <select
            value={filterUniversity}
            onChange={(e) => setFilterUniversity(e.target.value)}
            className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-w-[150px]"
          >
            <option value="all">All University Types</option>
            {universityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <button onClick={fetchApplications} className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
            Search
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Applications" 
          value={applications.length} 
          icon={<Users className="w-5 h-5" />}
          color="blue"
        />
        <StatCard 
          title="Documents Uploaded" 
          value={applications.reduce((acc, app) => acc + getDocumentCount(app), 0)} 
          icon={<FolderOpen className="w-5 h-5" />}
          color="green"
        />
        <StatCard 
          title="Qualified" 
          value={applications.filter(app => app.phdOfferDetails?.entranceResult === 'Qualified').length} 
          icon={<CheckCircle className="w-5 h-5" />}
          color="purple"
        />
        <StatCard 
          title="Govt. Universities" 
          value={applications.filter(app => app.phdOfferDetails?.universityType === 'Government').length} 
          icon={<Building className="w-5 h-5" />}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIST SECTION */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">PhD Applications List</h2>
              <button onClick={fetchApplications} className="text-sm font-medium text-blue-600">Refresh</button>
            </div>
            
            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading applications...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b text-xs uppercase font-bold text-gray-500">
                    <tr>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">PhD Offer</th>
                      <th className="px-6 py-4">Entrance</th>
                      <th className="px-6 py-4 text-center">Docs</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApplications.map((app) => (
                      <tr key={app._id} className={`hover:bg-blue-50/30 transition-colors ${selected?._id === app._id ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold uppercase">
                              {app?.applicantProfile?.fullName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{app?.applicantProfile?.fullName || 'Unnamed'}</p>
                              <p className="text-xs text-blue-600 font-bold uppercase">{app?.applicantProfile?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-700">{app?.phdOfferDetails?.offeredStream || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{app?.phdOfferDetails?.offeredUniversity}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            app?.phdOfferDetails?.entranceResult === 'Qualified' ? 'bg-green-100 text-green-700' :
                            app?.phdOfferDetails?.entranceResult === 'Awaiting' ? 'bg-yellow-100 text-yellow-700' :
                            app?.phdOfferDetails?.entranceResult === 'Not Qualified' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {app?.phdOfferDetails?.entranceResult || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                            {getDocumentCount(app)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => setSelected(app)} 
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200"
                              title="Quick View"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => openFullProfile(app)} 
                              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 border border-purple-200"
                              title="Full Profile"
                            >
                              <User size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(app._id)} 
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 border border-red-200"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {filteredApplications.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No applications found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* SIDE PREVIEW */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Quick Preview</h3>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X size={20}/>
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                    {selected?.applicantProfile?.fullName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 leading-tight">{selected?.applicantProfile?.fullName}</h4>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                      {selected?.academicQualification?.postGraduationDegree || 'PhD Applicant'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <SidebarItem icon={<Mail size={16}/>} label="Email" value={selected?.applicantProfile?.email} />
                  <SidebarItem icon={<Phone size={16}/>} label="Mobile" value={selected?.applicantProfile?.mobile} />
                  <SidebarItem icon={<MapPin size={16}/>} label="Location" value={selected?.applicantProfile?.cityState} />
                  <SidebarItem icon={<Building size={16}/>} label="University" value={selected?.phdOfferDetails?.offeredUniversity} />
                  <SidebarItem icon={<BookOpen size={16}/>} label="Research Area" value={selected?.phdOfferDetails?.proposedResearchArea} />
                  <SidebarItem icon={<Calendar size={16}/>} label="Applied On" value={formatDate(selected?.createdAt)} />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <div className="text-xs font-bold text-blue-600 uppercase">Documents</div>
                    <div className="text-2xl font-black text-blue-700">{getDocumentCount(selected)}</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <div className="text-xs font-bold text-green-600 uppercase">Entrance</div>
                    <div className="text-sm font-black text-green-700 truncate">{selected?.phdOfferDetails?.entranceResult || 'N/A'}</div>
                  </div>
                </div>

                <button 
                  onClick={() => openFullProfile(selected)} 
                  className="w-full py-4 bg-gray-900 text-white rounded-xl font-black hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  VIEW FULL APPLICATION
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-gray-200">
              <User size={40} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold">Select an application to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* FULL PROFILE MODAL */}
      {showModal && selected && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-6xl w-full rounded-3xl shadow-2xl my-6 overflow-hidden flex flex-col relative">
            
            {/* MODAL HEADER */}
            <div className="p-8 border-b bg-white flex justify-between items-center sticky top-0 z-50">
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                   <GraduationCap size={28}/>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{selected?.applicantProfile?.fullName}</h2>
                  <p className="text-gray-500 font-bold text-xs uppercase flex items-center gap-2 flex-wrap">
                    <Calendar size={14}/> ID: PHD-{selected._id?.slice(-8).toUpperCase()} • 
                    Submitted: {formatDateTime(selected.createdAt)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-3 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-all"
              >
                <X size={32}/>
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-8 space-y-12 bg-gray-50/50">
              
              {/* PERSONAL INFORMATION SECTION */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                  <UserCircle size={20} /> Personal Information
                </h3>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DataRow label="Full Name" value={selected?.applicantProfile?.fullName} />
                    <DataRow label="Father/Spouse Name" value={selected?.applicantProfile?.fatherOrSpouseName} />
                    <DataRow label="Date of Birth" value={formatDate(selected?.applicantProfile?.dob)} />
                    <DataRow label="Gender" value={selected?.applicantProfile?.gender} />
                    <DataRow label="Mobile" value={selected?.applicantProfile?.mobile} />
                    <DataRow label="Email" value={selected?.applicantProfile?.email} />
                    <DataRow label="City/State" value={selected?.applicantProfile?.cityState} />
                    <DataRow label="Consent" value={selected?.declaration?.consent ? '✓ Given' : '✗ Not Given'} />
                  </div>
                </div>
              </section>

              {/* ACADEMIC QUALIFICATION */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                  <GraduationCap size={20} /> Academic Qualifications
                </h3>
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left font-bold text-gray-500 uppercase text-xs tracking-wider">
                        <th className="px-6 py-4">Qualification</th>
                        <th className="px-6 py-4">Degree</th>
                        <th className="px-6 py-4">University</th>
                        <th className="px-6 py-4 text-center">Year</th>
                        <th className="px-6 py-4 text-center">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <AcademicRow 
                        label="Graduation" 
                        degree={selected?.academicQualification?.graduationDegree}
                        university={selected?.academicQualification?.graduationUniversity}
                        year={selected?.academicQualification?.graduationYear}
                        percentage={selected?.academicQualification?.graduationPercentage}
                      />
                      <AcademicRow 
                        label="Post Graduation" 
                        degree={selected?.academicQualification?.postGraduationDegree}
                        university={selected?.academicQualification?.postGraduationUniversity}
                        year={selected?.academicQualification?.postGraduationYear}
                        percentage={selected?.academicQualification?.postGraduationPercentage}
                        highlight
                      />
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <span className="font-bold text-gray-700">Mode of Study: </span>
                          <span className="text-gray-600">{selected?.academicQualification?.mode || 'Not specified'}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* PROFESSIONAL PROFILE */}
              {(selected?.professionalProfile?.currentRole || selected?.professionalProfile?.organization) && (
                <section>
                  <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                    <Briefcase size={20} /> Professional Profile
                  </h3>
                  <div className="bg-white p-6 rounded-2xl border shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <DataRow label="Current Role" value={selected?.professionalProfile?.currentRole} />
                      <DataRow label="Organization" value={selected?.professionalProfile?.organization} />
                      <DataRow label="Industry" value={selected?.professionalProfile?.industry} />
                      <DataRow label="Work Experience" value={selected?.professionalProfile?.workExperience} />
                    </div>
                  </div>
                </section>
              )}

              {/* PHD OFFER DETAILS */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                  <Award size={20} /> PhD Offer Details
                </h3>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <DataRow label="Entrance Exam" value={selected?.phdOfferDetails?.entranceExamUniversity} />
                    <DataRow label="Exam Date" value={formatDate(selected?.phdOfferDetails?.entranceExamDate)} />
                    <DataRow label="Result" value={selected?.phdOfferDetails?.entranceResult} />
                    <DataRow label="Offered Stream" value={
                      selected?.phdOfferDetails?.offeredStream === 'Other' 
                        ? selected?.phdOfferDetails?.offeredStreamOther 
                        : selected?.phdOfferDetails?.offeredStream
                    } />
                    <DataRow label="Research Area" value={selected?.phdOfferDetails?.proposedResearchArea} />
                    <DataRow label="University" value={selected?.phdOfferDetails?.offeredUniversity} />
                    <DataRow label="University Type" value={selected?.phdOfferDetails?.universityType} />
                    {selected?.phdOfferDetails?.universityType === 'Other' && (
                      <DataRow label="Other Institution" value={selected?.phdOfferDetails?.otherInstitution} />
                    )}
                  </div>
                </div>
              </section>

              {/* FEE STRUCTURE */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                  <DollarSign size={20} /> Fee Structure
                </h3>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <DataRow label="Common Entrance Fee" value={selected?.feeStructure?.commonEntranceFee} />
                    <DataRow label="Total PhD Program Fee" value={selected?.feeStructure?.totalPhdProgramFee} />
                  </div>

                  {/* Installments */}
                  {(selected?.installmentStructure?.firstInstallment || 
                    selected?.installmentStructure?.secondInstallment ||
                    selected?.installmentStructure?.thirdInstallment ||
                    selected?.installmentStructure?.fourthInstallment ||
                    selected?.installmentStructure?.finalInstallment) && (
                    <>
                      <h4 className="font-black text-gray-800 mb-4 text-sm uppercase tracking-wider">Installment Schedule</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selected?.installmentStructure?.firstInstallment && (
                          <InstallmentCard title="First" data={selected.installmentStructure.firstInstallment} />
                        )}
                        {selected?.installmentStructure?.secondInstallment && (
                          <InstallmentCard title="Second" data={selected.installmentStructure.secondInstallment} />
                        )}
                        {selected?.installmentStructure?.thirdInstallment && (
                          <InstallmentCard title="Third" data={selected.installmentStructure.thirdInstallment} />
                        )}
                        {selected?.installmentStructure?.fourthInstallment && (
                          <InstallmentCard title="Fourth" data={selected.installmentStructure.fourthInstallment} />
                        )}
                        {selected?.installmentStructure?.finalInstallment && (
                          <InstallmentCard title="Final" data={selected.installmentStructure.finalInstallment} />
                        )}
                      </div>
                    </>
                  )}

                  {/* Additional Fees */}
                  {(selected?.additionalFees?.fees?.length > 0 || selected?.additionalFees?.details) && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-black text-gray-800 mb-4 text-sm uppercase tracking-wider">Additional Fees</h4>
                      {selected?.additionalFees?.fees?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {selected.additionalFees.fees.map((fee, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-700">
                              {fee}
                            </span>
                          ))}
                        </div>
                      )}
                      {selected?.additionalFees?.details && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-sm text-gray-700">{selected.additionalFees.details}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* DOCUMENTS SECTION */}
              <section>
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                  <FolderOpen size={20} /> Uploaded Documents
                </h3>
                
                {selected?.documentUploads && Object.keys(selected.documentUploads).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selected.documentUploads.tenthMarksheet && (
                      <DocumentCard 
                        title="10th Marksheet" 
                        icon={<FileText className="text-blue-600" />}
                        file={selected.documentUploads.tenthMarksheet}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.twelfthMarksheet && (
                      <DocumentCard 
                        title="12th Marksheet" 
                        icon={<FileText className="text-purple-600" />}
                        file={selected.documentUploads.twelfthMarksheet}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.graduationDegree && (
                      <DocumentCard 
                        title="Graduation Degree" 
                        icon={<GraduationCap className="text-green-600" />}
                        file={selected.documentUploads.graduationDegree}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.pgDegree && (
                      <DocumentCard 
                        title="PG Degree" 
                        icon={<Award className="text-indigo-600" />}
                        file={selected.documentUploads.pgDegree}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.idProof && (
                      <DocumentCard 
                        title="ID Proof" 
                        icon={<Shield className="text-orange-600" />}
                        file={selected.documentUploads.idProof}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.passportPhoto && (
                      <DocumentCard 
                        title="Passport Photo" 
                        icon={<Camera className="text-pink-600" />}
                        file={selected.documentUploads.passportPhoto}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.cvResume && (
                      <DocumentCard 
                        title="CV/Resume" 
                        icon={<File className="text-teal-600" />}
                        file={selected.documentUploads.cvResume}
                        getFileUrl={getFileUrl}
                      />
                    )}
                    {selected.documentUploads.researchProposal && (
                      <DocumentCard 
                        title="Research Proposal" 
                        icon={<PenTool className="text-red-600" />}
                        file={selected.documentUploads.researchProposal}
                        getFileUrl={getFileUrl}
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-12 text-center rounded-2xl border">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No documents uploaded</p>
                  </div>
                )}
              </section>

              {/* DECLARATION */}
              <section className="pb-10">
                <h3 className="text-lg font-black text-gray-900 mb-4 border-l-4 border-blue-600 pl-4 flex items-center gap-2">
                  <CheckCircle size={20} /> Declaration
                </h3>
                <div className="bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${selected?.declaration?.consent ? 'bg-green-100' : 'bg-red-100'}`}>
                      {selected?.declaration?.consent ? 
                        <Check className="w-5 h-5 text-green-600" /> : 
                        <X className="w-5 h-5 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {selected?.declaration?.consent ? 'Consent Provided' : 'Consent Not Provided'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selected?.declaration?.consent 
                          ? 'Applicant has agreed to the terms and conditions' 
                          : 'Applicant did not provide consent'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- UI COMPONENTS --- */

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gray-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-gray-800 break-words">{value || "Not specified"}</p>
      </div>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-bold text-gray-800 mt-1 break-words">{value || "—"}</span>
    </div>
  );
}

function AcademicRow({ label, degree, university, year, percentage, highlight }) {
  if (!degree && !university && !year && !percentage) return null;
  return (
    <tr className={highlight ? 'bg-blue-50/70 font-bold' : ''}>
      <td className="px-6 py-4 text-gray-700 font-black">{label}</td>
      <td className="px-6 py-4 text-gray-600 font-bold">{degree || "—"}</td>
      <td className="px-6 py-4 text-gray-600">{university || "—"}</td>
      <td className="px-6 py-4 text-center text-gray-600 font-black">{year || "—"}</td>
      <td className="px-6 py-4 text-center text-gray-600 font-black">{percentage || "—"}{percentage && '%'}</td>
    </tr>
  );
}

function InstallmentCard({ title, data }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <h5 className="font-black text-gray-800 mb-2 text-sm">{title} Installment</h5>
      <div className="space-y-2">
        {data.date && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Date:</span>
            <span className="font-bold text-gray-800">{new Date(data.date).toLocaleDateString('en-IN')}</span>
          </div>
        )}
        {data.amount && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Amount:</span>
            <span className="font-bold text-gray-800">₹{data.amount}</span>
          </div>
        )}
        {data.status && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              data.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {data.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ title, icon, file, getFileUrl }) {
  const [preview, setPreview] = useState(false);
  const fileUrl = getFileUrl(file);
  const isImage = file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = file?.match(/\.pdf$/i);

  return (
    <>
      <div className="bg-white border rounded-xl p-4 hover:shadow-lg transition-all group">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-50 rounded-lg">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm truncate">{title}</p>
            <p className="text-xs text-gray-400 mt-1">{file?.split('/').pop()?.slice(0, 20)}...</p>
            
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => window.open(fileUrl, '_blank')}
                className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                View
              </button>
              <a
                href={fileUrl}
                download
                className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Download size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-white">
              <h4 className="font-bold text-gray-800">{title}</h4>
              <button onClick={() => setPreview(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 bg-gray-50 max-h-[calc(90vh-80px)] overflow-auto">
              {isImage ? (
                <img src={fileUrl} alt={title} className="max-w-full mx-auto rounded-lg shadow-lg" />
              ) : isPdf ? (
                <iframe src={`${fileUrl}#view=FitH`} className="w-full h-[70vh]" title={title} />
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                  <a
                    href={fileUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                  >
                    <Download size={18} />
                    Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}