import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarCandidate from "../components/common/navbarCandidate";
import { FaChevronLeft, FaPlay, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../api/api";
import { Footer } from "../components/common/footer";

// Define available programming languages
const LANGUAGES = [
  { id: "javascript", name: "JavaScript", syntax: "javascript" },
  { id: "python", name: "Python", syntax: "python" },
  { id: "java", name: "Java", syntax: "java" },
  { id: "php", name: "PHP", syntax: "php" }
];

// Notification component
const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  // Define styles based on notification type
  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const borderColor = type === 'success' ? 'border-green-500' : 'border-red-500';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-20 right-5 z-50 p-4 rounded-lg shadow-lg border ${borderColor} ${bgColor} max-w-md`}
      style={{ 
        fontFamily: 'Inter, sans-serif',
        width: '350px'
      }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <p className={`font-medium ${textColor}`}>
            {type === 'success' ? 'Success!' : 'Error'}
          </p>
          <p className={`mt-1 text-sm ${textColor}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
            className={`inline-flex ${textColor} hover:bg-gray-100 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <span className="sr-only">Close</span>
            <FaTimes />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Celebration popup for successful submissions
const SuccessCelebration = ({ onClose }) => {
  useEffect(() => {
    // Auto-close after 7 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto z-10 text-center"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <div className="h-20 w-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
          <FaCheck className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
        <p className="text-gray-600 mb-6">Congratulations! Your solution passed all test cases.</p>
        <div className="mb-6">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 animate-pulse rounded-full"></div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  );
};

const ProblemWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [notification, setNotification] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Function to show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
  };
  
  // Function to hide notification
  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await api.get(`api/training/problems/${id}`);
        setProblem(response.data);
        
        // Set initial code from starter_code for selected language
        if (response.data.starter_code && response.data.starter_code[selectedLanguage.id]) {
          setCode(response.data.starter_code[selectedLanguage.id]);
        } else {
          // Default starter code if none is provided
          const defaultStarterCode = {
            javascript: "// Write your JavaScript solution here\n\nfunction solution(input) {\n  // Your code here\n  \n  return result;\n}",
            python: "# Write your Python solution here\n\ndef solution(input):\n    # Your code here\n    \n    return result",
            java: "// Write your Java solution here\n\npublic class Solution {\n    public static String solution(String input) {\n        // Your code here\n        \n        return result;\n    }\n}",
            php: "<?php\n// Write your PHP solution here\n\nfunction solution($input) {\n    // Your code here\n    \n    return $result;\n}\n?>"
          };
          
          setCode(defaultStarterCode[selectedLanguage.id]);
        }
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch problem details");
        setLoading(false);
        console.error("Error fetching problem:", err);
      }
    };

    fetchProblem();
  }, [id, selectedLanguage.id]);

  // Update code when language changes
  useEffect(() => {
    if (problem?.starter_code && problem.starter_code[selectedLanguage.id]) {
      setCode(problem.starter_code[selectedLanguage.id]);
    }
    setSubmissionResult(null); // Clear previous submission results
  }, [selectedLanguage, problem]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    
    // Ensure we have a valid code submission
    if (!code || code.trim().length === 0) {
      showNotification('error', 'Empty code submission. Please write some code before submitting.');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await api.post(`api/training/problems/${id}/submit`, {
        code: code,
        language: selectedLanguage.id
      });
      
      setSubmissionResult(response.data);
      
      if (response.data?.success) {
        showNotification('success', 'Your solution passed all test cases!');
        setShowCelebration(true);
        
        // Mark as completed in any active challenges
        const candidateId = localStorage.getItem('candidate_id');
        if (candidateId) {
          try {
            await api.post(`api/training/problems/${id}/mark-completed`, {
              candidate_id: candidateId,
              problem_type: 'standard'
            });
            console.log("Problem marked as completed in challenges");
          } catch (err) {
            console.error("Error marking problem as completed:", err);
          }
        }
      } else {
        showNotification('error', response.data?.message || 'Your solution failed some test cases.');
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      showNotification('error', 'Failed to submit your solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunCode = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await api.post(`api/training/problems/${id}/run`, {
        code: code,
        language: selectedLanguage.id
      });
      
      setSubmissionResult(response.data);
      if (response.data?.success) {
        showNotification('success', 'Code ran successfully!');
      } else {
        showNotification('error', response.data?.message || 'Error running your code.');
      }
    } catch (err) {
      console.error("Error running code:", err);
      showNotification('error', 'Failed to run your code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const getSubmissionStatusUI = () => {
    if (!submissionResult) return null;
    
    if (submissionResult.success) {
      return (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
          <h3 className="text-green-800 font-semibold flex items-center">
            <FaCheck className="mr-2" /> Success
          </h3>
          <p className="text-green-700 mt-2">All test cases passed!</p>
          <div className="mt-3 bg-white rounded p-3 text-sm">
            <p className="font-medium">Execution Time: {submissionResult.execution_time || 'N/A'}</p>
            <p className="font-medium">Memory Used: {submissionResult.memory_used || 'N/A'}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <h3 className="text-red-800 font-semibold flex items-center">
            <FaTimes className="mr-2" /> Failed
          </h3>
          <p className="text-red-700 mt-2">{submissionResult.message || 'Some test cases failed.'}</p>
          {submissionResult.error && (
            <div className="mt-3 bg-white rounded p-3 text-sm font-mono overflow-x-auto">
              <pre className="whitespace-pre-wrap">{submissionResult.error}</pre>
            </div>
          )}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
            <p className="text-gray-600">Loading problem...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarCandidate />
        <div className="text-center py-16 text-red-500">
          <FaTimes className="inline-block text-4xl mb-4" />
          <p>{error}</p>
          <button
            onClick={handleBackClick}
            className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCandidate />
      <AnimatePresence>
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={hideNotification}
          />
        )}
        {showCelebration && (
          <SuccessCelebration onClose={() => setShowCelebration(false)} />
        )}
      </AnimatePresence>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaChevronLeft className="mr-2" /> Back to problems
          </button>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Problem Header */}
            <div className="bg-indigo-600 text-white p-6">
              <h1 className="text-2xl font-bold">{problem?.name}</h1>
              <div className="flex mt-2 space-x-2">
                <span className={`text-sm px-2 py-1 rounded-full ${
                  problem?.level === 'easy' ? 'bg-green-200 text-green-800' :
                  problem?.level === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {problem?.level?.charAt(0).toUpperCase() + problem?.level?.slice(1) || 'N/A'}
                </span>
                <span className="bg-blue-200 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {problem?.skill?.name || 'General'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row h-[calc(100vh-250px)]">
              {/* Left Panel - Problem Description */}
              <div className="lg:w-1/2 p-6 overflow-y-auto border-r border-gray-200">
                <div className="mb-4">
                  <div className="flex border-b border-gray-200">
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeTab === 'description' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('description')}
                    >
                      Description
                    </button>
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeTab === 'solution' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'
                      }`}
                      onClick={() => setActiveTab('solution')}
                    >
                      Solution
                    </button>
                  </div>
                </div>
                
                {activeTab === 'description' ? (
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-bold mb-4">Problem Description</h2>
                    <p className="mb-4">{problem?.description}</p>
                    
                    {problem?.example && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Example</h3>
                        <div className="bg-gray-50 p-4 rounded-md font-mono text-sm">
                          <pre className="whitespace-pre-wrap">{problem.example}</pre>
                        </div>
                      </div>
                    )}
                    
                    {problem?.constraints && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Constraints</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <pre className="whitespace-pre-wrap">{problem.constraints}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-bold mb-4">Solution Approach</h2>
                    {problem?.solution ? (
                      <div dangerouslySetInnerHTML={{ __html: problem.solution }} />
                    ) : (
                      <p>No solution provided for this problem yet.</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Panel - Code Editor */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="p-4 bg-gray-100 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {LANGUAGES.map((language) => (
                        <button
                          key={language.id}
                          onClick={() => handleLanguageChange(language)}
                          className={`px-3 py-1.5 text-sm rounded ${
                            selectedLanguage.id === language.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {language.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <textarea
                    value={code}
                    onChange={handleCodeChange}
                    className="w-full h-full p-4 font-mono text-sm focus:outline-none border-0 resize-none"
                    placeholder="Write your code here..."
                    spellCheck="false"
                  />
                </div>
                
                <div className="p-4 bg-gray-100 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <button
                        onClick={handleRunCode}
                        disabled={isSubmitting}
                        className="bg-gray-700 text-white px-4 py-2 rounded mr-2 hover:bg-gray-800 disabled:opacity-50 flex items-center"
                      >
                        {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaPlay className="mr-2" />}
                        Run
                      </button>
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                    >
                      {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
                      Submit
                    </button>
                  </div>
                  
                  {getSubmissionStatusUI()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProblemWorkspace; 