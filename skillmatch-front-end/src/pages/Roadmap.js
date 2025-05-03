import React, { useState, useEffect, useMemo } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { api } from "../api/api";
import { useParams } from 'react-router';

export const Roadmap = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState("1");

  // Data for roadmap steps
  const roadmapSteps = [
    { id: 1, name: "Prerequisites" },
    { id: 2, name: "Courses" },
    { id: 3, name: "Improve Skills" },
    { id: 4, name: "Quiz" },
    { id: 5, name: "Badge" },
  ];

  // State for dynamic data
  const [data, setData] = useState({
    skills: [],
    prerequisites: [],
    tools: [],
    candidateCourses: [],
    roadmapSkills: [],
  });
  const { id } = useParams();
  const [competitors, setCompetitors] = useState([]);
  const [companySelected, setCompanySelected] = useState({ name: "Unknown Company" });
  const [skillsCompanySelected, setSkillsCompanySelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const candidateId = JSON.parse(localStorage.getItem('candidate_id'));

  // Utility function to remove duplicates based on specified criteria
  const removeDuplicates = (array, criteria) => {
    const seen = new Set();
    return array.filter(item => {
      // Handle single property or multiple properties as criteria
      const value = typeof criteria === 'string'
        ? item[criteria]
        : criteria.map(key => item[key]).join('|');
      
      // Skip if value is undefined or null
      if (value === undefined || value === null) return false;
      
      // Convert to lowercase for case-insensitive comparison if value is a string
      const dedupeKey = typeof value === 'string' ? value.toLowerCase() : value;
      
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    });
  };

  // Fetch company skills and roadmap data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/roadmap/${id}`);
        const uniqueData = {
          skills: removeDuplicates(response.data.skills || [], 'id'),
          prerequisites: removeDuplicates(response.data.prerequisites || [], 'id'),
          tools: removeDuplicates(response.data.tools || [], 'name'), // Deduplicate tools by name
          candidateCourses: removeDuplicates(response.data.candidateCourses || [], 'id'),
          roadmapSkills: removeDuplicates(response.data.roadmapSkills || [], 'text'), // Deduplicate roadmapSkills by text
        };
        setData(uniqueData);
        setCompanySelected(response.data.company || { name: "Unknown Company" });
        setSkillsCompanySelected(removeDuplicates(response.data.skills || [], 'id'));
        setCompetitors(removeDuplicates(response.data.competitors || [], 'id'));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Memoized filtered data for performance
  const filteredTools = useMemo(() => data.tools, [data.tools]);
  const filteredPrerequisites = useMemo(() => data.prerequisites, [data.prerequisites]);
  const filteredCourses = useMemo(() => data.candidateCourses, [data.candidateCourses]);
  const filteredRoadmapSkills = useMemo(() => data.roadmapSkills, [data.roadmapSkills]);
  const filteredSkillsCompanySelected = useMemo(() => skillsCompanySelected, [skillsCompanySelected]);
  const filteredCompetitors = useMemo(() => competitors, [competitors]);

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Your Roadmap</h1>
            <p className="mt-2 text-sm text-white">
              Chosen Company: <span className="font-semibold">{companySelected.name || "Unknown Company"}</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
          {/* Roadmap Content */}
          <div className="flex-1">
            {/* Loading and Error States */}
            {loading && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <p className="text-sm text-gray-600">Loading roadmap data...</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 rounded-xl shadow-md p-6 mb-6">
                <p className="text-sm text-red-600">Error: {error}</p>
              </div>
            )}

            {/* How to Follow the Roadmap Section */}
            {!loading && !error && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How to Follow Your Roadmap
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This roadmap is designed to prepare you for a role at {companySelected.name || "your chosen company"} by
                  building key skills in {filteredSkillsCompanySelected.length > 0 ? filteredSkillsCompanySelected.map(skill => skill.name).join(", ") : "various areas"}.
                  Follow these steps to succeed:
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Prerequisites:</strong> Set up your development
                      environment using the tools listed below. Ensure you have basic
                      programming knowledge.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Courses:</strong> Enroll in recommended courses to build
                      foundational skills. Complete all modules and practice exercises.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Improve Skills:</strong> Master the listed competences
                      through hands-on projects and practice. Mark each skill as done
                      when confident.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Quiz:</strong> Test your knowledge with the quiz.
                      Review materials if needed, then take the quiz to demonstrate
                      your skills.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2 mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      <strong>Badge:</strong> Earn a badge by passing the quiz.
                      Display it on your profile to impress employers like {companySelected.name || "your chosen company"}.
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* Badge Information Section */}
            {!loading && !error && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About Your Badge
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Badges are digital credentials that showcase your skills to
                  employers. Here’s what you need to know:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/pulsar-gradient/48/warranty-card.png"
                      alt="warranty-card"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        What is a Badge?
                      </h4>
                      <p className="text-xs text-gray-600">
                        A badge certifies your mastery of skills required for {companySelected.name || "company"} roles.
                        It’s shareable on your SkillMatch profile and LinkedIn.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/pulsar-gradient/48/positive-dynamic.png"
                      alt="benefits"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        Benefits
                      </h4>
                      <p className="text-xs text-gray-600">
                        Stand out to recruiters, boost your profile visibility, and
                        increase your chances of landing an interview.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <img
                      width="48"
                      height="48"
                      src="https://img.icons8.com/pulsar-gradient/48/how-quest.png"
                      alt="how-quest"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">
                        How to Earn
                      </h4>
                      <p className="text-xs text-gray-600">
                        Complete all roadmap steps and pass the quiz with a score of
                        80% or higher to earn your badge.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            {!loading && !error && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Roadmap Steps
                  </h2>
                  <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex gap-4 border-b border-gray-200">
                  {roadmapSteps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveTab(step.id.toString())}
                      className={`flex items-center px-4 py-2 text-sm font-medium ${
                        activeTab === step.id.toString()
                          ? "bg-purple-100 text-purple-600 rounded-t-md"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs font-semibold ${
                          activeTab === step.id.toString()
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.id}
                      </span>
                      {step.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tools and Resources Section */}
            {!loading && !error && filteredTools.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tools & Resources You'll Need
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Prepare your development environment with these essential tools to complete your roadmap.
                </p>
                <div className="space-y-4">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <img
                        src={tool.image || "https://via.placeholder.com/40"}
                        alt={tool.name || "Tool"}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">
                          {tool.name || "Unknown Tool"}
                        </h4>
                        <p className="text-xs text-gray-600">{tool.description || "No description available"}</p>
                        <a
                          href={tool.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 text-xs font-medium hover:underline"
                        >
                          Download / Install
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Based on Active Tab */}
            {!loading && !error && (
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* Prerequisites */}
                {activeTab === "1" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Prerequisites
                        </h3>
                      </div>
                      <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">
                        Mark as Done
                      </button>
                    </div>
                    <div className="mt-4 ml-9 p-4 bg-gray-50 rounded-lg">
                      {filteredPrerequisites.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-600">
                          {filteredPrerequisites.map((prereq) => (
                            <li key={prereq.id} className="flex items-start">
                              <svg
                                className="w-4 h-4 text-purple-600 mr-2 mt-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 12l2 2 4-4"
                                />
                              </svg>
                              <span>{prereq.description || "No description available"}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Ensure you have basic programming knowledge and the tools
                          listed above installed.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Courses */}
                {activeTab === "2" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Courses
                        </h3>
                      </div>
                      <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">
                        Mark as Done
                      </button>
                    </div>
                    <div className="mt-4 ml-9 p-4 bg-gray-50 rounded-lg">
                      {filteredCourses.length > 0 ? (
                        <div className="space-y-4">
                          {filteredCourses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                              <img
                                src={course.image || "https://via.placeholder.com/40"}
                                alt={course.name || "Course"}
                                className="w-10 h-10 rounded-full mr-4"
                              />
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">
                                  {course.name || "Unknown Course"}
                                </h4>
                                <h5 className="text-sm font-small text-gray-600">{course.provider}</h5>
                                <p className="text-xs text-gray-600 font-bold">{course.duration || "No description available"}</p>
                                <p className="text-xs text-indigo-600 text-xs font-medium ">{course.level}</p>
                                <a
                                  href={course.link || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-600 text-xs font-medium hover:underline"
                                >
                                  Enroll Now
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Enroll in recommended courses to build foundational skills.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Improve Skills */}
                {activeTab === "3" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Improve Your Skills
                        </h3>
                      </div>
                      <button className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">
                        Mark as Done
                      </button>
                    </div>

                    {/* Skills List */}
                    <div className="mt-6 ml-9">
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <span className="text-xs font-bold text-purple-600">
                          SKILLS REQUIRED
                        </span>
                      </div>
                      <div className="mt-4 ml-6 space-y-4">
                        {filteredRoadmapSkills.length > 0 ? (
                          filteredRoadmapSkills.map((skill, index) => (
                            <div key={skill.id} className="flex items-start">
                              <div className="relative mr-4">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                    skill.completed
                                      ? "bg-green-500"
                                      : "bg-gray-200 border border-gray-300"
                                  }`}
                                >
                                  {skill.completed && (
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                                {index < filteredRoadmapSkills.length - 1 && (
                                  <div className="absolute top-5 left-2.5 w-px h-6 bg-gray-300"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{skill.text || "No skill description"}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-600">
                            No skills available. Complete the prerequisites and courses first.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {activeTab === "4" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Take the Quiz
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 ml-9 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-800">
                        Before You Start the Quiz
                      </h4>
                      <p className="text-xs text-yellow-700 mt-2">
                        This quiz assesses your skills in {filteredSkillsCompanySelected.length > 0 ? filteredSkillsCompanySelected.map(skill => skill.name).join(", ") : "various areas"}.
                        Pass to earn a badge for your profile. Take your time and good luck!
                      </p>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-purple-700 transition-all">
                        Take the Quiz
                      </button>
                    </div>
                  </div>
                )}

                {/* Badge */}
                {activeTab === "5" && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Earn Your Badge
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 ml-9 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Complete the quiz to earn a badge showcasing your skills to
                        employers like {companySelected.name || "your chosen company"}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Progress
              </h3>
              <div className="flex justify-center items-center my-4">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">
                      15%
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-800">
                  Recent Activity
                </h4>
                <p className="text-xs text-gray-600">
                  Completed Skill - {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Competitors Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Competitors
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                See how you compare to other candidates.
              </p>
              {filteredCompetitors.length > 0 ? (
                filteredCompetitors.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={competitor.image || "https://via.placeholder.com/32"}
                        alt={competitor.name || "Competitor"}
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {competitor.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {competitor.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        {competitor.badges || 0} Badges
                      </p>
                      <p className="text-xs text-gray-500">
                        {competitor.location || "Unknown"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-600">
                  No competitor data available.
                </p>
              )}
              <a
                href="#"
                className="text-purple-600 text-xs font-medium hover:underline flex items-center"
              >
                See All Details
                <svg
                  className="w-3 h-3 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};