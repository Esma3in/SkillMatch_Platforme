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
        setError(err.response?.data?.error || err.response?.data?.message || err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  // Helper function to check if a value is numeric
  const isNumeric = (value) => !isNaN(parseFloat(value)) && isFinite(value);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-6 text-center text-red-600">
        Error: {error}
      </div>
    );
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
              const {
                id = "unknown",
                name = "Untitled Badge",
                description = "No description available",
                Date_obtained = null,
                result = { score: 0 },
                company = { name: "No company associated" },
                qcm_for_roadmap_id = "unknown",
                icon = "/default-badge-icon.png",
              } = badge;

              const score = result.score || 0;
              const companyName = company.name || "No company associated";
              const additionalInfo = `Associated with roadmap ID ${qcm_for_roadmap_id} (${companyName})`;

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
                  className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <h3 className="text-2xl font-semibold text-blue-700">{name}</h3>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <img
                      src={icon}
                      alt={`${name} badge`}
                      className="w-16 h-16 object-contain"
                      onError={(e) => (e.target.src = "/default-badge-icon.png")}
                    />
                    <div className="flex flex-col gap-2">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                        Earned: {formattedDate}
                      </span>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      completed
                      </span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm mb-2">{description}</p>
                    <div className="flex items-center text-sm mt-1">
                      <span className="font-medium text-gray-700 mr-2">Company:</span>
                      <span className="text-gray-900">{companyName}</span>
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