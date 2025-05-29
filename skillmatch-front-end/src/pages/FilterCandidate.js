import React, { useState, useEffect } from 'react';
import { Search, Check, ChevronLeft, ChevronRight, Filter, X, AlertCircle, Award, FileText, Bell, User } from 'lucide-react';
import { api } from '../api/api';
import NavbarCompany from '../components/common/navbarCompany';

// Notification Modal Component
const NotificationModal = ({ isOpen, onClose, candidateId, companyId }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      await api.post('/api/notifications', {
        message,
        candidate_id: candidateId,
        company_id: companyId,
      });
      setMessage('');
      onClose();
    } catch (error) {
      console.error("Error sending the notification:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Send a notification to the candidate</h3>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your message here..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white focus:outline-none ${
              loading || !message.trim()
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            onClick={handleSend}
            disabled={loading || !message.trim()}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CandidateFilter = () => {
  const [filters, setFilters] = useState({
    domain: '',
    skill: [],
    city: '',
  });
  const [candidates, setCandidates] = useState([]);
  const [skills, setSkills] = useState([]); // Dynamic skills state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1 });
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState(null);

  const companyId = localStorage.getItem('company_id') || 1; // Use company_id from localStorage

  // Fetch skills from API
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setSkillsLoading(true);
        const response = await api.get('/api/skills/company');
        setSkills(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setSkillsError('Failed to load skills. Please try again later.');
      } finally {
        setSkillsLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSkillDropdown && !event.target.closest('.skill-dropdown-container')) {
        setShowSkillDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSkillDropdown]);

  const fetchCandidates = async () => {
    if (!isAnyFilterApplied()) return;

    setIsLoading(true);
    try {
      const res = await api.get('/api/candidates/filter', {
        params: {
          field: filters.domain,
          skill: filters.skill.join(','),
          city: filters.city,
          page,
        },
      });
      setCandidates(res.data.data || []);
      setMeta({
        lastPage: res.data.last_page || 1,
        total: res.data.total || 0,
      });
      setIsFiltered(true);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAnyFilterApplied = () => {
    return filters.domain !== '' || filters.skill.length > 0 || filters.city !== '';
  };

  const handleFilter = () => {
    setPage(1);
    setSelectedCandidate(null);
    fetchCandidates();
  };

  const resetFilters = () => {
    setFilters({ domain: '', skill: [], city: '' });
    setSelectedCandidate(null);
    setPage(1);
    setCandidates([]);
    setIsFiltered(false);
  };

  const toggleSkill = (skillId) => {
    setFilters({
      ...filters,
      skill: filters.skill.includes(skillId)
        ? filters.skill.filter((id) => id !== skillId)
        : [...filters.skill, skillId],
    });
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= meta.lastPage) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    if (isFiltered) {
      fetchCandidates();
    }
  }, [page]);

  const getSkillName = (skillId) => {
    const skill = skills.find((s) => s.id === skillId);
    return skill ? skill.name : skillId;
  };

  const renderSelectedSkills = () => {
    if (filters.skill.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {filters.skill.map((skillId) => (
          <div key={skillId} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md flex items-center text-xs">
            {getSkillName(skillId)}
            <X
              size={14}
              className="ml-1 cursor-pointer hover:text-indigo-900"
              onClick={() => toggleSkill(skillId)}
            />
          </div>
        ))}
      </div>
    );
  };
  const handleViewResume = (resumeUrl) => {
  if (!resumeUrl) {
    alert('Resume not available for this candidate');
    return;
  }

  // If the resumeUrl is a relative path, you might need to prepend your base URL
  const fullUrl = resumeUrl.startsWith('http') 
    ? resumeUrl 
    : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'}/storage/${resumeUrl}`;

  // Open the resume in a new window/tab
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
};

// Alternative method if you want to handle file display differently
const handleViewResumeWithFetch = async (resumeUrl) => {
    if (!resumeUrl) {
      alert('Resume not available for this candidate');
      return;
    }

    try {
      const response = await api.get(`/api/candidates/${selectedCandidate.id}/resume`, {
        responseType: 'blob'
      });
      
      // Create a blob URL and open it
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error fetching resume:', error);
      alert('Error loading resume. Please try again.');
    }
};            

  // Available domains
  const domains = [
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Development' },
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'data', label: 'Data & Database' },
    { id: 'cloud', label: 'Cloud Computing' },
    { id: 'devops', label: 'DevOps' },
  ];

  return (
    
       <>
       <NavbarCompany />
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Candidate Search</h1>
            <div className="text-sm text-gray-500">
              {isFiltered && `${meta.total} candidates found`}
            </div>
          </div>
          <p className="mt-2 text-gray-600">Find the perfect candidate for your team based on skills, domain, and location</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 text-gray-700 font-medium">
              <Filter size={18} />
              <h2 className="text-lg">Filter Candidates</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Domain</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      onClick={() => setFilters({ ...filters, domain: domain.id === filters.domain ? '' : domain.id })}
                      className={`
                        px-3 py-2 rounded-lg border cursor-pointer transition-all
                        ${filters.domain === domain.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center
                          ${filters.domain === domain.id ? 'border-indigo-500' : 'border-gray-300'}`}
                        >
                          {filters.domain === domain.id && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                        </div>
                        <span className="text-sm">{domain.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Skills</h3>
                {skillsLoading ? (
                  <div className="text-gray-500">Loading skills...</div>
                ) : skillsError ? (
                  <div className="text-red-500">{skillsError}</div>
                ) : (
                  <div className="relative skill-dropdown-container">
                    <div
                      className="border border-gray-300 rounded-lg px-4 py-2.5 flex items-center justify-between cursor-pointer bg-white"
                      onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                    >
                      <div className="flex items-center gap-2 text-gray-700">
                        <span>
                          {filters.skill.length > 0
                            ? `${filters.skill.length} skill${filters.skill.length > 1 ? 's' : ''} selected`
                            : 'Select skills'}
                        </span>
                      </div>
                      <div className={`transform transition-transform duration-200 ${showSkillDropdown ? 'rotate-180' : ''}`}>
                        <ChevronRight size={16} className="rotate-90" />
                      </div>
                    </div>

                    {renderSelectedSkills()}
                    {showSkillDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-1">
                          {skills.map((skill) => (
                            <div
                              key={skill.id}
                              className={`
                                px-3 py-2 rounded-md hover:bg-gray-50 flex items-center justify-between cursor-pointer
                                ${filters.skill.includes(skill.id) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}
                              `}
                              onClick={() => toggleSkill(skill.id)}
                            >
                              <span>{skill.name}</span>
                              {filters.skill.includes(skill.id) && (
                                <Check size={16} className="text-indigo-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                onClick={resetFilters}
              >
                <X size={16} />
                <span>Reset</span>
              </button>
              <button
                className={`
                  px-5 py-2 rounded-lg text-white flex items-center gap-2 transition-colors
                  ${isAnyFilterApplied()
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-gray-400 cursor-not-allowed'}
                `}
                onClick={handleFilter}
                disabled={!isAnyFilterApplied()}
              >
                <Search size={16} />
                <span>Apply Filters</span>
              </button>
            </div>
          </div>
        </div>

        {!isFiltered ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
            <div className="text-gray-400 mb-4">
              <Filter size={48} />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No candidates to display</h3>
            <p className="text-gray-500 text-center max-w-md">
              Apply filters using the search panel above to find candidates matching your criteria.
            </p>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
            <p className="text-gray-500">Loading candidates...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-medium text-gray-800">Candidates</h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {candidates.length > 0 ? (
                    candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${selectedCandidate?.id === candidate.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <User size={20} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                {candidate.test_score}%
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">
                              {candidate.profile?.field} • {candidate.profile?.localisation}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills && candidate.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                >
                                  {skill.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center">
                      <AlertCircle className="mx-auto text-gray-400 mb-2" size={24} />
                      <p className="text-gray-500">No candidates match your search criteria</p>
                    </div>
                  )}
                </div>

                {candidates.length > 0 && (
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      className={`flex items-center gap-1 text-sm ${page > 1 ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-300 cursor-not-allowed'}`}
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>
                    <div className="flex items-center gap-2">
                      {[...Array(meta.lastPage || 1)].map((_, i) => (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            page === i + 1
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => goToPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      className={`flex items-center gap-1 text-sm ${page < meta.lastPage ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-300 cursor-not-allowed'}`}
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= meta.lastPage}
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-3">
              {selectedCandidate ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                          <User size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{selectedCandidate.name}</h3>
                          <p className="text-gray-600">
                            {selectedCandidate.profile?.field} • {selectedCandidate.profile?.localisation}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {selectedCandidate.badges && selectedCandidate.badges.map((badge, index) => (
                          <div key={index} className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white">
                            <Award size={16} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <Award size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-green-800 font-medium">Test Score</p>
                          <p className="text-lg font-semibold text-green-900">{selectedCandidate.test_score}%</p>
                        </div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Check size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-indigo-800 font-medium">Certification</p>
                          <p className="text-lg font-semibold text-indigo-900">Verified Professional</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills && selectedCandidate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Summary</h4>
                      <p className="text-gray-700">
                        {selectedCandidate.profile?.description}
                      </p>
                    </div>
                    <div className="flex gap-4 mt-8">
                      <button 
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
                        onClick={() => handleViewResume(selectedCandidate.resumeUrl || selectedCandidate.profile?.file)}
                      >
                        <FileText size={18} />
                        <span>View Resume</span>
                      </button>
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                        onClick={() => setShowNotificationModal(true)}
                      >
                        <Bell size={18} />
                        <span>Send Notification</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center h-full">
                  <div className="text-gray-400 mb-4">
                    <User size={48} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No candidate selected</h3>
                  <p className="text-gray-500 text-center">
                    Select a candidate from the list to view their details.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
       
      </div>

      {selectedCandidate && (
        <NotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          candidateId={selectedCandidate.id}
          companyId={companyId}
        />
      )}
    </div>
    </>
  );
};

export default CandidateFilter;