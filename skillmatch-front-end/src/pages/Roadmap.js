import React, { useState, useEffect, useMemo } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";
import { api } from "../api/api";
import { useParams, useNavigate } from 'react-router';

export const Roadmap = () => {
  const roadmapSteps = [
    { id: 1, name: "Prerequisites" },
    { id: 2, name: "Courses" },
    { id: 3, name: "Improve Skills" },
    { id: 4, name: "Quiz" },
  ];

  const { id: roadmapId } = useParams(); // Renamed for clarity: id is roadmapId
  const navigate = useNavigate();

  // State
  const [stepCompletion, setStepCompletion] = useState(() => {
    const savedData = localStorage.getItem(`roadmapProgress_${roadmapId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.stepCompletion && Object.keys(parsedData.stepCompletion).length === roadmapSteps.length) {
          return parsedData.stepCompletion;
        }
      } catch (e) {
        console.warn("Invalid localStorage data, using default:", e);
      }
    }
    return {
      "1": false,
      "2": false,
      "3": false,
      "4": false,
    };
  });

  const [activeTab, setActiveTab] = useState(() => {
    const savedData = localStorage.getItem(`roadmapProgress_${roadmapId}`);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.activeTab && roadmapSteps.some(step => step.id.toString() === parsedData.activeTab)) {
          return parsedData.activeTab;
        }
      } catch (e) {
        console.warn("Invalid activeTab in localStorage, using default:", e);
      }
    }
    return "1";
  });

  const [data, setData] = useState({
    skills: [],
    prerequisites: [],
    tools: [],
    candidateCourses: [],
    roadmapSkills: [],
    userTools: [],
  });
  const [competitors, setCompetitors] = useState([]);
  const [companySelected, setCompanySelected] = useState({ id: null, name: "Unknown Company", address: null });
  const [skillsCompanySelected, setSkillsCompanySelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState("pending");
  const [roadmapName, setRoadmapName] = useState("Personalized Learning Roadmap");

  // Fetch company info based on roadmap ID
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const response = await api.get(`/api/company/roadmap/${roadmapId}`);
        const { company, roadmap } = response.data;
        setCompanySelected({
          id: company.id,
          name: company.name,
          address: company.address,
        });
        setCompleted(roadmap.completed);
        // Generate dynamic roadmap name
        setRoadmapName(`${company.name} Career Roadmap`);
        // If roadmap is completed, mark all steps as completed
        if (roadmap.completed === "completed") {
          const updatedStepCompletion = roadmapSteps.reduce((acc, step) => {
            acc[step.id] = true;
            return acc;
          }, {});
          setStepCompletion(updatedStepCompletion);
          setActiveTab("4"); // Set to Quiz tab
        }
      } catch (error) {
        console.error("Error fetching company info:", error.message);
        setError(error.response?.data?.message || "Failed to load company information");
      }
    };
    fetchCompanyInfo();
  }, [roadmapId, roadmapSteps]);

  // Fetch roadmap details
  useEffect(() => {
    const fetchRoadmapData = async () => {
      try {
        if (!companySelected.id) return; // Wait for company ID
        const response = await api.get(`/api/roadmap/${companySelected.id}`);
        const uniqueData = {
          skills: removeDuplicates(response.data.skills || [], 'id'),
          prerequisites: removeDuplicates(response.data.prerequisites || [], 'id'),
          tools: removeDuplicates(response.data.tools || [], 'name'),
          candidateCourses: removeDuplicates(response.data.candidateCourses || [], 'id'),
          roadmapSkills: removeDuplicates(response.data.roadmapSkills || [], 'text'),
          userTools: removeDuplicates(response.data.userTools || [], 'name'),
        };
        setData(uniqueData);
        setSkillsCompanySelected(removeDuplicates(response.data.skills || [], 'id'));
        setCompetitors(removeDuplicates(response.data.competitors || [], 'id'));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching roadmap data');
        setLoading(false);
      }
    };
    fetchRoadmapData();
  }, [companySelected.id]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        stepCompletion,
        activeTab,
        completed,
      };
      localStorage.setItem(`roadmapProgress_${roadmapId}`, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Failed to save progress to localStorage:", e);
    }
  }, [stepCompletion, activeTab, completed, roadmapId]);

  const handleTakeQuiz = () => {
    navigate(`/qcm/roadmap/${roadmapId}`);
  };

  const removeDuplicates = (array, criteria) => {
    const seen = new Set();
    return array.filter(item => {
      const value = typeof criteria === 'string'
        ? item[criteria]
        : criteria.map(key => item[key]).join('|');
      if (value === undefined || value === null) return false;
      const dedupeKey = typeof value === 'string' ? value.toLowerCase() : value;
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    });
  };

  const filteredTools = useMemo(() => data.tools, [data.tools]);
  const filteredPrerequisites = useMemo(() => data.prerequisites, [data.prerequisites]);
  const filteredCourses = useMemo(() => data.candidateCourses, [data.candidateCourses]);
  const filteredRoadmapSkills = useMemo(() => data.roadmapSkills, [data.roadmapSkills]);
  const filteredSkillsCompanySelected = useMemo(() => skillsCompanySelected, [skillsCompanySelected]);
  const filteredCompetitors = useMemo(() => competitors, [competitors]);
  const filteredUserTools = useMemo(() => data.userTools, [data.userTools]);

  const isStepCompleted = (stepId) => stepCompletion[stepId] || false;

  const getNextTab = (currentTab) => {
    const currentIndex = roadmapSteps.findIndex(step => step.id.toString() === currentTab);
    return roadmapSteps[currentIndex + 1]?.id.toString() || currentTab;
  };

  const handleNextStep = (currentTab) => {
    const updatedStepCompletion = {
      ...stepCompletion,
      [currentTab]: true,
    };
    setStepCompletion(updatedStepCompletion);
    const nextTab = getNextTab(currentTab);
    setActiveTab(nextTab);
  };

  const calculateProgress = () => {
    const completedSteps = Object.values(stepCompletion).filter(Boolean).length;
    return (completedSteps / roadmapSteps.length) * 100;
  };

  return (
    <>
      <NavbarCandidate />
      <div className={`min-h-screen bg-gray-50 ${completed === "completed" ? "bg-green-50" : ""}`}>
        {/* Roadmap Header */}
        <div className={`bg-gradient-to-r ${completed === "completed" ? "from-green-600 to-emerald-700" : "from-purple-600 to-indigo-700"} shadow-lg py-6`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">{roadmapName}</h1>
            <p className="mt-2 text-sm text-white">
              Tailored for: <span className="font-semibold">{companySelected.name || "Unknown Company"}</span>
              {completed === "completed" && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Roadmap Timeline */}
            <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Path</h2>
                <div className="relative">
                  {roadmapSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className="mb-6 last:mb-0"
                      onClick={() => setActiveTab(step.id.toString())}
                    >
                      <div className="flex items-center cursor-pointer">
                        <div className="flex flex-col items-center mr-4">
                          {step.id === 1 ? (
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          ) : (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                              activeTab === step.id.toString()
                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                : isStepCompleted(step.id.toString())
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}>
                              {step.id}
                            </div>
                          )}
                          {index < roadmapSteps.length - 1 && (
                            <div className={`w-px h-full absolute left-3 top-6 ${
                              isStepCompleted(step.id.toString()) ? "bg-green-500" : "bg-gray-300"
                            }`}></div>
                          )}
                        </div>
                        <div className={`text-sm font-medium transition-all duration-300 ${
                          activeTab === step.id.toString()
                            ? "text-purple-600 font-semibold"
                            : isStepCompleted(step.id.toString())
                            ? "text-green-600"
                            : "text-gray-700 hover:text-gray-900"
                        }`}>
                          {step.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{calculateProgress()}% Complete</p>
                </div>
              </div>
            </div>

            {/* Roadmap Content */}
            <div className="flex-1">
              {loading && (
                <div className="bg-white rounded-xl shadow-md p-4">
                  <p className="text-sm text-gray-600">Loading roadmap data...</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 rounded-xl shadow-md p-4">
                  <p className="text-sm text-red-600">Error: {error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  {/* How to Follow the Roadmap */}
                  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Succeed</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      This roadmap is designed to prepare you for a role at {companySelected.name || "your chosen company"} by building skills in {filteredSkillsCompanySelected.length > 0 ? filteredSkillsCompanySelected.map(skill => skill.name).join(", ") : "various areas"}.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Prerequisites:</strong> Review and set up your environment.</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Courses:</strong> Complete recommended courses to build skills.</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Improve Skills:</strong> Practice through hands-on projects.</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Quiz:</strong> Test your knowledge to unlock your badge.</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span><strong>Badge:</strong> Showcase your achievement to employers.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Badge Information */}
                  <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Badge Overview</h3>
                    <div className="space-y-4 text-sm text-gray-600">
                      <div className="flex items-start">
                        <img width="40" height="40" src="https://img.icons8.com/pulsar-gradient/48/warranty-card.png" alt="badge" className="mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-800">What is a Badge?</h4>
                          <p className="text-xs">A digital credential certifying your skills for {companySelected.name || "company"} roles, shareable on SkillMatch and LinkedIn.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <img width="40" height="40" src="https://img.icons8.com/pulsar-gradient/48/positive-dynamic.png" alt="benefits" className="mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-800">Benefits</h4>
                          <p className="text-xs">Stand out to recruiters and boost your profile visibility.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <img width="40" height="40" src="https://img.icons8.com/pulsar-gradient/48/how-quest.png" alt="how" className="mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-800">How to Earn</h4>
                          <p className="text-xs">Pass the quiz with a score of 80% or higher.</p>
                        </div>
                      </div>
                    </div>
                    {completed === "completed" && (
                      <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-400 rounded-lg">
                        <p className="text-sm text-green-700">
                          Congratulations! You've earned your badge for {companySelected.name || "this roadmap"}.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tools and Resources */}
                  {filteredTools.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tools & Resources</h3>
                      <p className="text-sm text-gray-600 mb-3">Set up your environment with these essentials.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredTools.map((tool) => (
                          <div key={tool.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                            <img src={tool.image || "https://via.placeholder.com/40"} alt={tool.name || "Tool"} className="w-10 h-10 rounded-full mr-3" />
                            <div>
                              <h4 className="text-sm font-medium text-gray-800">{tool.name || "Unknown Tool"}</h4>
                              <p className="text-xs text-gray-600">{tool.description || "No description"}</p>
                              <a href={tool.link || "#"} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-xs font-medium hover:underline">Download</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab Content */}
                  <div className="bg-white rounded-xl shadow-md p-4">
                    {activeTab === "1" && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Prerequisites</h3>
                        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Necessary Prerequisites</h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Ensure you have the following skills and knowledge to succeed in this roadmap:
                          </p>
                          <ul className="space-y-2 text-sm text-gray-600">
                            {filteredPrerequisites.length > 0 ? (
                              filteredPrerequisites.map((prereq) => (
                                <li key={prereq.id} className="flex items-start">
                                  <svg className="w-4 h-4 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{prereq.text || "No description available"}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-600">Basic programming knowledge and tools setup required.</li>
                            )}
                          </ul>
                        </div>
                        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-800 mb-2">Tools You Have</h4>
                          <p className="text-xs text-gray-600 mb-3">
                            Based on your profile, here are the tools you already possess:
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {filteredUserTools.length > 0 ? (
                              filteredUserTools.map((tool) => (
                                <span key={tool.id} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{tool.name || "Unknown Tool"}</span>
                              ))
                            ) : (
                              <p className="text-sm text-gray-600">No tools detected. Install required tools to proceed.</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => handleNextStep("1")}
                            disabled={completed === "completed"}
                            className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ${completed === "completed" ? "bg-gray-400 cursor-not-allowed" : ""}`}
                          >
                            Next Step
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "2" && (
                      <div className="-ml-4 sm:-ml-6 lg:-ml-8">
                        <div className="flex items-center px-4 sm:px-6 lg:px-8">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                          <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
                        </div>
                        <div className="mt-4 w-full bg-gray-50">
                          {filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                              {filteredCourses.map((course) => (
                                <div key={course.id} className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                  <img
                                    src={course.image || `https://ui-avatars.com/api/?name=${course.name}&background=0D8ABC&color=fff&size=150`}
                                    alt={course.name || "Course"}
                                    className="w-full h-48 object-cover"
                                  />
                                  <div className="p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{course.name || "Unknown Course"}</h4>
                                    <p className="text-xs text-gray-600 mb-1">{course.provider || "N/A"}</p>
                                    <p className="text-xs text-gray-600 mb-1">{course.duration || "N/A"}</p>
                                    <p className="text-xs text-indigo-600 font-medium mb-2">{course.level}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                      <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: "30%" }}></div>
                                    </div>
                                    <a
                                      href={course.link || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-purple-600 text-xs font-medium hover:underline inline-block"
                                    >
                                      Continue Learning
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 p-4">Enroll in recommended courses to build skills.</p>
                          )}
                        </div>
                        <div className="mt-6 flex justify-end px-4 sm:px-6 lg:px-8">
                          <button
                            onClick={() => handleNextStep("2")}
                            disabled={completed === "completed"}
                            className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ${completed === "completed" ? "bg-gray-400 cursor-not-allowed" : ""}`}
                          >
                            Next Step
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "3" && (
                      <div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                          <h3 className="text-lg font-semibold text-gray-900">Improve Your Skills</h3>
                        </div>
                        <div className="mt-6 ml-9">
                          <div className="bg-purple-50 p-2 rounded-lg mb-4">
                            <span className="text-xs font-bold text-purple-600">SKILLS TO MASTER</span>
                          </div>
                          <div className="space-y-4">
                            {filteredRoadmapSkills.length > 0 ? (
                              filteredRoadmapSkills.map((skill) => (
                                <div key={skill.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                                        skill.completed || completed === "completed" ? "bg-green-500" : "bg-gray-200 border border-gray-300"
                                      }`}>
                                        {(skill.completed || completed === "completed") && (
                                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </div>
                                      <p className="text-sm font-medium text-gray-800">{skill.text || "No skill description"}</p>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: skill.completed || completed === "completed" ? "100%" : "50%" }}></div>
                                      </div>
                                      <button className="text-xs text-purple-600 hover:underline">Practice</button>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-600">Complete prerequisites and courses first.</p>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => handleNextStep("3")}
                            disabled={completed === "completed"}
                            className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ${completed === "completed" ? "bg-gray-400 cursor-not-allowed" : ""}`}
                          >
                            Next Step
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "4" && (
                      <div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                          <h3 className="text-lg font-semibold text-gray-900">Take the Quiz</h3>
                        </div>
                        <div className="mt-4 ml-9 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                          <h4 className="text-sm font-medium text-yellow-800">Before You Start</h4>
                          <p className="text-xs text-yellow-700 mt-2">
                            Assess skills in {filteredSkillsCompanySelected.length > 0 ? filteredSkillsCompanySelected.map(skill => skill.name).join(", ") : "various areas"}. Pass with 80% to earn a badge.
                          </p>
                        </div>
                        {completed === "completed" && (
                          <div className="mt-4 ml-9 p-3 bg-green-50 border-l-4 border-green-400 rounded-lg">
                            <p className="text-sm text-green-700">
                              Quiz completed! You've successfully finished the roadmap.
                            </p>
                          </div>
                        )}
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={handleTakeQuiz}
                            disabled={!isStepCompleted("3") || completed === "completed"}
                            className={`bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 ${(!isStepCompleted("3") || completed === "completed") ? "bg-gray-400 cursor-not-allowed" : ""}`}
                            title={!isStepCompleted("3") ? "Complete Improve Skills first" : completed === "completed" ? "Quiz already completed" : "Take the Quiz"}
                          >
                            Take the Quiz
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}