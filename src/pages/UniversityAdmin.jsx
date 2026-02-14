// src/components/UniversityAdmin.jsx - FIXED VERSION
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

// CORRECT Heroicons imports
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  BuildingLibraryIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  LightBulbIcon,
  UserGroupIcon,
  UsersIcon,
  PhoneIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

const UniversityAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({ id: null, status: '', notes: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const limit = 8;

  // Status colors
  const statusColors = {
    'Submitted': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Contacted': 'bg-purple-100 text-purple-800'
  };

  // Status icons
  const statusIcons = {
    'Submitted': ClockIcon,
    'Under Review': ClockIcon,
    'Approved': CheckCircleIcon,
    'Rejected': XCircleIcon,
    'Contacted': CheckCircleIcon
  };

  // Clear messages after timeout
  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setError('');
    }, 3000);
  };

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit,
        ...(filter !== 'all' && { status: filter }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await axiosInstance.get('/university/submissions', { params });
      
      if (response.data.success) {
        setSubmissions(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError(err.response?.data?.message || 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (id, newStatus, notes = '') => {
    try {
      setError('');
      
      const response = await axiosInstance.put(
        `/university/submissions/${id}/status`,
        { status: newStatus, notes }
      );
      
      if (response.data.success) {
        fetchSubmissions();
        setStatusUpdate({ id: null, status: '', notes: '' });
        setSuccessMessage('Status updated successfully');
        clearMessages();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
      clearMessages();
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      setError('');
      
      const response = await axiosInstance.delete(`/university/submissions/${deleteId}`);
      
      if (response.data.success) {
        fetchSubmissions();
        setShowDeleteModal(false);
        setDeleteId(null);
        setSuccessMessage('Submission deleted successfully');
        clearMessages();
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError(err.response?.data?.message || 'Failed to delete submission');
      clearMessages();
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      fetchSubmissions();
    }
  };

  // Load data on component mount and when dependencies change
  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, filter]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get stats
  const getStats = () => {
    const stats = {
      total: totalItems,
      submitted: submissions.filter(s => s.status === 'Submitted').length,
      approved: submissions.filter(s => s.status === 'Approved').length,
      rejected: submissions.filter(s => s.status === 'Rejected').length,
      contacted: submissions.filter(s => s.status === 'Contacted').length,
      underReview: submissions.filter(s => s.status === 'Under Review').length
    };
    return stats;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-4 max-w-screen-xl mx-auto">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircleIcon className="w-4 h-4" />
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2 text-sm">
          <ExclamationTriangleIcon className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BuildingLibraryIcon className="w-6 h-6" />
              University Submissions
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Manage university partnership requests</p>
          </div>
          <button
            onClick={fetchSubmissions}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats Cards - Made more compact */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-4">
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl font-bold mt-0.5">{stats.total}</p>
              </div>
              <DocumentTextIcon className="w-6 h-6 text-gray-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Submitted</p>
                <p className="text-xl font-bold mt-0.5">{stats.submitted}</p>
              </div>
              <ClockIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div className={`mt-1.5 h-1 rounded-full ${statusColors.Submitted}`}></div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Review</p>
                <p className="text-xl font-bold mt-0.5">{stats.underReview}</p>
              </div>
              <ClockIcon className="w-6 h-6 text-yellow-500" />
            </div>
            <div className={`mt-1.5 h-1 rounded-full ${statusColors['Under Review']}`}></div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Approved</p>
                <p className="text-xl font-bold mt-0.5">{stats.approved}</p>
              </div>
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <div className={`mt-1.5 h-1 rounded-full ${statusColors.Approved}`}></div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Rejected</p>
                <p className="text-xl font-bold mt-0.5">{stats.rejected}</p>
              </div>
              <XCircleIcon className="w-6 h-6 text-red-500" />
            </div>
            <div className={`mt-1.5 h-1 rounded-full ${statusColors.Rejected}`}></div>
          </div>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Contacted</p>
                <p className="text-xl font-bold mt-0.5">{stats.contacted}</p>
              </div>
              <UsersIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div className={`mt-1.5 h-1 rounded-full ${statusColors.Contacted}`}></div>
          </div>
        </div>
      </div>

      {/* Filters and Search - Made more compact */}
      <div className="bg-white rounded-lg shadow mb-4 p-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search universities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                    fetchSubmissions();
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={loading}
            >
              <option value="all">All Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Contacted">Contacted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table - Made more compact */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8">
            <BuildingLibraryIcon className="w-12 h-12 text-gray-400 mx-auto" />
            <p className="text-gray-500 mt-2 text-sm">No submissions found</p>
            {searchTerm && (
              <p className="text-gray-400 mt-1 text-xs">Try adjusting your search or filter</p>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      University
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submissions.map((submission) => {
                    const StatusIcon = statusIcons[submission.status];
                    return (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[150px] text-sm">
                              {submission.officialName}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                              {submission.location}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-[120px] text-sm">
                              {submission.contactPerson.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[120px] flex items-center gap-1">
                              <EnvelopeIcon className="w-3 h-3 flex-shrink-0" />
                              {submission.contactPerson.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 max-w-[100px] truncate">
                            {submission.universityType}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <StatusIcon className="w-4 h-4 flex-shrink-0" />
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status]}`}>
                                {submission.status}
                              </span>
                              {statusUpdate.id === submission._id ? (
                                <div className="flex flex-col gap-1 ml-1">
                                  <select
                                    value={statusUpdate.status}
                                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                                    className="border rounded px-1 py-0.5 text-xs w-24"
                                  >
                                    <option value="">Change</option>
                                    <option value="Submitted">Submitted</option>
                                    <option value="Under Review">Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Contacted">Contacted</option>
                                  </select>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setStatusUpdate({ id: submission._id, status: '', notes: '' })}
                                  className="text-blue-600 hover:text-blue-900 text-xs ml-1"
                                >
                                  Change
                                </button>
                              )}
                            </div>
                            {statusUpdate.id === submission._id && (
                              <div className="mt-1">
                                <textarea
                                  placeholder="Add notes..."
                                  value={statusUpdate.notes}
                                  onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                                  className="w-full border rounded p-1 text-xs"
                                  rows="1"
                                />
                                <div className="flex gap-1 mt-1">
                                  <button
                                    onClick={() => handleStatusUpdate(submission._id, statusUpdate.status, statusUpdate.notes)}
                                    className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                  >
                                    Update
                                  </button>
                                  <button
                                    onClick={() => setStatusUpdate({ id: null, status: '', notes: '' })}
                                    className="px-1.5 py-0.5 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(submission.submissionDate)}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-1">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteId(submission._id);
                                setShowDeleteModal(true);
                              }}
                              className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination - Made more compact */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 px-4 py-2">
              <div>
                <p className="text-xs text-gray-700">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalItems)} of {totalItems} entries
                </p>
              </div>
              <div className="flex items-center gap-1 mt-2 md:mt-0">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || loading}
                  className={`px-2 py-1 rounded text-xs ${currentPage === 1 || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <span className="px-2 py-1 text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || loading}
                  className={`px-2 py-1 rounded text-xs ${currentPage === totalPages || loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border text-gray-700 hover:bg-gray-50'}`}
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal - Made more compact */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-3">
            <div className="flex items-center gap-2 mb-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              <h3 className="text-base font-bold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Are you sure you want to delete this submission? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                disabled={deleteLoading}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - Will also be made compact */}
      {selectedSubmission && (
        <SubmissionDetailsModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          clearMessages={clearMessages}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </div>
  );
};

// Submission Details Modal Component - Compact version
const SubmissionDetailsModal = ({ submission, onClose, clearMessages, setSuccessMessage }) => {
  const [activeTab, setActiveTab] = useState('basic');

  // Using UsersIcon instead of HandshakeIcon
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: BuildingLibraryIcon },
    { id: 'academic', label: 'Academic', icon: AcademicCapIcon },
    { id: 'research', label: 'Research', icon: LightBulbIcon },
    { id: 'admission', label: 'Admission', icon: UserGroupIcon },
    { id: 'shodhsutra', label: 'ShodhSutra', icon: UsersIcon },
    { id: 'contact', label: 'Contact', icon: PhoneIcon }
  ];

  // Questions and Answers data structure (simplified)
  const questionData = {
    // Section 1: University Identity
    basic: [
      {
        id: 1,
        question: "Official Name",
        answer: submission.officialName,
        type: "text",
        required: true
      },
      {
        id: 2,
        question: "University Type",
        answer: submission.universityType,
        type: "text",
        required: true
      },
      {
        id: 3,
        question: "Established",
        answer: submission.yearOfEstablishment,
        type: "text",
        required: true
      },
      {
        id: 4,
        question: "Location",
        answer: submission.location,
        type: "text",
        required: true
      },
      {
        id: 5,
        question: "Recognition",
        answer: submission.recognitionStatus,
        type: "list",
        required: false
      }
    ],

    // Section 2: Academic & Research Ecosystem
    academic: [
      {
        id: 6,
        question: "Offers PhD",
        answer: submission.hasPhdProgram,
        type: "boolean",
        required: true
      },
      {
        id: 7,
        question: "PhD Disciplines",
        answer: submission.phdDisciplines,
        type: "list",
        required: false,
        subAnswer: submission.otherDiscipline ? `Other: ${submission.otherDiscipline}` : null
      },
      {
        id: 8,
        question: "PhD Modes",
        answer: submission.phdModes,
        type: "list",
        required: false,
        subAnswer: submission.otherMode ? `Other: ${submission.otherMode}` : null
      },
      {
        id: 9,
        question: "Avg. Scholars",
        answer: submission.averageScholars,
        type: "text",
        required: false
      }
    ],

    // Section 3 & 4: Research Guidance & Observed Challenges
    research: [
      {
        id: 10,
        question: "PhD Guides",
        answer: submission.phdGuideCount,
        type: "text",
        required: false
      },
      {
        id: 11,
        question: "Support Systems",
        answer: submission.supportSystems,
        type: "list",
        required: false
      },
      {
        id: 12,
        question: "Timeline Tracking",
        answer: submission.timelineTracking,
        type: "text",
        required: false
      },
      {
        id: 13,
        question: "Challenges",
        answer: submission.phdChallenges,
        type: "list",
        required: false
      },
      {
        id: 14,
        question: "Completion Importance",
        answer: submission.completionImportance,
        type: "text",
        required: false
      }
    ],

    // Section 5: Admission & Onboarding Approach
    admission: [
      {
        id: 15,
        question: "Onboarding Methods",
        answer: submission.onboardingMethods,
        type: "list",
        required: false
      },
      {
        id: 16,
        question: "Profile-based Admission",
        answer: submission.profileAdmissionPreference,
        type: "text",
        required: false
      },
      {
        id: 17,
        question: "Preferred Scholars",
        answer: submission.preferredScholarTypes,
        type: "list",
        required: false
      }
    ],

    // Section 6: Association with ShodhSutra
    shodhsutra: [
      {
        id: 18,
        question: "Interests in ShodhSutra",
        answer: submission.interests,
        type: "list",
        required: false
      },
      {
        id: 19,
        question: "Preferred Support",
        answer: submission.supportPreferences,
        type: "list",
        required: false
      },
      {
        id: 20,
        question: "Institution Philosophy",
        answer: submission.institutionPhilosophy,
        type: "text",
        required: false
      }
    ],

    // Section 7: Point of Contact
    contact: [
      {
        id: 21,
        question: "Contact Person",
        answer: submission.contactPerson.name,
        type: "text",
        required: true
      },
      {
        id: 22,
        question: "Designation",
        answer: submission.contactPerson.designation,
        type: "text",
        required: true
      },
      {
        id: 23,
        question: "Email",
        answer: submission.contactPerson.email,
        type: "email",
        required: true
      },
      {
        id: 24,
        question: "Phone",
        answer: submission.contactPerson.phone,
        type: "phone",
        required: true
      },
      {
        id: 25,
        question: "Declaration",
        answer: submission.declarationConfirmed,
        type: "boolean",
        required: true
      }
    ]
  };

  // Section descriptions (simplified)
  const sectionDescriptions = {
    'basic': 'University identity and recognition status.',
    'academic': 'PhD programs and academic structure.',
    'research': 'Research systems and challenges.',
    'admission': 'Admission processes and preferences.',
    'shodhsutra': 'Association with ShodhSutra.',
    'contact': 'Contact details and declaration.'
  };

  // Section icons
  const sectionIcons = {
    'basic': BuildingLibraryIcon,
    'academic': AcademicCapIcon,
    'research': LightBulbIcon,
    'admission': UserGroupIcon,
    'shodhsutra': UsersIcon,
    'contact': PhoneIcon
  };

  // Helper function to format answers
  const formatAnswer = (answer, type) => {
    if (answer === null || answer === undefined || answer === '') {
      return <span className="text-gray-400 italic text-xs">Not specified</span>;
    }

    if (type === 'boolean') {
      return (
        <span className={`font-medium text-sm ${answer ? 'text-green-600' : 'text-red-600'}`}>
          {answer ? 'Yes' : 'No'}
        </span>
      );
    }

    if (type === 'list' && Array.isArray(answer)) {
      if (answer.length === 0) {
        return <span className="text-gray-400 italic text-xs">Not specified</span>;
      }
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {answer.map((item, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (type === 'email') {
      return (
        <a 
          href={`mailto:${answer}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          {answer}
        </a>
      );
    }

    if (type === 'phone') {
      return (
        <a 
          href={`tel:${answer}`} 
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
        >
          {answer}
        </a>
      );
    }

    return <span className="font-medium text-sm">{answer}</span>;
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    const text = `University: ${submission.officialName}\nStatus: ${submission.status}\nSubmitted: ${new Date(submission.submissionDate).toLocaleString()}`;
    
    navigator.clipboard.writeText(text);
    setSuccessMessage('Details copied!');
    clearMessages();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {submission.officialName}
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                submission.status === 'Approved' ? 'bg-green-100 text-green-800' :
                submission.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                submission.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                submission.status === 'Contacted' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {submission.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {new Date(submission.submissionDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl ml-2"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex px-4 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 font-medium text-xs border-b-2 whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Section Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              {(() => {
                const Icon = sectionIcons[activeTab];
                return <Icon className="w-4 h-4 text-blue-600" />;
              })()}
              <h3 className="text-base font-bold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
            </div>
            <p className="text-gray-600 text-xs">
              {sectionDescriptions[activeTab]}
            </p>
          </div>

          {/* Questions and Answers */}
          <div className="space-y-3">
            {questionData[activeTab]?.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {item.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        {item.question}
                        {item.required && <span className="text-red-500 ml-0.5">*</span>}
                      </h4>
                    </div>
                    
                    {/* Main Answer */}
                    <div className="mt-1">
                      {formatAnswer(item.answer, item.type)}
                    </div>

                    {/* Sub Answer */}
                    {item.subAnswer && (
                      <div className="mt-2 pl-3 border-l-2 border-blue-300">
                        <p className="text-xs text-gray-600 mb-0.5">Additional:</p>
                        <p className="text-gray-800 font-medium text-sm">{item.subAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Admin Notes */}
            {activeTab === 'basic' && submission.notes && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-1 mb-1">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600" />
                  <h5 className="text-xs font-medium text-yellow-800">Admin Notes</h5>
                </div>
                <p className="text-yellow-700 text-sm break-words">{submission.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            ID: {submission._id?.slice(-6).toUpperCase()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopyToClipboard}
              className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-xs flex items-center gap-1"
            >
              <DocumentTextIcon className="w-3 h-3" />
              Copy
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityAdmin;