import React, { useState } from "react";

import { api } from "../api/api";

const BadgeGenerator = ({ candidateId, qcmForRoadmapId }) => {
  const [badgeMessage, setBadgeMessage] = useState(null);

  const createBadge = async () => {
    try {
      const response = await api.post('/api/create/badge', {
        candidate_id: candidateId,
        qcm_for_roadmap_id: qcmForRoadmapId,
        name: `Badge for Roadmap ${qcmForRoadmapId}`,
        icon: "https://img.icons8.com/pulsar-gradient/48/warranty-card.png",
        description: `Earned by completing the roadmap with ID ${qcmForRoadmapId}`,
        date_obtained: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      });

      setBadgeMessage({
        type: 'success',
        text: response.data.message || 'Badge created successfully!',
      });
    } catch (error) {
      setBadgeMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create badge',
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Earn Your Badge</h3>
      <button
        onClick={createBadge}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
      >
        Get My Badge
      </button>
      {badgeMessage && (
        <div className={`mt-3 p-2 rounded-lg text-sm ${badgeMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {badgeMessage.text}
        </div>
      )}
    </div>
  );
};

export default BadgeGenerator;