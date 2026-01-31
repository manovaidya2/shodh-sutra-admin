import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const AdminAdmissionPartners = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [notes, setNotes] = useState('');
  const [expandedSections, setExpandedSections] = useState({});

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axiosInstance.get(`/admission-partner/applications?${params}`);
      setApplications(response.data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  // View application details
  const handleViewDetails = async (id) => {
    try {
      const response = await axiosInstance.get(`/admission-partner/applications/${id}`);
      setSelectedApplication(response.data.data);
      // Reset expanded sections
      setExpandedSections({});
    } catch (error) {
      console.error('Error fetching application details:', error);
      alert('Failed to fetch application details');
    }
  };

  // Download document
  const handleDownloadDocument = async (applicationId, documentId, filename) => {
    try {
      const response = await axiosInstance.get(
        `/admission-partner/applications/${applicationId}/documents/${documentId}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  // Update application status
  const handleUpdateStatus = async (applicationId) => {
    if (!statusUpdate) {
      alert('Please select a status');
      return;
    }

    try {
      await axiosInstance.put(`/admission-partner/applications/${applicationId}/status`, {
        status: statusUpdate,
        notes: notes
      });
      
      alert('Status updated successfully');
      fetchApplications();
      setStatusUpdate('');
      setNotes('');
      
      if (selectedApplication && selectedApplication._id === applicationId) {
        const response = await axiosInstance.get(`/admission-partner/applications/${applicationId}`);
        setSelectedApplication(response.data.data);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  // Delete application
  const handleDeleteApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/admission-partner/applications/${applicationId}`);
      alert('Application deleted successfully');
      fetchApplications();
      if (selectedApplication && selectedApplication._id === applicationId) {
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'under_review': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return null;
    }
  };

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Render array as checklist
  const renderChecklist = (array, selectedValues = []) => {
    if (!array || array.length === 0) return <span className="text-gray-500 italic">Not specified</span>;
    
    return (
      <div className="mt-2 space-y-1">
        {array.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 flex items-center justify-center border rounded ${selectedValues.includes(item) ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
              {selectedValues.includes(item) && <Check className="w-3 h-3 text-green-600" />}
            </div>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render radio selection
  const renderRadioSelection = (options, selectedValue) => {
    if (!options || options.length === 0) return <span className="text-gray-500 italic">Not specified</span>;
    
    return (
      <div className="mt-2 space-y-1">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-4 flex items-center justify-center border rounded-full ${selectedValue === option ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'}`}>
              {selectedValue === option && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
            </div>
            <span>{option}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render documents
  const renderDocuments = (documents) => {
    if (!documents || documents.length === 0) {
      return <p className="text-gray-500 italic">No documents uploaded</p>;
    }

    return (
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{doc.originalname}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(doc.size / 1024)} KB • {doc.mimetype}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDownloadDocument(selectedApplication._id, doc._id, doc.originalname)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        ))}
      </div>
    );
  };

  // Application form sections data
  const applicationSections = selectedApplication ? [
    {
      id: 'basic-info',
      title: 'Representative Information',
      expanded: expandedSections['basic-info'] || false,
      content: (
        <div className="space-y-4">
          {/* Form-like layout with questions and answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Full Name:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.representativeName || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Father's Name:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.fathersName || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Mother's Name:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.mothersName || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {formatDate(selectedApplication.dateOfBirth)}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Gender:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.gender || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Nationality:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.nationality || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Role in Organisation:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.roleInOrganisation || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Education Qualification:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.educationQualification || 'Not specified'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'org-info',
      title: 'Organisation Information',
      expanded: expandedSections['org-info'] || false,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Organisation Name:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.organisationName || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Year of Establishment:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.yearOfEstablishment || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Mobile Number:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.mobileNumber || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.email || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Organisation Type:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.organisationType || 'Not specified'}
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">Organisation Address:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.organisationAddress || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Organisation ZIP Code:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.organisationZipCode || 'Not specified'}
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <label className="block text-sm font-medium text-gray-700">Representative Address:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.representativeAddress || 'Not specified'}
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Representative ZIP Code:</label>
              <div className="p-2 bg-gray-50 rounded border border-gray-200">
                {selectedApplication.representativeZipCode || 'Not specified'}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'industry-exp',
      title: 'INDUSTRY EXPERIENCE',
      expanded: expandedSections['industry-exp'] || false,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Institutions Connected with:
            </label>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
              {selectedApplication.institutionsConnected || 'Not specified'}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Achievements & Awards:
            </label>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
              {selectedApplication.achievementsAwards || 'Not specified'}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'research-exp',
      title: 'Experience in Research Education',
      expanded: expandedSections['research-exp'] || false,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Total Students Enrolled in Research Programs:</label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {selectedApplication.totalStudentsEnrolled || 'Not specified'}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Total Research Papers Published:</label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {selectedApplication.totalResearchPapers || '0'}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Fields of Research Programs:</label>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              {selectedApplication.fieldsOfResearch || 'Not specified'}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              If worked as Research Guide or Mentor (Kindly Mention Details of Area of Research & Other Relevant Details):
            </label>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
              {selectedApplication.researchGuideDetails || 'Not specified'}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'section-a',
      title: 'SECTION A: INSTITUTION PROFILE',
      expanded: expandedSections['section-a'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How would you primarily describe your institution? (Multiple allowed)
            </label>
            {renderChecklist([
              'Higher education institute',
              'Research guidance centre',
              'Coaching / training institute',
              'Skill development institute',
              'Education consultancy',
              'University liaison / facilitation centre',
              'Independent academic advisory'
            ], selectedApplication.institutionDescription || [])}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What best reflects your institution's core philosophy? (Single choice)
            </label>
            {renderRadioSelection([
              'Student success & long-term outcomes',
              'Admissions & placements focus',
              'Research & academic excellence',
              'Skill development & training',
              'Mixed / evolving model'
            ], selectedApplication.corePhilosophy)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Which student profiles do you most commonly work with?
            </label>
            {renderChecklist([
              'UG students',
              'PG students',
              'Working professionals',
              'Research scholars',
              'International aspirants'
            ], selectedApplication.studentProfiles || [])}
          </div>
        </div>
      )
    },
    {
      id: 'section-b',
      title: 'SECTION B: EXPERIENCE WITH PhD ASPIRANTS',
      expanded: expandedSections['section-b'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Do students approach your institution specifically for PhD-related guidance?
            </label>
            {renderRadioSelection([
              'Yes, frequently',
              'Yes, occasionally',
              'Rarely',
              'No'
            ], selectedApplication.phdGuidanceFrequency)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Which PhD-related services does your institution currently provide?
            </label>
            {renderChecklist([
              'University information',
              'Admission facilitation',
              'Topic suggestion',
              'Research proposal support',
              'Documentation assistance',
              'Informal counselling only'
            ], selectedApplication.phdServices || [])}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              On average, how many PhD aspirants do you interact with in a year?
            </label>
            {renderRadioSelection([
              '1-10',
              '11-30',
              '31-60',
              '60+'
            ], selectedApplication.phdAspirantsVolume)}
          </div>
        </div>
      )
    },
    {
      id: 'section-c',
      title: 'SECTION C: OBSERVED STUDENT CHALLENGES',
      expanded: expandedSections['section-c'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              From your experience, which issues do PhD aspirants most commonly face?
            </label>
            {renderChecklist([
              'Lack of clarity before enrolment',
              'Choosing PhD due to pressure or comparison',
              'Unrealistic timelines promised elsewhere',
              'Poor guide-student alignment',
              'Dropouts midway',
              'Emotional / professional burnout'
            ], selectedApplication.phdChallenges || [])}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Have you witnessed students discontinue or regret their PhD journey?
            </label>
            {renderRadioSelection([
              'Yes, multiple times',
              'Yes, occasionally',
              'Rarely',
              'Never'
            ], selectedApplication.discontinuationWitnessed)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              In such cases, what do you feel was missing the most?
            </label>
            {renderChecklist([
              'Early profiling & clarity',
              'Ethical counselling',
              'Continuous academic mentoring',
              'Completion-oriented planning',
              'Realistic expectation setting'
            ], selectedApplication.missingElements || [])}
          </div>
        </div>
      )
    },
    {
      id: 'section-d',
      title: 'SECTION D: ETHICAL ALIGNMENT & DECISION PROCESS',
      expanded: expandedSections['section-d'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Which statement best represents your belief?
            </label>
            {renderRadioSelection([
              'Admission without clarity harms students',
              'Completion matters more than enrolment',
              'Each student needs a customised PhD path',
              'Universities alone cannot ensure completion'
            ], selectedApplication.ethicalBelief)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Are you comfortable referring students only after profile evaluation and suitability assessment?
            </label>
            {renderRadioSelection([
              'Yes',
              'Depends on case',
              'Not sure',
              'No'
            ], selectedApplication.referralComfort)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What factors matter most before recommending any platform to a student?
            </label>
            {renderChecklist([
              'Academic integrity',
              'Completion probability',
              'Student life context',
              'Institutional credibility',
              'Long-term career outcomes'
            ], selectedApplication.recommendationFactors || [])}
          </div>
        </div>
      )
    },
    {
      id: 'section-e',
      title: 'SECTION E: COLLABORATION EXPECTATIONS',
      expanded: expandedSections['section-e'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What interests your institution in collaborating with ShodhSutra?
            </label>
            {renderChecklist([
              'Ethical PhD guidance ecosystem',
              'Structured student profiling',
              'Multi-university access',
              'Completion-focused mentorship',
              'Long-term academic association'
            ], selectedApplication.collaborationInterests || [])}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              How do you see your institution's role in this collaboration?
            </label>
            {renderRadioSelection([
              'Student identifier & guide',
              'Academic mentor',
              'Awareness creator',
              'Referral partner (ethical)',
              'Not fixed — open to discussion'
            ], selectedApplication.collaborationRole)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Which approach aligns most with you?
            </label>
            {renderRadioSelection([
              'Fewer students, higher quality outcomes',
              'Moderate volume with structured support',
              'Observational collaboration initially'
            ], selectedApplication.collaborationApproach)}
          </div>
        </div>
      )
    },
    {
      id: 'section-f',
      title: 'SECTION F: READINESS & QUALITY FILTER',
      expanded: expandedSections['section-f'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Are you willing to discourage students from pursuing a PhD if it is not suitable for them?
            </label>
            {renderRadioSelection([
              'Yes, absolutely',
              'In most cases',
              'Unsure',
              'No'
            ], selectedApplication.willingnessToDiscourage)}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Would you prefer a system where incentives are linked to quality & completion, not volume?
            </label>
            {renderRadioSelection([
              'Yes',
              'Neutral',
              'No'
            ], selectedApplication.incentivePreference)}
          </div>
        </div>
      )
    },
    {
      id: 'section-g',
      title: 'SECTION G: OPEN REFLECTION',
      expanded: expandedSections['section-g'] || false,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              In your view, what is the biggest gap in the current PhD admission ecosystem?
            </label>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
              {selectedApplication.phdAdmissionGap || 'Not specified'}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              What would an ideal PhD guidance and completion system look like for your students?
            </label>
            <div className="p-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap">
              {selectedApplication.idealPhdSystem || 'Not specified'}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'documents',
      title: 'Documents Upload',
      expanded: expandedSections['documents'] || false,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Kindly upload all relevant documents (PDF only) such as Research Papers,
            Seminar / Conference Certificates, ID Proofs, etc.
          </p>
          {renderDocuments(selectedApplication.documents || [])}
        </div>
      )
    },
    {
      id: 'declaration',
      title: 'SECTION H: DECLARATION & CONSENT',
      expanded: expandedSections['declaration'] || false,
      content: (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-5 h-5 flex items-center justify-center border rounded ${selectedApplication.declarationAgreed ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
              {selectedApplication.declarationAgreed && <Check className="w-3 h-3 text-green-600" />}
            </div>
            <p className="text-gray-700">
              We believe in ethical, clarity-first PhD guidance and wish to explore collaboration aligned with these values.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-5 h-5 flex items-center justify-center border rounded ${selectedApplication.informationCertified ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
              {selectedApplication.informationCertified && <Check className="w-3 h-3 text-green-600" />}
            </div>
            <p className="text-gray-700">
              I certify that the above information is true and correct.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-5 h-5 flex items-center justify-center border rounded ${selectedApplication.rulesAgreed ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}`}>
              {selectedApplication.rulesAgreed && <Check className="w-3 h-3 text-green-600" />}
            </div>
            <p className="text-gray-700">
              I agree to follow all rules and regulations of ShodhSutra.
            </p>
          </div>
        </div>
      )
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Admission Partners Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage and review admission partner applications</p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={() => {setSearchTerm(''); fetchApplications();}}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Applications ({applications.length})
                </h2>
                <button
                  onClick={fetchApplications}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Organization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {app.representativeName}
                              </div>
                              <div className="text-sm text-gray-500">{app.email}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Phone className="w-3 h-3" />
                                {app.mobileNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{app.organisationName}</div>
                          <div className="text-sm text-gray-500">{app.organisationType}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                              {getStatusIcon(app.status)}
                              {app.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(app._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm border border-blue-200"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteApplication(app._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm border border-red-200"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* Application Details Panel */}
        <div className="lg:col-span-1">
          {selectedApplication ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                    <p className="text-sm text-gray-500">
                      Reference: AP{selectedApplication._id?.slice(-8)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Status Update Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Status
                    </label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select new status</option>
                      <option value="pending">Pending</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add notes about this application..."
                    />
                  </div>
                  
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication._id)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Update Status
                  </button>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Current Status:</span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusIcon(selectedApplication.status)}
                        {selectedApplication.status.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedApplication.reviewedAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        Last reviewed: {formatDate(selectedApplication.reviewedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Details */}
              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedApplication.representativeName}</h4>
                        <p className="text-sm text-gray-600">Representative</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{selectedApplication.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{selectedApplication.mobileNumber}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Building className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{selectedApplication.organisationName}</h4>
                        <p className="text-sm text-gray-600">{selectedApplication.organisationType}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Declaration Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {selectedApplication.declarationAgreed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">Ethical collaboration agreement</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedApplication.informationCertified ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">Information certification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedApplication.rulesAgreed ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm">Rules agreement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Application</h3>
              <p className="text-gray-600">Click "View Details" on any application to see complete form data</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl my-8">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Complete Application Form</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Reference:</span> AP{selectedApplication._id?.slice(-8)}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Submitted:</span> {formatDate(selectedApplication.createdAt)}
                    </p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedApplication.status)}`}>
                      {getStatusIcon(selectedApplication.status)}
                      {selectedApplication.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content - Application Form Sections */}
            <div className="p-6">
              <div className="space-y-6">
                {applicationSections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      {section.expanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                    
                    {section.expanded && (
                      <div className="p-6 bg-white">
                        {section.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Admin Notes Section */}
              {selectedApplication.notes && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Admin Notes</h3>
                  <p className="text-yellow-800 whitespace-pre-wrap">{selectedApplication.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAdmissionPartners;