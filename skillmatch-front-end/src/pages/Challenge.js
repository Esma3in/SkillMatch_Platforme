import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalChallenges, setTotalChallenges] = useState(0);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/challenges?page=${currentPage}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        setChallenges(response.data.data);
        setLastPage(response.data.last_page);
        setTotalChallenges(response.data.total);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch challenges');
        setLoading(false);
        console.error('Error fetching challenges:', err);
      }
    };

    fetchChallenges();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };
  const getLevelStyles = (level) => {
    const levels = {
      easy: 'bg-green-200 text-green-800',
      medium: 'bg-yellow-200 text-yellow-800', 
      hard: 'bg-red-200 text-red-800',
      expert: 'bg-purple-200 text-purple-800'
    };
    return levels[level] || 'bg-gray-200 text-gray-800';
  };
  

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-wrap items-center mt-4 gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
        >
          Previous
        </button>

        {pages.map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'border text-gray-600 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) return <div className="text-center py-8">Loading challenges...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Challenges List</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Skill</th>
              <th className="px-6 py-3 text-left">Level</th>
              <th className="px-6 py-3 text-center">Number Users Resolved</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {challenges.length > 0 ? (
              challenges.map((challenge) => (
                <tr key={challenge.id} className="border-t hover:bg-gray-50 text-center">
                  <td className="px-6 py-4 text-left">{challenge.name}</td>
                  <td className="px-6 py-4 text-left">
                    {challenge.description.length > 50
                      ? `${challenge.description.slice(0, 50)}...`
                      : challenge.description}
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs">
                      {challenge.skill?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-left">
                    <span className={`px-2 py-1 rounded text-xs ${getLevelStyles(challenge.level)}`}>
                        {challenge.level
                        ? challenge.level.charAt(0).toUpperCase() + challenge.level.slice(1)
                        : 'N/A'}
                    </span>
                 </td>
                  <td className="px-6 py-4">{challenge.candidates_count}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/serie-challenges/${challenge.id}`}
                      className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-xs"
                    >
                      Start
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No challenges available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Challenge;
