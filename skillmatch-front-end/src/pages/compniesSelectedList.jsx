import { useState, useEffect } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import axios from "axios"; // Assuming you're using axios for API calls
import { api } from "../api/api";

function CompaniesRelated() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const candidate_id = JSON.parse(localStorage.getItem("candidate_id")) || null;

  useEffect(() => {
    const fetchCompaniesSelected = async () => {
      if (!candidate_id) {
        setError("Candidate ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/selected/companies/${candidate_id}`);
        setCompanies(response.data); // Assuming response.data is an array of companies
        setError(null);
      } catch (error) {
        setError("Failed to fetch selected companies. Please try again later.");
        console.error("Error fetching selected companies:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompaniesSelected();
  }, [candidate_id]);

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Your Chosen Companies
          </h2>
          {loading && <p className="text-gray-600">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && companies.length === 0 && (
            <p className="text-gray-600">No companies selected yet.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="https://via.placeholder.com/48"
                    alt={`${company.company_name} logo`}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {company.company_name}
                    </h4>
                    <p className="text-sm text-gray-500">{company.sector || "Technology"}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-600 flex-grow">
                  <p>
                    <span className="font-semibold">Selected Date:</span>{" "}
                    {company.selected_date}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {company.description || "Innovative solutions for a sustainable future."}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {company.location || "San Francisco, CA"}
                  </p>
                  <p>
                    <span className="font-semibold">Website:</span>{" "}
                    <a
                      href={company.website || "https://example.com"}
                      className="text-purple-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website || "https://example.com"}
                    </a>
                  </p>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all">
                    View Career Roadmap
                  </button>
                  <button className="bg-white border border-purple-500 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-all">
                    Take Assessment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default CompaniesRelated;