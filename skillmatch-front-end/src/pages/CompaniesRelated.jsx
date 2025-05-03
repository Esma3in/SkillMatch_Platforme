import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarCandidate from "../components/common/navbarCandidate";
import { api } from "../api/api";

function CompaniesRelated() {
  const [companiesSelectedList, setCompaniesSelectedList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [companiesSkills, setCompaniesSkills] = useState([]);
  const [RoadmapData , setRoadmapData] = useState({})

  const navigate = useNavigate();
  
  const candidate_id = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("candidate_id")) || null;
    } catch (e) {
      console.error("Error parsing candidate_id from localStorage:", e);
      return null;
    }
  })[0];

  useEffect(() => {
    const fetchCompaniesSelected = async () => {
      if (!candidate_id) {
        setError("Candidate ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setErrorDetails(null);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        console.log(`Fetching from: /api/selected/companies/${candidate_id}`);
        
        const response = await api.get(`/api/selected/companies/${candidate_id}`);
        
        clearTimeout(timeoutId);
        
        console.log("API Response:", response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }
        
        // Set the full response data
        setCompaniesSelectedList(response.data);
        setCompanies(response.data); // Use the flat list directly as companies
        
        console.log("Companies data:", response.data);
        
      } catch (error) {
        const errorMessage = "Failed to fetch selected companies. Please try again later.";
        setError(errorMessage);
        setErrorDetails(error.response?.data?.error || error.message);
        console.error("Error fetching selected companies:", error);
      } finally {
        setLoading(false);
      }
    };

    if (candidate_id) {
      fetchCompaniesSelected();
    } else {
      setLoading(false);
      setError("Please log in to view selected companies");
    }
  }, [candidate_id, retryCount]);

  const handleRetry = () => {
    setRetryCount(prevCount => prevCount + 1);
  };
  
  const handleBrowseCompanies = () => {
    navigate(`/candidate/Session/${candidate_id}`);
  };

  const renderCompanyCard = (company) => {
    const formattedDate = company.created_at 
      ? new Date(company.created_at).toLocaleDateString()
      : "Recently selected";
  
    return (
      <div
        key={company.id || `company-${Math.random()}`}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
            <span className="text-lg font-bold text-purple-600">
            <img src={company.companies.logo} alt={company.company_id} />
            </span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-800">
            {company.companies.name || "Unknown"}
            </h4>
            <p className="text-sm text-gray-500">{company.companies.sector || "Sector not available"}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm text-gray-600 flex-grow">
          <p>
            <span className="font-semibold">Selected Date:</span>{" "}
            {formattedDate}
          </p>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            No description available.
          </p>
          <p>
            <span className="font-semibold">Location:</span>{" "}
            Location not specified
          </p>
        </div>
        <div className="mt-6 flex flex-col space-y-3">
          <button 
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"
            onClick={() => generateRoadMap(company.company_id)}


          >
            View Career Roadmap
          </button>
          <button 
            className="bg-white border border-purple-500 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-all"
            onClick={() => navigate(`/candidate/assessment/${company.company_id}`)}
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  };

  const generateRoadMap = async (companyId) => {
    try {

        const responseRoadmapData =await api.get(`/api/roadmap/${companyId}`)
      console.log( responseRoadmapData.data) 
      // console.log(responseRoadmapData.data.prerequisties)
      // console.log(responseRoadmapData.data.tools)
        console.log(responseRoadmapData.data.message)

 
      // First, fetch the skills for the company
      const response = await api.get(`/api/skills/company/${companyId}`);
      const skillsData = response.data;
      
      // Store the skills data in state
      setCompaniesSkills(skillsData);
      
      console.log("Company skills data:", skillsData);
      
      // Based on the JSON format you shared, the skills are directly on the object
      // and not nested under a company object
      // if (!skillsData || !skillsData.skills || skillsData.skills.length === 0) {
      //   console.error("No skills found for this company");
      //   return;
      // }
      
      // Get the first skill ID from the skills array
      const skillId = skillsData[0].skills[0].id;
      
      console.log(`Creating roadmap for company ID: ${companyId}, skill ID: ${skillId}`);
      
      // Create the roadmap
      const responseRoadmap = await api.post(`/api/create-roadmap`, {
        skill_id: skillId,
        candidate_id: candidate_id
      });
      
      console.log("Roadmap created:", responseRoadmap.data);
      
      // Navigate to the roadmap page or handle the roadmap display
      // You might want to uncomment and adjust this based on your routing
      navigate(`/candidate/roadmap/${responseRoadmap.data.data.id}`);
     
    } catch (error) {
      console.error("Error generating roadmap:", error);
      // Handle error appropriately
    }
  };

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Your Chosen Companies
          </h2>
          
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading your selected companies...</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
              <p className="text-red-600 mb-4">{error}</p>
              {errorDetails && (
                <details className="mt-2">
                  <summary className="text-sm text-red-500 cursor-pointer">Show technical details</summary>
                  <pre className="mt-2 p-3 bg-red-50 rounded text-xs text-red-800 overflow-auto">
                    {errorDetails}
                  </pre>
                </details>
              )}
              <button
                onClick={handleRetry}
                className="mt-3 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {!loading && !error && companies.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <p className="text-gray-600 mb-6">No companies selected yet.</p>
              <button 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all"
                onClick={handleBrowseCompanies}
              >
                Browse Companies
              </button>
            </div>
          )}
          
          {!loading && !error && companies.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map(renderCompanyCard)}
            </div>
          )}
        </div>
      </div>
      
      {!loading && !error && companies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            Your Progress
          </h3>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">
                Application Status
              </h4>
              <span className="text-sm text-purple-600 font-medium">
                In Progress
              </span>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-100">
                    60% Complete
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: "60%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Complete assessments and interviews to move forward in the application process.
            </p>
            <div className="mt-4">
              <h5 className="text-sm font-semibold text-gray-700">
                Next Steps:
              </h5>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                <li>Complete the technical assessment</li>
                <li>Schedule an interview</li>
                <li>Review company culture fit</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            Tips for Success
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Prepare for Assessments
              </h4>
              <p className="text-sm text-gray-600">
                Review common technical questions and practice coding challenges
                to excel in your assessments.
              </p>
              <a
                href="#"
                className="text-purple-600 text-sm font-medium hover:underline mt-3 inline-block"
              >
                Learn More
              </a>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Build Your Profile
              </h4>
              <p className="text-sm text-gray-600">
                Complete your SkillMatch profile to attract more employers and
                showcase your skills.
              </p>
              <a
                href="#"
                className="text-purple-600 text-sm font-medium hover:underline mt-3 inline-block"
              >
                Update Profile
              </a>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Research Companies
              </h4>
              <p className="text-sm text-gray-600">
                Learn about company culture, values, and recent projects to
                tailor your applications.
              </p>
              <a
                href="#"
                className="text-purple-600 text-sm font-medium hover:underline mt-3 inline-block"
              >
                Explore Resources
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompaniesRelated;