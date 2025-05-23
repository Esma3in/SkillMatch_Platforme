import React, { useState, useEffect } from "react";
import axios from "axios";
import NavbarCandidate from "../components/common/navbarCandidate";
import { FaSearch, FaFilter, FaExclamationCircle } from "react-icons/fa";

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/problems?page=${currentPage}`, {
          headers: { Accept: "application/json" },
        });

        setProblems(response.data.data);
        setFilteredProblems(response.data.data); // Initial set
        setLastPage(response.data.last_page);
        setTotalProblems(response.data.total);
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
    let filtered = [...problems]; // Create a copy to avoid mutating state directly

    if (searchQuery) {
      filtered = filtered.filter(
        (problem) =>
          problem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          problem.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter((problem) => problem.skill?.name === selectedSkill);
    }

    if (selectedLevel) {
      filtered = filtered.filter((problem) => problem.level === selectedLevel);
    }

    setFilteredProblems(filtered);
  }, [searchQuery, selectedSkill, selectedLevel, problems]);

  const getLevelStyles = (level) => {
    const levels = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800",
    };
    return levels[level] || "bg-gray-100 text-gray-800";
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

  const skills = [...new Set(problems.map((problem) => problem.skill?.name).filter(Boolean))];
  const levels = ["easy", "medium", "hard", "expert"];

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
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Challenges</h1>
            <p className="text-lg text-gray-600 mb-4">
              Test your skills with real-world problems. Solve challenges, earn badges, and grow your career on SkillMatch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems by name or description..."
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
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                  aria-label="Filter by level"
                >
                  <option value="">All Levels</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredProblems.length} of {totalProblems} problems
            </div>
          </div>

          {/* Problems List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{problem.name}</h2>
                      <p className="text-gray-600 mb-3">{problem.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span
                          className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded"
                          aria-label={`Skill: ${problem.skill?.name || "N/A"}`}
                        >
                          {problem.skill?.name || "N/A"}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${getLevelStyles(problem.level)}`}
                          aria-label={`Level: ${problem.level?.charAt(0).toUpperCase() + problem.level?.slice(1)}`}
                        >
                          {problem.level?.charAt(0).toUpperCase() + problem.level?.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Attempted by:</span>{" "}
                        {problem.candidates?.length > 0
                          ? problem.candidates.map((candidate) => candidate.name).join(", ")
                          : "No candidates yet"}
                      </div>
                    </div>
                    <button
                      onClick={() => (window.location.href = `/problems/${problem.name}`)}
                      className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`Resolve problem: ${problem.name}`}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200">
                <FaExclamationCircle className="inline-block text-4xl text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Problems Found</h2>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters, or explore other challenges to test your skills!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSkill("");
                    setSelectedLevel("");
                  }}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  aria-label="Reset filters"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {lastPage > 1 && renderPagination()}
        </div>
      </div>
    </>
  );
};

export default ProblemsList;