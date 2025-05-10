import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaTrophy, FaSearch, FaFilter, FaExclamationCircle } from "react-icons/fa";
import { FaInfoCircle } from "react-icons/fa";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";
const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/challenges?page=${currentPage}`, {
          headers: { Accept: "application/json" },
        });

        setChallenges(response.data.data);
        setFilteredChallenges(response.data.data);
        setLastPage(response.data.last_page);
        setTotalChallenges(response.data.total);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch challenges");
        setLoading(false);
        console.error("Error fetching challenges:", err);
      }
    };

    fetchChallenges();
  }, [currentPage]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...challenges];

    if (searchQuery) {
      filtered = filtered.filter(
        (challenge) =>
          challenge.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          challenge.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter((challenge) => challenge.skill?.name === selectedSkill);
    }

    if (selectedLevel) {
      filtered = filtered.filter((challenge) => challenge.level === selectedLevel);
    }

    setFilteredChallenges(filtered);
  }, [searchQuery, selectedSkill, selectedLevel, challenges]);

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  const getLevelStyles = (level) => {
    const levels = {
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800",
    };
    return levels[level] || "bg-gray-100 text-gray-800";
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

  const skills = [...new Set(challenges.map((challenge) => challenge.skill?.name).filter(Boolean))];
  const levels = ["easy", "medium", "hard", "expert"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
          <p className="text-gray-600">Loading challenges...</p>
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
    {/* Enhanced Introductory Component */}
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
      <div className="flex items-center mb-4">
        <FaTrophy className="text-3xl text-indigo-600 mr-3" />
        <h1 className="text-4xl font-bold text-gray-900">Discover Your Challenge Journey</h1>
      </div>
      <p className="text-lg text-gray-600 mb-4">
        Dive into a world of challenges designed to sharpen your skills and earn certificates. Each series guides you to mastery—start exploring now!
      </p>
      <div className="flex justify-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">1</div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">2</div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">3</div>
      </div>
      <p className="text-sm text-gray-500">Step 1: Browse and Select a Challenge Series</p>
      <div className="mt-4 text-center">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          onClick={() => alert("Certificate preview coming soon!")}
          aria-label="Preview certificate"
        >
          Preview Certificate
        </button>
      </div>
    </div>

    {/* Descriptive Section 1: Purpose */}
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
        <FaInfoCircle className="mr-2 text-indigo-600" /> Why Challenges?
      </h2>
      <p className="text-gray-600">
        Challenges offer hands-on practice to build your expertise, preparing you for real-world projects. Tackle them at your pace and track your growth!
      </p>
    </div>

    {/* Descriptive Section 2: Benefits */}
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
        <FaTrophy className="mr-2 text-indigo-600" /> Your Rewards
      </h2>
      <p className="text-gray-600">
        Complete a series to earn a certificate, a powerful credential to showcase on your resume or SkillMatch profile. Boost your career today!
      </p>
    </div>

    {/* Descriptive Section 3: Getting Started */}
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
        <FaInfoCircle className="mr-2 text-indigo-600" /> Getting Started
      </h2>
      <p className="text-gray-600">
        Use the filters below to find a challenge that suits your skill level. Click “Start” to begin a series, and follow the steps to earn your certificate!
      </p>
    </div>

    {/* Filter and Search Section */}
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search challenges by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
            aria-label="Search challenges"
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
      <div className="text-sm text-gray-600">
        Showing {filteredChallenges.length} of {totalChallenges} challenges
      </div>
    </div>

    {/* Enhanced Challenges List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredChallenges.length > 0 ? (
        filteredChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
          >
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Series: {challenge.name} ({challenge.problems_count || 3} Challenges)
              </h3>
              <p className="text-gray-600 mb-3">
                {challenge.description && challenge.description.length > 50
                  ? `${challenge.description.slice(0, 50)}...`
                  : challenge.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                  {challenge.skill?.name || "N/A"}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${getLevelStyles(challenge.level)}`}
                >
                  {challenge.level
                    ? challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)
                    : "N/A"}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Resolved by:</span>{" "}
                {challenge.candidates_count || 0} users
              </div>
              <Link
                to={`/serie-challenges/${challenge.id}`}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                aria-label={`Start challenge series: ${challenge.name}`}
              >
                Start
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200 col-span-full">
          <FaExclamationCircle className="inline-block text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Challenges Found</h2>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters, or explore later for new opportunities!
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
<Footer />
    </>
    
  );
};

export default Challenge;