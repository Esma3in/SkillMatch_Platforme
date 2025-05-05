import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import CompanyCard from '../../layouts/companyCard';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filter, setFilter] = useState('all'); // For sector filtering

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`/api/candidate/companies/all?page=${page}`);
      setCompanies(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setLoading(false);
      if (response.data.data.length === 0) {
        setMessage('No companies found.');
      } else {
        setMessage('');
      }
    } catch (err) {
      setLoading(false);
      setMessage('Failed to load companies.');
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  // Get unique sectors for filtering
  const sectors = [...new Set(companies.map(company => company.sector))];
  const filteredCompanies = filter === 'all' ? companies : companies.filter(company => company.sector === filter);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  // Generate array of page numbers to display (e.g., 1, 2, 3, ..., lastPage)
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(lastPage, startPage + maxPagesToShow - 1);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Introductory Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Companies</h1>
        <p className="mt-2 text-gray-600 text-sm">
          Browse through all available companies on our platform. Filter by sector to find opportunities that match your interests and skills.
        </p>
      </div>

      {/* Filter Section (Small Buttons) */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Sectors
        </button>
        {sectors.map((sector, i) => (
          <button
            key={i}
            onClick={() => setFilter(sector)}
            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === sector ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* Companies Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && (
          <div className="col-span-full text-center py-4">
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        )}
        {message && !loading && (
          <div className="col-span-full text-center py-4">
            <p className="text-red-600 text-sm">{message}</p>
          </div>
        )}
        {!loading &&
          filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              id={company.id}
              name={company.name}
              profile={company.profile}
              skills={company.skills}
              sector={company.sector}
              logo={company.logo}
            />
          ))}
      </div>

      {/* Enhanced Pagination Controls */}
      {!loading && lastPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {startPage > 1 && (
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              1
            </button>
          )}
          {startPage > 2 && <span className="px-3 py-1 text-gray-500">...</span>}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
          {endPage < lastPage - 1 && <span className="px-3 py-1 text-gray-500">...</span>}
          {endPage < lastPage && (
            <button
              onClick={() => handlePageChange(lastPage)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              {lastPage}
            </button>
          )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === lastPage}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}