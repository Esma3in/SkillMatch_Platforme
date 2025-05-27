import React, { useState, useEffect } from 'react';
import { FaTrophy, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaSearch, FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { api } from '../../api/api';
import NavbarAdmin from '../../components/common/navbarAdmin';
import { toast } from 'react-toastify';

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    level: 'medium',
    skill_id: '',
    problem_ids: []
  });
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    skill: '',
    level: ''
  });
  
  useEffect(() => {
    fetchChallenges();
    fetchSkills();
    fetchProblems();
  }, [currentPage]);
  
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      // Try direct admin route first, fallback to training/admin if needed
      let response;
      try {
        response = await api.get(`api/admin/challenges?page=${currentPage}`);
      } catch (error) {
        console.log('Falling back to training/admin route');
        response = await api.get(`api/training/admin/challenges?page=${currentPage}`);
      }
      
      setChallenges(response.data.data);
      setTotalPages(response.data.last_page || 1);
      setLoading(false);
    } catch (error) {
      console.error('Error loading challenges:', error);
      toast.error('Failed to load challenges');
      setLoading(false);
    }
  };
  
  const fetchSkills = async () => {
    try {
      const response = await api.get('api/skills/all');
      console.log('Skills loaded:', response.data);
      setSkills(response.data);
    } catch (error) {
      console.error('Error loading skills:', error);
      toast.error('Failed to load skills');
    }
  };
  
  const fetchProblems = async () => {
    // Array of possible endpoints to try
    const endpoints = [
      'api/leetcode/problems',
      'api/problems',
      'api/training/problems'
    ];
    
    let success = false;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      if (success) break;
      
      try {
        console.log(`Attempting to fetch problems from ${endpoint}...`);
        const response = await api.get(endpoint);
        
        // Check if we got valid data
        if (response.data && (Array.isArray(response.data) || Array.isArray(response.data.data))) {
          const problemsData = Array.isArray(response.data) ? response.data : response.data.data;
          console.log(`Success! Loaded ${problemsData.length} problems from ${endpoint}`);
          
          setProblems(problemsData);
          setFilteredProblems(problemsData);
          success = true;
          break;
        } else {
          console.warn(`Endpoint ${endpoint} returned invalid data format:`, response.data);
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error.message);
      }
    }
    
    if (!success) {
      console.error('All problem endpoints failed');
      toast.error('Failed to load problems. Please check the console for details.');
      setProblems([]);
      setFilteredProblems([]);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for skill_id to ensure it's stored as a number
    if (name === 'skill_id') {
      setForm(prev => ({ 
        ...prev, 
        [name]: value ? parseInt(value) : '', 
        problem_ids: [] 
      }));
      setSelectedProblems([]);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Apply filters to problems
    let filtered = [...problems];
    
    if (name === 'search' && value) {
      const searchTerm = value.toLowerCase();
      filtered = filtered.filter(problem => {
        const name = (problem.name || problem.title || '').toLowerCase();
        const description = (problem.description || '').toLowerCase();
        return name.includes(searchTerm) || description.includes(searchTerm);
      });
    }
    
    if (name === 'skill' && value) {
      filtered = filtered.filter(problem => {
        // Check if problem has a skill_id that matches
        if (problem.skill_id && problem.skill_id.toString() === value) {
          return true;
        }
        
        // Check if problem has a skill object with matching id
        if (problem.skill && problem.skill.id && problem.skill.id.toString() === value) {
          return true;
        }
        
        // Check tags
        if (problem.tags && Array.isArray(problem.tags)) {
          // Handle string tags or object tags
          return problem.tags.some(tag => {
            if (typeof tag === 'string') return tag === value;
            return tag && tag.id && tag.id.toString() === value;
          });
        }
        
        return false;
      });
    }
    
    if (name === 'level' && value) {
      const levelValue = value.toLowerCase();
      filtered = filtered.filter(problem => {
        const level = getProblemLevel(problem).toLowerCase();
        return level === levelValue;
      });
    }
    
    setFilteredProblems(filtered);
  };
  
  const handleProblemSelection = (problemId) => {
    const isSelected = selectedProblems.includes(problemId);
    
    if (isSelected) {
      setSelectedProblems(prev => prev.filter(id => id !== problemId));
      setForm(prev => ({
        ...prev,
        problem_ids: prev.problem_ids.filter(id => id !== problemId)
      }));
    } else {
      setSelectedProblems(prev => [...prev, problemId]);
      setForm(prev => ({
        ...prev,
        problem_ids: [...prev.problem_ids, problemId]
      }));
    }
  };
  
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      level: 'medium',
      skill_id: '',
      problem_ids: []
    });
    setSelectedProblems([]);
  };
  
  const openCreateModal = () => {
    resetForm();
    setSelectedChallenge(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = async (challenge) => {
    try {
      // Try direct admin route first
      let response;
      try {
        response = await api.get(`api/training/challenges/${challenge.id}`);
      } catch (error) {
        console.log('Falling back to alternate route');
        response = await api.get(`api/challenges/${challenge.id}`);
      }
      
      const challengeData = response.data;
      
      setSelectedChallenge(challengeData);
      setForm({
        name: challengeData.name,
        description: challengeData.description,
        level: challengeData.level,
        skill_id: parseInt(challengeData.skill_id),
        problem_ids: challengeData.problems.map(p => p.id)
      });
      
      setSelectedProblems(challengeData.problems.map(p => p.id));
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to load challenge details:', error);
      toast.error('Failed to load challenge details');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.problem_ids.length === 0) {
      toast.warning('Please select at least one problem for the challenge');
      return;
    }
    
    // Create a cleaned version of the form data
    const formData = {
      ...form,
      skill_id: parseInt(form.skill_id)
    };
    
    // Debug log the form data
    console.log('Submitting form data:', formData);
    
    try {
      let response;
      
      if (selectedChallenge) {
        // Update existing challenge - Use direct admin route
        const url = `api/admin/challenges/${selectedChallenge.id}`;
        console.log(`Sending PUT request to: ${url}`);
        response = await api.put(url, formData);
        toast.success('Challenge updated successfully');
      } else {
        // Create new challenge - Use direct admin route
        const url = 'api/admin/challenges';
        console.log(`Sending POST request to: ${url}`);
        response = await api.post(url, formData);
        toast.success('Challenge created successfully');
      }
      
      console.log('API Response:', response.data);
      setIsModalOpen(false);
      fetchChallenges();
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error response data:', error.response ? error.response.data : 'No response data');
      console.error('Error status:', error.response ? error.response.status : 'No status code');
      
      let errorMessage = 'Failed to save challenge';
      
      // Display more specific error if available
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        if (firstError && firstError.length > 0) {
          errorMessage = firstError[0];
        }
      }
      
      toast.error(errorMessage);
    }
  };
  
  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        // Use direct admin route
        await api.delete(`api/admin/challenges/${challengeId}`);
        toast.success('Challenge deleted successfully');
        fetchChallenges();
      } catch (error) {
        console.error('Error deleting challenge:', error);
        toast.error('Failed to delete challenge');
      }
    }
  };
  
  const getLevelBadgeClass = (level) => {
    const classes = {
      beginner: 'bg-green-100 text-green-800',
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
      advanced: 'bg-red-100 text-red-800',
      expert: 'bg-purple-100 text-purple-800'
    };
    
    return classes[level] || 'bg-gray-100 text-gray-800';
  };
  
  // Helper function to get problem name from any format
  const getProblemName = (problem) => {
    return problem?.name || problem?.title || `Problem #${problem?.id || 'Unknown'}`;
  };

  // Helper function to get problem level/difficulty from any format
  const getProblemLevel = (problem) => {
    return problem?.level || problem?.difficulty || 'medium';
  };

  // Helper function to get problem skill/tag from any format
  const getProblemSkill = (problem) => {
    if (problem?.skill?.name) return problem.skill.name;
    if (problem?.tags && Array.isArray(problem.tags) && problem.tags.length > 0) {
      return typeof problem.tags[0] === 'string' 
        ? problem.tags[0] 
        : problem.tags[0]?.name || 'N/A';
    }
    return 'N/A';
  };
  
  return (
    <>
      <NavbarAdmin />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Challenges</h1>
          <button
            onClick={openCreateModal}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="mr-2" /> Create Challenge
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Challenge
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Problems
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.length > 0 ? (
                    challenges.map((challenge) => (
                      <tr key={challenge.id}>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <div className="flex items-center">
                            <div className="ml-3">
                              <p className="text-gray-900 whitespace-no-wrap font-medium">{challenge.name}</p>
                              <p className="text-gray-600 whitespace-no-wrap text-xs mt-1">
                                {challenge.description && challenge.description.length > 50
                                  ? `${challenge.description.substring(0, 50)}...`
                                  : challenge.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {challenge.skill?.name || 'N/A'}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          <span className={`relative inline-block px-3 py-1 font-semibold rounded-full ${getLevelBadgeClass(challenge.level)}`}>
                            {challenge.level && challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {challenge.problems_count || 0}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {challenge.candidates_count || 0}
                          </p>
                        </td>
                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openEditModal(challenge)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit Challenge"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteChallenge(challenge.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Challenge"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                        No challenges found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav>
                  <ul className="flex space-x-2">
                    <li>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index}>
                        <button
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === index + 1
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-4xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedChallenge ? 'Edit Challenge' : 'Create New Challenge'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Challenge Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Skill
                  </label>
                  <select
                    name="skill_id"
                    value={form.skill_id}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select a skill</option>
                    {skills.map(skill => (
                      <option key={skill.id} value={skill.id}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Level
                  </label>
                  <select
                    name="level"
                    value={form.level}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="hard">Hard</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Selected Problems ({selectedProblems.length})
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedProblems.length > 0 ? (
                      selectedProblems.map(problemId => {
                        const problem = problems.find(p => p.id === problemId);
                        return (
                          <div key={problemId} className="bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-800 flex items-center">
                            {getProblemName(problem)}
                            <button
                              type="button"
                              onClick={() => handleProblemSelection(problemId)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-gray-500">No problems selected</div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="mb-4 flex gap-4 flex-wrap">
                      <div className="flex-1">
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          Search
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search problems..."
                            className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 text-sm"
                          />
                          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="w-40">
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          Filter by Skill
                        </label>
                        <select
                          name="skill"
                          value={filters.skill}
                          onChange={handleFilterChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm"
                        >
                          <option value="">All Skills</option>
                          {skills.map(skill => (
                            <option key={skill.id} value={skill.id}>
                              {skill.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="w-40">
                        <label className="block text-gray-700 text-xs font-bold mb-1">
                          Filter by Level
                        </label>
                        <select
                          name="level"
                          value={filters.level}
                          onChange={handleFilterChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 text-sm"
                        >
                          <option value="">All Levels</option>
                          <option value="beginner">Beginner</option>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="hard">Hard</option>
                          <option value="advanced">Advanced</option>
                          <option value="expert">Expert</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded">
                      <table className="min-w-full">
                        <thead className="bg-gray-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Select
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Problem Name
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Level
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Skill
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProblems.length > 0 ? (
                            filteredProblems.map(problem => (
                              <tr key={problem.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">
                                  <input
                                    type="checkbox"
                                    checked={selectedProblems.includes(problem.id)}
                                    onChange={() => handleProblemSelection(problem.id)}
                                    className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                  />
                                </td>
                                <td className="px-4 py-2">
                                  {getProblemName(problem)}
                                </td>
                                <td className="px-4 py-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadgeClass(getProblemLevel(problem))}`}>
                                    {getProblemLevel(problem)}
                                  </span>
                                </td>
                                <td className="px-4 py-2">
                                  {getProblemSkill(problem)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="px-4 py-2 text-center text-gray-500">
                                No problems found matching your filters
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                  >
                    {selectedChallenge ? 'Update Challenge' : 'Create Challenge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 