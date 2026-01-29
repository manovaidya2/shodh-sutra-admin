import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

/* 🔹 QUESTIONS CONFIG */
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
    } catch (error) {
      console.error("Error loading profile:", error);
      alert("Failed to load profile details");
    }
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
          <h2 className="text-xl font-bold text-gray-800">
            📋 Shodh Sutra Submissions ({profiles.length})
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Click on any profile to view details
          </p>
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
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {profile.professionalStatus || "No Status"}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {profile.uploadedFiles?.length || 0} files
                      </span>
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
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {selected.fullName}
                  </h1>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      📧 {selected.email}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      📱 {selected.mobile}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      🏙️ {selected.cityCountry || "Not specified"}
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      🎯 {selected.professionalStatus}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-90">
                    Submitted on
                  </div>
                  <div className="font-semibold">
                    {new Date(selected.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="text-sm opacity-90 mt-1">
                    {new Date(selected.createdAt).toLocaleTimeString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions & Answers Sections */}
            <div className="space-y-6">
              {QUESTIONS.map((section) => {
                // Check if section should be shown based on condition
                if (section.condition && !section.condition(selected)) {
                  return null;
                }

                // Check if section has any data to show
                const hasData = section.fields.some(field => {
                  const value = getValue(selected, field.key);
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
                        const value = getValue(selected, field.key);
                        
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

              {/* Uploaded Files Section */}
              {selected.uploadedFiles && selected.uploadedFiles.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-100">
                    <span className="text-green-600 mr-2">📎</span>
                    Uploaded Documents ({selected.uploadedFiles.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {selected.uploadedFiles.map((file, idx) => (
  <div
    key={idx}
    onClick={() => setPreviewFile(file)}
    className="cursor-pointer group border border-gray-200 rounded-lg p-4 
               hover:border-green-400 hover:bg-green-50 transition-all duration-200"
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
          <span className="text-xs text-green-600 font-medium">
            Click to view →
          </span>
        </div>
      </div>
    </div>
  </div>
))}

                  </div>
                </div>
              )}

              {/* Model Data Display (For Debugging) */}
              <div className="bg-gray-900 text-white rounded-xl p-6">
                <details>
                  <summary className="cursor-pointer text-sm font-mono">
                    🔍 View Raw Model Data (Debug)
                  </summary>
                  <pre className="mt-4 text-xs overflow-auto p-4 bg-gray-800 rounded">
                    {JSON.stringify(selected, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </>
        )}
        {previewFile && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div className="bg-white w-[90%] h-[90%] rounded-xl shadow-xl flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-gray-800 truncate">
          {previewFile.originalName}
        </h3>
        <button
          onClick={() => setPreviewFile(null)}
          className="text-red-500 font-bold text-lg"
        >
          ✕
        </button>
      </div>

      {/* Content */}
<div className="flex-1 overflow-hidden">
  {previewFile.mimeType?.startsWith("image/") ? (
    <img
      src={previewFile.url}
      alt="Preview"
      className="w-full h-full object-contain"
    />
  ) : (
    <iframe
      src={previewFile.url}
      className="w-full h-full"
      title="Document Preview"
    />
  )}
</div>

    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default ShodhSutraAdmin;