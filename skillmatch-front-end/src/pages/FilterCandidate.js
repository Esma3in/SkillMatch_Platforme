import React, { useState, useEffect } from 'react';
import { api } from '../api/api';

const FilterCandidate = () => {
  // Filter states
  const [domain, setDomain] = useState('');
  const [city, setCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [minScore, setMinScore] = useState('');
  
  // Available options for filters
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  // Results
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  // Domain options
  const domainOptions = [
    'Web Development',
    'Mobile Development',
    'AI & Machine Learning',
    'Data & Database',
    'Cloud Computing',
    'DevOps'
  ];

  // Fetch skills and tags on component mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [skillsResponse, tagsResponse] = await Promise.all([
          api.get('api/skills'),
          api.get('api/test-tags')
        ]);
        
        setAvailableSkills(skillsResponse.data);
        setAvailableTags(tagsResponse.data);
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
          tag: selectedTag,
          minScore,
          page: currentPage
        }
      });
      
      setCandidates(response.data.data);
      setTotalPages(response.data.meta.last_page);
      setTotalResults(response.data.meta.total);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setDomain('');
    setCity('');
    setSelectedSkill('');
    setSelectedTag('');
    setMinScore('');
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

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    handleApplyFilters();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Filter Candidates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Filter Panel */}
        <div className="md:col-span-1 space-y-6">
          {/* Domain Filter */}
          <div>
            <h2 className="text-xl font-medium mb-4">Domaine</h2>
            <div className="grid grid-cols-2 gap-3">
              {domainOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`domain-${option}`}
                    name="domain"
                    className="h-4 w-4 rounded-full border-gray-300"
                    checked={domain === option}
                    onChange={() => setDomain(option)}
                  />
                  <label htmlFor={`domain-${option}`} className="ml-2 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* City Filter */}
          <div>
            <h2 className="text-xl font-medium mb-4">City</h2>
            <div className="flex items-center border rounded-md p-2">
              <input
                type="text"
                placeholder="Choose a city..."
                className="w-full outline-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
          
          {/* Skills Filter */}
          <div>
            <h2 className="text-xl font-medium mb-4">Choose skill</h2>
            <div className="relative">
              <div className="border rounded-md p-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  <span>Programming Skills</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              
              <select 
                className="w-full p-2 border rounded-md mt-2"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="">Select a skill</option>
                {availableSkills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Test Score Filter */}
          <div>
            <h2 className="text-xl font-medium mb-4">Rate Average</h2>
            <div className="relative">
              <div className="border rounded-md p-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  <span>Test Score</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              
              <select 
                className="w-full p-2 border rounded-md mt-2"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
              >
                <option value="">Select minimum score</option>
                <option value="25">25%</option>
                <option value="50">50%</option>
                <option value="75">75%</option>
                <option value="100">100%</option>
              </select>
            </div>
          </div>
          
          {/* Test Tag Filter */}
          <div>
            <h2 className="text-xl font-medium mb-4">Choose Tag</h2>
            <div className="relative">
              <div className="border rounded-md p-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                  <span>Test Tag</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              
              <select 
                className="w-full p-2 border rounded-md mt-2"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">Select a tag</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <button 
              onClick={handleResetFilters}
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
            >
              Reset Filters
            </button>
            
            <button 
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="md:col-span-2">
          {/* Search Results */}
          <div className="bg-gray-50 p-6 rounded-md mb-6">
            <h2 className="text-2xl font-bold mb-4">Search Results</h2>
            <p className="text-gray-600 mb-6">{totalResults} candidates found</p>
            
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : candidates.length > 0 ? (
              <div>
                <div className="space-y-6">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="bg-white rounded-md p-4 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0"></div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-medium">{candidate.name}</h3>
                          <p className="text-gray-600">
                            {candidate.field} | {candidate.location}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {candidate.skills.slice(0, 3).map((skill, index) => (
                              <span 
                                key={index} 
                                className={`px-3 py-1 rounded-full text-sm ${
                                  index % 2 === 0 
                                    ? 'bg-red-100 text-red-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-center mb-2">
                            <p className="text-gray-600 text-sm">Test score</p>
                            <div className="bg-green-100 text-green-800 rounded-md px-3 py-1 mt-1">
                              {candidate.testScore}%
                            </div>
                          </div>
                          
                          <div className="mt-2 flex space-x-2">
                            <button 
                              onClick={() => handleViewCandidate(candidate.id)}
                              className="px-4 py-1 bg-blue-50 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-100"
                            >
                              View
                            </button>
                            <button className="px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-6">
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 border'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No candidates found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
          
          {/* Candidate Details */}
          {selectedCandidate && (
            <div className="bg-gray-50 p-6 rounded-md">
              <h2 className="text-2xl font-bold mb-6">Candidate Details</h2>
              
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex-shrink-0"></div>
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-medium">{selectedCandidate.name}</h3>
                      <p className="text-gray-600">
                        {selectedCandidate.field} | {selectedCandidate.location}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedCandidate.badges.map((badge, index) => (
                        <div key={index} className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <span className="text-xs">★</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <span className={`px-3 py-1 bg-blue-100 text-blue-800 rounded-full ${selectedCandidate.certified ? 'block' : 'hidden'}`}>
                      Certified
                    </span>
                    
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                      Test score: {selectedCandidate.testScore}%
                    </span>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-lg font-medium mb-2">SUMMARY</h4>
                    <p className="text-gray-700">
                      {selectedCandidate.description || 'No description available.'}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <a 
                      href={selectedCandidate.resumeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-blue-50 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-100"
                    >
                      Resume
                    </a>
                    
                    <button 
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterCandidate;