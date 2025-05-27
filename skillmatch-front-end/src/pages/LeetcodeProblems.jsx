import React, { useState, useEffect } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { FaSearch, FaFilter, FaExclamationCircle, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios"; // Import our configured axios instance

const LeetcodeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        // Use our api instance instead of axios directly
        const response = await api.get(`/leetcode/problems?page=${currentPage}`);

        setProblems(response.data.data);
        setFilteredProblems(response.data.data);
        setLastPage(response.data.last_page);
        setTotalProblems(response.data.total);
        
        // Extract unique skills from problems
        const uniqueSkills = [...new Set(response.data.data.map(problem => problem.skill?.name).filter(Boolean))];
        setSkills(uniqueSkills);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problems");
        setLoading(false);
        console.error("Error fetching problems:", err);
      }
    };

    fetchProblems();
  }, [currentPage]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...problems];

    if (searchQuery) {
      filtered = filtered.filter(
        (problem) =>
          problem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter((problem) => problem.skill?.name === selectedSkill);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter((problem) => problem.difficulty === selectedDifficulty);
    }

    setFilteredProblems(filtered);
  }, [searchQuery, selectedSkill, selectedDifficulty, problems]);

  const getDifficultyStyles = (difficulty) => {
    const styles = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
    };
    return styles[difficulty] || "bg-gray-100 text-gray-800";
  };

  const handleProblemClick = (problemId) => {
    navigate(`/leetcode/problem/${problemId}`);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(lastPage, startPage + pagesToShow - 1);

    return (
      <div className="flex items-center justify-center mt-8 gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-md bg-indigo-200 text-indigo-800 hover:bg-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
        </button>

        {startPage > 1 && <span className="px-3 py-1 text-gray-600">...</span>}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-4 py-2 rounded-md ${
              currentPage === page ? "bg-indigo-600 text-white" : "bg-indigo-200 text-indigo-800 hover:bg-indigo-300"
            }`}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
        {endPage < lastPage && <span className="px-3 py-1 text-gray-600">...</span>}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-4 py-2 rounded-md bg-indigo-200 text-indigo-800 hover:bg-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
          <p className="text-gray-600">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500">
        <FaExclamationCircle className="inline-block text-4xl mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Coding Challenges</h1>
            <p className="text-lg text-gray-600 mb-4">
              Sharpen your programming skills with our curated collection of challenges. Solve problems, improve your logic, and become a better developer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  aria-label="Search problems"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  aria-label="Filter by skill"
                >
                  <option value="">All Skills</option>
                  {skills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  aria-label="Filter by difficulty"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProblems.length} of {totalProblems} problems
            </div>
          </motion.div>

          {/* Problems List */}
          <div className="space-y-4">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <motion.div
                  key={problem.id}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyStyles(problem.difficulty)}`}>
                            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                          </span>
                          {problem.skill && (
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                              {problem.skill.name}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl font-medium text-gray-900">{problem.title}</h2>
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {problem.description.length > 150
                            ? problem.description.substring(0, 150) + "..."
                            : problem.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleProblemClick(problem.id)}
                        className="mt-4 sm:mt-0 flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Solve <FaChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
                <FaExclamationCircle className="inline-block text-4xl text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Problems Found</h2>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSkill("");
                    setSelectedDifficulty("");
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredProblems.length > 0 && renderPagination()}
        </div>
      </div>
    </>
  );
};

export default LeetcodeProblems; 