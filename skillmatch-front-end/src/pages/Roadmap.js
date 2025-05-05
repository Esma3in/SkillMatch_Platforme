import React, { useState, useEffect } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { api } from "../api/api";

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
  const [Prerequisites, setPrerequisites] = useState([]);
  const [candidateCourses, setcandidateCourses] = useState([]);
  const [roadmapSkills, setroadmapSkills] = useState([]);
  const [tools, settools] = useState([]);
  const [competitor, setcompetitor] = useState([]);
  const [companyselected, setcompanySelected] = useState({ // Assuming company ID for API calls
  });
  const [skillsCompanySelected, setskillsCompanySelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const candidate_id= JSON.parse(localStorage.getItem('candidate_id'));
  console.log(candidate_id)

  // Fetch company skills and roadmap data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch company skills
        const skillsResponse = await api.get(
          `/api/company/${companyselected}/skills`
        );
        if (!skillsResponse.ok) {
          throw new Error("Failed to fetch company skills");
        }
        const skillsData = skillsResponse.data.skills
        setskillsCompanySelected(skillsData);
        console.log(skillsData)

        // Step 2: Fetch roadmap data based on skills
        const skillIds = skillsData.skills.map((skill) => skill.id).join(",");
        const roadmapResponse = await fetch(
          `/api/roadmap-data?skills=${skillIds}`
        );
        if (!roadmapResponse.ok) {
          throw new Error("Failed to fetch roadmap data");
        }
        const roadmapData = await roadmapResponse.json();

        // Update state with fetched data
        setPrerequisites(roadmapData.prerequisites || []);
        setcandidateCourses(roadmapData.courses || []);
        setroadmapSkills(roadmapData.skills || []);
        settools(roadmapData.tools || []);
        setcompetitor(roadmapData.competitors || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyselected.id]);

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Your Roadmap</h1>
            <p className="mt-2 text-sm text-white">
              Chosen Company: <span className="font-semibold">{companyselected.name}</span>
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
                  This roadmap is designed to prepare you for a role at {companyselected.name} by
                  building key skills in {skillsCompanySelected.map(skill => skill.name).join(", ")}.
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
                      Display it on your profile to impress employers like {companyselected.name}.
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
                        A badge certifies your mastery of skills required for {companyselected.name} roles.
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
            {!loading && !error && tools.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tools & Resources You'll Need
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Prepare your development environment with these essential tools to complete your roadmap.
                </p>
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-gray-600">{tool.description}</p>
                        <a
                          href={tool.link}
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
                      {Prerequisites.length > 0 ? (
                        <ul className="space-y-2 text-sm text-gray-600">
                          {Prerequisites.map((prereq) => (
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
                              <span>{prereq.description}</span>
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
                      {candidateCourses.length > 0 ? (
                        <div className="space-y-4">
                          {candidateCourses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                            >
                              <img
                                src={course.image}
                                alt={course.title}
                                className="w-10 h-10 rounded-full mr-4"
                              />
                              <div>
                                <h4 className="text-sm font-medium text-gray-800">
                                  {course.title}
                                </h4>
                                <p className="text-xs text-gray-600">{course.description}</p>
                                <a
                                  href={course.link}
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
                        {roadmapSkills.length > 0 ? (
                          roadmapSkills.map((skill, index) => (
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
                                {index < roadmapSkills.length - 1 && (
                                  <div className="absolute top-5 left-2.5 w-px h-6 bg-gray-300"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{skill.text}</p>
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
                        This quiz assesses your skills in {skillsCompanySelected.map(skill => skill.name).join(", ")}.
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
                        employers like {companyselected.name}.
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
              {competitor.length > 0 ? (
                competitor.map((competitor) => (
                  <div
                    key={competitor.id}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full mr-2"
                        src={competitor.image}
                        alt={competitor.name}
                      />
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {competitor.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {competitor.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-900">
                        {competitor.badges} Badges
                      </p>
                      <p className="text-xs text-gray-500">
                        {competitor.location}
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