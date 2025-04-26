import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

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
        // Get the challenge details first
        const challengeResponse = await axios.get(`http://localhost:8000/api/challenges/${challengeId}`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        setChallenge(challengeResponse.data);
        
        // Then get all problems associated with this challenge
        const problemsResponse = await axios.get(`http://localhost:8000/api/challenges/${challengeId}/problems`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        setProblems(problemsResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch challenge details and problems');
        setLoading(false);
        console.error('Error fetching challenge data:', err);
      }
    };

    fetchChallengeAndProblems();
  }, [challengeId]);

  const getLevelStyles = (level) => {
    const levels = {
      easy: 'bg-green-200 text-green-800',
      beginner: 'bg-green-200 text-green-800',
      medium: 'bg-yellow-200 text-yellow-800',
      intermediate: 'bg-yellow-200 text-yellow-800',
      hard: 'bg-red-200 text-red-800',
      advanced: 'bg-red-200 text-red-800',
      expert: 'bg-purple-200 text-purple-800'
    };
    return levels[level?.toLowerCase()] || 'bg-gray-200 text-gray-800';
  };

  const getLevelBadges = (level) => {
    const badges = [];
    
    if (level === 'intermediate' || level === 'advanced') {
      badges.push(
        <span key="intermediate" className="inline-block px-2 py-1 rounded bg-yellow-200 text-yellow-800 text-xs mr-1">
          Intermediate
        </span>
      );
    }
    
    if (level === 'advanced') {
      badges.push(
        <span key="advanced" className="inline-block px-2 py-1 rounded bg-red-200 text-red-800 text-xs">
          Advanced
        </span>
      );
    }
    
    if (level === 'beginner') {
      badges.push(
        <span key="beginner" className="inline-block px-2 py-1 rounded bg-green-200 text-green-800 text-xs">
          Beginner
        </span>
      );
    }
    
    return badges.length ? badges : level;
  };

  if (loading) return <div className="text-center py-8">Loading challenge problems...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      {challenge && (
        <div className="border-b border-dotted border-blue-300 pb-4 mb-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="text-gray-600">Challenge:</div>
            <div className="font-semibold text-blue-600">{challenge.name}</div>
            <div className="text-gray-600 ml-6">Skill:</div>
            <div className="font-semibold text-blue-600">{challenge.skill?.name || 'N/A'}</div>
            <div className="text-gray-600 ml-6">Level:</div>
            <div className="font-semibold text-blue-600">{challenge.level ? challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1) : 'N/A'}</div>
          </div>
        </div>
      )}

      {problems.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="border-b border-dotted border-blue-300">
                <th className="px-4 py-2 text-left text-gray-600">description</th>
                <th className="px-4 py-2 text-left text-gray-600">skill</th>
                <th className="px-4 py-2 text-left text-gray-600">level</th>
                <th className="px-4 py-2 text-center text-gray-600">number users resolved</th>
                <th className="px-4 py-2 text-center text-gray-600">action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id} className="border-b border-dotted border-blue-200">
                  <td className="px-4 py-3 text-left">
                    <div className="font-semibold mb-1">{problem.name}</div>
                    <div className="text-sm text-gray-600">
                      {problem.description && problem.description.length > 50
                        ? `${problem.description.slice(0, 50)}...`
                        : problem.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-left">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                      {problem.skill?.name || 'JavaScript'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className={`px-2 py-1 rounded text-xs ${getLevelStyles(problem.level)}`}>
                      {problem.level
                        ? problem.level.charAt(0).toUpperCase() + problem.level.slice(1)
                        : 'N/A'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {problem.candidates_count || Math.floor(Math.random() * 10000)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
                    >
                      resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No problems found for this challenge
        </div>
      )}
      
      <div className="mt-6">
        <Link to="/challenges" className="text-indigo-600 hover:text-indigo-800">
          ← Back to Challenges
        </Link>
      </div>
    </div>
  );
};

export default SeriesChallenge;