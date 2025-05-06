import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import NavbarCandidate from '../components/common/navbarCandidate';
import { api } from '../api/api';

const TestsList = () => {
  const { companyId } = useParams()
  const [Tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTests, setTotalTests] = useState(0);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const response = await api.get(`api/candidate/company/${companyId}/tests?page=${currentPage}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        setTests(response.data.data);
        setLastPage(response.data.last_page); // total pages
        setTotalTests(response.data.total); // ← total Tests
        setLoading(false);

      } catch (err) {
        setError(err.response.data);
        setLoading(false);
        console.error('Error fetching tests:', err);
      }
    };

    fetchTests();
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

  if (loading) return <div className="text-center py-8">Loading Tests...</div>;
  if (error) return <div className="text-center py-4 px-6 mx-auto mt-4 max-w-md rounded-xl bg-red-100 text-red-700 shadow-md border border-red-300">
  {error}
</div>
;

  return (
    <>
      <NavbarCandidate />
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 p-4">
          <div className="w-16 h-16 overflow-hidden rounded-full border border-gray-200">
            <img
              src={`${Tests[0].company.logo}`}
              alt="Company Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div >
            <p className="text-lg font-medium text-gray-800">
              {Tests[0].company.name}
            </p>
            <p className="text-lg font-medium text-gray-800">
              <span className="text-m font-medium text-gray-500">sector:</span> {Tests[0].company.sector}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Tests</h1>
            <span className="text-sm text-gray-600">{totalTests} total Tests</span>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-gray-600 text-sm border-b">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Objective</th>
                <th className="py-3 px-6 text-left">Skill</th>
                <th className="py-3 px-6 text-left">Level</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {Tests.length > 0 ? (
                Tests.map((test) => (
                  <tr key={test.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      {test?.skill?.name?.length > 30 ? `${test.skill?.name.substring(0, 30)}...` : 'Test In ' + test?.skill?.name}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {test.objective?.length > 50 ? `${test.objective.substring(0, 50)}...` : test.objective}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        {test.skill?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${getLevelStyles(test.skill?.level)}`}>
                        {test.skill?.level?.charAt(0).toUpperCase() + test?.skill?.level?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => window.location.href = `/candidate/Test/${test.id}`}
                        className="bg-indigo-600 text-white px-4 py-1 text-xs rounded hover:bg-indigo-700"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => window.location.href = `/candidate/test/${test.id}/result`}
                        className="bg-indigo-600 text-white px-4 py-1 text-xs rounded hover:bg-indigo-700"
                      >
                        Result
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">No Tests found</td>
                </tr>
              )}
            </tbody>
          </table>

          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default TestsList;
