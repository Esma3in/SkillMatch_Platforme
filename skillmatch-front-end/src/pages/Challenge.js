import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrophy, FaSearch, FaFilter, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";
import { toast } from "react-toastify";

export default function ChallengeList() {
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
  const [certificates, setCertificates] = useState([]);
  const navigate = useNavigate();

  // Get candidate ID from localStorage
  const candidateId = localStorage.getItem('candidateId');

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        // Fetch challenges
        const response = await api.get(`/training/challenges?page=${currentPage}`);
        setChallenges(response.data.data);
        setFilteredChallenges(response.data.data);
        setLastPage(response.data.last_page || 1);
        setTotalChallenges(response.data.total || 0);
        
        // Fetch certificates if logged in
        if (candidateId) {
          try {
            const certificatesResponse = await api.get(`/training/candidates/${candidateId}/certificates`);
            setCertificates(certificatesResponse.data);
          } catch (err) {
            console.error("Error fetching certificates:", err);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch challenges");
        setLoading(false);
        console.error("Error fetching challenges:", err);
      }
    };

    fetchChallenges();
  }, [currentPage, candidateId]);

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
      beginner: "bg-green-100 text-green-800",
      easy: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      advanced: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800",
    };
    return levels[level?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const hasCertificateForChallenge = (challengeId) => {
    return certificates.some(cert => cert.challenge_id === challengeId);
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
  const levels = ["beginner", "easy", "medium", "intermediate", "hard", "advanced", "expert"];

  if (loading) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
            <p className="text-gray-600">Loading challenges...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarCandidate />
        <div className="text-center py-16 text-red-500">
          <FaExclamationCircle className="inline-block text-4xl mb-4" />
          <p>{error}</p>
        </div>
      </>
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
              <h1 className="text-4xl font-bold text-gray-900">Skill Challenges</h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">
              Enhance your skills by completing challenges and earning certificates. Each challenge contains a series of problems designed to test and improve your abilities.
            </p>
            
            {certificates.length > 0 && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Certificates</h2>
                <div className="flex flex-wrap gap-3">
                  {certificates.map((cert) => (
                    <div 
                      key={cert.certificate_id}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => navigate(`/certificates/${cert.certificate_id}`)}
                    >
                      <FaTrophy className="text-yellow-500 mr-2" />
                      <div>
                        <p className="font-medium text-gray-800">{cert.challenge_name}</p>
                        <p className="text-xs text-gray-600">{cert.completion_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.length > 0 ? (
              filteredChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="flex flex-col h-full">
                    {hasCertificateForChallenge(challenge.id) && (
                      <div className="flex justify-end mb-2">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                          <FaTrophy className="mr-1" /> Completed
                        </span>
                      </div>
                    )}
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {challenge.name}
                    </h3>
                    <p className="text-gray-600 mb-3 flex-grow">
                      {challenge.description && challenge.description.length > 100
                        ? `${challenge.description.slice(0, 100)}...`
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
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
                        {challenge.problems_count || 0} Problems
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Participants:</span>{" "}
                      {challenge.candidates_count || 0}
                    </div>
                    <Link
                      to={`/challenges/${challenge.id}`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                      aria-label={`View challenge: ${challenge.name}`}
                    >
                      {hasCertificateForChallenge(challenge.id) ? "View Details" : "Start Challenge"}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-200 col-span-full">
                <FaExclamationCircle className="inline-block text-4xl text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Challenges Found</h2>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters, or check back later for new challenges!
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
}