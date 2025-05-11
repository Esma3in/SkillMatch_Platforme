import React, { useEffect, useState } from "react";
import { api } from "../api/api";

const BadgeGenerator = ({ candidateId, qcmForRoadmapId }) => {
  const [badgeMessage, setBadgeMessage] = useState(null);
  const [qcmRoadmapResult, setQcmRoadmapResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQcmRoadmapResult = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/qcmForRoadmap/${qcmForRoadmapId}`);
        setQcmRoadmapResult(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error loading QCM roadmap:', error.message);
        setError('Failed to load QCM roadmap data');
      } finally {
        setLoading(false);
      }
    };

    if (qcmForRoadmapId) {
      getQcmRoadmapResult();
    }
  }, [qcmForRoadmapId]);

  const createBadge = async () => {
    try {
      // Check if score exists and is greater than 80
      if (!qcmRoadmapResult || !qcmRoadmapResult.score) {
        setBadgeMessage({
          type: 'error',
          text: 'Score information not available',
        });
        return;
      }

      if (qcmRoadmapResult.score <= 80) {
        setBadgeMessage({
          type: 'error',
          text: 'Score must be greater than 80 to earn this badge',
        });
        return;
      }

      console.log('Sending badge creation request:', { candidateId, qcmForRoadmapId });
      const response = await api.post('/api/create/badge', {
        candidate_id: candidateId,
        qcm_for_roadmap_id: qcmForRoadmapId,
        name: `Badge for Roadmap ${qcmForRoadmapId}`,
        icon: "https://img.icons8.com/pulsar-gradient/48/warranty-card.png",
        description: `Earned by completing the roadmap with ID ${qcmForRoadmapId} with a score of ${qcmRoadmapResult.score}`,
        Date_obtained: new Date().toISOString().split('T')[0],
      });

      setBadgeMessage({
        type: 'success',
        text: response.data.message || 'Badge created successfully!',
      });
    } catch (error) {
      console.error('Badge creation error:', error.response?.data);
      setBadgeMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to create badge',
        errorDetails: error.response?.data?.error || 'No additional error details available',
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Earn Your Badge</h3>
      {loading && <p className="text-gray-500 text-sm">Loading score data...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Your score: {qcmRoadmapResult?.score || 'N/A'}
            {qcmRoadmapResult?.score && qcmRoadmapResult.score > 80 ? (
              <span className="text-green-600 ml-2">Eligible for badge!</span>
            ) : (
              <span className="text-red-600 ml-2">Score must be above 80</span>
            )}
          </p>
          <button
            onClick={createBadge}
            disabled={loading || !qcmRoadmapResult?.score || qcmRoadmapResult.score <= 80}
            className={`font-semibold py-2 px-4 rounded-lg transition-all duration-300 ${
              loading || !qcmRoadmapResult?.score || qcmRoadmapResult.score <= 80
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
            }`}
          >
            Get My Badge
          </button>
        </>
      )}
      {badgeMessage && (
        <div className={`mt-3 p-2 rounded-lg text-sm ${badgeMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p>{badgeMessage.text}</p>
          {badgeMessage.errorDetails && <p className="mt-1 text-xs">Details: {badgeMessage.errorDetails}</p>}
        </div>
      )}
    </div>
  );
};

export default BadgeGenerator;