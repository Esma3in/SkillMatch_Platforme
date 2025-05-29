import { useEffect, useState } from 'react';
import { api } from '../../api/api';
import CompnayCard from '../../layouts/companyCard';
import { BsStars } from "react-icons/bs";

export default function SuggestedCompanies() {
  const candidate_id = JSON.parse(localStorage.getItem('candidate_id'));
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all'); // For sector filtering

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/candidate/suggestedcompanies/${candidate_id}`);
        setLoading(false);
        if (response.data && response.data.length > 0) {
          setCompanies(response.data);
          console.log("companies suggested ", response.data);
        } else {
          setMessage('This candidate has no companies matched.');
        }
      } catch (err) {
        setLoading(false);
        setMessage(err.message);
      }
    };

    fetchData();
  }, [candidate_id]);

  // Get unique sectors for filtering
  const sectors = [...new Set(companies.map(company => company.sector))];
  const filteredCompanies = filter === 'all' ? companies : companies.filter(company => company.sector === filter);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Introductory Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          Our Recommendations <BsStars className="text-yellow-500" />
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          These companies are tailored for you based on your skills, experience, and preferences. Explore opportunities that align with your career goals.
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Sectors
          </button>
          {sectors.map((sector, i) => (
            <button
              key={i}
              onClick={() => setFilter(sector)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === sector ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          View All
        </button>
      </div>

      {/* Recommendation Highlights */}
      {filteredCompanies.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Why These Companies?</h2>
          <p className="mt-1 text-sm text-gray-600">
            {filteredCompanies[0]?.skills?.length > 0
              ? `Top Match: High skill overlap with ${filteredCompanies[0].name} (${filteredCompanies[0].skills.length} matching skills).`
              : `Top Match: ${filteredCompanies[0].name} aligns with your sector (${filteredCompanies[0].sector}).`}
          </p>
        </div>
      )}

      {/* Companies Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && (
          <div className="col-span-full text-center py-4">
            <p className="text-gray-600 text-sm">Loading...</p>
          </div>
        )}
        {message && !loading && (
          <div className="col-span-full text-center py-4">
            <p className="text-gray-700 text-sm">{message}</p>
          </div>
        )}
        {!loading &&
          filteredCompanies.map((company, i) => (
            <CompnayCard
              key={i}
              name={company.name}
              sector={company.sector}
              image={company.logo}
              profile={company.profile}
              skills={company.skills}
            />
          ))}
      </div>
    </div>
  );
}