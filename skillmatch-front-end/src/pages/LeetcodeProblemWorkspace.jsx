import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarCandidate from "../components/common/navbarCandidate";
import { FaChevronLeft, FaPlay, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios"; // Import our configured axios instance
import { api as apiClient } from "../api/api"; // Import the api client used in other files

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

const LeetcodeProblemWorkspace = () => {
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
        const response = await api.get(`/leetcode/problems/${id}`);
        setProblem(response.data);
        
        // Set initial code from starter_code for selected language
        if (response.data.starter_code && response.data.starter_code[selectedLanguage.id]) {
          setCode(response.data.starter_code[selectedLanguage.id]);
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
      setSubmissionResult(null); // Clear previous submission results
    }
  }, [selectedLanguage, problem]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    console.log("Submit button clicked - starting submission process");
    setIsSubmitting(true);
    setSubmissionResult(null);
    
    // Ensure we have a valid code submission
    if (!code || code.trim().length === 0) {
      setSubmissionResult({
        submission: {
          status: "compilation_error",
          test_results: {
            passed: false,
            passed_tests: 0,
            total_tests: 0
          }
        },
        message: "Empty code submission. Please write some code before submitting."
      });
      showNotification('error', 'Empty code submission. Please write some code before submitting.');
      setIsSubmitting(false);
      return;
    }
    
    console.log(`Preparing to submit code for problem ${id} using language: ${selectedLanguage.id}`);
    
    try {
      // Create a FormData object to ensure proper POST submission
      const formData = new FormData();
      formData.append('code', code);
      formData.append('language', selectedLanguage.id);
      
      // For debugging - log all form data
      for (let pair of formData.entries()) {
        console.log(`FormData contains: ${pair[0]}: ${pair[1]}`);
      }
      
      // Using explicit fetch with POST method and proper headers
      const submitUrl = `http://localhost:8000/api/leetcode/problems/${id}/submit`;
      console.log(`Sending POST request to ${submitUrl}`);
      
      // Try both FormData and JSON approaches
      let response;
      
      // First try with FormData 
      response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
          // Note: Content-Type is automatically set with FormData
        },
        credentials: 'include',
        body: formData
      });
      
      if (!response.ok) {
        console.log("FormData approach failed, trying JSON...");
        
        // If FormData fails, try with JSON
        response = await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include',
          body: JSON.stringify({
            code: code,
            language: selectedLanguage.id
          })
        });
      }
      
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data && data.submission) {
        setSubmissionResult(data);
        
        // Add to local submissions list for display
        if (problem && Array.isArray(problem.submissions)) {
          setProblem({
            ...problem,
            submissions: [data.submission, ...problem.submissions]
          });
        }
        
        // Show success or error notification
        if (data.submission.status === 'accepted') {
          showNotification('success', 'Great job! Your solution passed all test cases.');
          setShowCelebration(true);
          
          // Mark as completed in any active challenges
          const candidateId = localStorage.getItem('candidate_id');
          if (candidateId) {
            try {
              await apiClient.post(`api/training/problems/${id}/mark-completed`, {
                candidate_id: candidateId,
                problem_type: 'leetcode'
              });
              console.log("Problem marked as completed in challenges");
            } catch (err) {
              console.error("Error marking problem as completed:", err);
            }
          }
        } else {
          showNotification('error', `Your solution was not accepted: ${data.message}`);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error submitting solution:", err);
      
      // Provide a clear error message
      setSubmissionResult({
        submission: {
          status: "error",
          test_results: {
            passed: false,
            passed_tests: 0,
            total_tests: 0
          }
        },
        message: `Submission error: ${err.message}`
      });
      
      showNotification('error', `Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubmissionStatusUI = () => {
    if (!submissionResult) return null;

    const status = submissionResult.submission.status;
    
    let icon, text, bgColor, textColor;
    
    switch(status) {
      case "accepted":
        icon = <FaCheck className="text-green-500" size={20} />;
        text = "Accepted";
        bgColor = "bg-green-100";
        textColor = "text-green-800";
        break;
      case "wrong_answer":
        icon = <FaTimes className="text-red-500" size={20} />;
        text = "Wrong Answer";
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "time_limit_exceeded":
        icon = <FaTimes className="text-yellow-500" size={20} />;
        text = "Time Limit Exceeded";
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "memory_limit_exceeded":
        icon = <FaTimes className="text-yellow-500" size={20} />;
        text = "Memory Limit Exceeded";
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        break;
      case "runtime_error":
        icon = <FaTimes className="text-red-500" size={20} />;
        text = "Runtime Error";
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "compilation_error":
        icon = <FaTimes className="text-red-500" size={20} />;
        text = "Compilation Error";
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      case "error":
        icon = <FaTimes className="text-red-500" size={20} />;
        text = "Error";
        bgColor = "bg-red-100";
        textColor = "text-red-800";
        break;
      default:
        icon = <FaTimes className="text-gray-500" size={20} />;
        text = "Unknown Status";
        bgColor = "bg-gray-100";
        textColor = "text-gray-800";
    }
    
    const hasFailedTests = 
      submissionResult.submission.failed_test_details && 
      submissionResult.submission.failed_test_details.length > 0;
    
    return (
      <div className={`mt-4 p-4 rounded-md ${bgColor}`}>
        <div className={`flex items-center gap-2 ${textColor} font-medium text-lg`}>
          {icon} {text}
        </div>
        
        <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-md">
          <p className="font-semibold mb-2">{submissionResult.message}</p>
          
          {submissionResult.submission.test_results && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-2 items-center mb-2">
                <span className="font-medium">Test Results:</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  status === 'accepted' 
                    ? 'bg-green-200 text-green-800' 
                    : 'bg-red-200 text-red-800'
                }`}>
                  {submissionResult.submission.test_results.passed_tests || 0} / {submissionResult.submission.test_results.total_tests || 0} passed
                </span>
              </div>
              
              {submissionResult.submission.execution_time !== undefined && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Execution Time:</span> {submissionResult.submission.execution_time} ms
                </p>
              )}
              
              {submissionResult.submission.memory_used !== undefined && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Memory Used:</span> {submissionResult.submission.memory_used} KB
                </p>
              )}
              
              {submissionResult.submission.test_results.error_message && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  <p className="font-medium">Error Message:</p>
                  <pre className="whitespace-pre-wrap mt-1 text-xs bg-gray-50 p-2 rounded">
                    {submissionResult.submission.test_results.error_message}
                  </pre>
                </div>
              )}
            </div>
          )}
          
          {/* Show failed test details */}
          {hasFailedTests && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Failed Test Cases:</h4>
              <div className="space-y-3">
                {submissionResult.submission.failed_test_details.map((test, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded-md border border-red-200">
                    <p className="font-medium text-red-800">Test Case {test.testCase}</p>
                    <div className="mt-1 grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Input:</span> 
                        <pre className="whitespace-pre-wrap bg-white p-1 rounded mt-1 text-xs">
                          {test.input}
                        </pre>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="font-medium">Expected:</span>
                          <pre className="whitespace-pre-wrap bg-white p-1 rounded mt-1 text-xs">
                            {JSON.stringify(test.expected, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium">Your Output:</span>
                          <pre className="whitespace-pre-wrap bg-white p-1 rounded mt-1 text-xs">
                            {JSON.stringify(test.actual, null, 2)}
                          </pre>
                        </div>
                      </div>
                      {test.error && (
                        <div>
                          <span className="font-medium text-red-600">Error:</span>
                          <pre className="whitespace-pre-wrap bg-white p-1 rounded mt-1 text-xs">
                            {test.error}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {status === 'wrong_answer' && !hasFailedTests && (
          <div className="mt-4 text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">
            <p className="font-medium text-yellow-800">Debugging Tips:</p>
            <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
              <li>Check your algorithm logic - are you handling edge cases?</li>
              <li>Make sure your return format matches the expected output format</li>
              <li>Try with the example test cases first to verify your solution</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
          <p className="text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="text-center py-16 text-red-500">
        <FaTimes className="inline-block text-4xl mb-4" />
        <p>{error || "Problem not found"}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gray-100">
        {/* Notification component */}
        <AnimatePresence>
          {notification && (
            <Notification 
              type={notification.type} 
              message={notification.message} 
              onClose={hideNotification} 
            />
          )}
        </AnimatePresence>
        
        {/* Celebration popup */}
        <AnimatePresence>
          {showCelebration && (
            <SuccessCelebration onClose={() => setShowCelebration(false)} />
          )}
        </AnimatePresence>
        
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
            >
              <FaChevronLeft /> Back to Problems
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                    problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </span>
                  {problem.skill && (
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {problem.skill.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Problem Description */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    className={`px-4 py-3 font-medium ${activeTab === 'description' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                  <button
                    className={`px-4 py-3 font-medium ${activeTab === 'examples' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('examples')}
                  >
                    Examples
                  </button>
                  <button
                    className={`px-4 py-3 font-medium ${activeTab === 'submissions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('submissions')}
                  >
                    Your Submissions
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Problem Description</h3>
                    <div className="whitespace-pre-line">
                      {problem.description}
                    </div>
                    
                    {problem.constraints && (
                      <>
                        <h4 className="text-lg font-medium mt-6 mb-2">Constraints:</h4>
                        <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap">{problem.constraints}</pre>
                      </>
                    )}
                  </div>
                )}
                
                {activeTab === 'examples' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Examples</h3>
                    {problem.examples && problem.examples.map((example, index) => (
                      <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 mb-2">Example {index + 1}:</h4>
                        <div className="mb-3">
                          <span className="font-medium text-gray-700">Input:</span>
                          <pre className="bg-gray-100 p-2 mt-1 rounded text-sm overflow-x-auto">{example.input}</pre>
                        </div>
                        <div className="mb-3">
                          <span className="font-medium text-gray-700">Output:</span>
                          <pre className="bg-gray-100 p-2 mt-1 rounded text-sm overflow-x-auto">{example.output}</pre>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="font-medium text-gray-700">Explanation:</span>
                            <p className="mt-1 text-sm text-gray-600">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'submissions' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Your Submissions</h3>
                    {problem.submissions && problem.submissions.length > 0 ? (
                      <div className="space-y-4">
                        {problem.submissions.map((submission, index) => (
                          <div key={index} className={`p-4 rounded-lg border ${
                            submission.status === 'accepted' ? 'border-green-200 bg-green-50' : 
                            'border-red-200 bg-red-50'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-medium ${
                                submission.status === 'accepted' ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {submission.status.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(submission.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Language:</span> {submission.language}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">You haven't submitted any solutions yet.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Panel - Code Editor */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="language-select" className="text-sm font-medium text-gray-700 mr-2">
                      Language:
                    </label>
                    <select
                      id="language-select"
                      value={selectedLanguage.id}
                      onChange={(e) => {
                        const selected = LANGUAGES.find(lang => lang.id === e.target.value);
                        if (selected) handleLanguageChange(selected);
                      }}
                      className="border-gray-300 rounded text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {LANGUAGES.map(lang => (
                        <option key={lang.id} value={lang.id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Use a form to ensure a proper POST request */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    id="code-submission-form"
                    method="post" 
                    action={`http://localhost:8000/api/leetcode/problems/${id}/submit`}
                  >
                    <input type="hidden" name="language" value={selectedLanguage.id} />
                    <input type="hidden" name="code" value={code} />
                    
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${
                          isSubmitting 
                            ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>
                            <FaPlay /> Run Code
                          </>
                        )}
                      </button>
                      
                      {/* Debug button - direct form POST */}
                      <button
                        type="button"
                        onClick={() => {
                          // Create a temporary form and submit it
                          const debugForm = document.createElement('form');
                          debugForm.method = 'POST';
                          debugForm.action = `http://localhost:8000/api/leetcode/debug/${id}`;
                          
                          const codeInput = document.createElement('input');
                          codeInput.type = 'hidden';
                          codeInput.name = 'code';
                          codeInput.value = code;
                          debugForm.appendChild(codeInput);
                          
                          const langInput = document.createElement('input');
                          langInput.type = 'hidden';
                          langInput.name = 'language';
                          langInput.value = selectedLanguage.id;
                          debugForm.appendChild(langInput);
                          
                          document.body.appendChild(debugForm);
                          debugForm.submit();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Debug
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="p-0">
                <textarea
                  form="code-submission-form"
                  name="code"
                  value={code}
                  onChange={handleCodeChange}
                  className="w-full h-96 p-4 font-mono text-sm border-0 focus:ring-0 focus:border-0"
                  spellCheck="false"
                />
              </div>
              
              {/* Submission Results */}
              {submissionResult && (
                <div className="px-6 pb-6">
                  {getSubmissionStatusUI()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeetcodeProblemWorkspace; 