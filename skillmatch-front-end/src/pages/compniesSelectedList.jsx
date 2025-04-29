import { useState } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";

function CompaniesRelated() {
  const [company, setCompany] = useState({
    name: "Example Corp",
    sector: "Technology",
    selected_Date: "2025-03-15",
    description: "Innovative tech solutions for a sustainable future.",
    location: "San Francisco, CA",
    website: "https://example.com",
  });


  const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));
  console.log(candidate_id);

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">
            Your Chosen Companies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col justify-between">
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">
                  {company.name}
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-semibold">Sector:</span> {company.sector}
                  </p>
                  <p>
                    <span className="font-semibold">Selected Date:</span> {company.selected_Date}
                  </p>
                  <p className="line-clamp-3">
                    <span className="font-semibold">Description:</span> {company.description}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span> {company.location}
                  </p>
                  <p>
                    <span className="font-semibold">Website:</span>{" "}
                    <a
                      href={company.website}
                      className="text-purple-600 hover:underline break-words"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col space-y-3">
                <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all">
                  Get RoadMap
                </button>
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all">
                  Resolve the Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompaniesRelated;
