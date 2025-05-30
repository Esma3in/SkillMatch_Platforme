import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarCandidate from "../components/common/navbarCandidate.jsx";
import { api } from "../api/api";
import confetti from 'canvas-confetti';

// Define roadmap steps as a constant
const ROADMAP_STEPS = [
  { id: 1, name: "Prerequisites" },
  { id: 2, name: "Courses" },
  { id: 3, name: "Improve Skills" },
  { id: 4, name: "Quiz" },
];

// Utility to remove duplicates from an array
const removeDuplicates = (array, criteria) => {
  if (!array || !array.length) return [];
  const seen = new Set();
  return array.filter(item => {
    if (!item) return false;
    const value = typeof criteria === "string" ? item[criteria] : criteria.map(key => item[key] ?? "").join("|");
    if (value === undefined || value === null) return false;
    const dedupeKey = typeof value === "string" ? value.toLowerCase() : value;
    if (seen.has(dedupeKey)) return false;
    seen.add(dedupeKey);
    return true;
  });
};

const Roadmap = () => {
  const { id: roadmapId } = useParams();
  const navigate = useNavigate();
  const candidateId = JSON.parse(localStorage.getItem("candidate_id"));

  // State management
  const [stepCompletion, setStepCompletion] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [completed, setCompleted] = useState("pending");
  const [pathProgress, setPathProgress] = useState(0);
  const [data, setData] = useState({
    skills: [],
    prerequisites: [],
    tools: [],
    candidateCourses: [],
    roadmapSkills: [],
    userTools: [],
  });
  const [companySelected, setCompanySelected] = useState({ id: null, name: "Unknown Company", address: null });
  const [skillsCompanySelected, setSkillsCompanySelected] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roadmapName, setRoadmapName] = useState("Personalized Learning Roadmap");
  const [isCreatingQcm, setIsCreatingQcm] = useState(false);
  const [courseProgress, setCourseProgress] = useState(() => {
    const courses = JSON.parse(localStorage.getItem("all_courses")) || [];
    return courses.reduce((acc, course) => ({
      ...acc,
      [course.id]: JSON.parse(localStorage.getItem(`course_progress_${course.id}`)) || false
    }), {});
  });
  const [skillCheckboxes, setSkillCheckboxes] = useState({});

  // Initialize or load roadmap progress with sync check
  useEffect(() => {
    const initializeProgress = async () => {
      if (!roadmapId || !candidateId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/api/roadmap/progress/${roadmapId}/${candidateId}`);
        const progressData = response.data.data;

        const steps = progressData.steps ? JSON.parse(progressData.steps) : {};
        const newStepCompletion = {};
        ROADMAP_STEPS.forEach(step => {
          newStepCompletion[step.id] = steps[step.id] !== undefined ? steps[step.id] : false;
        });

        const savedData = localStorage.getItem(`roadmapProgress_${roadmapId}`);
        let localProgress = {};
        if (savedData) {
          try {
            localProgress = JSON.parse(savedData);
            if (
              localProgress.stepCompletion &&
              Object.keys(localProgress.stepCompletion).length === ROADMAP_STEPS.length &&
              ROADMAP_STEPS.every(step => typeof localProgress.stepCompletion[step.id] === "boolean")
            ) {
              Object.keys(newStepCompletion).forEach(stepId => {
                newStepCompletion[stepId] = newStepCompletion[stepId] || localProgress.stepCompletion[stepId];
              });
            }
          } catch (e) {
            console.warn("Failed to parse localStorage data:", e);
          }
        }

        setStepCompletion(newStepCompletion);
        const completedSteps = Object.values(newStepCompletion).filter(Boolean).length;
        const totalSteps = ROADMAP_STEPS.length;
        const calculatedProgress = Math.round((completedSteps / totalSteps) * 100);
        setPathProgress(calculatedProgress);

        const firstIncompleteStep = ROADMAP_STEPS.find(step => !newStepCompletion[step.id]);
        setActiveTab(firstIncompleteStep ? firstIncompleteStep.id.toString() : "4");

        localStorage.setItem(`roadmapProgress_${roadmapId}`, JSON.stringify({
          stepCompletion: newStepCompletion,
          activeTab: firstIncompleteStep ? firstIncompleteStep.id.toString() : "4",
          completed: progressData.completed || (calculatedProgress >= 100 ? "completed" : "pending"),
          pathProgress: calculatedProgress
        }));
      } catch (error) {
        console.error('Failed to fetch roadmap progress:', error);
        const savedData = localStorage.getItem(`roadmapProgress_${roadmapId}`);
        if (savedData) {
          try {
            const parsedData = JSON.parse(savedData);
            if (
              parsedData.stepCompletion &&
              Object.keys(parsedData.stepCompletion).length === ROADMAP_STEPS.length &&
              ROADMAP_STEPS.every(step => typeof parsedData.stepCompletion[step.id] === "boolean")
            ) {
              setStepCompletion(parsedData.stepCompletion);
              setActiveTab(parsedData.activeTab || "1");
              setPathProgress(parsedData.pathProgress || 0);
            } else {
              const initialState = ROADMAP_STEPS.reduce((acc, step) => ({ ...acc, [step.id]: false }), {});
              setStepCompletion(initialState);
              setActiveTab("1");
              setPathProgress(0);
            }
          } catch (e) {
            console.warn("Failed to parse localStorage data:", e);
            const initialState = ROADMAP_STEPS.reduce((acc, step) => ({ ...acc, [step.id]: false }), {});
            setStepCompletion(initialState);
            setActiveTab("1");
            setPathProgress(0);
          }
        } else {
          const initialState = ROADMAP_STEPS.reduce((acc, step) => ({ ...acc, [step.id]: false }), {});
          setStepCompletion(initialState);
          setActiveTab("1");
          setPathProgress(0);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeProgress();
  }, [roadmapId, candidateId]);

  // Initialize skill checkboxes
  useEffect(() => {
    setSkillCheckboxes(prev => {
      const newCheckboxes = {};
      data.roadmapSkills.forEach(skill => {
        newCheckboxes[skill.id] = stepCompletion["3"] || completed === "completed";
      });
      return newCheckboxes;
    });
  }, [data.roadmapSkills, stepCompletion, completed]);

  // Save progress to localStorage and backend
  useEffect(() => {
    const saveProgress = async () => {
      if (!roadmapId || !candidateId) return;

      const completedSteps = Object.values(stepCompletion).filter(Boolean).length;
      const totalSteps = ROADMAP_STEPS.length;
      const calculatedProgress = completed === "completed" ? 100 : Math.round((completedSteps / totalSteps) * 100);

      setPathProgress(calculatedProgress);

      try {
        localStorage.setItem(`roadmapProgress_${roadmapId}`, JSON.stringify({
          stepCompletion,
          activeTab,
          completed,
          pathProgress: calculatedProgress
        }));
      } catch (e) {
        console.warn("Failed to save progress to localStorage:", e);
      }

      try {
        await api.post('/api/roadmap/progress', {
          roadmap_id: roadmapId,
          candidate_id: candidateId,
          steps: JSON.stringify(stepCompletion),
          progress: calculatedProgress,
          completed
        });
      } catch (error) {
        console.error('Failed to save roadmap progress to backend:', error);
        setTimeout(() => {
          api.post('/api/roadmap/progress', {
            roadmap_id: roadmapId,
            candidate_id: candidateId,
            steps: JSON.stringify(stepCompletion),
            progress: calculatedProgress,
            completed
          }).catch(err => console.error('Retry failed:', err));
        }, 2000);
      }
    };

    saveProgress();
  }, [stepCompletion, activeTab, completed, roadmapId, candidateId]);

  // Fetch company and roadmap data
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (!roadmapId || !candidateId) return;
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/company/candidate-roadmap/${roadmapId}`, { params: { candidate_id: candidateId } });
        const { company, roadmap } = response.data;

        setCompanySelected({
          id: company.id,
          name: company.name || "Unknown Company",
          address: company.address || "",
        });
        setRoadmapName(`${company.name || "Unknown Company"} Career Roadmap`);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load company information");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [roadmapId, candidateId]);

  // Fetch roadmap data
  useEffect(() => {
    const fetchRoadmapData = async () => {
      if (!companySelected.id) return;
      try {
        const response = await api.get(`/api/roadmaps/${roadmapId}`);
        const uniqueData = {
          skills: removeDuplicates(response.data.skills || [], "id"),
          prerequisites: removeDuplicates(response.data.prerequisites || [], "id"),
          tools: removeDuplicates(response.data.tools || [], "name"),
          candidateCourses: removeDuplicates(response.data.candidate_courses || [], "id"),
          roadmapSkills: removeDuplicates(response.data.roadmap_skills || [], "text"),
          userTools: removeDuplicates(response.data.userTools || [], "name"),
        };
        setData(uniqueData);
        setSkillsCompanySelected(removeDuplicates(response.data.skills || [], "id"));
        setCompetitors(removeDuplicates(response.data.competitors || [], "id"));
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching roadmap data");
      }
    };

    fetchRoadmapData();
  }, [companySelected.id, roadmapId]);

  // Fetch completed roadmap status and sync quiz step
  useEffect(() => {
    const fetchCompletedRoadmap = async () => {
      try {
        const response = await api.get(`/api/roadmap/completed/${roadmapId}`);
        const isCompleted = response.data.completed === "completed";
        setCompleted(response.data.completed);
        
        if (isCompleted) {
          setStepCompletion(prev => ({
            ...prev,
            "4": true // Ensure quiz step is marked complete
          }));
          setPathProgress(100); // Force progress to 100% when completed
        }
      } catch (error) {
        console.error('Failed to fetch completed roadmap status:', error);
      }
    };
    fetchCompletedRoadmap();
  }, [roadmapId]);

  useEffect(() => {
    if (completed === "completed") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#6EE7B7'],
      });
    }
  }, [completed]);

  // Handle course completion
  const handleMarkCourseComplete = useCallback((courseId) => {
    setCourseProgress(prev => {
      const updated = { ...prev, [courseId]: true };
      localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(true));
      return updated;
    });

    const allCoursesCompleted = data.candidateCourses.every(course => courseProgress[course.id] || course.id === courseId);
    if (allCoursesCompleted) {
      setStepCompletion(prev => ({ ...prev, "2": true }));
    }
  }, [courseProgress, data.candidateCourses]);

  // Handle quiz creation and navigation
  const handleTakeQuiz = useCallback(async () => {
    if (isCreatingQcm || !data.roadmapSkills.length) return;
    setIsCreatingQcm(true);

    try {
      const questionCount = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
      const questions = Array.from({ length: questionCount }, (_, i) => {
        const skill = data.roadmapSkills[i % data.roadmapSkills.length];
        return {
          question: `What is a key concept in ${skill.text}?`,
          options: [
            `A correct answer related to ${skill.text}`,
            `A plausible but wrong answer`,
            `Another incorrect option`,
            `Yet another wrong choice`,
          ],
          correctAnswer: 0,
          skillId: skill.id,
        };
      });

      const response = await api.post("/api/createQcm", { roadmap_id: roadmapId, questions });
      const qcmId = response?.data?.id;
      if (!qcmId) throw new Error("QCM ID not found in response");
      navigate(`/qcmForRoadmap/${qcmId}`);
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message || "Failed to create QCM"}`);
    } finally {
      setIsCreatingQcm(false);
    }
  }, [isCreatingQcm, roadmapId, navigate, data.roadmapSkills]);

  // Handle skill checkbox change
  const handleCheckboxChange = useCallback((skillId) => {
    setSkillCheckboxes(prev => ({
      ...prev,
      [skillId]: !prev[skillId]
    }));
  }, []);

  // Handle next step logic
  const handleNextStep = useCallback((currentTab) => {
    const currentIndex = ROADMAP_STEPS.findIndex(step => step.id.toString() === currentTab);
    const nextTab = ROADMAP_STEPS[currentIndex + 1]?.id.toString() || currentTab;

    setStepCompletion(prev => {
      const updated = { ...prev, [currentTab]: true };
      return updated;
    });

    if (currentTab === "3") {
      setSkillCheckboxes(prev => {
        const updated = {};
        data.roadmapSkills.forEach(skill => {
          updated[skill.id] = true;
        });
        return updated;
      });
    }

    setActiveTab(nextTab);

    const completedSteps = Object.values({ ...stepCompletion, [currentTab]: true }).filter(Boolean).length;
    const totalSteps = ROADMAP_STEPS.length;
    const calculatedProgress = Math.round((completedSteps / totalSteps) * 100);
    setPathProgress(calculatedProgress);
  }, [stepCompletion, data.roadmapSkills]);

  // Calculate progress for display
  const calculateProgress = useMemo(() => {
    const completedSteps = Object.values(stepCompletion).filter(Boolean).length;
    return completed === "completed" ? 100 : Math.round((completedSteps / ROADMAP_STEPS.length) * 100);
  }, [stepCompletion, completed]);

  // Memoized data filters
  const filteredTools = useMemo(() => data.tools, [data.tools]);
  const filteredPrerequisites = useMemo(() => data.prerequisites, [data.prerequisites]);
  const filteredCourses = useMemo(() => data.candidateCourses, [data.candidateCourses]);
  const filteredRoadmapSkills = useMemo(() => data.roadmapSkills, [data.roadmapSkills]);
  const filteredSkillsCompanySelected = useMemo(() => skillsCompanySelected, [skillsCompanySelected]);
  const filteredUserTools = useMemo(() => data.userTools, [data.userTools]);

  console.log("Roadmap Data : ",
    "tools : ", filteredTools,
    "prerequisites :", filteredPrerequisites,
    "Courses :", filteredCourses,
    "Roadmap Skills", filteredRoadmapSkills
  );

  return (
    <>
      <NavbarCandidate />
      <div className={`min-h-screen transition-all duration-500 ${completed === "completed" ? "bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100" : "bg-gradient-to-b from-gray-50 to-gray-100"} font-sans`}>
        <div className={`bg-gradient-to-r ${completed === "completed" ? "from-emerald-700 via-green-600 to-teal-600 animate-pulse" : "from-indigo-700 to-purple-600"} py-8 shadow-xl`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{roadmapName}</h1>
            <div className="mt-3 flex items-center space-x-2">
              <p className="text-sm text-white/90">
                Tailored for: <span className="font-semibold">{companySelected.name}</span>
              </p>
              {completed === "completed" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-200 text-green-900 animate-bounce">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Learning Path Progress Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`bg-white rounded-2xl shadow-md p-6 mb-6 ${completed === "completed" ? "ring-2 ring-green-300" : ""}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Path</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{pathProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${completed === "completed" ? "bg-green-600" : "bg-indigo-600"}`}
                  style={{ width: `${pathProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Path Steps Visualization */}
            <div className="relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200"></div>
              <div className="flex justify-between relative z-10">
                {ROADMAP_STEPS.map((step, index) => {
                  const isActive = activeTab === step.id.toString();
                  const isCompleted = stepCompletion[step.id] || (step.id === 4 && completed === "completed");
                  const isLast = index === ROADMAP_STEPS.length - 1;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          if (isCompleted || isActive) {
                            setActiveTab(step.id.toString());
                          }
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                          ? "bg-green-500 text-white ring-2 ring-green-300"
                          : isActive
                            ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                            : "bg-white border-2 border-gray-300 text-gray-400"}
                          transition-all duration-300 ${(isCompleted || isActive) ? "cursor-pointer hover:scale-110" : "cursor-not-allowed"}`}
                      >
                        {isCompleted ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step.id
                        )}
                      </button>
                      <span className={`mt-2 text-xs font-medium ${isActive ? "text-indigo-600" : isCompleted ? "text-green-600" : "text-gray-500"}`}>
                        {step.name}
                      </span>
                      {!isLast && (
                        <div
                          className={`absolute h-1 top-1/2 -translate-y-1/2 left-0 ${isCompleted ? "bg-green-500" : "bg-gray-200"}`}
                          style={{
                            width: `${100 / (ROADMAP_STEPS.length - 1)}%`,
                            left: `${(index * 100) / (ROADMAP_STEPS.length - 1)}%`
                          }}
                        ></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-8">
              {loading && (
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <p className="text-sm text-gray-600 animate-pulse">Loading roadmap data...</p>
                </div>
              )}
              {error && (
                <div className="bg-red-50 rounded-2xl shadow-md p-6">
                  <p className="text-sm text-red-600 font-medium">Error: {error}</p>
                </div>
              )}

              {!loading && !error && (
                <>
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Succeed</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      This roadmap is designed to prepare you for a role at{" "}
                      <span className="font-semibold">{companySelected.name}</span> by mastering skills in{" "}
                      {filteredSkillsCompanySelected.length > 0
                        ? filteredSkillsCompanySelected.map(skill => skill.name).join(", ")
                        : "key areas"}.
                    </p>
                    <ul className="space-y-3 text-sm text-gray-600">
                      {[
                        { text: "Review and set up your environment.", label: "Prerequisites" },
                        { text: "Complete recommended courses to build skills.", label: "Courses" },
                        { text: "Practice through hands-on projects.", label: "Improve Skills" },
                        { text: "Test your knowledge to unlock your badge.", label: "Quiz" },
                        { text: "Showcase your achievement to employers.", label: "Badge" },
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>
                            <strong>{item.label}:</strong> {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={`bg-white rounded-2xl shadow-md p-6 ${completed === "completed" ? "ring-4 ring-green-200 animate-pulse" : ""}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Badge Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        {
                          icon: "https://img.icons8.com/pulsar-gradient/48/warranty-card.png",
                          title: "What is a Badge?",
                          desc: `A digital credential certifying your skills for ${companySelected.name} roles, shareable on SkillMatch and LinkedIn.`,
                        },
                        {
                          icon: "https://img.icons8.com/pulsar-gradient/48/positive-dynamic.png",
                          title: "Benefits",
                          desc: "Stand out to recruiters and boost your profile visibility.",
                        },
                        {
                          icon: "https://img.icons8.com/pulsar-gradient/48/how-quest.png",
                          title: "How to Earn",
                          desc: "Pass the quiz with a score of 80% or higher.",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300">
                          <img src={item.icon} alt={item.title} className="w-10 h-10 mr-3" />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                            <p className="text-xs text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {completed === "completed" && (
                      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg">
                        <p className="text-sm text-green-700 font-medium animate-bounce">
                          Congratulations! You've earned your badge for {companySelected.name}.
                        </p>
                        <div className="mt-4 flex justify-center">
                          <div className="relative">
                            <img
                              src="https://img.icons8.com/pulsar-gradient/96/trophy.png"
                              alt="Badge"
                              className="w-16 h-16 animate-pulse"
                            />
                            <div className="absolute inset-0 rounded-full bg-green-300 opacity-50 blur-md animate-ping"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {filteredTools.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Tools & Resources</h3>
                      <p className="text-sm text-gray-600 mb-4">Set up your environment with these essential tools.</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTools.map((tool, index) => (
                          <div
                            key={tool.id ? `${tool.id}-${index}` : index}
                            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300"
                          >
                            <img
                              src={tool.image || "https://via.placeholder.com/40"}
                              alt={tool.name}
                              className="w-12 h-12 rounded-full mr-3 object-cover"
                            />
                            <div>
                              <h4 className="text-sm font-semibold text-gray-800">{tool.name || "Unknown Tool"}</h4>
                              <p className="text-xs text-gray-600 line-clamp-2">{tool.description || "No description"}</p>
                              <a
                                href={tool.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 text-xs font-medium hover:underline"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl shadow-md p-6">
                    {activeTab === "1" && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h3>
                        <div className="space-y-6">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Necessary Prerequisites</h4>
                            <p className="text-xs text-gray-600 mb-3">Ensure you have the following skills and knowledge:</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                              {filteredPrerequisites.length > 0 ? (
                                filteredPrerequisites.map((prereq, index) => (
                                  <li key={prereq.id ? `${prereq.id}-${index}` : index} className="flex items-start">
                                    <svg
                                      className="w-4 h-4 text-indigo-600 mr-2 mt-0.5 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
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
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">Tools You Have</h4>
                            <p className="text-xs text-gray-600 mb-3">Based on your profile, you already possess:</p>
                            <div className="flex flex-wrap gap-2">
                              {filteredUserTools.length > 0 ? (
                                filteredUserTools.map((tool, index) => (
                                  <span
                                    key={tool.id ? `${tool.id}-${index}` : index}
                                    className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full"
                                  >
                                    {tool.name || "Unknown Tool"}
                                  </span>
                                ))
                              ) : (
                                <p className="text-sm text-gray-600">No tools detected. Install required tools to proceed.</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => handleNextStep("1")}
                            disabled={completed === "completed"}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                          >
                            Mark as Complete
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "2" && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Courses</h3>
                        {filteredCourses.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course, index) => (
                              <div
                                key={course.id ? `${course.id}-${index}` : index}
                                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                              >
                                <div className="w-full h-40 object-cover bg-indigo-600"></div>
                                <div className="p-4 flex flex-col">
                                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{course.name || "Unknown Course"}</h4>
                                  <p className="text-xs text-gray-600 mb-1">{course.provider || "N/A"}</p>
                                  <p className="text-xs text-gray-600 mb-1">{course.duration || "N/A"}</p>
                                  <div className="flex items-center justify-between mt-auto">
                                    <a
                                      href={course.link || "#"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 text-xs font-medium hover:underline"
                                    >
                                      View Course
                                    </a>
                                    <button
                                      onClick={() => handleMarkCourseComplete(course.id)}
                                      disabled={courseProgress[course.id]}
                                      className={`px-3 py-1 rounded text-xs font-semibold transition-colors duration-300 ${
                                        courseProgress[course.id]
                                          ? "bg-green-100 text-green-700"
                                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                      }`}
                                    >
                                      {courseProgress[course.id] ? "Completed" : "Mark as Complete"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 p-4">Enroll in recommended courses to build skills.</p>
                        )}
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => handleNextStep("2")}
                            disabled={completed === "completed" || !data.candidateCourses.every(course => courseProgress[course.id])}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                            title={data.candidateCourses.every(course => courseProgress[course.id]) ? "Mark as Complete" : "Complete all courses first"}
                          >
                            Mark as Complete
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "3" && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Improve Your Skills</h3>
                        <div className="bg-indigo-50 p-3 rounded-lg mb-6">
                          <span className="text-xs font-semibold text-indigo-700 uppercase">Skills to Master</span>
                        </div>
                        <div className="space-y-4">
                          {filteredRoadmapSkills.length > 0 ? (
                            filteredRoadmapSkills.map((skill, index) => (
                              <div
                                key={skill.id ? `${skill.id}-${index}` : index}
                                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                        skillCheckboxes[skill.id] || completed === "completed" ? "bg-green-500" : "bg-gray-200 border border-gray-300"
                                      }`}
                                    >
                                      {(skillCheckboxes[skill.id] || completed === "completed") && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">{skill.text || "No skill description"}</p>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: skillCheckboxes[skill.id] || completed === "completed" ? "100%" : "50%" }}
                                      />
                                    </div>
                                    <input
                                      type="checkbox"
                                      checked={skillCheckboxes[skill.id] || completed === "completed"}
                                      onChange={() => handleCheckboxChange(skill.id)}
                                      disabled={completed === "completed"}
                                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600 p-4">Complete prerequisites and courses first.</p>
                          )}
                        </div>
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={() => handleNextStep("3")}
                            disabled={completed === "completed"}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                          >
                            Mark as Complete
                          </button>
                        </div>
                      </div>
                    )}
                    {activeTab === "4" && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Take the Quiz</h3>
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg mb-6">
                          <h4 className="text-sm font-semibold text-yellow-800">Before You Start</h4>
                          <p className="text-xs text-yellow-700 mt-2">
                            Assess your skills in{" "}
                            {filteredSkillsCompanySelected.length > 0
                              ? filteredSkillsCompanySelected.map(skill => skill.name).join(", ")
                              : "various areas"}. Pass with 80% to earn your badge.
                          </p>
                        </div>
                        {completed === "completed" && (
                          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg mb-6">
                            <p className="text-sm text-green-700 font-medium">
                              Quiz completed! You've successfully finished the roadmap.
                            </p>
                          </div>
                        )}
                        <div className="mt-6 flex justify-end">
                          <button
                            onClick={handleTakeQuiz}
                            disabled={isCreatingQcm || !stepCompletion["3"] || completed === "completed"}
                            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                            title={
                              isCreatingQcm
                                ? "Quiz creation in progress"
                                : !stepCompletion["3"]
                                ? "Complete Improve Skills first"
                                : completed === "completed"
                                ? "Quiz already completed"
                                : "Take the Quiz"
                            }
                          >
                            {isCreatingQcm ? "Creating Quiz..." : "Take the Quiz"}
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
};

export default Roadmap;