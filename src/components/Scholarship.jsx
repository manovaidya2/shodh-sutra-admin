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
  gender: "⚥",
  declaration: "📜",
  subject: "📚",
  organization: "🏢",
  designation: "👔",
  experience: "⏳",
  conference: "🎤",
  publication: "📖",
  statement: "📋",
  eligibility: "✅"
};

const GENDER_COLORS = {
  Male: "bg-blue-100 text-blue-800 border border-blue-200",
  Female: "bg-pink-100 text-pink-800 border border-pink-200",
  Other: "bg-purple-100 text-purple-800 border border-purple-200"
};

const EMPLOYMENT_STATUS_COLORS = {
  Employed: "bg-green-100 text-green-800 border border-green-200",
  Unemployed: "bg-gray-100 text-gray-800 border border-gray-200",
  Student: "bg-blue-100 text-blue-800 border border-blue-200",
  Other: "bg-purple-100 text-purple-800 border border-purple-200"
};

const ScholarshipAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [employmentFilter, setEmploymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewModal, setViewModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/scholarship/all");
      setApplications(res.data.data || []);
    } catch (error) {
      console.error("Error fetching scholarship applications:", error);
      alert("Failed to load scholarship applications");
    } finally {
      setLoading(false);
    }
  };

  // Get unique qualification values for filter
  const qualifications = [...new Set(applications.map(app => app.academicDetails?.highestQualification).filter(Boolean))];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.personalInfo?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.personalInfo?.mobile?.includes(searchTerm) ||
      app.proposedSubject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesQualification = qualificationFilter === "all" || 
      app.academicDetails?.highestQualification === qualificationFilter;
    
    const matchesEmployment = employmentFilter === "all" || 
      app.professionalDetails?.employmentStatus === employmentFilter;
    
    return matchesSearch && matchesQualification && matchesEmployment;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setViewModal(true);
  };

  const downloadCSV = () => {
    if (applications.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      'Full Name', 'Date of Birth', 'Gender', 'Mobile', 'Email', 'Permanent Address',
      'Highest Qualification', 'University', 'Year of Passing', 'Percentage',
      'Proposed Subject', 'Employment Status', 'Other Status', 'Organization',
      'Designation', 'Work Experience', 'Scholarship Eligibility',
      'Has Published', 'Publication Details', 'Has Attended Conference',
      'Conference Details', 'Research Interest', 'Statement of Need',
      'Consent Given', 'Application Date'
    ];

    const rows = applications.map(app => [
      app.personalInfo?.fullName || '',
      app.personalInfo?.dob ? new Date(app.personalInfo.dob).toLocaleDateString('en-IN') : '',
      app.personalInfo?.gender || '',
      app.personalInfo?.mobile || '',
      app.personalInfo?.email || '',
      app.personalInfo?.permanentAddress || '',
      app.academicDetails?.highestQualification || '',
      app.academicDetails?.university || '',
      app.academicDetails?.yearOfPassing || '',
      app.academicDetails?.percentage || '',
      app.proposedSubject || '',
      app.professionalDetails?.employmentStatus || '',
      app.professionalDetails?.otherStatus || '',
      app.professionalDetails?.organization || '',
      app.professionalDetails?.designation || '',
      app.professionalDetails?.workExperience || '',
      (app.scholarshipEligibility || []).join('; '),
      app.researchBackground?.hasPublished || '',
      app.researchBackground?.publicationDetails || '',
      app.researchBackground?.hasAttended || '',
      app.researchBackground?.conferenceDetails || '',
      app.researchBackground?.researchInterest || '',
      app.statementOfNeed || '',
      app.declaration?.consent ? 'Yes' : 'No',
      new Date(app.createdAt).toLocaleDateString('en-IN')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `scholarship-applications-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scholarship applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-4 overflow-x-hidden">
      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="mb-2 md:mb-0">
            <h1 className="text-xl font-bold text-gray-800">Scholarship Applications</h1>
            <p className="text-gray-600 text-sm mt-0.5">{filteredApplications.length} applications</p>
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
              value={qualificationFilter}
              onChange={(e) => setQualificationFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Qualifications</option>
              {qualifications.map(qual => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
            
            <select
              value={employmentFilter}
              onChange={(e) => setEmploymentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Employment</option>
              <option value="Employed">Employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Other">Other</option>
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
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">Total</div>
            <div className="text-lg font-bold text-gray-800">{applications.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">Filtered</div>
            <div className="text-lg font-bold text-gray-800">{filteredApplications.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">This Page</div>
            <div className="text-lg font-bold text-gray-800">{currentApplications.length}</div>
          </div>
          <div className="bg-white p-3 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-600">Consent Given</div>
            <div className="text-lg font-bold text-gray-800">
              {applications.filter(app => app.declaration?.consent).length}
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant Details
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qualification
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposed Subject
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Research
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    <div className="text-3xl mb-3">📭</div>
                    <p className="text-sm">No applications found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing your search or filter</p>
                  </td>
                </tr>
              ) : (
                currentApplications.map((app) => (
                  <tr 
                    key={app._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewApplication(app)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 text-sm">
                          {Icons.user}
                        </div>
                        <div className="ml-3 min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate max-w-[140px]">
                            {app.personalInfo?.fullName || "No Name"}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[140px]">
                            {app.personalInfo?.email || "No Email"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {app.personalInfo?.mobile || "No Mobile"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-gray-900">
                        {app.academicDetails?.highestQualification || "N/A"}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">
                        {app.academicDetails?.university || ""}
                      </div>
                      {app.academicDetails?.percentage && (
                        <div className="text-xs text-gray-400">
                          {app.academicDetails.percentage}%
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium text-gray-900 truncate max-w-[120px]">
                        {app.proposedSubject || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        EMPLOYMENT_STATUS_COLORS[app.professionalDetails?.employmentStatus] || "bg-gray-100 text-gray-800"
                      }`}>
                        {app.professionalDetails?.employmentStatus || "Not Specified"}
                      </span>
                      {app.professionalDetails?.organization && (
                        <div className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">
                          {app.professionalDetails.organization}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${
                            app.researchBackground?.hasPublished === 'Yes' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {app.researchBackground?.hasPublished === 'Yes' ? '📝' : '📄'}
                          </div>
                          <div className="text-xs text-gray-500">Published</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-semibold ${
                            app.researchBackground?.hasAttended === 'Yes' ? 'text-purple-600' : 'text-gray-400'
                          }`}>
                            {app.researchBackground?.hasAttended === 'Yes' ? '🎤' : '🎫'}
                          </div>
                          <div className="text-xs text-gray-500">Conference</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-900">
                        {new Date(app.createdAt).toLocaleDateString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(app.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewApplication(app);
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

        {/* Pagination */}
        {filteredApplications.length > itemsPerPage && (
          <div className="bg-white px-4 py-2 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastItem, filteredApplications.length)}
                </span> of{" "}
                <span className="font-medium">{filteredApplications.length}</span>
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

      {/* Application View Modal */}
      {viewModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setViewModal(false)}
        />
      )}
    </div>
  );
};

const ApplicationModal = ({ application, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDOB = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: Icons.user },
    { id: 'academic', label: 'Academic', icon: Icons.education },
    { id: 'professional', label: 'Professional', icon: Icons.work },
    { id: 'research', label: 'Research', icon: Icons.research },
    { id: 'statement', label: 'Statement', icon: Icons.statement },
    { id: 'eligibility', label: 'Eligibility', icon: Icons.eligibility },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[95vh] flex flex-col my-2">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center text-white text-base shrink-0">
                {Icons.user}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-800 truncate">
                  {application.personalInfo?.fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    GENDER_COLORS[application.personalInfo?.gender] || "bg-gray-100 text-gray-800"
                  }`}>
                    {application.personalInfo?.gender || 'Gender not specified'}
                  </span>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-xs text-gray-600 truncate max-w-[180px]">
                    {application.personalInfo?.email}
                  </span>
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

        {/* Modal Stats */}
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-gray-600">
              Applied {formatDate(application.createdAt)}
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-3">
              <StatCard 
                label="Qualification" 
                value={application.academicDetails?.highestQualification || 'N/A'}
                color="blue"
              />
              <StatCard 
                label="Consent" 
                value={application.declaration?.consent ? '✓ Given' : '✗ Not Given'}
                color={application.declaration?.consent ? "green" : "gray"}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <TabContent 
              activeTab={activeTab} 
              application={application}
              formatDOB={formatDOB}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-3 bg-white sticky bottom-0">
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = `mailto:${application.personalInfo?.email}`;
                link.click();
              }}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors text-sm"
            >
              Email Applicant
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

const TabContent = ({ activeTab, application, formatDOB }) => {
  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <Section title="Personal Information" icon={Icons.user}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard icon={Icons.user} label="Full Name" value={application.personalInfo?.fullName} />
          <InfoCard icon={Icons.calendar} label="Date of Birth" value={formatDOB(application.personalInfo?.dob)} />
          <InfoCard icon={Icons.gender} label="Gender" value={application.personalInfo?.gender} />
          <InfoCard icon={Icons.phone} label="Mobile" value={application.personalInfo?.mobile} />
          <InfoCard icon={Icons.email} label="Email" value={application.personalInfo?.email} />
          <InfoCard icon={Icons.location} label="Permanent Address" value={application.personalInfo?.permanentAddress} />
        </div>
      </Section>
      
      <Section title="Declaration" icon={Icons.declaration}>
        <div className="bg-gray-50 rounded p-3">
          <div className="flex items-center gap-2">
            <div className={`text-lg ${application.declaration?.consent ? 'text-green-600' : 'text-red-600'}`}>
              {application.declaration?.consent ? '✓' : '✗'}
            </div>
            <div className="text-sm text-gray-700">
              {application.declaration?.consent 
                ? 'Consent given for scholarship application' 
                : 'Consent not provided'}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );

  const renderAcademicInfo = () => (
    <div className="space-y-4">
      <Section title="Academic Details" icon={Icons.education}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard icon={Icons.education} label="Highest Qualification" value={application.academicDetails?.highestQualification} />
          <InfoCard icon={Icons.university} label="University/Institute" value={application.academicDetails?.university} />
          <InfoCard icon={Icons.year} label="Year of Passing" value={application.academicDetails?.yearOfPassing} />
          <InfoCard icon={Icons.percentage} label="Percentage/CGPA" value={application.academicDetails?.percentage} />
        </div>
      </Section>
      
      <Section title="Proposed Subject" icon={Icons.subject}>
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="text-gray-800 font-medium text-sm">
            {application.proposedSubject || 'Not specified'}
          </div>
        </div>
      </Section>
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="space-y-4">
      <Section title="Employment Details" icon={Icons.work}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard icon={Icons.status} label="Employment Status" value={application.professionalDetails?.employmentStatus} />
          {application.professionalDetails?.employmentStatus === 'Other' && (
            <InfoCard icon={Icons.status} label="Other Status" value={application.professionalDetails?.otherStatus} />
          )}
          <InfoCard icon={Icons.organization} label="Organization" value={application.professionalDetails?.organization} />
          <InfoCard icon={Icons.designation} label="Designation" value={application.professionalDetails?.designation} />
          <InfoCard icon={Icons.experience} label="Work Experience" value={application.professionalDetails?.workExperience} />
        </div>
      </Section>
      
      {(application.professionalDetails?.employmentStatus === 'Unemployed' || !application.professionalDetails?.employmentStatus) && (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
          <div className="text-2xl mb-2">💼</div>
          <p className="text-sm">No professional details provided</p>
        </div>
      )}
    </div>
  );

  const renderResearchInfo = () => (
    <div className="space-y-4">
      <Section title="Publications" icon={Icons.publication}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              application.researchBackground?.hasPublished === 'Yes' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {application.researchBackground?.hasPublished === 'Yes' ? 'Has Publications' : 'No Publications'}
            </span>
          </div>
          {application.researchBackground?.hasPublished === 'Yes' && application.researchBackground?.publicationDetails && (
            <TextAreaCard label="Publication Details" value={application.researchBackground.publicationDetails} />
          )}
        </div>
      </Section>
      
      <Section title="Conferences" icon={Icons.conference}>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium px-2 py-1 rounded ${
              application.researchBackground?.hasAttended === 'Yes' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {application.researchBackground?.hasAttended === 'Yes' ? 'Attended Conferences' : 'No Conference Experience'}
            </span>
          </div>
          {application.researchBackground?.hasAttended === 'Yes' && application.researchBackground?.conferenceDetails && (
            <TextAreaCard label="Conference Details" value={application.researchBackground.conferenceDetails} />
          )}
        </div>
      </Section>
      
      {application.researchBackground?.researchInterest && (
        <Section title="Research Interest" icon={Icons.research}>
          <TextAreaCard value={application.researchBackground.researchInterest} />
        </Section>
      )}
    </div>
  );

  const renderStatementInfo = () => (
    <div className="space-y-4">
      <Section title="Statement of Need" icon={Icons.statement}>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
            {application.statementOfNeed || 'No statement provided'}
          </p>
        </div>
      </Section>
    </div>
  );

  const renderEligibilityInfo = () => (
    <div className="space-y-4">
      <Section title="Scholarship Eligibility" icon={Icons.eligibility}>
        {application.scholarshipEligibility?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {application.scholarshipEligibility.map((item, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded p-2 flex items-center gap-2">
                <span className="text-green-600 text-lg">✓</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded">
            <p className="text-sm">No eligibility criteria specified</p>
          </div>
        )}
      </Section>
    </div>
  );

  switch (activeTab) {
    case 'personal': return renderPersonalInfo();
    case 'academic': return renderAcademicInfo();
    case 'professional': return renderProfessionalInfo();
    case 'research': return renderResearchInfo();
    case 'statement': return renderStatementInfo();
    case 'eligibility': return renderEligibilityInfo();
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
      {value || value === 0 ? value : <span className="text-gray-400 italic text-xs">Not provided</span>}
    </div>
  </div>
);

const TextAreaCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded p-3">
    {label && (
      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
    )}
    <div className="bg-white rounded border p-2 max-h-48 overflow-y-auto">
      <pre className="text-gray-800 whitespace-pre-wrap font-sans text-xs leading-relaxed">
        {value || 'No details provided'}
      </pre>
    </div>
  </div>
);

const StatCard = ({ label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <div className={`px-3 py-1.5 rounded ${colorClasses[color]} text-center min-w-[100px]`}>
      <div className="text-xs font-medium">{label}</div>
      <div className="text-sm font-bold mt-0.5">{value}</div>
    </div>
  );
};

export default ScholarshipAdmin;