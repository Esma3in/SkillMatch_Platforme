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
      'api/problems'
    ];
    
    let allProblems = [];
    let successfulEndpoints = 0;
    
    // Try all endpoints and combine their results
    for (const endpoint of endpoints) {
      try {
        console.log(`Attempting to fetch problems from ${endpoint}...`);
        const response = await api.get(endpoint);
        
        // Check if we got valid data
        if (response.data && (Array.isArray(response.data) || Array.isArray(response.data.data))) {
          const rawProblemsData = Array.isArray(response.data) ? response.data : response.data.data;
          console.log(`Raw problems data from ${endpoint}:`, rawProblemsData.slice(0, 2)); // Log sample
          
          // Filter and validate problems to ensure they have valid IDs
          const validatedProblems = rawProblemsData
            .filter(problem => problem && problem.id && !isNaN(Number(problem.id)))
            .map(problem => {
              // Normalize problem structure to handle both standard and leetcode problems
              let normalizedProblem = {
                ...problem,
                id: Number(problem.id), // Ensure ID is a number
                name: problem.name || problem.title || `Problem #${problem.id}`,
                level: problem.level || problem.difficulty || 'medium',
                description: problem.description || '',
                source: endpoint.includes('leetcode') ? 'leetcode' : 'standard'
              };
              
              // Ensure skill information is properly formatted
              if (problem.skill_id && !problem.skill) {
                normalizedProblem.skill = { id: problem.skill_id };
              }
              
              return normalizedProblem;
            });
          
          console.log(`Success! Loaded ${validatedProblems.length} valid problems from ${endpoint}`);
          if (validatedProblems.length < rawProblemsData.length) {
            console.warn(`Filtered out ${rawProblemsData.length - validatedProblems.length} problems with invalid IDs`);
          }
          
          // Add to our collection
          allProblems = [...allProblems, ...validatedProblems];
          successfulEndpoints++;
        } else {
          console.warn(`Endpoint ${endpoint} returned invalid data format:`, response.data);
        }
      } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error.message);
      }
    }
    
    // De-duplicate problems by ID
    const uniqueProblems = [];
    const seenIds = new Set();
    
    allProblems.forEach(problem => {
      if (!seenIds.has(problem.id)) {
        seenIds.add(problem.id);
        uniqueProblems.push(problem);
      } else {
        console.warn(`Duplicate problem ID found: ${problem.id}`);
      }
    });
    
    console.log(`Total unique problems loaded: ${uniqueProblems.length} from ${successfulEndpoints} endpoints`);
    
    if (uniqueProblems.length > 0) {
      setProblems(uniqueProblems);
      setFilteredProblems(uniqueProblems);
    } else {
      console.error('No valid problems found from any endpoint');
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
    // Debug the incoming problem ID
    console.log('Problem selection - original ID:', problemId, 'type:', typeof problemId);
    
    // Ensure problemId is a number
    const numericId = Number(problemId);
    if (isNaN(numericId)) {
      console.error('Invalid problem ID:', problemId);
      toast.error(`Invalid problem ID: ${problemId}`);
      return;
    }
    
    console.log('Problem selection - converted ID:', numericId, 'type:', typeof numericId);
    
    const isSelected = selectedProblems.includes(numericId);
    
    if (isSelected) {
      setSelectedProblems(prev => prev.filter(id => id !== numericId));
      setForm(prev => ({
        ...prev,
        problem_ids: prev.problem_ids.filter(id => id !== numericId)
      }));
    } else {
      setSelectedProblems(prev => [...prev, numericId]);
      setForm(prev => ({
        ...prev,
        problem_ids: [...prev.problem_ids, numericId]
      }));
    }

    // Log the updated selected problems
    console.log('Updated selected problems:', selectedProblems);
    console.log('Updated form problem_ids:', form.problem_ids);
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
    console.log('Opening create modal - resetting form state');
    resetForm();
    setSelectedChallenge(null);
    setIsModalOpen(true);
    console.log('Form after reset:', form);
    console.log('Selected problems after reset:', selectedProblems);
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
      console.log('Loaded challenge data:', challengeData);
      
      // Extract problem IDs from both standard and leetcode problems
      const standardProblemIds = challengeData.problems && Array.isArray(challengeData.problems)
        ? challengeData.problems.map(p => Number(p.id))
        : [];
        
      const leetcodeProblemIds = challengeData.leetcode_problems && Array.isArray(challengeData.leetcode_problems)
        ? challengeData.leetcode_problems.map(p => Number(p.id))
        : [];
      
      // Combine both types of problem IDs
      const allProblemIds = [...standardProblemIds, ...leetcodeProblemIds];
      
      console.log('Extracted problem IDs:', {
        standard: standardProblemIds,
        leetcode: leetcodeProblemIds,
        all: allProblemIds
      });
      
      setSelectedChallenge(challengeData);
      setForm({
        name: challengeData.name,
        description: challengeData.description,
        level: challengeData.level,
        skill_id: parseInt(challengeData.skill_id),
        problem_ids: allProblemIds
      });
      
      setSelectedProblems(allProblemIds);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to load challenge details:', error);
      toast.error('Failed to load challenge details');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission - Raw form data:', form);
    console.log('Form submission - Selected problems:', selectedProblems);
    
    if (form.problem_ids.length === 0) {
      toast.warning('Please select at least one problem for the challenge');
      return;
    }
    
    try {
      // Ensure problem_ids are properly formatted (convert to numbers)
      const validatedProblemIds = form.problem_ids.map(id => {
        const numId = Number(id);
        if (isNaN(numId) || numId <= 0) {
          throw new Error(`Invalid problem ID: ${id}`);
        }
        return numId;
      });
      
      console.log('Form submission - Validated problem IDs:', validatedProblemIds);
      
      // Create a cleaned version of the form data
      const formData = {
        ...form,
        skill_id: parseInt(form.skill_id),
        problem_ids: validatedProblemIds
      };
      
      // Debug log the form data
      console.log('Form submission - Final form data to submit:', formData);
      
      let response;
      let url;
      
      if (selectedChallenge) {
        // Update existing challenge - Use the correct route
        url = `api/admin/challenges/${selectedChallenge.id}`;
        console.log(`Sending PUT request to: ${url}`);
        response = await api.put(url, formData);
        toast.success('Challenge updated successfully');
      } else {
        // Create new challenge - Use the correct route
        url = 'api/admin/challenges';
        console.log(`Sending POST request to: ${url}`);
        response = await api.post(url, formData);
        toast.success('Challenge created successfully');
      }
      
      console.log('API Response:', response.data);
      setIsModalOpen(false);
      fetchChallenges();
    } catch (error) {
      // Check if this is our validation error first
      if (error.message && error.message.startsWith('Invalid problem ID:')) {
        toast.error(error.message);
        return;
      }
      
      console.error('Form submission error:', error);
      console.error('Error response data:', error.response ? error.response.data : 'No response data');
      console.error('Error status:', error.response ? error.response.status : 'No status code');
      
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(`Error: ${error.response.data.error}`);
        return;
      }
      
      let errorMessage = 'Failed to save challenge';
      
      // Enhanced error handling
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle validation errors (422)
        if (status === 422 && data.errors) {
          const errors = data.errors;
          
          // Problem IDs validation error
          if (errors.problem_ids) {
            errorMessage = `Problem IDs error: ${errors.problem_ids[0]}`;
            console.error('Problem with problem_ids:', errors.problem_ids);
          } 
          // Other validation errors
          else {
            const firstErrorField = Object.keys(errors)[0];
            const firstError = errors[firstErrorField][0];
            errorMessage = `${firstErrorField}: ${firstError}`;
          }
        } 
        // Other error statuses
        else if (data && data.message) {
          errorMessage = data.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };
  
  const handleDeleteChallenge = async (challengeId) => {
    if (window.confirm('Are you sure you want to delete this challenge?')) {
      try {
        // Use training admin route
        await api.delete(`api/training/admin/challenges/${challengeId}`);
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
  
  // Add a function to check if problems data is correctly loaded
  useEffect(() => {
    if (problems.length > 0) {
      console.log('Problems data structure sample:', problems.slice(0, 2));
      
      // Check if problems have proper IDs
      const problematicProblems = problems.filter(p => !p.id || isNaN(Number(p.id)));
      if (problematicProblems.length > 0) {
        console.warn('Problems with missing or invalid IDs:', problematicProblems);
      }
    }
  }, [problems]);
  
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-start pt-20 z-[9999]">
          <div className="relative bg-white rounded-lg shadow-xl mx-auto max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedChallenge ? 'Edit Challenge' : 'Create New Challenge'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={24} />
              </button>
            </div>
            
            <div className="p-6">
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
                  <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50">
                    {selectedProblems.length > 0 ? (
                      selectedProblems.map(problemId => {
                        // Ensure we have a proper numeric ID
                        const numericId = Number(problemId);
                        if (isNaN(numericId)) {
                          console.error('Invalid problem ID in selectedProblems:', problemId);
                          return null;
                        }
                        
                        // Find the problem object by ID
                        const problem = problems.find(p => Number(p.id) === numericId);
                        if (!problem) {
                          console.error(`Problem with ID ${numericId} not found in problems list`);
                          return (
                            <div key={numericId} className="bg-red-100 rounded-full px-3 py-1 text-sm text-red-800 flex items-center">
                              Error: Invalid ID {numericId}
                              <button
                                type="button"
                                onClick={() => handleProblemSelection(numericId)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          );
                        }
                        
                        // Determine badge color based on source
                        const badgeClass = problem.source === 'leetcode' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800';
                        
                        return (
                          <div key={numericId} className={`rounded-full px-3 py-1 text-sm flex items-center ${badgeClass}`}>
                            <span className="mr-1 text-xs text-gray-500">[{numericId}]</span>
                            {problem.name}
                            <span className="mx-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-700">
                              {problem.source || 'standard'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleProblemSelection(numericId)}
                              className="ml-2 text-gray-600 hover:text-gray-800"
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
                              Problem ID
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
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                              Source
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProblems.length > 0 ? (
                            filteredProblems.map(problem => {
                              // Ensure problem ID is a number
                              const problemId = problem?.id ? Number(problem.id) : null;
                              
                              if (!problemId) {
                                console.warn('Problem with missing or invalid ID:', problem);
                                return null; // Skip rendering this problem
                              }
                              
                              return (
                                <tr key={problemId} className="hover:bg-gray-50">
                                  <td className="px-4 py-2">
                                    <input
                                      type="checkbox"
                                      checked={selectedProblems.includes(problemId)}
                                      onChange={() => handleProblemSelection(problemId)}
                                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                    />
                                  </td>
                                  <td className="px-4 py-2 text-xs text-gray-500">
                                    {problemId}
                                  </td>
                                  <td className="px-4 py-2">
                                    {problem.name}
                                  </td>
                                  <td className="px-4 py-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadgeClass(problem.level)}`}>
                                      {problem.level}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">
                                    {getProblemSkill(problem)}
                                  </td>
                                  <td className="px-4 py-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      problem.source === 'leetcode' 
                                        ? 'bg-orange-100 text-orange-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {problem.source || 'standard'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-4 py-2 text-center text-gray-500">
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