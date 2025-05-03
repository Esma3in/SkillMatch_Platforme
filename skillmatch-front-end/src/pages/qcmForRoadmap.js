import React, { useState, useEffect } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { api } from "../api/api";
import { useParams } from "react-router-dom";

const QcmForRoadmap = () => {
  const { id } = useParams();
  const [qcmData, setQcmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQcmData = async () => {
      try {
        const response = await api.get(`/api/qcm/roadmap/${id}`);
        setQcmData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching quiz data");
        setLoading(false);
      }
    };
    fetchQcmData();
  }, [id]);

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Quiz for Roadmap</h1>

          {/* Loading and Error States */}
          {loading && (
            <p className="text-sm text-gray-600">Loading quiz data...</p>
          )}
          {error && (
            <p className="text-sm text-red-600">Error: {error}</p>
          )}

          {/* Quiz Content */}
          {!loading && !error && qcmData.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Questions</h2>
              {qcmData.map((question, index) => (
                <div key={question.id} className="mb-6">
                  <p className="text-sm font-medium text-gray-800">
                    {index + 1}. {question.question_text || "No question text"}
                  </p>
                  <ul className="mt-2 space-y-2">
                    {question.options && question.options.map((option, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          className="mr-2"
                        />
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-6 flex justify-end">
                <button className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700">
                  Submit Quiz
                </button>
              </div>
            </div>
          ) : (
            !loading && !error && (
              <p className="text-sm text-gray-600">No quiz questions available for this roadmap.</p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default QcmForRoadmap;