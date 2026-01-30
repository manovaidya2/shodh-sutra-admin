import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

/* 🔹 QUESTIONS CONFIG - COMPLETE */
const QUESTIONS = [
  {
    title: "Basic Details",
    fields: [
      { key: "fullName", label: "Full Name", type: "text" },
      { key: "email", label: "Email ID", type: "email" },
      { key: "mobile", label: "Mobile Number", type: "text" },
      { key: "cityCountry", label: "City & Country", type: "text" },
      { key: "age", label: "Age", type: "text" },
    ],
  },
  {
    title: "Class 10 Details",
    fields: [
      { key: "class10.board", label: "Board", type: "text" },
      { key: "class10.year", label: "Year", type: "text" },
      { key: "class10.percentage", label: "Percentage/Grade", type: "text" },
    ],
  },
  {
    title: "Class 12 Details",
    fields: [
      { key: "class12.stream", label: "Stream", type: "text" },
      { key: "class12.board", label: "Board", type: "text" },
      { key: "class12.year", label: "Year", type: "text" },
      { key: "class12.percentage", label: "Percentage/Grade", type: "text" },
    ],
  },
  {
    title: "Graduation Details",
    fields: [
      { key: "graduation.degree", label: "Degree", type: "text" },
      { key: "graduation.specialisation", label: "Specialisation", type: "text" },
      { key: "graduation.university", label: "University", type: "text" },
      { key: "graduation.mode", label: "Mode of Study", type: "text" },
      { key: "graduation.admissionYear", label: "Admission Year", type: "text" },
      { key: "graduation.passingYear", label: "Passing Year", type: "text" },
      { key: "graduation.percentage", label: "Percentage/CGPA", type: "text" },
    ],
  },
  {
    title: "Post Graduation Details",
    fields: [
      { key: "postGraduation.status", label: "PG Status", type: "text" },
      { key: "postGraduation.degree", label: "Degree", type: "text" },
      { key: "postGraduation.specialisation", label: "Specialisation", type: "text" },
      { key: "postGraduation.university", label: "University", type: "text" },
      { key: "postGraduation.admissionYear", label: "Admission Year", type: "text" },
      { key: "postGraduation.passingYear", label: "Passing Year", type: "text" },
      { key: "postGraduation.mode", label: "Mode of Study", type: "text" },
      { key: "postGraduation.percentage", label: "Percentage/CGPA", type: "text" },
    ],
  },
  {
    title: "Professional Status",
    fields: [
      { key: "professionalStatus", label: "Current Status", type: "text" },
    ],
  },
  {
    title: "Employment Details",
    condition: (profile) => profile.professionalStatus === "Employed",
    fields: [
      { key: "employmentDetails.jobTitle", label: "Job Title", type: "text" },
      { key: "employmentDetails.industry", label: "Industry/Domain", type: "text" },
      { key: "employmentDetails.organisation", label: "Organisation", type: "text" },
      { key: "employmentDetails.firstJobYear", label: "First Job Year", type: "text" },
      { key: "employmentDetails.experienceYears", label: "Experience Years", type: "text" },
      { key: "employmentDetails.jobHistory", label: "Job History", type: "textarea" },
    ],
  },
  {
    title: "Business Details",
    condition: (profile) => profile.professionalStatus === "Business",
    fields: [
      { key: "businessDetails.nature", label: "Nature of Business", type: "text" },
      { key: "businessDetails.startYear", label: "Start Year", type: "text" },
      { key: "businessDetails.previousWork", label: "Previous Work", type: "text" },
      { key: "businessDetails.currentRole", label: "Current Role", type: "text" },
      { key: "businessDetails.responsibilities", label: "Responsibilities", type: "textarea" },
    ],
  },
  {
    title: "Consulting Details",
    condition: (profile) => profile.professionalStatus === "Consultant",
    fields: [
      { key: "consultantDetails.expertise", label: "Area of Expertise", type: "text" },
      { key: "consultantDetails.yearsOfExperience", label: "Years of Experience", type: "text" },
      { key: "consultantDetails.clients", label: "Types of Clients", type: "textarea" },
    ],
  },
  {
    title: "Academic Details",
    condition: (profile) => profile.professionalStatus === "Academician",
    fields: [
      { key: "academicDetails.institution", label: "Institution", type: "text" },
      { key: "academicDetails.designation", label: "Designation", type: "text" },
      { key: "academicDetails.subjects", label: "Subjects Taught", type: "text" },
      { key: "academicDetails.experienceYears", label: "Teaching Experience", type: "text" },
    ],
  },
  {
    title: "Research & Publications",
    fields: [
      { key: "research.totalPapers", label: "Total Research Papers Published", type: "text" },
      { key: "research.otherUniversity", label: "Other University Research Program", type: "textarea" },
      { key: "research.session", label: "Session (if any)", type: "text" },
      { key: "research.existingResearch", label: "Existing Research", type: "textarea" },
      { key: "research.seminars", label: "Seminars/Conferences Attended", type: "textarea" },
      { key: "research.fields", label: "Fields of Research Papers", type: "textarea" },
    ],
  },
  {
    title: "Professional Goals",
    fields: [
      { key: "goals", label: "What are your top 3 professional goals for next 2 years?", type: "textarea" },
      { key: "blockers", label: "What is blocking or slowing your growth?", type: "textarea" },
      { key: "underUtilised", label: "Where do you feel under-utilised?", type: "textarea" },
    ],
  },
  {
    title: "Authority & Validation Incidents",
    fields: [
      { key: "authorityIncidents", label: "Describe THREE authority incidents", type: "textarea" },
    ],
  },
  {
    title: "PhD Intent & Relevance",
    fields: [
      { key: "phd.why", label: "Why do you believe a PhD is relevant?", type: "textarea" },
      { key: "phd.benefits", label: "How can PhD help achieve your goals?", type: "textarea" },
      { key: "phd.seriousness", label: "Seriousness Level (1-10)", type: "number" },
      { key: "phd.reason", label: "Why this seriousness level?", type: "textarea" },
    ],
  },
  {
    title: "Niche & Expertise",
    fields: [
      { key: "niche.helpWith", label: "What topics do people come to you for?", type: "textarea" },
      { key: "niche.expertise", label: "Where do you have deep expertise?", type: "textarea" },
      { key: "niche.ideal", label: "What should be your ideal niche?", type: "textarea" },
      { key: "niche.lifeLessons", label: "What life lessons push you?", type: "textarea" },
    ],
  },
  {
    title: "Expectations from Shodh Sutra",
    fields: [
      { key: "expectations.heardFrom", label: "How did you hear about us?", type: "text" },
      { key: "expectations.expectation", label: "What do you expect?", type: "textarea" },
      { key: "expectations.phdHelp", label: "How can we help your PhD journey?", type: "textarea" },
      { key: "expectations.sessionValue", label: "What would make session valuable?", type: "textarea" },
    ],
  },
  {
    title: "Commitment Check",
    fields: [
      { key: "commitment.weeklyHours", label: "Weekly hours for research", type: "text" },
      { key: "commitment.fears", label: "Fears about pursuing PhD", type: "textarea" },
      { key: "commitment.honestAdvice", label: "Open to honest advice?", type: "text" },
    ],
  },
  {
    title: "Form Submission Details",
    fields: [
      { key: "formStatus", label: "Form Status", type: "text" },
      { 
        key: "createdAt", 
        label: "Submitted At", 
        type: "text",
        format: (value) => new Date(value).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      },
    ],
  },
];

/* 🔹 Nested getter */
const getValue = (obj, path) => {
  if (!path) return "";
  return path.split(".").reduce((acc, key) => {
    if (acc === null || acc === undefined) return "";
    return acc[key];
  }, obj);
};

const ShodhSutraAdmin = () => {
  const [profiles, setProfiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewFile, setPreviewFile] = useState(null);
  const [viewMode, setViewMode] = useState('full'); // 'full' or 'compact'

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

  const loadProfile = async (id) => {
    try {
      const res = await axiosInstance.get(`/shodh-sutra/profiles/${id}`);
      setSelected(res.data.data);
      setViewMode('full');
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Failed to load profile details");
    }
  };

  const downloadCSV = () => {
    if (profiles.length === 0) {
      alert("No data to export");
      return;
    }

    // Create headers
    const headers = [
      'Full Name',
      'Email',
      'Mobile',
      'City/Country',
      'Age',
      'Professional Status',
      'Submission Date',
      'Class 10 Board',
      'Class 10 Year',
      'Class 10 Percentage',
      'Class 12 Stream',
      'Class 12 Board',
      'Class 12 Year',
      'Class 12 Percentage',
      'Graduation Degree',
      'Graduation Specialisation',
      'Graduation University',
      'Graduation Mode',
      'Graduation Admission Year',
      'Graduation Passing Year',
      'Graduation Percentage',
      'PG Status',
      'PG Degree',
      'PG Specialisation',
      'PG University',
      'PG Admission Year',
      'PG Passing Year',
      'PG Mode',
      'PG Percentage',
      'Goals',
      'Blockers',
      'Under Utilised',
      'Authority Incidents',
      'PhD Why',
      'PhD Benefits',
      'PhD Seriousness',
      'PhD Reason',
      'Niche Help With',
      'Niche Expertise',
      'Niche Ideal',
      'Life Lessons',
      'Heard From',
      'Expectations',
      'PhD Help',
      'Session Value',
      'Weekly Hours',
      'Fears',
      'Honest Advice'
    ];

    // Create rows
    const rows = profiles.map(profile => [
      profile.fullName || '',
      profile.email || '',
      profile.mobile || '',
      profile.cityCountry || '',
      profile.age || '',
      profile.professionalStatus || '',
      new Date(profile.createdAt).toLocaleDateString('en-IN'),
      profile.class10?.board || '',
      profile.class10?.year || '',
      profile.class10?.percentage || '',
      profile.class12?.stream || '',
      profile.class12?.board || '',
      profile.class12?.year || '',
      profile.class12?.percentage || '',
      profile.graduation?.degree || '',
      profile.graduation?.specialisation || '',
      profile.graduation?.university || '',
      profile.graduation?.mode || '',
      profile.graduation?.admissionYear || '',
      profile.graduation?.passingYear || '',
      profile.graduation?.percentage || '',
      profile.postGraduation?.status || '',
      profile.postGraduation?.degree || '',
      profile.postGraduation?.specialisation || '',
      profile.postGraduation?.university || '',
      profile.postGraduation?.admissionYear || '',
      profile.postGraduation?.passingYear || '',
      profile.postGraduation?.mode || '',
      profile.postGraduation?.percentage || '',
      profile.goals || '',
      profile.blockers || '',
      profile.underUtilised || '',
      profile.authorityIncidents || '',
      profile.phd?.why || '',
      profile.phd?.benefits || '',
      profile.phd?.seriousness || '',
      profile.phd?.reason || '',
      profile.niche?.helpWith || '',
      profile.niche?.expertise || '',
      profile.niche?.ideal || '',
      profile.niche?.lifeLessons || '',
      profile.expectations?.heardFrom || '',
      profile.expectations?.expectation || '',
      profile.expectations?.phdHelp || '',
      profile.expectations?.sessionValue || '',
      profile.commitment?.weeklyHours || '',
      profile.commitment?.fears || '',
      profile.commitment?.honestAdvice || ''
    ]);

    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `shodh-sutra-profiles-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT PANEL - Profile List */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              📋 Shodh Sutra Submissions ({profiles.length})
            </h2>
            <button
              onClick={downloadCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
            >
              📥 Export CSV
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Click on any profile to view details
          </p>
          <div className="flex space-x-2 mt-3">
            <button
              onClick={() => setViewMode('full')}
              className={`px-3 py-1 text-sm rounded ${viewMode === 'full' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Full View
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1 text-sm rounded ${viewMode === 'compact' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Compact View
            </button>
          </div>
        </div>

        <div className="p-4">
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No submissions yet
            </div>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile._id}
                onClick={() => loadProfile(profile._id)}
                className={`p-4 mb-3 rounded-lg border cursor-pointer transition-all duration-200
                  ${
                    selected?._id === profile._id
                      ? "bg-blue-50 border-blue-300 shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {profile.fullName || "No Name"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {profile.email || "No Email"}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded
                        ${profile.professionalStatus === "Employed" ? "bg-blue-100 text-blue-700" :
                          profile.professionalStatus === "Business" ? "bg-green-100 text-green-700" :
                          profile.professionalStatus === "Consultant" ? "bg-purple-100 text-purple-700" :
                          profile.professionalStatus === "Academician" ? "bg-yellow-100 text-yellow-700" :
                          "bg-gray-100 text-gray-700"}`}>
                        {profile.professionalStatus || "No Status"}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {profile.uploadedFiles?.length || 0} files
                      </span>
                      {profile.research?.documents?.length > 0 && (
                        <span className="ml-2 text-xs text-blue-500">
                          {profile.research.documents.length} research papers
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {new Date(profile.createdAt).toLocaleDateString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(profile.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT PANEL - Profile Details */}
      <div className="w-2/3 overflow-y-auto p-6">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-5xl mb-4">👈</div>
            <h3 className="text-xl font-medium mb-2">Select a Profile</h3>
            <p className="text-center max-w-md">
              Click on any profile from the left panel to view<br />
              complete question & answer details here
            </p>
          </div>
        ) : viewMode === 'compact' ? (
          <CompactView profile={selected} />
        ) : (
          <FullView 
            profile={selected} 
            previewFile={previewFile}
            setPreviewFile={setPreviewFile}
          />
        )}
      </div>
    </div>
  );
};

const FullView = ({ profile, previewFile, setPreviewFile }) => {
  return (
    <>
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {profile.fullName}
            </h1>
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                📧 {profile.email}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                📱 {profile.mobile}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                🏙️ {profile.cityCountry || "Not specified"}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                🎯 {profile.professionalStatus}
              </div>
              {profile.age && (
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  🎂 Age: {profile.age}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">
              Submitted on
            </div>
            <div className="font-semibold">
              {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="text-sm opacity-90 mt-1">
              {new Date(profile.createdAt).toLocaleTimeString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Questions & Answers Sections */}
      <div className="space-y-6">
        {QUESTIONS.map((section) => {
          // Check if section should be shown based on condition
          if (section.condition && !section.condition(profile)) {
            return null;
          }

          // Check if section has any data to show
          const hasData = section.fields.some(field => {
            const value = getValue(profile, field.key);
            return value !== undefined && value !== null && value !== "";
          });

          if (!hasData) return null;

          return (
            <div
              key={section.title}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                <span className="text-blue-600 mr-2">📋</span>
                {section.title}
              </h3>

              <div className="space-y-4">
                {section.fields.map((field) => {
                  const value = getValue(profile, field.key);
                  
                  if (value === undefined || value === null || value === "") {
                    return null;
                  }

                  const displayValue = field.format 
                    ? field.format(value)
                    : value;

                  return (
                    <div 
                      key={field.key} 
                      className="border-l-4 border-blue-100 pl-4 py-1"
                    >
                      <div className="flex items-start">
                        <div className="w-1/3">
                          <p className="font-medium text-gray-700 text-sm">
                            {field.label}
                          </p>
                        </div>
                        <div className="w-2/3">
                          {field.type === "textarea" ? (
                            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                              <pre className="text-gray-800 whitespace-pre-wrap font-sans">
                                {displayValue}
                              </pre>
                            </div>
                          ) : field.type === "number" ? (
                            <div className="flex items-center">
                              <div className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full">
                                {displayValue}/10
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                                    style={{ width: `${(displayValue / 10) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-800 bg-gray-50 p-3 rounded-md border border-gray-100">
                              {displayValue}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Research Documents Section */}
        {profile.research?.documents && profile.research.documents.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              <span className="text-purple-600 mr-2">📄</span>
              Research Papers & Certificates ({profile.research.documents.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.research.documents.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewFile(file)}
                  className="cursor-pointer group border border-gray-200 rounded-lg p-4 
                           hover:border-purple-400 hover:bg-purple-50 transition-all"
                >
                  <div className="flex items-start">
                    <div className="mr-3 text-purple-600 text-xl">
                      {file.mimeType === "application/pdf" ? "📄" : "🖼️"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-purple-700 truncate">
                        {file.originalName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
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
                          className="text-xs text-purple-700 font-semibold hover:underline"
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Uploaded Files Section */}
        {profile.uploadedFiles && profile.uploadedFiles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
              <span className="text-green-600 mr-2">📎</span>
              Uploaded Marksheets & Certificates ({profile.uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => setPreviewFile(file)}
                  className="cursor-pointer group border border-gray-200 rounded-lg p-4 
                           hover:border-green-400 hover:bg-green-50 transition-all"
                >
                  <div className="flex items-start">
                    <div className="mr-3 text-green-600 text-xl">
                      {file.mimeType === "application/pdf" ? "📄" : "🖼️"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-green-700 truncate">
                        {file.originalName}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
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
                          className="text-xs text-green-700 font-semibold hover:underline"
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Raw Data (Optional) */}
        <div className="bg-gray-900 text-white rounded-xl p-6">
          <details>
            <summary className="cursor-pointer text-sm font-mono">
              🔍 View Raw Model Data (Debug)
            </summary>
            <pre className="mt-4 text-xs overflow-auto p-4 bg-gray-800 rounded max-h-96">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </details>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] h-[90%] rounded-xl shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold text-gray-800 truncate">
                {previewFile.originalName}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-red-500 font-bold text-lg hover:bg-red-50 p-2 rounded-full"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {previewFile.mimeType?.startsWith("image/") ? (
                <img
                  src={`http://localhost:5007${previewFile.url}`}
                  className="w-full h-full object-contain"
                  alt={previewFile.originalName}
                />
              ) : previewFile.mimeType === "application/pdf" ? (
                <iframe
                  src={`http://localhost:5007${previewFile.url}`}
                  className="w-full h-full"
                  title={previewFile.originalName}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-5xl mb-4">📄</div>
                    <p className="text-gray-600">File preview not available for this type</p>
                    <a
                      href={`http://localhost:5007${previewFile.url}`}
                      download={previewFile.originalName}
                      className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CompactView = ({ profile }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Quick Overview</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Name</div>
            <div className="text-lg font-semibold">{profile.fullName}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Email</div>
            <div className="text-lg font-semibold truncate">{profile.email}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Mobile</div>
            <div className="text-lg font-semibold">{profile.mobile}</div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Status</div>
            <div className="text-lg font-semibold">{profile.professionalStatus}</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600 font-medium">Age</div>
            <div className="text-lg font-semibold">{profile.age || "N/A"}</div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-indigo-600 font-medium">Location</div>
            <div className="text-lg font-semibold">{profile.cityCountry || "N/A"}</div>
          </div>
        </div>

        {/* Education Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🎓 Education Summary</h3>
          <div className="space-y-2">
            {profile.graduation?.degree && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Graduation:</span>
                <span className="font-medium">{profile.graduation.degree} ({profile.graduation.specialisation})</span>
              </div>
            )}
            {profile.postGraduation?.degree && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Post Graduation:</span>
                <span className="font-medium">{profile.postGraduation.degree} ({profile.postGraduation.specialisation})</span>
              </div>
            )}
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Class 12 Stream:</span>
              <span className="font-medium">{profile.class12?.stream || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Files Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📁 Files Summary</h3>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.uploadedFiles?.length || 0}</div>
              <div className="text-sm text-gray-600">Marksheets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.research?.documents?.length || 0}</div>
              <div className="text-sm text-gray-600">Research Papers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(profile.uploadedFiles?.length || 0) + (profile.research?.documents?.length || 0)}
              </div>
              <div className="text-sm text-gray-600">Total Files</div>
            </div>
          </div>
        </div>

        {/* Key Information */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔑 Key Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">PhD Seriousness:</span>
              <span className="font-bold text-blue-600">{profile.phd?.seriousness || "N/A"}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weekly Research Hours:</span>
              <span className="font-bold text-green-600">{profile.commitment?.weeklyHours || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Research Papers:</span>
              <span className="font-bold text-purple-600">{profile.research?.totalPapers || "0"}</span>
            </div>
          </div>
        </div>

        {/* Professional Goals Preview */}
        {profile.goals && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Professional Goals Preview</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-700 line-clamp-3">{profile.goals}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShodhSutraAdmin;