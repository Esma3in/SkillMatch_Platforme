import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaCode, FaCheck, FaExclamationCircle, FaArrowLeft, FaDownload } from 'react-icons/fa';
import { api } from '../api/api';
import NavbarCandidate from '../components/common/navbarCandidate';
import { toast } from 'react-toastify';
import { Footer } from '../components/common/footer';

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
    completedProblems: []
  });
  const [certificate, setCertificate] = useState(null);
  
  // Get candidate ID from localStorage
  const candidateId = localStorage.getItem('candidateId');
  
  useEffect(() => {
    const fetchChallengeData = async () => {
      setLoading(true);
      try {
        // Fetch challenge details
        const challengeResponse = await api.get(`api/training/challenges/${challengeId}`);
        setChallenge(challengeResponse.data);
        
        // Fetch problems
        const problemsResponse = await api.get(`api/training/challenges/${challengeId}/problems`);
        setProblems(problemsResponse.data);
        
        // Check enrollment status if candidateId exists
        if (candidateId) {
          try {
            // This endpoint would check if the candidate is enrolled and return progress
            const enrollmentResponse = await api.get(`api/training/challenges/${challengeId}/enrollment/${candidateId}`);
            setIsEnrolled(true);
            setProgress({
              completed: enrollmentResponse.data.completed_problems || 0,
              total: problemsResponse.data.length,
              percentage: enrollmentResponse.data.percentage || 0,
              completedProblems: enrollmentResponse.data.completed_problems_ids || []
            });
            
            // If challenge is completed, fetch certificate
            if (enrollmentResponse.data.is_completed && enrollmentResponse.data.certificate_id) {
              const certificateResponse = await api.get(`api/training/certificates/${enrollmentResponse.data.certificate_id}`);
              setCertificate(certificateResponse.data);
            }
          } catch (err) {
            // Not enrolled or other error
            setIsEnrolled(false);
            setProgress({
              completed: 0,
              total: problemsResponse.data.length,
              percentage: 0,
              completedProblems: []
            });
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load challenge details');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchChallengeData();
  }, [challengeId, candidateId]);
  
  const handleStartChallenge = async () => {
    if (!candidateId) {
      toast.error('You must be logged in to start a challenge');
      navigate('/login');
      return;
    }
    
    try {
      await api.post(`api/training/challenges/${challengeId}/start`, { candidate_id: candidateId });
      setIsEnrolled(true);
      toast.success('Challenge started successfully!');
      
      // Update progress
      setProgress(prev => ({
        ...prev,
        total: problems.length
      }));
    } catch (error) {
      toast.error('Failed to start challenge');
      console.error(error);
    }
  };
  
  const handleCompleteProblem = async (problemId) => {
    if (!isEnrolled || !candidateId) {
      toast.error('You must be enrolled in this challenge first');
      return;
    }
    
    try {
      const response = await api.post(`api/training/challenges/${challengeId}/update-progress`, {
        candidate_id: candidateId,
        problem_id: problemId,
        completed: true
      });
      
      // Update progress
      setProgress({
        completed: response.data.progress.completed,
        total: response.data.progress.total,
        percentage: response.data.progress.percentage,
        completedProblems: [...progress.completedProblems, problemId]
      });
      
      toast.success(response.data.message);
      
      // If challenge is completed and certificate is available
      if (response.data.certificate_id) {
        const certificateResponse = await api.get(`api/training/certificates/${response.data.certificate_id}`);
        setCertificate(certificateResponse.data);
      }
    } catch (error) {
      toast.error('Failed to update progress');
      console.error(error);
    }
  };
  
  const isProblemCompleted = (problemId) => {
    return progress.completedProblems.includes(problemId);
  };
  
  const getLevelBadgeClass = (level) => {
    const classes = {
      beginner: 'bg-green-100 text-green-800',
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800',
      advanced: 'bg-red-100 text-red-800',
      expert: 'bg-purple-100 text-purple-800'
    };
    
    return classes[level] || 'bg-gray-100 text-gray-800';
  };
  
  if (loading) {
    return (
      <>
        <NavbarCandidate />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid mb-4"></div>
            <p className="text-gray-600">Loading challenge details...</p>
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
          <FaExclamationCircle className="inline-block text-4xl mb-4" />
          <p>{error}</p>
        </div>
      </>
    );
  }
  
  return (
    <>
      <NavbarCandidate />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link to="/challenges" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              <FaArrowLeft className="mr-2" /> Back to Challenges
            </Link>
          </div>
          
          {/* Challenge Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <FaTrophy className="text-3xl text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">{challenge?.name}</h1>
            </div>
            <p className="text-lg text-gray-600 mb-4">{challenge?.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded">
                {challenge?.skill?.name || 'N/A'}
              </span>
              <span className={`text-sm font-semibold px-3 py-1 rounded ${getLevelBadgeClass(challenge?.level)}`}>
                {challenge?.level?.charAt(0).toUpperCase() + challenge?.level?.slice(1) || 'N/A'}
              </span>
            </div>
            
            {/* Progress Bar */}
            {isEnrolled && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-700">{progress.completed}/{progress.total} completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Action Button */}
            {!isEnrolled ? (
              <button
                onClick={handleStartChallenge}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Challenge
              </button>
            ) : progress.completed === progress.total ? (
              <div className="mt-4 text-green-600 font-semibold flex items-center">
                <FaCheck className="mr-2" /> Challenge Completed!
              </div>
            ) : (
              <p className="mt-4 text-gray-600">
                Complete all problems to earn your certificate!
              </p>
            )}
          </div>
          
          {/* Certificate Section (if completed) */}
          {certificate && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-yellow-400">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
                    <FaTrophy className="text-yellow-500 mr-2" /> Certificate of Completion
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Congratulations on completing the {challenge.name} challenge!
                  </p>
                  <div className="text-sm text-gray-600">
                    <p><strong>Certificate ID:</strong> {certificate.certificate_id}</p>
                    <p><strong>Issued on:</strong> {certificate.completion_date}</p>
                    <p><strong>Skill:</strong> {certificate.skill}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.open(`/certificates/${certificate.certificate_id}`, '_blank')}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center"
                >
                  <FaDownload className="mr-2" /> View Certificate
                </button>
              </div>
            </div>
          )}
          
          {/* Problems List */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Challenge Problems</h2>
            
            <div className="space-y-4">
              {problems.length > 0 ? (
                problems.map((problem, index) => (
                  <div 
                    key={problem.id}
                    className={`border rounded-lg p-4 ${isProblemCompleted(problem.id) ? 'bg-green-50 border-green-200' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          {isProblemCompleted(problem.id) && <FaCheck className="text-green-500 mr-2" />}
                          Problem {index + 1}: {problem.name}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {problem.description && problem.description.length > 100
                            ? `${problem.description.substring(0, 100)}...`
                            : problem.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getLevelBadgeClass(problem.level)}`}>
                            {problem.level}
                          </span>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {problem.skill?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        {isProblemCompleted(problem.id) ? (
                          <span className="text-green-600 font-medium flex items-center">
                            <FaCheck className="mr-1" /> Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              // Navigate to problem page
                              window.open(`/problems/${problem.id}`, '_blank');
                              // Mark as completed (in a real app, this would happen after actual completion)
                              handleCompleteProblem(problem.id);
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                            disabled={!isEnrolled}
                          >
                            <FaCode className="mr-2" /> Solve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No problems found for this challenge.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 