import React, { useState, useEffect } from "react";
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";
import { Footer } from "../components/common/footer";

export const BadgeList = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      const candidateId = JSON.parse(localStorage.getItem("candidate_id"));
      if (!candidateId || !isNumeric(candidateId) || candidateId <= 0) {
        setError("Invalid or missing candidate ID");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/badges/${candidateId}`);
        const { message, data } = response.data;

        if (response.status !== 200) {
          throw new Error(message || "Failed to fetch badges");
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array of badges");
        }

        const uniqueBadges = Array.from(
          new Map(data.map((badge) => [badge.id, badge])).values()
        );
        setBadges(uniqueBadges);
      } catch (err) {
        console.error("Error fetching badges:", err.response?.data || err.message);
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-pulse space-y-6">
          <h2 className="text-3xl font-bold text-gray-400 mb-8">Loading your badges...</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-3xl shadow-md p-6"
              >
                <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 text-center text-red-600 font-medium text-lg">
        ⚠️ Error: {error}
      </div>
    );
  }

  return (
    <>
      <NavbarCandidate />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl overflow-hidden">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
              Your Learning Achievements
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-6">
              You're making progress! You've earned{" "}
              <span className="font-bold text-indigo-200">{badges.length}</span>{" "}
              badge{badges.length !== 1 ? "s" : ""}. Keep learning to unlock more!
            </p>
            <a
              href="#explore-courses"
              className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-indigo-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label="Explore more courses to earn badges"
            >
              Discover New Challenges
            </a>
          </div>
          <div className="absolute inset-0 bg-indigo-900 opacity-10 rounded-3xl"></div>
        </section>

        {badges.length === 0 ? (
          <NoBadgesYet />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => {
              const {
                id = "unknown",
                name = "Untitled Badge",
                description = "No description available",
                Date_obtained = null,
                result = { score: 0 },
                company_name = "Unknown Company",
                qcm_for_roadmap_id = "unknown",
                icon = "/default-badge-icon.png",
                candidate_name = "Unknown Candidate",
              } = badge;

              const companyName = company_name || "No company associated";
              const additionalInfo = `Roadmap ID: ${qcm_for_roadmap_id}`;
              const score = Math.min(Math.max(result.score || 0, 0), 100); // Normalize score to 0-100
              const formattedDate = Date_obtained
                ? new Date(Date_obtained).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown Date";

              return (
                <div
                  key={id}
                  className="relative bg-white rounded-3xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-indigo-500"
                  style={{ animation: `popIn 0.4s ease-out ${index * 100}ms` }}
                  role="article"
                  aria-labelledby={`badge-${id}-title`}
                >
                  {/* Badge Card */}
                  <div className="flex flex-col items-center text-center">
                    {/* Badge Icon with Animation */}
                    <div className="relative w-20 h-20 mb-4">
                      <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-20 transition-opacity duration-300 group-hover:opacity-30"></div>
                      <img
                        src={icon}
                        alt={`${name} badge`}
                        className="w-full h-full object-contain rounded-full border-2 border-indigo-200 transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => (e.target.src = "/default-badge-icon.png")}
                      />
                    </div>
                    <h3
                      id={`badge-${id}-title`}
                      className="text-lg font-semibold text-gray-900 mb-1"
                      title={candidate_name}
                    >
                      {candidate_name.length > 20
                        ? `${candidate_name.slice(0, 20)}...`
                        : candidate_name}
                    </h3>
                    <div
                      className="text-sm font-medium text-indigo-600 mb-3"
                      title={name}
                    >
                      {name.length > 25 ? `${name.slice(0, 25)}...` : name}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                      role="progressbar"
                      aria-valuenow={score}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>

                  <div className="text-center">
                    <p
                      className="text-gray-600 text-sm mb-4 line-clamp-2"
                      title={description}
                    >
                      {description}
                    </p>
                    <div className="flex justify-center gap-2 mb-4">
                      <span className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200 hover:bg-indigo-200">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {formattedDate}
                      </span>
                      <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full transition-colors duration-200 hover:bg-green-200">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        {score}% Complete
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 font-medium mb-4">
                      <span className="text-gray-500">🏢 </span>
                      {companyName}
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-gray-500 text-xs" title={additionalInfo}>
                        {additionalInfo}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const NoBadgesYet = () => {
  return (
    <div className="text-center py-16 bg-white rounded-3xl shadow-md border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Your Journey!</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        No badges yet? No problem! Dive into our learning paths to earn your first badge and showcase your skills.
      </p>
      <a
        href="#start-learning"
        className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Start learning to earn badges"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          ></path>
        </svg>
        Get Started
      </a>
    </div>
  );
};

// Add CSS Keyframes for Animation
const styles = `
  @keyframes popIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

// Inject styles into the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default BadgeList;