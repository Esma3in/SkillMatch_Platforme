import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const SerieChallenges = () => {
  const { skill } = useParams(); // récupère le paramètre de l'URL
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        // Make sure the URL format matches what your Laravel backend expects
        // If your skill parameter contains spaces or special characters, it should be encoded
        const encodedSkill = encodeURIComponent(skill);
        const response = await axios.get(`http://localhost:8000/api/serie-challenges/${encodedSkill}`, {
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        setChallenges(response.data);
      } catch (err) {
        console.error('Error details:', err);
        // More detailed error message for debugging
        setError(`Error loading challenges: ${err.response?.status || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    if (skill) {
      fetchChallenges();
    }
  }, [skill]);

  const getLevelStyles = (level) => {
    if (!level) return 'bg-gray-200 text-gray-800';
    
    const styles = {
      easy: 'bg-green-200 text-green-800',
      meduim: 'bg-yellow-200 text-yellow-800', // Note: keeping original spelling
      medium: 'bg-yellow-200 text-yellow-800',
      hard: 'bg-red-200 text-red-800',
      expert: 'bg-purple-200 text-purple-800'
    };
    return styles[level.toLowerCase()] || 'bg-gray-200 text-gray-800';
  };

  if (loading) return <div className="text-center py-8">Loading challenges for {skill}...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">
            Challenges for: <span className="text-indigo-600">{skill}</span>
            <span className="text-sm text-indigo-600 ml-2">{challenges.length} problem</span>
          </h1>
          <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600">← Back to list</Link>
        </div>
        
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Level</th>
              <th className="py-3 px-6 text-left">Skill</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {challenges.length > 0 ? (
              challenges.map(challenge => (
                <tr key={challenge.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{challenge.name}</td>
                  <td className="py-3 px-6">{challenge.description?.substring(0, 50)}...</td>
                  <td className="py-3 px-6">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getLevelStyles(challenge.level)}`}>
                      {challenge.level?.charAt(0).toUpperCase() + challenge.level?.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      {challenge.skill?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button 
                      onClick={() => window.location.href = `/challenges/${challenge.id}`}
                      className="bg-indigo-600 text-white px-4 py-1 text-xs rounded hover:bg-indigo-700"
                    >
                      resolve
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="py-6 text-center">No challenges found for this skill</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SerieChallenges;