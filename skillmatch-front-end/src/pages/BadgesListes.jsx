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
      const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));
      if (!candidate_id) {
        setError('No candidate ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/badges/${81}`);
        const data = response.data.data; // Access the 'data' array from response
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: Expected an array");
        }
        setBadges(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading badges...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <NavbarCandidate />
      <div className="max-w-7xl mx-auto py-12 px-6">
        {badges.length === 0 ? (
          <NoBadgesYet />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {badges.map((badge) => {
              // Map backend fields to frontend expectations
              const {
                id = "unknown",
                name = "Untitled Badge", // Backend: name → Frontend: title
                description = "No description available",
                date_obtained = null, // Backend: date_obtained → Frontend: dateEarned
                qcm_for_roadmap = null,
              } = badge;

              // Extract fields from qcm_for_roadmap and result
              const title = qcm_for_roadmap?.title || name; // Prefer roadmap title if available
              const score = qcm_for_roadmap?.result?.score || 0; // Score from results
              // Placeholder defaults for missing fields
              const difficulty = 0; // Not provided by backend
              const timeSpent = 0; // Not provided by backend
              const skills = []; // Not provided by backend
              const additionalInfo = qcm_for_roadmap ? "Associated with roadmap" : "No additional info";

              // Safely parse date
              const formattedDate = date_obtained
                ? new Date(date_obtained).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown Date";

              return (
                <div
                  key={id}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <h3 className="text-2xl font-semibold text-blue-700">{title}</h3>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Earned: {formattedDate}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      Completed
                    </span>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-2">{description}</p>
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700 mr-2">Score:</span>
                      <span className="text-blue-600 font-bold">{score}%</span>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <span className="font-medium text-gray-700 mr-2">Difficulty:</span>
                      <span className="text-yellow-500">
                        {"★".repeat(difficulty) + "☆".repeat(5 - difficulty)} ({difficulty}/5)
                      </span>
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <span className="font-medium text-gray-700 mr-2">Time:</span>
                      <span className="font-bold text-gray-900">{timeSpent} hours</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">Key Competencies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(skills) && skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-xs">No skills listed</span>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-500 text-xs">{additionalInfo}</p>
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
    <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">No Badges Yet</h2>
      <p className="text-gray-600 mb-6">
        It looks like you haven’t earned any badges yet. Start exploring our courses and challenges to earn your first badge!
      </p>
      <a
        href="#start-learning"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Start learning to earn badges"
      >
        Start Learning
      </a>
    </div>
  );
};

export default BadgeList;