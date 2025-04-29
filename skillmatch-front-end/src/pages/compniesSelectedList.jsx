import { useState } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { useNavigate } from "react-router";

function CompaniesRelated() {
  const [company, setCompany] = useState({
    name: "Example Corp",
    sector: "Technology",
    selected_Date: "2025-03-15",
    description: "Innovative tech solutions for a sustainable future.",
    location: "San Francisco, CA",
    website: "https://example.com",
    employees: "500-1000",
    founded: "2010",
    mission: "To empower global innovation through cutting-edge technology.",
  });

  const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));
  console.log(candidate_id);

  const navigate = useNavigate();

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Your Career Opportunities
            </h1>
            <p className="text-lg md:text-xl max-w-3xl">
              Discover companies that match your skills and aspirations. Follow
              your roadmap, complete assessments, and take the next step in your
              career journey.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome, Candidate!
            </h2>
            <p className="mt-2 text-gray-600 max-w-3xl">
              This is your personalized dashboard to explore companies, track your
              progress, and prepare for your dream role. Start by reviewing the
              companies you’ve selected or explore new opportunities below.
            </p>
          </div>

          {/* Company Card */}
          <div className="mb-16">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
              Your Chosen Companies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <img
                    src="https://via.placeholder.com/48"
                    alt={`${company.name} logo`}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">
                      {company.name}
                    </h4>
                    <p className="text-sm text-gray-500">{company.sector}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-600 flex-grow">
                  <p>
                    <span className="font-semibold">Mission:</span>{" "}
                    {company.mission}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span>{" "}
                    {company.description}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span>{" "}
                    {company.location}
                  </p>
                  <p>
                    <span className="font-semibold">Employees:</span>{" "}
                    {company.employees}
                  </p>
                  <p>
                    <span className="font-semibold">Founded:</span>{" "}
                    {company.founded}
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
                  <p>
                    <span className="font-semibold">Selected Date:</span>{" "}
                    {company.selected_Date}
                  </p>
                </div>
                <div className="mt-6 flex flex-col space-y-3">
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"onClick={()=>{navigate('/roadmap')}}>
                    View Career Roadmap
                  </button>
                  <button className="bg-white border border-purple-500 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-all">
                    Take Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="mb-16">
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
                Complete theFusce dapibus, lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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

          {/* Tips and Resources */}
          <div>
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
        </div>
      </div>
    </>
  );
}

export default CompaniesRelated;