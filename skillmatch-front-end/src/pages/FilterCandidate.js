import React, { useState, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
import { api } from '../api/api';

const CandidateFilter = () => {
  // State management
  const [filters, setFilters] = useState({ 
    domain: '',
    skill: [],
    city: ''
  });
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1 });
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  
  // Available options
  const domains = [
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Development' },
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'data', label: 'Data & Database' },
    { id: 'cloud', label: 'Cloud Computing' },
    { id: 'devops', label: 'DevOps' }
  ];
  
  const skills = [
    { id: 'spring', name: 'Spring Boot' },
    { id: 'django', name: 'Django' },
    { id: 'nodejs', name: 'Node.js' },
    { id: 'java', name: 'Java' },
    { id: 'sql', name: 'SQL' }
  ];

  // Fetch candidates based on current filters and pagination
  const fetchCandidates = async () => {
    try {
      const res = await api.get('/api/candidates/filter', {
        params: { 
          field: filters.domain, 
          skill: filters.skill.join(','), 
          city: filters.city, 
          page 
        }
      });
      setCandidates(res.data.data);
      setMeta({ 
        lastPage: res.data.last_page, 
        total: res.data.total 
      });
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  // Initial load and when page changes
  useEffect(() => {
    fetchCandidates();
  }, [page]);

  // Apply filters handler
  const handleFilter = () => {
    setPage(1);
    fetchCandidates();
  };

  // Reset filters handler
  const resetFilters = () => {
    setFilters({ domain: '', skill: [], city: '' });
    setSelectedCandidate(null);
    setPage(1);
    fetchCandidates();
  };

  // Toggle skill selection
  const toggleSkill = (skillId) => {
    if (filters.skill.includes(skillId)) {
      setFilters({
        ...filters,
        skill: filters.skill.filter(id => id !== skillId)
      });
    } else {
      setFilters({
        ...filters,
        skill: [...filters.skill, skillId]
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Filter Candidates</h1>
      
      {/* FILTERS SECTION */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {/* Domain selection */}
        <div>
          <h2 className="text-sm font-medium mb-4">Domaine</h2>
          <div className="grid grid-cols-2 gap-4">
            {domains.map(domain => (
              <div key={domain.id} className="flex items-center gap-2">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center border cursor-pointer
                    ${filters.domain === domain.id ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'}`}
                  onClick={() => setFilters({...filters, domain: domain.id})}
                >
                  {filters.domain === domain.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="text-sm">{domain.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Skills selection */}
        <div>
          <h2 className="text-sm font-medium mb-4">Choose skill</h2>
          <div className="relative">
            <div 
              className="border border-gray-300 rounded px-4 py-2 flex items-center justify-between cursor-pointer"
              onClick={() => setShowSkillDropdown(!showSkillDropdown)}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {filters.skill.length > 0 
                    ? `${filters.skill.length} skill${filters.skill.length > 1 ? 's' : ''} selected` 
                    : 'Programming Skills'}
                </span>
              </div>
              <div className={`transform transition-transform ${showSkillDropdown ? 'rotate-180' : ''}`}>
                ▲
              </div>
            </div>
            
            {/* Skills dropdown */}
            {showSkillDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg">
                {skills.map(skill => (
                  <div 
                    key={skill.id}
                    className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSkill(skill.id)}
                  >
                    <span>{skill.name}</span>
                    {filters.skill.includes(skill.id) && (
                      <Check size={16} className="text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* City selection */}
        <div>
          <h2 className="text-sm font-medium mb-4">City</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Choose a city..."
              className="w-full border border-gray-300 rounded px-4 py-2 pr-10"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      {/* FILTER BUTTONS */}
      <div className="flex justify-end gap-4 mb-12">
        <button 
          className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
          onClick={resetFilters}
        >
          Reset Filters
        </button>
        <button 
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleFilter}
        >
          Apply Filters
        </button>
      </div>
      
      {/* RESULTS SECTION */}
      <div className="grid grid-cols-2 gap-8">
        {/* Search Results */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results <span className="text-gray-500 font-normal text-base">{meta.total} candidates found</span></h2>
          
          <div className="space-y-4">
            {candidates.map(candidate => (
              <div 
                key={candidate.id} 
                className="bg-white border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                    {candidate.avatar ? (
                      <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-200"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{candidate.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {candidate.profile?.field} | {candidate.profile?.localisation}
                    </p>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm mb-2">Test score</div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {candidate.test_score || '95'}%
                    </span>
                    
                    {candidate.skills && candidate.skills.slice(0, 3).map(skill => (
                      <span 
                        key={skill.id} 
                        className={`px-2 py-1 rounded text-sm ${
                          ['Java', 'Django'].includes(skill.name) 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {[1, 2, 3].map(num => (
                      <div key={num} className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs">
                        {num}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="px-4 py-1 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      View
                    </button>
                    <button className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Candidate Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>
          
          {selectedCandidate ? (
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    {selectedCandidate.avatar ? (
                      <img src={selectedCandidate.avatar} alt={selectedCandidate.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-200"></div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-xl">{selectedCandidate.name}</h3>
                    <p className="text-gray-600">
                      {selectedCandidate.profile?.field} | {selectedCandidate.profile?.localisation}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {selectedCandidate.badges && selectedCandidate.badges.slice(0, 2).map((badge, index) => (
                    <div key={index} className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      ★
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    Certified
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Test score : {selectedCandidate.test_score || '95'}%
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <h4 className="uppercase text-gray-500 font-semibold text-sm mb-2">SUMMARY</h4>
                <p className="text-gray-700 text-sm">
                  {selectedCandidate.profile?.description || 
                   "Experienced Full Stack Developer with 5+ years specializing in web applications. Strong expertise in JavaScript frameworks, Java backends, and database optimization. Passionate about clean code and scalable architecture."}
                </p>
              </div>
              
              <div className="flex gap-4">
                <button className="px-6 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50">
                  Resume
                </button>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Notification
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 flex items-center justify-center h-64">
              <p className="text-gray-500">Select a candidate to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateFilter;