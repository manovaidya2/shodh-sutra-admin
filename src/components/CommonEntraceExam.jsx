import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Search, Eye, Trash2, X, User, Mail, Phone, FileText, CheckCircle,
  ChevronDown, ChevronUp, Building, GraduationCap, Briefcase,
  Calendar, BookOpen, Download, Image as ImageIcon, File, Award,
  MapPin, DollarSign, CreditCard, FolderOpen, Upload, UserCircle,
  Hash, Clock, AlertCircle, Check, Shield, Globe, Bookmark,
  Users, PenTool, Target, Layers, Zap, Heart, ThumbsUp,
  Paperclip, Link, ExternalLink, Camera, Video, Mic, Filter,
  ChevronRight, ChevronLeft, Home, Info, HelpCircle
} from "lucide-react";

export default function AdminEntranceExamDashboard() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/entrance-exam/all`);
      console.log("API Response:", res.data);
      setApplications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert("Failed to load entrance exam applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entrance exam application?")) return;
    try {
      await axiosInstance.delete(`/entrance-exam/${id}`);
      fetchApplications();
      if (selected?._id === id) {
        setSelected(null);
        setShowModal(false);
      }
    } catch (err) { 
      console.error(err);
      alert("Delete Failed"); 
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({ 
      ...prev, 
      [sectionId]: !prev[sectionId] 
    }));
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
    const cleanPath = path.replace(/^[\\/]+/, '').replace(/\\/g, '/');
    const baseURL = 'https://api.shodhsutra.com/';
    const cleanBaseURL = baseURL.replace(/\/$/, '');
    
    if (cleanPath.startsWith('uploads')) {
      return `${cleanBaseURL}/${cleanPath}`;
    }
    return `${cleanBaseURL}/uploads/admission-partners/${cleanPath}`;
  };

  const openFullProfile = (application) => {
    setSelected(application);
    setShowModal(true);
  };

  const getDocumentCount = (app) => {
    if (!app.documents) return 0;
    return Object.values(app.documents).filter(v => v && typeof v === 'string').length;
  };

  // Extract personal info from section2
  const getPersonalInfo = (app) => {
    const section2 = app.applicationData?.section2 || [];
    const info = {};
    section2.forEach(item => {
      if (item.question === "Full Name (In Block Letters)") info.fullName = item.answer;
      if (item.question === "Email ID") info.email = item.answer;
      if (item.question === "Mobile Number") info.mobile = item.answer;
      if (item.question === "Date of Birth") info.dob = item.answer;
      if (item.question === "Gender") info.gender = item.answer;
      if (item.question === "Nationality") info.nationality = item.answer;
      if (item.question === "Social Category") info.category = item.answer;
    });
    return info;
  };

  // Get applied streams from section1
  const getAppliedStreams = (app) => {
    const section1 = app.applicationData?.section1;
    if (section1?.selectedStreams) {
      return section1.selectedStreams.join(', ');
    }
    return 'N/A';
  };

  // Get proposed research area from section8
  const getResearchArea = (app) => {
    const section8 = app.applicationData?.section8 || [];
    const researchItem = section8.find(item => 
      item.question === "Proposed Research Area / Topic"
    );
    return researchItem?.answer || 'N/A';
  };

  // Filter applications based on search
  const filteredApplications = applications.filter(app => {
    if (!search) return true;
    
    const personal = getPersonalInfo(app);
    const searchLower = search.toLowerCase();
    
    return (
      personal.fullName?.toLowerCase().includes(searchLower) ||
      personal.email?.toLowerCase().includes(searchLower) ||
      personal.mobile?.includes(search) ||
      app._id?.includes(search)
    );
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Common Entrance Exam Applications</h1>
        <p className="text-gray-600">Review all entrance exam applications, documents, and details</p>
      </div>

      {/* SEARCH AND STATS */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <button 
            onClick={fetchApplications} 
            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2"
          >
            <Filter size={18} />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
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
            title="With Documents" 
            value={applications.filter(app => getDocumentCount(app) > 0).length} 
            icon={<FileText className="w-5 h-5" />}
            color="purple"
          />
          <StatCard 
            title="This Month" 
            value={applications.filter(app => {
              const date = new Date(app.createdAt);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length} 
            icon={<Calendar className="w-5 h-5" />}
            color="orange"
          />
        </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Applications List</h2>
          <span className="text-sm text-gray-500">Total: {filteredApplications.length}</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-xs uppercase font-bold text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Applied For</th>
                    <th className="px-6 py-4">Contact</th>
                    <th className="px-6 py-4 text-center">Documents</th>
                    <th className="px-6 py-4 text-center">Submitted</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentApplications.map((app) => {
                    const personal = getPersonalInfo(app);
                    const streams = getAppliedStreams(app);
                    
                    return (
                      <tr key={app._id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold uppercase">
                              {personal.fullName?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{personal.fullName || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">
                                {personal.gender || 'Gender N/A'} • {personal.category || 'Category N/A'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-700 truncate max-w-[200px]">{streams}</p>
                          <p className="text-xs text-gray-400 mt-1">ID: {app._id.slice(-6)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">{personal.email || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{personal.mobile || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                            {getDocumentCount(app)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-xs text-gray-700">{formatDate(app.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button 
                              onClick={() => openFullProfile(app)} 
                              className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 border border-purple-200"
                              title="View Full Application"
                            >
                              <Eye size={18} />
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
                    );
                  })}
                  
                  {currentApplications.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No applications found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* FULL PROFILE MODAL */}
      {showModal && selected && (
        <EntranceExamModal
          application={selected}
          onClose={() => setShowModal(false)}
          getFileUrl={getFileUrl}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
          toggleSection={toggleSection}
          expandedSections={expandedSections}
          onPreview={setPreviewFile}
        />
      )}

      {/* FILE PREVIEW MODAL */}
      {previewFile && (
        <FilePreviewModal 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
          getFileUrl={getFileUrl}
        />
      )}
    </div>
  );
}

// Main Modal Component
function EntranceExamModal({ 
  application, 
  onClose, 
  getFileUrl, 
  formatDate, 
  formatDateTime,
  toggleSection,
  expandedSections,
  onPreview 
}) {
  
  // Helper function to get answer from section array
  const getAnswer = (section, questionText) => {
    if (!application.applicationData?.[section]) return null;
    
    if (Array.isArray(application.applicationData[section])) {
      const item = application.applicationData[section].find(
        item => item.question === questionText
      );
      return item?.answer;
    }
    return null;
  };

  // Personal info from section2
  const personalInfo = {
    fullName: getAnswer('section2', 'Full Name (In Block Letters)'),
    dob: getAnswer('section2', 'Date of Birth'),
    age: getAnswer('section2', 'Age'),
    gender: getAnswer('section2', 'Gender'),
    nationality: getAnswer('section2', 'Nationality'),
    category: getAnswer('section2', 'Social Category'),
    otherCategory: getAnswer('section2', 'Other Category'),
    mobile: getAnswer('section4', 'Mobile Number'),
    altMobile: getAnswer('section4', 'Alternate Number'),
    email: getAnswer('section4', 'Email ID'),
    commAddress: getAnswer('section4', 'Communication Address'),
    commCity: getAnswer('section4', 'Communication City'),
    commState: getAnswer('section4', 'Communication State'),
    commPin: getAnswer('section4', 'Communication PIN'),
    permAddress: getAnswer('section4', 'Permanent Address'),
    permCity: getAnswer('section4', 'Permanent City'),
    permState: getAnswer('section4', 'Permanent State'),
    permPin: getAnswer('section4', 'Permanent PIN')
  };

  // Applied streams from section1
  const appliedStreams = application.applicationData?.section1?.selectedStreams || [];
  const otherStream = application.applicationData?.section1?.otherStream;

  // ID Proof from section3
  const idProof = {
    selected: application.applicationData?.section3?.selectedIdProofs || [],
    idNumber: application.applicationData?.section3?.idNumber,
    otherIdProof: application.applicationData?.section3?.otherIdProof
  };

  // Education from section5
  const education = application.applicationData?.section5 || {};

  // Experience from section6
  const experiences = application.applicationData?.section6?.experiences || [];
  const totalExperience = application.applicationData?.section6?.totalExperience;

  // Current employment from section7
  const currentEmployment = {
    organization: getAnswer('section7', 'Organisation Name'),
    designation: getAnswer('section7', 'Designation'),
    employmentType: getAnswer('section7', 'Employment Type'),
    yearsOfExperience: getAnswer('section7', 'Years of Experience')
  };

  // Research from section8
  const research = {
    topic: getAnswer('section8', 'Proposed Research Area / Topic'),
    reason: getAnswer('section8', 'Why do you want to pursue PhD?')
  };

  // Exam details from section9
  const examDetails = {
    paymentMode: getAnswer('section9', 'Entrance Exam Fee Payment Mode'),
    receiptNo: getAnswer('section9', 'Receipt No. / NEFT / Bank Transfer Details'),
    dateBank: getAnswer('section9', 'Date & Bank'),
    entranceMode: getAnswer('section9', 'Entrance Mode'),
    advertisementNo: getAnswer('section9', 'Advertisement No. & Date'),
    cycle: getAnswer('section9', 'Cycle of Entrance Exam'),
    preferredDate: getAnswer('section9', 'Preferred Exam Date'),
    examCenter: getAnswer('section9', 'Exam Centre / City'),
    subjectApplied: getAnswer('section9', 'Subject / Faculty Applied For'),
    result: getAnswer('section9', 'Result of Entrance Exam'),
    exemptionGrounds: getAnswer('section9', 'If Entrance Exam Exempted (Grounds)')
  };

  // Consent from section11
  const consent = getAnswer('section11', 'Consent');

  // Documents
  const documents = application.documents || {};

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-6xl w-full rounded-3xl shadow-2xl my-6 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0 z-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                <FileText size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{personalInfo.fullName || 'Unknown'}</h2>
                <p className="text-blue-100 text-sm flex items-center gap-2">
                  <Calendar size={14} /> Applied: {formatDateTime(application.createdAt)}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 bg-gray-50 max-h-[calc(100vh-200px)] overflow-y-auto">
          
          {/* Personal Information */}
          <Section 
            title="Personal Information" 
            icon={<UserCircle />}
            isExpanded={expandedSections['personal']}
            onToggle={() => toggleSection('personal')}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem label="Full Name" value={personalInfo.fullName} />
              <InfoItem label="Date of Birth" value={formatDate(personalInfo.dob)} />
              <InfoItem label="Age" value={personalInfo.age} />
              <InfoItem label="Gender" value={personalInfo.gender} />
              <InfoItem label="Nationality" value={personalInfo.nationality} />
              <InfoItem label="Category" value={personalInfo.category} />
              {personalInfo.otherCategory && (
                <InfoItem label="Other Category" value={personalInfo.otherCategory} />
              )}
            </div>
          </Section>

          {/* Contact Information */}
          <Section 
            title="Contact Information" 
            icon={<Mail />}
            isExpanded={expandedSections['contact']}
            onToggle={() => toggleSection('contact')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Mobile" value={personalInfo.mobile} />
                <InfoItem label="Alternate Mobile" value={personalInfo.altMobile} />
                <InfoItem label="Email" value={personalInfo.email} />
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-700 mb-2">Communication Address</h4>
                <p className="text-gray-600">
                  {personalInfo.commAddress}, {personalInfo.commCity}, {personalInfo.commState} - {personalInfo.commPin}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-700 mb-2">Permanent Address</h4>
                <p className="text-gray-600">
                  {personalInfo.permAddress}, {personalInfo.permCity}, {personalInfo.permState} - {personalInfo.permPin}
                </p>
              </div>
            </div>
          </Section>

          {/* Applied Streams */}
          <Section 
            title="Applied Streams" 
            icon={<BookOpen />}
            isExpanded={expandedSections['streams']}
            onToggle={() => toggleSection('streams')}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {appliedStreams.map((stream, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {stream}
                  </span>
                ))}
              </div>
              {otherStream && (
                <InfoItem label="Other Stream" value={otherStream} />
              )}
            </div>
          </Section>

          {/* ID Proof */}
          <Section 
            title="ID Proof Submitted" 
            icon={<Shield />}
            isExpanded={expandedSections['idproof']}
            onToggle={() => toggleSection('idproof')}
          >
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {idProof.selected.map((proof, idx) => (
                  <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {proof}
                  </span>
                ))}
              </div>
              <InfoItem label="ID Number" value={idProof.idNumber} />
              {idProof.otherIdProof && (
                <InfoItem label="Other ID Proof" value={idProof.otherIdProof} />
              )}
            </div>
          </Section>

          {/* Educational Qualifications */}
          <Section 
            title="Educational Qualifications" 
            icon={<GraduationCap />}
            isExpanded={expandedSections['education']}
            onToggle={() => toggleSection('education')}
          >
            <div className="space-y-6">
              {/* Graduation */}
              {education.graduation && education.graduation.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">Graduation</h4>
                  {education.graduation.map((grad, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoItem label="Degree" value={grad.degree} />
                        <InfoItem label="Discipline" value={grad.discipline} />
                        <InfoItem label="Mode" value={grad.mode} />
                        <InfoItem label="University" value={grad.university} />
                        <InfoItem label="Year" value={grad.year} />
                        <InfoItem label="Percentage" value={grad.percentage} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Post Graduation */}
              {education.postGraduation && education.postGraduation.length > 0 && (
                <div>
                  <h4 className="font-bold text-gray-700 mb-3">Post Graduation</h4>
                  {education.postGraduation.map((pg, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-3 border-l-4 border-blue-500">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <InfoItem label="Degree" value={pg.degree} />
                        <InfoItem label="Discipline" value={pg.discipline} />
                        <InfoItem label="Mode" value={pg.mode} />
                        <InfoItem label="University" value={pg.university} />
                        <InfoItem label="Year" value={pg.year} />
                        <InfoItem label="Percentage" value={pg.percentage} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Section>

          {/* Professional Experience */}
          {(experiences.length > 0 || totalExperience) && (
            <Section 
              title="Professional Experience" 
              icon={<Briefcase />}
              isExpanded={expandedSections['experience']}
              onToggle={() => toggleSection('experience')}
            >
              <div className="space-y-4">
                {totalExperience && (
                  <InfoItem label="Total Experience" value={totalExperience + " years"} />
                )}
                
                {experiences.map((exp, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <InfoItem label="Organization" value={exp.organization} />
                      <InfoItem label="Designation" value={exp.designation} />
                      <InfoItem label="From" value={exp.from} />
                      <InfoItem label="To" value={exp.to} />
                      <InfoItem label="Nature" value={exp.nature} />
                    </div>
                  </div>
                ))}

                {/* Current Employment */}
                {currentEmployment.organization && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-700 mb-3">Current Employment</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <InfoItem label="Organization" value={currentEmployment.organization} />
                      <InfoItem label="Designation" value={currentEmployment.designation} />
                      <InfoItem label="Employment Type" value={currentEmployment.employmentType} />
                      <InfoItem label="Experience" value={currentEmployment.yearsOfExperience} />
                    </div>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Research Details */}
          {(research.topic || research.reason) && (
            <Section 
              title="Research Details" 
              icon={<PenTool />}
              isExpanded={expandedSections['research']}
              onToggle={() => toggleSection('research')}
            >
              <div className="space-y-4">
                <InfoItem label="Proposed Research Area" value={research.topic} />
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-bold text-blue-700 mb-2">Why do you want to pursue PhD?</h4>
                  <p className="text-gray-700">{research.reason}</p>
                </div>
              </div>
            </Section>
          )}

          {/* Exam Details */}
          <Section 
            title="Entrance Exam Details" 
            icon={<FileText />}
            isExpanded={expandedSections['exam']}
            onToggle={() => toggleSection('exam')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Payment Mode" value={examDetails.paymentMode} />
              <InfoItem label="Receipt/Transaction No." value={examDetails.receiptNo} />
              <InfoItem label="Date & Bank" value={examDetails.dateBank} />
              <InfoItem label="Entrance Mode" value={examDetails.entranceMode} />
              <InfoItem label="Advertisement No." value={examDetails.advertisementNo} />
              <InfoItem label="Exam Cycle" value={examDetails.cycle} />
              <InfoItem label="Preferred Date" value={formatDate(examDetails.preferredDate)} />
              <InfoItem label="Exam Center" value={examDetails.examCenter} />
              <InfoItem label="Subject Applied" value={examDetails.subjectApplied} />
              <InfoItem label="Result" value={examDetails.result} />
              {examDetails.exemptionGrounds && (
                <InfoItem label="Exemption Grounds" value={examDetails.exemptionGrounds} />
              )}
            </div>
          </Section>

          {/* Documents */}
          {Object.keys(documents).filter(key => documents[key]).length > 0 && (
            <Section 
              title="Uploaded Documents" 
              icon={<FolderOpen />}
              isExpanded={expandedSections['documents']}
              onToggle={() => toggleSection('documents')}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.tenthMarksheet && (
                  <DocumentCard 
                    title="10th Marksheet" 
                    icon={<FileText className="text-blue-600" />}
                    file={documents.tenthMarksheet}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
                {documents.twelfthMarksheet && (
                  <DocumentCard 
                    title="12th Marksheet" 
                    icon={<FileText className="text-purple-600" />}
                    file={documents.twelfthMarksheet}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
                {documents.graduationDegree && (
                  <DocumentCard 
                    title="Graduation Degree" 
                    icon={<GraduationCap className="text-green-600" />}
                    file={documents.graduationDegree}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
                {documents.pgDegree && (
                  <DocumentCard 
                    title="PG Degree" 
                    icon={<Award className="text-indigo-600" />}
                    file={documents.pgDegree}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
                {documents.idProofDocument && (
                  <DocumentCard 
                    title="ID Proof" 
                    icon={<Shield className="text-orange-600" />}
                    file={documents.idProofDocument}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
                {documents.cvResume && (
                  <DocumentCard 
                    title="CV/Resume" 
                    icon={<File className="text-teal-600" />}
                    file={documents.cvResume}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
                {documents.passportPhoto && (
                  <DocumentCard 
                    title="Passport Photo" 
                    icon={<Camera className="text-pink-600" />}
                    file={documents.passportPhoto}
                    getFileUrl={getFileUrl}
                    onPreview={onPreview}
                  />
                )}
              </div>
            </Section>
          )}

          {/* Consent */}
          <Section 
            title="Consent" 
            icon={<CheckCircle />}
            isExpanded={expandedSections['consent']}
            onToggle={() => toggleSection('consent')}
          >
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <div className={`p-2 rounded-full ${consent ? 'bg-green-500' : 'bg-red-500'}`}>
                {consent ? 
                  <Check className="w-4 h-4 text-white" /> : 
                  <X className="w-4 h-4 text-white" />
                }
              </div>
              <span className="font-medium">
                {consent ? 'Consent Provided' : 'Consent Not Provided'}
              </span>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

// Section Component with Collapse
function Section({ title, icon, children, isExpanded, onToggle }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-blue-600">{icon}</div>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isExpanded && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  );
}

// Info Item Component
function InfoItem({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-1">{value}</p>
    </div>
  );
}

// Stat Card Component
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

// Document Card Component
function DocumentCard({ title, icon, file, getFileUrl, onPreview }) {
  const fileUrl = getFileUrl(file);
  const isImage = file?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = file?.match(/\.pdf$/i);

  return (
    <div className="bg-white border rounded-xl p-4 hover:shadow-lg transition-all group">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">{title}</p>
          <p className="text-xs text-gray-400 mt-1">{file?.split('/').pop()?.slice(0, 20)}...</p>
          
          <div className="flex items-center gap-2 mt-3">
            {(isImage || isPdf) ? (
              <button
                onClick={() => onPreview({ url: file, title, type: isImage ? 'image' : 'pdf' })}
                className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100"
              >
                Preview
              </button>
            ) : (
              <a
                href={fileUrl}
                download
                className="flex-1 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 text-center"
              >
                Download
              </a>
            )}
            <a
              href={fileUrl}
              download
              className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
              title="Download"
            >
              <Download size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// File Preview Modal
function FilePreviewModal({ file, onClose, getFileUrl }) {
  const [loadError, setLoadError] = useState(false);
  const fileUrl = getFileUrl(file.url || file);
  const fileName = file.title || file.name || 'Document';
  const isImage = file.type === 'image' || fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = file.type === 'pdf' || fileUrl?.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-white">
          <h4 className="font-bold text-gray-800 truncate">{fileName}</h4>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 bg-gray-50 max-h-[calc(90vh-80px)] overflow-auto">
          {loadError ? (
            <div className="text-center py-12">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
              <p className="text-red-600 mb-4">Failed to load file</p>
              <a href={fileUrl} download className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                <Download size={18} />
                Download File
              </a>
            </div>
          ) : isImage ? (
            <img 
              src={fileUrl} 
              alt={fileName} 
              className="max-w-full mx-auto rounded-lg shadow-lg"
              onError={() => setLoadError(true)}
            />
          ) : isPdf ? (
            <iframe 
              src={`${fileUrl}#view=FitH`} 
              className="w-full h-[70vh]" 
              title={fileName}
              onError={() => setLoadError(true)}
            />
          ) : (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Preview not available</p>
              <a href={fileUrl} download className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                <Download size={18} />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}