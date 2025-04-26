import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProblemsList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/problems?page=${currentPage}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        setProblems(response.data.data); 
        setLastPage(response.data.last_page); // total pages
        setTotalProblems(response.data.total); // ← total problems
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch problems');
        setLoading(false);
        console.error('Error fetching problems:', err);
      }
    };

    fetchProblems();
  }, [currentPage]);

  const getLevelStyles = (level) => {
    const levels = {
      easy: 'bg-green-200 text-green-800',
      meduim: 'bg-yellow-200 text-yellow-800',
      hard: 'bg-red-200 text-red-800',
      expert: 'bg-purple-200 text-purple-800'
    };
    return levels[level] || 'bg-gray-200 text-gray-800';
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
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

  if (loading) return <div className="text-center py-8">Loading problems...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Problems</h1>
          <span className="text-sm text-gray-600">{totalProblems} total problems</span>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-gray-600 text-sm border-b">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Skill</th>
              <th className="py-3 px-6 text-left">Level</th>
              <th className="py-3 px-6 text-left">Users</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {problems.length > 0 ? (
              problems.map((problem) => (
                <tr key={problem.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {problem.name?.length > 30 ? `${problem.name.substring(0, 30)}...` : problem.name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {problem.description?.length > 50 ? `${problem.description.substring(0, 50)}...` : problem.description}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      {problem.skill?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${getLevelStyles(problem.level)}`}>
                      {problem.level?.charAt(0).toUpperCase() + problem.level?.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {problem.candidates && problem.candidates.map((candidate) => (
                      <span key={candidate.id} className="block text-xs">{candidate.name}</span>
                    ))}
                  </td>
                  <td className="py-3 px-6 text-center">
                  <button 
                    onClick={() => window.location.href = `/serie-problems/${problem.skill?.name}`}
                    className="bg-indigo-600 text-white px-4 py-1 text-xs rounded hover:bg-indigo-700"
                    >
                    resolve
                </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">No problems found</td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination()}
      </div>
    </div>
  );
};

export default ProblemsList;
