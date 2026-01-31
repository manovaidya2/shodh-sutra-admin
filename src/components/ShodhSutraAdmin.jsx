import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

// Icons for better visual representation
const Icons = {
  user: "👤",
  email: "📧",
  phone: "📱",
  location: "📍",
  calendar: "📅",
  education: "🎓",
  work: "💼",
  research: "🔬",
  file: "📄",
  download: "⬇️",
  view: "👁️",
  status: "🏷️",
  clock: "⏰",
  goal: "🎯",
  filter: "🔍",
  export: "📊",
  edit: "✏️",
  delete: "🗑️",
  search: "🔎",
  close: "✕",
  paper: "📝",
  university: "🏛️",
  percentage: "📈",
  year: "📅",
  stream: "📚",
  board: "🏫"
};

const STATUS_COLORS = {
  Employed: "bg-blue-100 text-blue-800 border border-blue-200",
  Business: "bg-green-100 text-green-800 border border-green-200",
  Consultant: "bg-purple-100 text-purple-800 border border-purple-200",
  Academician: "bg-amber-100 text-amber-800 border border-amber-200",
  Student: "bg-gray-100 text-gray-800 border border-gray-200"
};

const ShodhSutraAdmin = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/shodh-sutra/profiles");
      setProfiles(res.data.data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      alert("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.mobile?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || profile.professionalStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProfiles.length / itemsPerPage);

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setViewModal(true);
  };

  const downloadCSV = () => {
    if (profiles.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      'Full Name', 'Email', 'Mobile', 'City/Country', 'Age', 'Professional Status',
      'Submission Date', 'Class 10 Board', 'Class 10 Year', 'Class 10 Percentage',
      'Class 12 Stream', 'Class 12 Board', 'Class 12 Year', 'Class 12 Percentage',
      'Graduation Degree', 'Graduation Specialisation', 'Graduation University',
      'Graduation Mode', 'Graduation Admission Year', 'Graduation Passing Year',
      'Graduation Percentage', 'PG Status', 'PG Degree', 'PG Specialisation',
      'PG University', 'PG Admission Year', 'PG Passing Year', 'PG Mode', 'PG Percentage',
      'Goals', 'Blockers', 'Under Utilised', 'Authority Incidents', 'PhD Why',
      'PhD Benefits', 'PhD Seriousness', 'PhD Reason', 'Niche Help With',
      'Niche Expertise', 'Niche Ideal', 'Life Lessons', 'Heard From', 'Expectations',
      'PhD Help', 'Session Value', 'Weekly Hours', 'Fears', 'Honest Advice'
    ];

    const rows = profiles.map(profile => [
      profile.fullName || '', profile.email || '', profile.mobile || '',
      profile.cityCountry || '', profile.age || '', profile.professionalStatus || '',
      new Date(profile.createdAt).toLocaleDateString('en-IN'),
      profile.class10?.board || '', profile.class10?.year || '', profile.class10?.percentage || '',
      profile.class12?.stream || '', profile.class12?.board || '', profile.class12?.year || '',
      profile.class12?.percentage || '', profile.graduation?.degree || '',
      profile.graduation?.specialisation || '', profile.graduation?.university || '',
      profile.graduation?.mode || '', profile.graduation?.admissionYear || '',
      profile.graduation?.passingYear || '', profile.graduation?.percentage || '',
      profile.postGraduation?.status || '', profile.postGraduation?.degree || '',
      profile.postGraduation?.specialisation || '', profile.postGraduation?.university || '',
      profile.postGraduation?.admissionYear || '', profile.postGraduation?.passingYear || '',
      profile.postGraduation?.mode || '', profile.postGraduation?.percentage || '',
      profile.goals || '', profile.blockers || '', profile.underUtilised || '',
      profile.authorityIncidents || '', profile.phd?.why || '', profile.phd?.benefits || '',
      profile.phd?.seriousness || '', profile.phd?.reason || '', profile.niche?.helpWith || '',
      profile.niche?.expertise || '', profile.niche?.ideal || '', profile.niche?.lifeLessons || '',
      profile.expectations?.heardFrom || '', profile.expectations?.expectation || '',
      profile.expectations?.phdHelp || '', profile.expectations?.sessionValue || '',
      profile.commitment?.weeklyHours || '', profile.commitment?.fears || '',
      profile.commitment?.honestAdvice || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shodh-sutra-profiles-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-4 overflow-x-hidden">
      {/* Header - More Compact */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="mb-2 md:mb-0">
            <h1 className="text-xl font-bold text-gray-800">Shodh Sutra Admin</h1>
            <p className="text-gray-600 text-sm mt-0.5">{filteredProfiles.length} profiles</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-48">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <span className="absolute left-3 top-2 text-gray-400 text-sm">{Icons.search}</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Employed">Employed</option>
              <option value="Business">Business</option>
              <option value="Consultant">Consultant</option>
              <option value="Academician">Academician</option>
              <option value="Student">Student</option>
            </select>
            
            <button
              onClick={downloadCSV}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              <span>{Icons.export}</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
        
        {/* Stats - More Compact */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">Total</div>
            <div className="text-lg font-bold text-gray-800">{profiles.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">Filtered</div>
            <div className="text-lg font-bold text-gray-800">{filteredProfiles.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">This Page</div>
            <div className="text-lg font-bold text-gray-800">{currentProfiles.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">Total Files</div>
            <div className="text-lg font-bold text-gray-800">
              {profiles.reduce((total, profile) => 
                total + (profile.uploadedFiles?.length || 0) + (profile.research?.documents?.length || 0), 0
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table - More Compact */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name & Contact
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PhD Details
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Files
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProfiles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    <div className="text-3xl mb-3">📭</div>
                    <p className="text-sm">No profiles found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing your search or filter</p>
                  </td>
                </tr>
              ) : (
                currentProfiles.map((profile) => (
                  <tr 
                    key={profile._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewProfile(profile)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 text-sm">
                          {Icons.user}
                        </div>
                        <div className="ml-3 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate max-w-[140px]">
                            {profile.fullName || "No Name"}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[140px]">
                            {profile.email || "No Email"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {profile.mobile || "No Mobile"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[profile.professionalStatus] || "bg-gray-100 text-gray-800"}`}>
                        {profile.professionalStatus || "No Status"}
                      </span>
                      {profile.age && (
                        <div className="text-xs text-gray-500 mt-1">Age: {profile.age}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                        {profile.graduation?.degree || profile.class12?.stream || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">
                        {profile.graduation?.university || profile.class12?.board || ""}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {profile.phd?.seriousness ? (
                        <div className="flex items-center">
                          <div className="text-sm font-bold text-blue-600 mr-2">
                            {profile.phd.seriousness}/10
                          </div>
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                              style={{ width: `${(profile.phd.seriousness / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-blue-600">
                            {(profile.uploadedFiles?.length || 0)}
                          </div>
                          <div className="text-xs text-gray-500">Marks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-purple-600">
                            {(profile.research?.documents?.length || 0)}
                          </div>
                          <div className="text-xs text-gray-500">Research</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-900">
                        {new Date(profile.createdAt).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(profile.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(profile);
                        }}
                        className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                      >
                        <span className="mr-1.5">{Icons.view}</span>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - More Compact */}
        {filteredProfiles.length > itemsPerPage && (
          <div className="bg-white px-4 py-2 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredProfiles.length)}
                </span> of{" "}
                <span className="font-medium">{filteredProfiles.length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <div className="flex items-center space-x-0.5">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-2.5 py-1 rounded text-xs font-medium ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <span className="px-1 text-gray-500">...</span>
                  )}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile View Modal */}
      {viewModal && selectedProfile && (
        <ProfileModal
          profile={selectedProfile}
          onClose={() => setViewModal(false)}
          previewFile={previewFile}
          setPreviewFile={setPreviewFile}
        />
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
};

const ProfileModal = ({ profile, onClose, previewFile, setPreviewFile }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'basic', label: 'Basic', icon: Icons.user },
    { id: 'education', label: 'Education', icon: Icons.education },
    { id: 'professional', label: 'Professional', icon: Icons.work },
    { id: 'research', label: 'Research', icon: Icons.research },
    { id: 'goals', label: 'Goals & PhD', icon: Icons.goal },
    { id: 'files', label: 'Files', icon: Icons.file },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] flex flex-col my-2">
        {/* Modal Header - More Compact */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white text-base shrink-0">
                {Icons.user}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-800 truncate">
                  {profile.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[profile.professionalStatus] || "bg-gray-100 text-gray-800"}`}>
                    {profile.professionalStatus}
                  </span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-xs text-gray-600 truncate max-w-[180px]">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-2 text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded transition-colors shrink-0"
          >
            <span className="text-lg">{Icons.close}</span>
          </button>
        </div>

        {/* Modal Stats - More Compact */}
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-600">
              Submitted {formatDate(profile.createdAt)}
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3">
              <StatCard 
                count={profile.uploadedFiles?.length || 0} 
                label="Marksheets" 
                color="blue"
              />
              <StatCard 
                count={profile.research?.documents?.length || 0} 
                label="Research" 
                color="purple"
              />
              <StatCard 
                count={profile.research?.totalPapers || 0} 
                label="Papers" 
                color="green"
              />
            </div>
          </div>
        </div>

        {/* Tabs - More Compact */}
        <div className="border-b bg-white sticky top-[68px] z-10">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 font-medium whitespace-nowrap transition-colors flex-shrink-0 text-sm ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - More Compact */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <TabContent 
              activeTab={activeTab} 
              profile={profile} 
              setPreviewFile={setPreviewFile}
            />
          </div>
        </div>

        {/* Modal Footer - More Compact */}
        <div className="border-t p-3 bg-white sticky bottom-0">
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = `mailto:${profile.email}`;
                link.click();
              }}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Email
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabContent = ({ activeTab, profile, setPreviewFile }) => {
  const renderBasicInfo = () => (
    <div className="space-y-4">
      <Section title="Personal Information" icon={Icons.user}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard icon={Icons.user} label="Full Name" value={profile.fullName} />
          <InfoCard icon={Icons.email} label="Email" value={profile.email} />
          <InfoCard icon={Icons.phone} label="Mobile" value={profile.mobile} />
          <InfoCard icon={Icons.location} label="City & Country" value={profile.cityCountry} />
          <InfoCard icon={Icons.calendar} label="Age" value={profile.age} />
          <InfoCard icon={Icons.status} label="Professional Status" value={profile.professionalStatus} />
        </div>
      </Section>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <Section title="Class 10 Details" icon={Icons.education}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <InfoCard icon={Icons.board} label="Board" value={profile.class10?.board} />
          <InfoCard icon={Icons.year} label="Year" value={profile.class10?.year} />
          <InfoCard icon={Icons.percentage} label="Percentage" value={profile.class10?.percentage} />
        </div>
      </Section>
      
      <Section title="Class 12 Details" icon={Icons.education}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <InfoCard icon={Icons.stream} label="Stream" value={profile.class12?.stream} />
          <InfoCard icon={Icons.board} label="Board" value={profile.class12?.board} />
          <InfoCard icon={Icons.year} label="Year" value={profile.class12?.year} />
          <InfoCard icon={Icons.percentage} label="Percentage" value={profile.class12?.percentage} />
        </div>
      </Section>
      
      <Section title="Graduation Details" icon={Icons.university}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard icon={Icons.education} label="Degree" value={profile.graduation?.degree} />
          <InfoCard icon={Icons.paper} label="Specialisation" value={profile.graduation?.specialisation} />
          <InfoCard icon={Icons.university} label="University" value={profile.graduation?.university} />
          <InfoCard icon={Icons.education} label="Mode" value={profile.graduation?.mode} />
          <InfoCard icon={Icons.year} label="Admission Year" value={profile.graduation?.admissionYear} />
          <InfoCard icon={Icons.year} label="Passing Year" value={profile.graduation?.passingYear} />
          <InfoCard icon={Icons.percentage} label="Percentage/CGPA" value={profile.graduation?.percentage} />
        </div>
      </Section>
      
      {profile.postGraduation?.status && (
        <Section title="Post Graduation" icon={Icons.university}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <InfoCard icon={Icons.status} label="PG Status" value={profile.postGraduation?.status} />
            <InfoCard icon={Icons.education} label="Degree" value={profile.postGraduation?.degree} />
            <InfoCard icon={Icons.paper} label="Specialisation" value={profile.postGraduation?.specialisation} />
            <InfoCard icon={Icons.university} label="University" value={profile.postGraduation?.university} />
            <InfoCard icon={Icons.year} label="Admission Year" value={profile.postGraduation?.admissionYear} />
            <InfoCard icon={Icons.year} label="Passing Year" value={profile.postGraduation?.passingYear} />
            <InfoCard icon={Icons.education} label="Mode" value={profile.postGraduation?.mode} />
            <InfoCard icon={Icons.percentage} label="Percentage" value={profile.postGraduation?.percentage} />
          </div>
        </Section>
      )}
    </div>
  );

  const renderProfessional = () => {
    if (profile.professionalStatus === "Employed" && profile.employmentDetails) {
      return (
        <div className="space-y-4">
          <Section title="Employment Details" icon={Icons.work}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <InfoCard icon="💼" label="Job Title" value={profile.employmentDetails.jobTitle} />
              <InfoCard icon="🏢" label="Industry" value={profile.employmentDetails.industry} />
              <InfoCard icon="🏛️" label="Organisation" value={profile.employmentDetails.organisation} />
              <InfoCard icon="📅" label="First Job Year" value={profile.employmentDetails.firstJobYear} />
              <InfoCard icon="⏳" label="Experience Years" value={profile.employmentDetails.experienceYears} />
            </div>
            {profile.employmentDetails.jobHistory && (
              <TextAreaCard label="Job History" value={profile.employmentDetails.jobHistory} />
            )}
          </Section>
        </div>
      );
    }

    if (profile.professionalStatus === "Business" && profile.businessDetails) {
      return (
        <div className="space-y-4">
          <Section title="Business Details" icon="🏢">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <InfoCard icon="💼" label="Nature" value={profile.businessDetails.nature} />
              <InfoCard icon="📅" label="Start Year" value={profile.businessDetails.startYear} />
              <InfoCard icon="👔" label="Previous Work" value={profile.businessDetails.previousWork} />
              <InfoCard icon="👨‍💼" label="Current Role" value={profile.businessDetails.currentRole} />
            </div>
            {profile.businessDetails.responsibilities && (
              <TextAreaCard label="Responsibilities" value={profile.businessDetails.responsibilities} />
            )}
          </Section>
        </div>
      );
    }

    if (profile.professionalStatus === "Consultant" && profile.consultantDetails) {
      return (
        <div className="space-y-4">
          <Section title="Consulting Details" icon="📈">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard icon="🎯" label="Expertise" value={profile.consultantDetails.expertise} />
              <InfoCard icon="⏳" label="Experience" value={profile.consultantDetails.yearsOfExperience} />
            </div>
            {profile.consultantDetails.clients && (
              <TextAreaCard label="Clients" value={profile.consultantDetails.clients} />
            )}
          </Section>
        </div>
      );
    }

    if (profile.professionalStatus === "Academician" && profile.academicDetails) {
      return (
        <div className="space-y-4">
          <Section title="Academic Details" icon="📚">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <InfoCard icon="🏛️" label="Institution" value={profile.academicDetails.institution} />
              <InfoCard icon="👨‍🏫" label="Designation" value={profile.academicDetails.designation} />
              <InfoCard icon="📖" label="Subjects" value={profile.academicDetails.subjects} />
              <InfoCard icon="⏳" label="Experience" value={profile.academicDetails.experienceYears} />
            </div>
          </Section>
        </div>
      );
    }

    return (
      <div className="text-center py-6 text-gray-500">
        <div className="text-3xl mb-3">📋</div>
        <p className="text-sm">No professional details</p>
      </div>
    );
  };

  const renderResearch = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoCard icon={Icons.paper} label="Research Papers" value={profile.research?.totalPapers} />
        <InfoCard icon={Icons.calendar} label="Session" value={profile.research?.session} />
      </div>
      
      {profile.research?.otherUniversity && (
        <TextAreaCard label="Other University Research" value={profile.research.otherUniversity} />
      )}
      
      {profile.research?.existingResearch && (
        <TextAreaCard label="Existing Research" value={profile.research.existingResearch} />
      )}
      
      {profile.research?.seminars && (
        <TextAreaCard label="Seminars/Conferences" value={profile.research.seminars} />
      )}
      
      {profile.research?.fields && (
        <TextAreaCard label="Research Fields" value={profile.research.fields} />
      )}
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      {profile.goals && (
        <TextAreaCard 
          icon="🎯" 
          label="Professional Goals" 
          value={profile.goals} 
        />
      )}
      
      {profile.blockers && (
        <TextAreaCard 
          icon="⛔" 
          label="Growth Blockers" 
          value={profile.blockers} 
        />
      )}
      
      {profile.underUtilised && (
        <TextAreaCard 
          icon="📉" 
          label="Under-utilised Areas" 
          value={profile.underUtilised} 
        />
      )}
      
      {profile.authorityIncidents && (
        <TextAreaCard 
          icon="⚖️" 
          label="Authority Incidents" 
          value={profile.authorityIncidents} 
        />
      )}
      
      <Section title="PhD Intent" icon="🎓">
        <div className="space-y-3">
          {profile.phd?.why && (
            <TextAreaCard label="PhD Relevance" value={profile.phd.why} />
          )}
          
          {profile.phd?.benefits && (
            <TextAreaCard label="PhD Benefits" value={profile.phd.benefits} />
          )}
          
          {profile.phd?.seriousness && (
            <div className="bg-gray-50 rounded p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">📊</span>
                <div className="text-sm font-medium text-gray-700">Seriousness (1-10)</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {profile.phd.seriousness}/10
                </div>
                <div className="flex-1">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                      style={{ width: `${(profile.phd.seriousness / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              {profile.phd?.reason && (
                <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded border">
                  {profile.phd.reason}
                </div>
              )}
            </div>
          )}
        </div>
      </Section>
      
      <Section title="Niche & Expertise" icon="🌟">
        <div className="space-y-3">
          {profile.niche?.helpWith && (
            <TextAreaCard label="People Come For" value={profile.niche.helpWith} />
          )}
          
          {profile.niche?.expertise && (
            <TextAreaCard label="Deep Expertise" value={profile.niche.expertise} />
          )}
          
          {profile.niche?.ideal && (
            <TextAreaCard label="Ideal Niche" value={profile.niche.ideal} />
          )}
          
          {profile.niche?.lifeLessons && (
            <TextAreaCard label="Life Lessons" value={profile.niche.lifeLessons} />
          )}
        </div>
      </Section>
      
      <Section title="Commitment" icon="✅">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCard icon="⏰" label="Weekly Hours" value={profile.commitment?.weeklyHours} />
          <InfoCard icon="💬" label="Honest Advice" value={profile.commitment?.honestAdvice} />
        </div>
        {profile.commitment?.fears && (
          <TextAreaCard label="Fears about PhD" value={profile.commitment.fears} />
        )}
      </Section>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-6">
      {profile.uploadedFiles?.length > 0 && (
        <Section title="Marksheets & Certificates" icon="📄">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.uploadedFiles.map((file, idx) => (
              <FileCard key={idx} file={file} setPreviewFile={setPreviewFile} />
            ))}
          </div>
        </Section>
      )}
      
      {profile.research?.documents?.length > 0 && (
        <Section title="Research Papers" icon="🔬">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {profile.research.documents.map((file, idx) => (
              <FileCard key={idx} file={file} setPreviewFile={setPreviewFile} />
            ))}
          </div>
        </Section>
      )}
      
      {(profile.uploadedFiles?.length === 0 && profile.research?.documents?.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm">No files uploaded</p>
        </div>
      )}
    </div>
  );

  switch (activeTab) {
    case 'basic': return renderBasicInfo();
    case 'education': return renderEducation();
    case 'professional': return renderProfessional();
    case 'research': return renderResearch();
    case 'goals': return renderGoals();
    case 'files': return renderFiles();
    default: return null;
  }
};

const Section = ({ title, icon, children }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 border-b pb-1.5">
      <span className="text-lg">{icon}</span>
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 hover:bg-gray-100 rounded p-3 transition-colors">
    <div className="flex items-center gap-1.5 mb-1">
      {icon && <span className="text-base">{icon}</span>}
      <div className="text-xs font-medium text-gray-500 truncate">{label}</div>
    </div>
    <div className="text-gray-800 font-medium text-sm break-words">
      {value || <span className="text-gray-400 italic text-xs">Not provided</span>}
    </div>
  </div>
);

const TextAreaCard = ({ icon, label, value }) => (
  <div className="bg-gray-50 rounded p-3">
    <div className="flex items-center gap-2 mb-2">
      {icon && <span className="text-base">{icon}</span>}
      <div className="text-sm font-medium text-gray-700">{label}</div>
    </div>
    <div className="bg-white rounded border p-2 max-h-48 overflow-y-auto">
      <pre className="text-gray-800 whitespace-pre-wrap font-sans text-xs leading-relaxed">
        {value}
      </pre>
    </div>
  </div>
);

const FileCard = ({ file, setPreviewFile }) => (
  <div 
    onClick={() => setPreviewFile(file)}
    className="border rounded p-2 hover:border-blue-400 hover:shadow transition-all cursor-pointer group bg-white"
  >
    <div className="flex items-start gap-2">
      <div className={`text-xl ${file.mimeType === "application/pdf" ? "text-red-500" : "text-blue-500"}`}>
        {file.mimeType === "application/pdf" ? "📄" : file.mimeType?.startsWith("image/") ? "🖼️" : "📎"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate group-hover:text-blue-600 text-xs">
          {file.originalName}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            {file.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : ""}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement("a");
              link.href = file.url;
              link.download = file.originalName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5"
          >
            <span>Download</span>
            <span>⬇️</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ count, label, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <div className={`px-2 py-1.5 rounded ${colorClasses[color]} text-center min-w-[70px]`}>
      <div className="text-base font-bold">{count}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
};

const FilePreviewModal = ({ file, onClose }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2">
    <div className="bg-white rounded-lg w-full max-w-5xl h-[95vh] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-gray-800 truncate text-sm">
          {file.originalName}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded transition-colors"
        >
          <span className="text-xl">{Icons.close}</span>
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {file.mimeType?.startsWith("image/") ? (
          <img
            src={`http://localhost:5007${file.url}`}
            className="w-full h-full object-contain p-3"
            alt={file.originalName}
          />
        ) : file.mimeType === "application/pdf" ? (
          <iframe
            src={`http://localhost:5007${file.url}#view=FitH`}
            className="w-full h-full"
            title={file.originalName}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-3">📄</div>
              <p className="text-gray-600 mb-3 text-sm">Preview not available</p>
              <a
                href={`http://localhost:5007${file.url}`}
                download={file.originalName}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                <span>Download</span>
                <span>⬇️</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ShodhSutraAdmin;