import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaTrophy, FaInfoCircle, FaExclamationCircle } from "react-icons/fa";

const SeriesChallenge = () => {
  const { challengeId } = useParams();
  const [problems, setProblems] = useState([]);
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallengeAndProblems = async () => {
      setLoading(true);
      try {
        const challengeResponse = await axios.get(`http://localhost:8000/api/challenges/${challengeId}`, {
          headers: { Accept: "application/json" },
        });
        setChallenge(challengeResponse.data);

        const problemsResponse = await axios.get(`http://localhost:8000/api/challenges/${challengeId}/problems`, {
          headers: { Accept: "application/json" },
        });
        setProblems(problemsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch challenge details and problems");
        setLoading(false);
        console.error("Error fetching challenge data:", err);
      }
    };

    fetchChallengeAndProblems();
  }, [challengeId]);

  const getLevelStyles = (level) => {
    const levels = {
      easy: "bg-green-100 text-green-800",
      beginner: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      hard: "bg-red-100 text-red-800",
      advanced: "bg-red-100 text-red-800",
      expert: "bg-purple-100 text-purple-800",
    };
    return levels[level?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const getLevelBadges = (level) => {
    const badges = [];

    if (level === "intermediate" || level === "advanced") {
      badges.push(
        <span key="intermediate" className="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs mr-1">
          Intermediate
        </span>
      );
    }

    if (level === "advanced") {
      badges.push(
        <span key="advanced" className="inline-block px-2 py-1 rounded bg-red-100 text-red-800 text-xs">
          Advanced
        </span>
      );
    }

    if (level === "beginner") {
      badges.push(
        <span key="beginner" className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
          Beginner
        </span>
      );
    }

    return badges.length ? badges : level;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
          <p className="text-gray-600">Loading challenge problems...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Introductory Component */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center mb-4">
            <FaTrophy className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Series Challenge: {challenge?.name}</h1>
          </div>
          <p className="text-lg text-gray-600 mb-4">
            Embark on this series of challenges to master {challenge?.skill?.name || "a skill"} and earn a prestigious certificate. Each problem builds your expertise, leading to a rewarding milestone!
          </p>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">1</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">2</div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">3</div>
          </div>
          <p className="text-sm text-gray-500">Step 1: Complete the Challenges</p>
        </div>

        {/* Descriptive Section 1: Challenge Structure */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-600" /> Challenge Overview
          </h2>
          <p className="text-gray-600">
            This series consists of multiple problems designed to test and enhance your skills. Tackle each challenge step-by-step, and track your progress toward certification.
          </p>
        </div>

        {/* Descriptive Section 2: Benefits */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
            <FaTrophy className="mr-2 text-indigo-600" /> Your Reward
          </h2>
          <p className="text-gray-600">
            Upon completing all challenges, you’ll receive a certificate showcasing your expertise in {challenge?.skill?.name || "this skill"}. Share it with employers or add it to your SkillMatch profile!
          </p>
        </div>

        {/* Descriptive Section 3: Tips for Success */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
            <FaInfoCircle className="mr-2 text-indigo-600" /> Tips for Success
          </h2>
          <p className="text-gray-600">
            Take your time to understand each problem, review solutions, and seek help if needed. Consistency is key to earning your certificate!
          </p>
        </div>

        {/* Series Challenges */}
        <div className="grid grid-cols-1 gap-6">
          {problems.length > 0 ? (
            problems.map((problem, index) => (
              <div
                key={problem.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Episode {index + 1}: {problem.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {problem.description && problem.description.length > 50
                        ? `${problem.description.slice(0, 50)}...`
                        : problem.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        {problem.skill?.name || "JavaScript"}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getLevelStyles(problem.level)}`}>
                        {problem.level
                          ? problem.level.charAt(0).toUpperCase() + problem.level.slice(1)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Resolved by:</span>{" "}
                      {problem.candidates_count || Math.floor(Math.random() * 10000)} users
                    </div>
                  </div>
                  <button
                    onClick={() => (window.location.href = `/serie-problems/${problem.skill?.name}`)}
                    className="mt-4 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Resolve Episode ${index + 1}: ${problem.name}`}
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
              <p className="text-gray-600 mb-4">It seems this challenge has no problems yet. Check back later!</p>
            </div>
          )}
        </div>

        {/* Certificate CTA */}
        {problems.length > 0 && (
          <div className="mt-10 text-center bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center justify-center">
              <FaTrophy className="mr-2 text-indigo-600" /> Complete the Series
            </h2>
            <p className="text-gray-600 mb-4">
              Finish all challenges to earn your certificate in {challenge?.skill?.name || "this skill"}!
            </p>
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              onClick={() => alert("Certificate earned! (Feature to be implemented)")}
              aria-label="View certificate preview"
            >
              Preview Certificate
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/challenges" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Back to Challenges
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SeriesChallenge;