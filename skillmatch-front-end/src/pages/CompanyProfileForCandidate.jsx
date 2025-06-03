import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/api";
import NavbarCandidate from "../components/common/navbarCandidate";
import { PlusIcon, MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/solid";

export default function CompanyProfileForCandidate() {
  const candidate_id = JSON.parse(localStorage.getItem("candidate_id"));
  const [companyInfoFetched, setCompanyInfo] = useState({});
  const [candidateInfo, setCandidateInfo] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({ fetchError: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/candidate/company/${id}/profile`);
        const response1 = await api.get(`/api/candidate/${candidate_id}`);
        // Handle single object or array with one object
        const companyData = Array.isArray(response.data) ? response.data[0] : response.data;
        setCompanyInfo(companyData);
        setCandidateInfo(response1.data);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setErrors((prev) => ({ ...prev, fetchError: err.message }));
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [candidate_id, id]);

  useEffect(() => {
    const createSelectedCompany = async () => {
      try {
        if (!companyInfoFetched || !companyInfoFetched.company_name) {
          return;
        }
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to create selected company");
        console.error("Error creating selected company:", err);
      }
    };

    if (id && candidate_id && companyInfoFetched && companyInfoFetched.company_name) {
      createSelectedCompany();
    }
  }, [id, candidate_id, companyInfoFetched]);

  const companyInfo = {
    name: companyInfoFetched?.company_name || "N/A",
    logo: companyInfoFetched?.logo || "https://via.placeholder.com/100",
    bio: companyInfoFetched?.bio || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus, el.",
    address: companyInfoFetched?.address || "N/A",
    sector: companyInfoFetched?.sector || "N/A",
    phone: companyInfoFetched?.phone || "N/A",
  };

  const Style = [
    { bgColor: "bg-indigo-100", textColor: "text-indigo-600" },
    { bgColor: "bg-violet-100", textColor: "text-violet-600" },
    { bgColor: "bg-gray-100", textColor: "text-gray-600" },
  ];

  const techTags = (companyInfoFetched?.skills || []).map((skill) => {
    const nb = Math.floor(Math.random() * Style.length);
    return {
      name: skill,
      bgColor: Style[nb].bgColor,
      textColor: Style[nb].textColor,
    };
  });

  const handleSelectCompany = async () => {
    try {
      setLoading(true);
      setMessage("Processing your selection...");
      await api.post(`/api/selected/company/${id}`, {
        candidate_id: candidate_id,
        company_id: id,
        name: companyInfoFetched?.company_name || "Unknown Company",
      });
      navigate("/companies/related");
    } catch (error) {
      console.error("Error selecting company:", error);
      setError("Failed to select company. Please try again.");
      setMessage("An error occurred while processing your selection.");
      setLoading(false);
    }
  };

  const companyVision = `Subject: Join our team and help shape the future with us
Hello ${candidateInfo?.name || "Candidate"},
At ${companyInfo?.name}, we believe that the future is built by passionate, curious, and bold minds. When we came across your profile on SkillMatch, we were genuinely impressed by your journey, your projects, and most of all, your ability to actively learn and innovate.

We are currently looking for a collaborator capable of contributing to ${companyInfo?.sector}, and we believe your profile aligns perfectly with this vision. Your approach to ${
    companyInfoFetched?.skills?.[0] || "your skills"
  }, along with your drive to grow, is exactly what we value.

What We Offer:
- A stimulating environment where every idea matters
- A clear roadmap to grow your skills, with hands-on projects at each stage
- Personalized and supportive mentoring
- Opportunities for growth if you wish to continue the journey with us

Your potential deserves to be supported and nurtured. With us, you won't be just another intern — you'll be a full member of the team, able to learn, contribute, and make an impact.

We would be thrilled to connect with you and share more about how this collaboration could benefit you.

Looking forward to speaking with you,
Team Lead
Team Lead at ${companyInfo?.name}
${companyInfo?.phone || "N/A"}`;

  const testInfo = {
    title: "Our Tests",
    description: `Objective: At ${companyInfo?.name}, we believe that technical skills go beyond a CV. That's why we offer a series of short problem-solving tests to help us discover how you think, analyze, and approach real-world challenges.

These exercises aren't just about finding the right answer — they're about creativity, logic, and clarity. Whether you're solving an algorithmic puzzle or optimizing a simple function, we value the way you think through problems and communicate your solutions.

Each test is designed to be:
- Short and focused (15–45 minutes)
- Language-flexible English
- Centered on real challenges from our team's daily work

We encourage you to explore them when you're ready — take your time and have fun!`,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavbarCandidate />
      {(message || error) && (
        <div
          className={`fixed top-16 left-0 right-0 mx-auto max-w-4xl p-4 rounded-lg shadow-md z-50 ${
            error ? "bg-red-50 text-red-800 border-red-200" : "bg-indigo-50 text-indigo-800 border-indigo-200"
          }`}
        >
          <span>{error || message}</span>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Company Header */}
          <div className="bg-white rounded-2xl shadow-md p-8 mb-8 flex items-center space-x-6">
            <img
              className="w-20 h-20 object-cover rounded-full border-2 border-indigo-200"
              src={companyInfo.logo}
              alt={companyInfo.name}
              aria-label={`${companyInfo.name} logo`}
            />
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">{companyInfo.name}</h1>
              <p className="text-base text-gray-600 mt-1">{companyInfo.sector}</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="w-full lg:w-2/3 space-y-8">
              {/* Tech Tags */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-bold text-indigo-600 mb-4">Skills & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {techTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`${tag.bgColor} ${tag.textColor} text-sm font-medium rounded-full px-3 py-1.5 hover:bg-opacity-80 transition-colors duration-300`}
                      aria-label={`Skill: ${tag.name}`}
                    >
                      {tag.name}
                    </span>
                  ))}
                  <div className="flex w-8 h-8 items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-300">
                    <PlusIcon className="w-4 h-4 text-gray-600" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* General Info */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-bold text-indigo-600 mb-4">About the Company</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
                    <p className="text-base text-gray-600">{companyInfo.bio}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <MapPinIcon className="w-5 h-5 text-violet-500 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Address</h3>
                        <p className="text-base text-gray-600">{companyInfo.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BriefcaseIcon className="w-5 h-5 text-violet-500 mt-1" aria-hidden="true" />
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Sector</h3>
                        <p className="text-base text-gray-600">{companyInfo.sector}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">Phone</h3>
                        <p className="text-base text-gray-600">{companyInfo.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tests Info */}
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-bold text-indigo-600 mb-4">{testInfo.title}</h2>
                <div className="text-base text-gray-600 space-y-4">
                  {testInfo.description.split("\n\n").map((paragraph, index) => (
                    <p key={index}>
                      {paragraph.split("\n").map((line, i) => (
                        <span key={i} className={line.startsWith("-") ? "block ml-4" : ""}>
                          {line.startsWith("-") ? `• ${line.slice(2)}` : line}
                          {i < paragraph.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Company Vision */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-bold text-indigo-600 mb-4">Why Join Us?</h2>
                <div className="text-base text-gray-600 space-y-4">
                  <p className="font-semibold">{companyVision.split("\n")[0]}</p>
                  {companyVision.split("\n").slice(1, 4).map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                  <p className="font-semibold">What We Offer:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {companyVision.split("\n").slice(5, 9).map((line, index) => (
                      <li key={index}>{line.replace("- ", "")}</li>
                    ))}
                  </ul>
                  {companyVision.split("\n").slice(10, 13).map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                  <p className="italic">{companyVision.split("\n")[14]}</p>
                  <p className="font-semibold">{companyVision.split("\n")[15]}</p>
                  <p>{companyVision.split("\n")[16]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/candidate/Session/${candidate_id}`)}
              className="flex-1 py-3 bg-gray-100 text-indigo-600 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300"
              aria-label="Cancel and return to session"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectCompany}
              className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300"
              disabled={loading}
              aria-label="Select this company"
            >
              {loading ? "Processing..." : "Select Company"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}