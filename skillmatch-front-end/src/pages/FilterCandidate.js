import React, { useState, useEffect } from 'react';
import { api } from '../api/api';
import { Search, Menu, Star, Book, Award, Download, Bell, ChevronDown, Filter, X, Check, Badge } from 'lucide-react';

const FilterCandidate = () => {
  const [domain, setDomain] = useState('');
  const [city, setCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  // Domain options with icons
  const domainOptions = [
    { id: 'web', name: 'Web Development', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6-9 6-9-6"/></svg> },
    { id: 'mobile', name: 'Mobile Development', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg> },
    { id: 'ai', name: 'AI & Machine Learning', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { id: 'data', name: 'Data & Database', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zM8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/></svg> },
    { id: 'cloud', name: 'Cloud Computing', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg> },
    { id: 'devops', name: 'DevOps', icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> }
  ];
  
  // Fetch skills on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const skillsResponse = await api.get('/skills');
        setAvailableSkills(skillsResponse.data);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Filter candidates
  const handleApplyFilters = async () => {
    setLoading(true);
    setSelectedCandidate(null);
    
    try {
      const response = await api.get('/candidates/filter', {
        params: { 
          domain, 
          city, 
          skill: selectedSkill, 
          page: currentPage,
          perPage
        }
      });
      
      console.log('Filter response:', response.data);
      setCandidates(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
      alert('An error occurred while fetching candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setDomain('');
    setCity('');
    setSelectedSkill('');
    setCandidates([]);
    setSelectedCandidate(null);
    setCurrentPage(1);
  };

  // View candidate details
  const handleViewCandidate = async (id) => {
    setLoading(true);
    
    try {
      const response = await api.get(`/candidates/${id}`);
      setSelectedCandidate(response.data);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Apply filters when page changes
  useEffect(() => {
    if (candidates.length > 0 || domain || city || selectedSkill) {
      handleApplyFilters();
    }
  }, [currentPage]);
  
  const getSkillColor = (index) => {
    const colors = [
      'bg-indigo-100 text-indigo-800',
      'bg-purple-100 text-purple-800',
      'bg-blue-100 text-blue-800',
      'bg-teal-100 text-teal-800',
      'bg-green-100 text-green-800'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm py-4 px-4 mb-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Talent Finder</h1>
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 flex items-center gap-2"
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-6">
          <div 
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 md:hidden ${
              isMobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto transition transform duration-300 ${
              isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button 
                    onClick={() => setIsMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Domain</h3>
                    <div className="space-y-2">
                      {domainOptions.map((option) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`mobile-domain-${option.id}`}
                            name="mobile-domain"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500"
                            checked={domain === option.name}
                            onChange={() => setDomain(option.name)}
                          />
                          <label htmlFor={`mobile-domain-${option.id}`} className="ml-3 flex items-center gap-2 text-sm text-gray-700">
                            {option.icon}
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900 mb-3">City</h3>
                    <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 bg-white">
                      <Search size={18} className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        placeholder="Enter city name..."
                        className="w-full border-none focus:ring-0 text-sm"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                    <div className="relative">
                      <select 
                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                      >
                        <option value="">Any skill</option>
                        {availableSkills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={handleResetFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Reset
                    </button>
                    
                    <button 
                      onClick={() => {
                        handleApplyFilters();
                        setIsMobileFiltersOpen(false);
                      }}
                      className="flex-1 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-full md:w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button 
                  onClick={handleResetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <X size={14} />
                  Reset all
                </button>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Domain</h3>
                <div className="space-y-2">
                  {domainOptions.map((option) => (
                    <div 
                      key={option.id} 
                      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                        domain === option.name 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => setDomain(option.name)}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        domain === option.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {domain === option.name && <Check size={12} />}
                      </div>
                      <div className="ml-3 flex items-center gap-2">
                        {option.icon}
                        <span className="text-sm text-gray-700">{option.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">City</h3>
                <div className="flex items-center rounded-md border border-gray-300 px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                  <Search size={18} className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    className="w-full border-none focus:ring-0 text-sm"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
                    onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                  >
                    <span>{selectedSkill || 'Any skill'}</span>
                    <ChevronDown size={16} className={`transform transition-transform ${isSkillsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isSkillsOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-y-auto py-1 text-sm">
                      <div 
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelectedSkill('');
                          setIsSkillsOpen(false);
                        }}
                      >
                        Any skill
                      </div>
                      {availableSkills.map((skill) => (
                        <div 
                          key={skill} 
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                          onClick={() => {
                            setSelectedSkill(skill);
                            setIsSkillsOpen(false);
                          }}
                        >
                          {skill}
                          {selectedSkill === skill && (
                            <Check size={16} className="text-blue-600" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={handleApplyFilters}
                className="w-full py-2.5 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Talent Results</h2>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
                    <Filter size={14} />
                    <span>{Object.values({domain, city, selectedSkill}).filter(Boolean).length} filters applied</span>
                  </div>
                  <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1.5">
                    <span className="text-sm text-gray-600">Per page:</span>
                    <select 
                      className="text-sm border-none bg-transparent focus:ring-0 pr-6"
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setCurrentPage(1);
                        setTimeout(() => handleApplyFilters(), 0);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-500">Searching for the best talent...</p>
                </div>
              </div>
            ) : candidates.length > 0 ? (
              <div className="space-y-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
                          {candidate.name ? candidate.name.charAt(0) : '?'}
                        </div>    
                        <div className="ml-4 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                              <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {candidate.field || 'N/A'} | {candidate.location || 'Remote'}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0">
                              {candidate.testScore > 0 && (
                                <div className="flex items-center gap-1 text-amber-600">
                                  <Star size={16} className="fill-amber-500" />
                                  <span className="font-medium">{candidate.testScore}/100</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {candidate.skills && candidate.skills.slice(0, 4).map((skill, index) => (
                              <span 
                                key={index} 
                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getSkillColor(index)}`}
                              >
                                {skill}
                              </span>
                            ))}
                            {candidate.skills && candidate.skills.length > 4 && (
                              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                +{candidate.skills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hidden sm:flex flex-col items-end ml-4 space-y-4">
                          {candidate.certified && (
                            <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                              <Award size={12} className="mr-1" />
                              Certified
                            </span>
                          )}
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewCandidate(candidate.id)}
                              className="px-3 py-1.5 bg-white border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors"
                            >
                              View Profile
                            </button>
                            <button 
                              className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center"
                            >
                              <Bell size={14} className="mr-1.5" />
                              Notify
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between sm:hidden">
                        <button 
                          onClick={() => handleViewCandidate(candidate.id)}
                          className="flex-1 px-3 py-1.5 bg-white border border-blue-600 text-blue-600 text-sm font-medium rounded-md hover:bg-blue-50 transition-colors mr-2"
                        >
                          View Profile
                        </button>
                        <button 
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                          <Bell size={14} className="mr-1.5" />
                          Notify
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-center">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      {totalPages > 5 && (
                        <>
                          <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-100"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No candidates found</h3>
                <p className="text-gray-500 mt-2 max-w-md">
                  We couldn't find any candidates matching your criteria. Try adjusting your filters or search for something else.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-md font-medium hover:bg-blue-100 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
            {selectedCandidate && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                    
                    <div className="ml-6 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                          <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {selectedCandidate.field}
                          </p>
                          <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {selectedCandidate.location}
                          </p>
                        </div>
                        
                        <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                          <div className="flex space-x-2 mb-3">
                            {selectedCandidate.badges.map((badge, index) => (
                              <div key={index} className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-center">
                                <Star size={14} />
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            {selectedCandidate.certified && (
                              <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                                <Award size={12} className="mr-1" />
                                Certified Professional
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.skills?.map((skill, index) => (
                            <span 
                              key={index} 
                              className={`px-3 py-1.5 rounded-full text-sm font-medium ${getSkillColor(index)}`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700">
                        {selectedCandidate.description || 'No professional summary available.'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                    <a 
                      href={selectedCandidate.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-white border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      <Download size={16} className="mr-2" />
                      Download Resume
                    </a>
                    <button 
                      className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Bell size={16} className="mr-2" />
                      Send Notification
                    </button>
                    <button 
                      onClick={() => setSelectedCandidate(null)}
                      className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center sm:ml-auto"
                    >
                      Back to Results
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default FilterCandidate;