import React, { useState } from "react";
import { api } from "../api/api";

const BadgeGenerator = ({ candidateId, qcmForRoadmapId, score, refreshBadges }) => {
  const [badgeMessage, setBadgeMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [BadgeName  ,setBadgeName] = useState("")

  const createBadge = async () => {
    try {
      if (!score || isNaN(score)) {
        setBadgeMessage({
          type: "error",
          text: "Valid score information not available",
        });
        return;
      }

      if (score <= 80) {
        setBadgeMessage({
          type: "error",
          text: "Score must be greater than 80 to earn this badge",
        });
        return;
      }
      if (score < 50) {
        setBadgeName("Spark Starter");
      } else if (score >= 50 && score < 81) {
        setBadgeName("Trailblazer");
      } else if (score === 81) {
        setBadgeName("Grit Vanguard");
      } else if (score > 81 && score <= 90) {
        setBadgeName("Stellar Striver");
      } else if (score > 90) {
        setBadgeName("Cosmic Champion");
      }
      console.log("BadgeGenerator candidateId:", candidateId);
      console.log("BadgeGenerator qcmForRoadmapId:", qcmForRoadmapId);
      const payload = {
        candidate_id: Number(candidateId),
        qcm_for_roadmap_id: Number(qcmForRoadmapId),
        name: String(`Badge with grade ${BadgeName}`),
        icon: String("https://img.icons8.com/pulsar-gradient/48/warranty-card.png"),
        description: String(`Earned by completing the roadmap with ID ${qcmForRoadmapId} with a score of ${score}`),
        Date_obtained: new Date().toISOString().split("T")[0],
        result: { score: Number(score) }, // Match BadgeList expectation
        company: { name: "Default Company" }, // Match BadgeList expectation
      };

      console.log("Sending badge creation request:", payload);
      setLoading(true);
      const response = await api.post("/api/create/badge", payload);

      setBadgeMessage({
        type: "success",
        text: response.data.message || "Badge created successfully!",
      });
      if (refreshBadges) {
        refreshBadges(); // Trigger parent refresh
      } else if (window.location.pathname === "/badges") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Badge creation error:", error.response?.data || error.message);
      setBadgeMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create badge",
        errorDetails: error.response?.data?.error || "No additional error details available",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Earn Your Badge</h3>
      {loading && <p className="text-gray-500 text-sm">Processing badge request...</p>}
      {!loading && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Your score: {score || "Not available"}
            {score && score > 80 ? (
              <span className="text-green-600 ml-2">Eligible for badge!</span>
            ) : (
              <span className="text-red-600 ml-2">Score must be above 80</span>
            )}
          </p>
          <button
            onClick={createBadge}
            disabled={loading || !score || score <= 80}
            className={`font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
              loading || !score || score <= 80
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
            }`}
          >
            Get My Badge
          </button>
        </>
      )}
      {badgeMessage && (
        <div
          className={`mt-3 p-2 rounded-lg text-sm ${
            badgeMessage.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <p>{badgeMessage.text}</p>
          {badgeMessage.errorDetails && <p className="mt-1 text-xs">Details: {badgeMessage.errorDetails}</p>}
        </div>
      )}
    </div>
  );
};

export default BadgeGenerator;