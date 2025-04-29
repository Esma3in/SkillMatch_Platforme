import React, { useState } from "react";
import NavbarCandidate from "../components/common/navbarCandidate";

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

  // Java competences data
  const javaCompetences = [
    {
      id: 1,
      text: "Basic Syntax: Variables, data types, operators, control structures (if, switch, while, for)",
      completed: true,
    },
    {
      id: 2,
      text: "Object-Oriented Programming (OOP): Classes, objects, methods, inheritance, polymorphism, encapsulation, abstraction",
      completed: false,
    },
    {
      id: 3,
      text: "Multithreading: Threads, Runnable, synchronization, concurrency concepts",
      completed: false,
    },
    {
      id: 4,
      text: "Input/Output (I/O): Reading/writing files, Streams (InputStream, OutputStream, BufferedReader, etc.)",
      completed: false,
    },
  ];

  // Angular competences data
  const angularCompetences = [
    {
      id: 1,
      text: "Basic Syntax: Variables, data types, operators, control structures (if, switch, while, for)",
      completed: false,
    },
    {
      id: 2,
      text: "Components: Creating and using components, communication between components (Input/Output, EventEmitter)",
      completed: false,
    },
    {
      id: 3,
      text: "Templates & Data Binding: Interpolation {{ }}, Property Binding [], Event Binding (), Two-way binding [(ngModel)]",
      completed: false,
    },
    {
      id: 4,
      text: "Routing & Navigation: Configuring routes, dynamic routing with parameters",
      completed: false,
    },
  ];

  // Competitors data
  const competitors = [
    {
      id: 1,
      name: "Jenny Wilson",
      email: "w.lawson@example.com",
      location: "Austin",
      badges: 4,
      image: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "Devon Lane",
      email: "dat.roberts@example.com",
      location: "New York",
      badges: 2,
      image: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Jane Cooper",
      email: "jgraham@example.com",
      location: "Toledo",
      badges: 6,
      image: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      name: "Dianne Russell",
      email: "curtis.d@example.com",
      location: "Naperville",
      badges: 1,
      image: "https://via.placeholder.com/40",
    },
  ];

  // Tools and resources data
  const toolsAndResources = [
    {
      id: 1,
      name: "Java Development Kit (JDK)",
      description: "Install JDK 17 or later to compile and run Java programs.",
      link: "https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html",
      image: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "Visual Studio Code",
      description: "A lightweight code editor with Java and Angular extensions.",
      link: "https://code.visualstudio.com/",
      image: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Node.js",
      description: "Required for Angular development and running npm commands.",
      link: "https://nodejs.org/",
      image: "https://via.placeholder.com/40",
    },
    {
      id: 4,
      name: "Angular CLI",
      description: "Command-line tool to scaffold and build Angular applications.",
      link: "https://angular.io/cli",
      image: "https://via.placeholder.com/40",
    },
    {
      id: 5,
      name: "Git",
      description: "Version control system for managing your project code.",
      link: "https://git-scm.com/",
      image: "https://via.placeholder.com/40",
    },
  ];

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 shadow-md py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Your Roadmap</h1>
            <p className="mt-2 text-sm text-white">
              Chosen Company: <span className="font-semibold">NTTDATA</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
          {/* Roadmap Content */}
          <div className="flex-1">
            {/* How to Follow the Roadmap Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                How to Follow Your Roadmap
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This roadmap is designed to prepare you for a role at NTTDATA by
                building key Java and Angular skills. Follow these steps to
                succeed:
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
                    <strong>Courses:</strong> Enroll in recommended Java and
                    Angular courses to build foundational skills. Complete all
                    modules and practice exercises.
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
                    <strong>Improve Skills:</strong> Master the listed Java and
                    Angular competences through hands-on projects and practice.
                    Mark each skill as done when confident.
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
                    Display it on your profile to impress employers like NTTDATA.
                  </span>
                </li>
              </ul>
            </div>

            {/* Badge Information Section */}
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
                    src="https://via.placeholder.com/40"
                    alt="Badge icon"
                    className="w-10 h-10 mr-3"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">
                      What is a Badge?
                    </h4>
                    <p className="text-xs text-gray-600">
                      A badge certifies your mastery of Java and Angular skills
                      required for NTTDATA roles. It’s shareable on your SkillMatch
                      profile and LinkedIn.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <img
                    src="https://via.placeholder.com/40"
                    alt="Benefits icon"
                    className="w-10 h-10 mr-3"
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
                    src="https://via.placeholder.com/40"
                    alt="How to earn icon"
                    className="w-10 h-10 mr-3"
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

            {/* Tabs Navigation */}
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

            {/* Tools and Resources Section */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tools & Resources You'll Need
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Prepare your development environment with these essential tools to complete your roadmap.
              </p>
              <div className="space-y-4">
                {toolsAndResources.map((tool) => (
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

            {/* Content Based on Active Tab */}
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
                    <p className="text-sm text-gray-600">
                      Ensure you have basic programming knowledge and the tools
                      listed above installed.
                    </p>
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
                    <p className="text-sm text-gray-600">
                      Enroll in recommended courses for Java and Angular to build
                      foundational skills.
                    </p>
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

                  {/* Java Competences */}
                  <div className="mt-6 ml-9">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="text-xs font-bold text-purple-600">
                        PART 1 | JAVA COMPETENCES
                      </span>
                    </div>
                    <div className="mt-4 ml-6 space-y-4">
                      {javaCompetences.map((competence, index) => (
                        <div key={competence.id} className="flex items-start">
                          <div className="relative mr-4">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                competence.completed
                                  ? "bg-green-500"
                                  : "bg-gray-200 border border-gray-300"
                              }`}
                            >
                              {competence.completed && (
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
                            {index < javaCompetences.length - 1 && (
                              <div className="absolute top-5 left-2.5 w-px h-6 bg-gray-300"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {competence.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Angular Competences */}
                  <div className="mt-6 ml-9">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <span className="text-xs font-bold text-purple-600">
                        PART 2 | ANGULAR COMPETENCES
                      </span>
                    </div>
                    <div className="mt-4 ml-6 space-y-4">
                      {angularCompetences.map((competence, index) => (
                        <div key={competence.id} className="flex items-start">
                          <div className="relative mr-4">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                competence.completed
                                  ? "bg-green-500"
                                  : "bg-gray-200 border border-gray-300"
                              }`}
                            >
                              {competence.completed && (
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
                            {index < angularCompetences.length - 1 && (
                              <div className="absolute top-5 left-2.5 w-px h-6 bg-gray-300"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {competence.text}
                          </p>
                        </div>
                      ))}
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
                      This quiz assesses your Java and Angular skills. Pass to
                      earn a badge for your profile. Take your time and good luck!
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
                      employers.
                    </p>
                  </div>
                </div>
              )}
            </div>
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
                  Completed Java Syntax - Dec 12, 2024
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
              {competitors.map((competitor) => (
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
              ))}
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