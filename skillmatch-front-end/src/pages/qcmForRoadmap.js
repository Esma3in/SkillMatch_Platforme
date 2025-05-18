import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import BadgeGenerator from "./BadgeGenerator";

const QcmForRoadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qcmData, setQcmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [progressAnimationWidth, setProgressAnimationWidth] = useState("0%");
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const candidateId = localStorage.getItem("candidate_id")
    ? JSON.parse(localStorage.getItem("candidate_id"))
    : null;

  // Fetch and process quiz data
  useEffect(() => {
    const fetchQcmData = async () => {
      try {
        const response = await api.get(`/api/qcm/roadmap/${id}`);
        const formattedData = response.data.map((item) => {
          let options = [];
          if (typeof item.options === "string") {
            try {
              options = JSON.parse(item.options);
            } catch (e) {
              if (process.env.NODE_ENV !== "production") {
                console.error(`Failed to parse options for question ${item.id}:`, item.options, e);
              }
              options = [];
            }
          } else if (Array.isArray(item.options)) {
            options = item.options;
          }

          const optionMap = {};
          if (Array.isArray(options) && options.length > 0) {
            options.forEach((option, index) => {
              const key = `option_${String.fromCharCode(97 + index)}`;
              optionMap[key] = option;
            });
          } else if (process.env.NODE_ENV !== "production") {
            console.warn(`No valid options found for question ${item.id}`);
          }

          return { ...item, ...optionMap, parsedOptions: options };
        });

        // Group questions by course
        const questionsByCourse = {};
        formattedData.forEach((question) => {
          const courseName = question.course_name || "General";
          if (!questionsByCourse[courseName]) {
            questionsByCourse[courseName] = [];
          }
          questionsByCourse[courseName].push(question);
        });

        // Select 2-3 questions per course, with a total cap of 20
        const courseNames = Object.keys(questionsByCourse);
        let finalQuestions = [];
        const maxTotalQuestions = 20;
        const questionsPerCourse = Math.min(3, Math.max(2, Math.floor(maxTotalQuestions / courseNames.length)));

        courseNames.forEach((courseName) => {
          const courseQuestions = questionsByCourse[courseName];
          const questionsToTake = Math.min(questionsPerCourse, courseQuestions.length);
          const selectedQuestions = courseQuestions.sort(() => Math.random() - 0.5).slice(0, questionsToTake);
          finalQuestions = [...finalQuestions, ...selectedQuestions];
        });

        // Cap at 20 questions
        finalQuestions = finalQuestions.slice(0, maxTotalQuestions);

        // Shuffle options while preserving correct answer
        const randomizedData = finalQuestions.map((question) => {
          if (question.parsedOptions && Array.isArray(question.parsedOptions) && question.parsedOptions.length > 0) {
            const originalOptions = [...question.parsedOptions];
            const correctText = question.correct_answer.startsWith("option_")
              ? originalOptions[parseInt(question.correct_answer.replace("option_", "")) - 97] || question.correct_answer
              : question.correct_answer;

            const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
            const newCorrectIndex = shuffledOptions.findIndex((opt) => opt === correctText);
            const newOptionMap = {};
            shuffledOptions.forEach((option, index) => {
              const key = `option_${String.fromCharCode(97 + index)}`;
              newOptionMap[key] = option;
            });

            return {
              ...question,
              ...newOptionMap,
              parsedOptions: shuffledOptions,
              correct_answer: `option_${String.fromCharCode(97 + newCorrectIndex)}`,
            };
          }
          return question;
        });

        setQcmData(randomizedData);
        const initialAnswers = {};
        randomizedData.forEach((item) => {
          initialAnswers[item.id] = "";
        });
        setSelectedAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching quiz data");
        setLoading(false);
      }
    };
    fetchQcmData();
  }, [id]);

  // Timer logic
  useEffect(() => {

    if (loading || isSubmitted || isTimeUp) return;

    const timer = setInterval(() => {
      const handleTimeUp = () => {
        calculateScore();
        setIsSubmitted(true);
      };
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);

  }, [loading, isSubmitted, isTimeUp]);

  // Update progress animation width
  useEffect(() => {
    if (qcmData.length === 0) return;

    // Calculate how many questions have been answered
    const answeredQuestions = Object.values(selectedAnswers).filter((answer) => answer !== "").length;
    const progressPercentage = (answeredQuestions / qcmData.length) * 100;
    setProgressAnimationWidth(`${progressPercentage}%`);

  }, [selectedAnswers, qcmData]);

  // Handle time up


  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Time warning class
  const getTimeWarningClass = () => {
    if (timeLeft <= 60) return "text-red-600 animate-pulse font-bold";
    if (timeLeft <= 180) return "text-orange-500 font-semibold";
    return "text-gray-600";
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, option) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  // Calculate score
  const calculateScore = () => {
    let correctAnswers = 0;
    qcmData.forEach((question) => {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = question.correct_answer;

      if (userAnswer && userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / qcmData.length) * 100;
    setScore(calculatedScore);
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    // Check if all questions are answered
    const unansweredCount = qcmData.filter((q) => !selectedAnswers[q.id]).length;

    if (unansweredCount > 0) {
      setShowConfirmSubmit(true);
    } else {
      finalizeSubmission();
    }
  };

  const saveQuizResults = async () => {
    try {
      if (!candidateId) {
        setError("No candidate ID found. Please log in again.");
        return;
      }

      const candidateAnswersJson = JSON.stringify(selectedAnswers);
      const correctAnswersJson = JSON.stringify(
        qcmData.reduce((acc, question) => {
          acc[question.id] = question.correct_answer;
          return acc;
        }, {})
      );

      const response = await api.post("/api/qcm/saveResults", {
        score,
        candidateAnswer: candidateAnswersJson,
        correctAnswer: correctAnswersJson,
        candidate_id: candidateId,
        test_id: id,
        qcm_for_roadmapId: id,
      });

      if (response.data.success) {
        if (process.env.NODE_ENV !== "production") {
          console.log("Results saved successfully");
        }
      } else {
        setError(response.data.message || "Failed to save results");
      }
    } catch (error) {
      setError("Error saving quiz results. Please try again.");
      if (process.env.NODE_ENV !== "production") {
        console.error("Error saving quiz results:", error);
      }
    }
  };

  // Final submission
  const finalizeSubmission = () => {
    calculateScore();
    setIsSubmitted(true);
    setShowConfirmSubmit(false);
    saveQuizResults();
  };

  // Return to roadmap
  const handleReturnToRoadmap = () => {
    navigate(`/candidate/roadmap/${id}`);
  };

  // Move to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Move to next question
  const goToNextQuestion = () => {
    if (currentQuestion < qcmData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (!isSubmitted) {
      handleSubmitQuiz();
    }
  };

  // Navigate to specific question
  const goToQuestion = (index) => {
    if (index >= 0 && index < qcmData.length) {
      setCurrentQuestion(index);
    }
  };

  // Jump to first unanswered question
  const goToFirstUnanswered = () => {
    const firstUnansweredIndex = qcmData.findIndex((q) => !selectedAnswers[q.id]);
    if (firstUnansweredIndex !== -1) {
      setCurrentQuestion(firstUnansweredIndex);
    }
  };

  // Get current question data
  const getCurrentQuestion = () => {
    return qcmData[currentQuestion] || {};
  };

  // Get total questions
  const getTotalQuestions = () => {
    return qcmData.length;
  };

  // Get answer style based on submission status
  const getAnswerStyle = (question, option) => {
    if (!isSubmitted) {
      return selectedAnswers[question.id] === option
        ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-300 shadow-md"
        : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300";
    }

    const isSelected = selectedAnswers[question.id] === option;
    const isCorrect = option === question.correct_answer;

    if (isSelected && isCorrect) return "bg-green-50 border-green-500 ring-2 ring-green-300";
    if (isSelected && !isCorrect) return "bg-red-50 border-red-500 ring-2 ring-red-300";
    if (!isSelected && isCorrect) return "bg-green-50 border-green-300 ring-1 ring-green-200";
    return "bg-white border-gray-200 opacity-70";
  };

  // Render options for a question
  const renderOptions = (question) => {
    if (!question.parsedOptions || !Array.isArray(question.parsedOptions) || question.parsedOptions.length === 0) {
      return <div className="text-red-500">No options available for this question</div>;
    }

    return question.parsedOptions.map((optionText, index) => {
      const option = `option_${String.fromCharCode(97 + index)}`;
      return (
        <div
          key={option}
          onClick={() => !isSubmitted && handleAnswerSelect(question.id, option)}
          className={`p-4 rounded-lg border mb-3 cursor-pointer transition-all ${getAnswerStyle(question, option)}`}
        >
          <div className="flex items-center">
            <div
              className={`w-8 h-8 mr-3 flex items-center justify-center rounded-full border ${
                selectedAnswers[question.id] === option
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-gray-400 text-gray-500"
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}</span>
            </div>
            <span className="text-gray-800">{optionText}</span>
          </div>
          {isSubmitted && option === question.correct_answer && (
            <div className="mt-2 flex items-center text-green-600 font-medium">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Correct answer
            </div>
          )}
          {isSubmitted && selectedAnswers[question.id] === option && option !== question.correct_answer && (
            <div className="mt-2 flex items-center text-red-600 font-medium">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              Incorrect choice
            </div>
          )}
        </div>
      );
    });
  };

  // Render quiz progress header
  const renderQuizHeader = () => {
    // Count answered questions
    const answeredCount = Object.values(selectedAnswers).filter((answer) => answer !== "").length;

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Skills Assessment</h1>
            <p className="text-gray-600">Test your knowledge on this roadmap</p>
          </div>
          <div className={`text-lg font-medium ${getTimeWarningClass()}`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
          <span>Progress: {answeredCount}/{qcmData.length} questions answered</span>
          <span>{Math.round((answeredCount / qcmData.length) * 100)}% complete</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: progressAnimationWidth }}
          ></div>
        </div>
      </div>
    );
  };

  // Render question navigation sidebar
  const renderQuestionSidebar = () => (
    <div className="hidden md:block bg-white rounded-xl shadow-md p-4 w-64 mr-6">
      <h3 className="font-medium text-gray-800 mb-3">Question Navigator</h3>
      <div className="grid grid-cols-5 gap-2">
        {qcmData.map((question, index) => {
          const hasAnswer = !!selectedAnswers[question.id];
          return (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-10 h-10 rounded-md flex items-center justify-center font-medium text-sm transition-all ${
                currentQuestion === index
                  ? "bg-indigo-600 text-white shadow-md"
                  : hasAnswer
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                    : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {!isSubmitted && (
        <div className="mt-4">
          <button
            onClick={goToFirstUnanswered}
            className="w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm font-medium flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Next unanswered
          </button>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-medium text-gray-800 mb-2">Question Status</h3>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-indigo-100 border border-indigo-300 mr-2"></div>
          <span className="text-sm text-gray-600">Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 mr-2"></div>
          <span className="text-sm text-gray-600">Unanswered</span>
        </div>
      </div>
    </div>
  );

  // Render question content
  const renderQuestionContent = () => (
    <div className="flex-1">
      <div className="bg-white p-6 rounded-xl shadow-md mb-4">
        <div className="flex items-center mb-6">
          <span className="bg-indigo-100 text-indigo-800 text-sm font-medium py-1 px-3 rounded-full">
            Question {currentQuestion + 1} of {getTotalQuestions()}
          </span>
          <div className="ml-3 flex items-center text-sm text-gray-500">
            <span className="bg-gray-100 py-1 px-3 rounded-full mr-2">{getCurrentQuestion().course_name || "General"}</span>
            <span className="bg-gray-100 py-1 px-3 rounded-full">{getCurrentQuestion().skill_name}</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-6">{getCurrentQuestion().question}</h3>

        <div className="space-y-1">{renderOptions(getCurrentQuestion())}</div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={goToPreviousQuestion}
          disabled={currentQuestion === 0}
          className={`flex items-center py-2 px-4 rounded-lg transition-all ${
            currentQuestion === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
          }`}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="md:hidden flex space-x-1">
          <span className="text-gray-600">
            {currentQuestion + 1}/{getTotalQuestions()}
          </span>
        </div>

        <button
          onClick={currentQuestion === qcmData.length - 1 ? handleSubmitQuiz : goToNextQuestion}
          disabled={isSubmitted}
          className={`flex items-center py-2 px-4 rounded-lg transition-all ${
            currentQuestion === qcmData.length - 1
              ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
          }`}
        >
          {currentQuestion === qcmData.length - 1 ? (
            <>
              Submit Quiz
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          ) : (
            <>
              Next
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Render confirmation modal
  const renderConfirmSubmitModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-4">
        <div className="text-center mb-4">
          <svg className="w-16 h-16 mx-auto text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mt-4">Confirm Submission</h2>
          <p className="text-gray-600 mt-2">
            You have {qcmData.filter((q) => !selectedAnswers[q.id]).length} unanswered questions. Are you sure you want to
            submit?
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowConfirmSubmit(false)}
            className="flex-1 py-2 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Continue Quiz
          </button>
          <button
            onClick={finalizeSubmission}
            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Submit Anyway
          </button>
        </div>
      </div>
    </div>
  );

  // Render time up message
  const renderTimeUpMessage = () => (
    <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md mx-auto mt-12">
      <svg className="w-24 h-24 mx-auto text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-3xl font-bold text-gray-900 mt-6">Time's Up!</h2>
      <p className="text-xl text-gray-600 mt-3">Your quiz has been submitted automatically.</p>
      <p className="text-lg text-gray-500 mt-1">Let's see how you did.</p>
      <button
        onClick={() => setIsTimeUp(false)}
        className="mt-8 bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-all shadow-md"
      >
        View Results
      </button>
    </div>
  );

  // Get score feedback
  const getScoreFeedback = () => {
    if (score >= 90) return { text: "Excellent!", color: "text-green-600", icon: "🏆" };
    if (score >= 75) return { text: "Great job!", color: "text-green-500", icon: "👏" };
    if (score >= 60) return { text: "Good effort!", color: "text-blue-500", icon: "👍" };
    if (score >= 40) return { text: "Keep practicing!", color: "text-yellow-500", icon: "📚" };
    return { text: "More study needed", color: "text-orange-500", icon: "📝" };
  };

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    const totalQuestions = qcmData.length;
    const correctCount = Math.round((score / 100) * totalQuestions);
    const incorrectCount = totalQuestions - correctCount;

    // Group by courses
    const coursePerformance = {};
    qcmData.forEach((question) => {
      const courseName = question.course_name || "General";
      if (!coursePerformance[courseName]) {
        coursePerformance[courseName] = { total: 0, correct: 0 };
      }

      coursePerformance[courseName].total++;
      if (selectedAnswers[question.id] === question.correct_answer) {
        coursePerformance[courseName].correct++;
      }
    });

    return {
      correctCount,
      incorrectCount,
      unattemptedCount: Object.values(selectedAnswers).filter((a) => a === "").length,
      coursePerformance,
    };
  };

  // Render results
  const renderResults = () => {
    const feedback = getScoreFeedback();
    const metrics = calculatePerformanceMetrics();

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Quiz Results</h2>
            <div className="mt-6 bg-gray-50 rounded-xl p-6 inline-block">
              <div className="text-6xl font-bold mb-2 flex items-center justify-center">
                <span className={feedback.color}>{score.toFixed(0)}%</span>
                <span className="ml-3">{feedback.icon}</span>
              </div>
              <p className={`text-xl ${feedback.color} font-medium`}>{feedback.text}</p>
              <p className="text-gray-600 mt-2">
                {metrics.correctCount} correct out of {qcmData.length} questions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-green-600 font-medium mb-1">Correct Answers</div>
              <div className="text-2xl font-bold text-green-700">{metrics.correctCount}</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-red-600 font-medium mb-1">Incorrect Answers</div>
              <div className="text-2xl font-bold text-red-700">{metrics.incorrectCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-gray-600 font-medium mb-1">Unattempted</div>
              <div className="text-2xl font-bold text-gray-700">{metrics.unattemptedCount}</div>
            </div>
          </div>

          {/* Performance by course */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance by Course</h3>
            <div className="space-y-3">
              {Object.entries(metrics.coursePerformance).map(([course, data]) => (
                <div key={course} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-800">{course}</span>
                    <span className="text-sm font-medium">
                      {data.correct}/{data.total} ({Math.round((data.correct / data.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(data.correct / data.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleReturnToRoadmap}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Roadmap
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Detailed Question Analysis</h3>

          <div className="space-y-6">
            {qcmData.map((question, index) => {
              const userAnswer = selectedAnswers[question.id];
              const isCorrect = userAnswer === question.correct_answer;

              const getAnswerText = (answerKey) => {
                if (!answerKey) return "No answer";
                if (answerKey.startsWith("option_")) {
                  const optionIndex = answerKey.charAt(answerKey.length - 1).charCodeAt(0) - 97;
                  return question.parsedOptions?.[optionIndex] || answerKey;
                }
                return answerKey;
              };

              return (
                <div
                  key={question.id}
                  className={`p-5 rounded-lg border ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                >
                  <div className="flex items-start">
                    <div
                      className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {isCorrect ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800">Question {index + 1}</span>
                        <div className="flex space-x-2 text-xs">
                          <span className="bg-gray-100 py-1 px-2 rounded-full">{question.course_name || "General"}</span>
                          <span className="bg-gray-100 py-1 px-2 rounded-full">{question.skill_name}</span>
                        </div>
                      </div>
                      <p className="font-medium text-gray-800 mb-3">{question.question}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div
                          className={`p-3 rounded-md ${userAnswer ? (isCorrect ? "bg-green-100" : "bg-red-100") : "bg-gray-100"}`}
                        >
                          <div className="text-sm text-gray-500">Your Answer</div>
                          <div className="font-medium">{getAnswerText(userAnswer) || "Unanswered"}</div>
                        </div>
                        <div className="p-3 rounded-md bg-green-100">
                          <div className="text-sm text-gray-500">Correct Answer</div>
                          <div className="font-medium">{getAnswerText(question.correct_answer)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <BadgeGenerator candidateId={candidateId} qcmForRoadmapId={id} score={score} />
      </div>
    );
  };

  // Main render
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading your assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Something went wrong</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={handleReturnToRoadmap}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Roadmap
          </button>
        </div>
      </div>
    );
  }

  if (isTimeUp) {
    return renderTimeUpMessage();
  }

  if (isSubmitted) {
    return <div className="max-w-4xl mx-auto p-6">{renderResults()}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {renderQuizHeader()}

      <div className="flex">
        {renderQuestionSidebar()}
        {renderQuestionContent()}
      </div>

      {/* Mobile question pagination */}
      <div className="md:hidden mt-6 bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-5 gap-2">
          {qcmData.slice(0, 10).map((question, index) => {
            const hasAnswer = !!selectedAnswers[question.id];
            return (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-full h-8 rounded-md flex items-center justify-center font-medium text-sm ${
                  currentQuestion === index
                    ? "bg-indigo-600 text-white"
                    : hasAnswer
                      ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        {qcmData.length > 10 && (
          <div className="grid grid-cols-5 gap-2 mt-2">
            {qcmData.slice(10, 20).map((question, index) => {
              const actualIndex = index + 10;
              const hasAnswer = !!selectedAnswers[question.id];
              return (
                <button
                  key={actualIndex}
                  onClick={() => goToQuestion(actualIndex)}
                  className={`w-full h-8 rounded-md flex items-center justify-center font-medium text-sm ${
                    currentQuestion === actualIndex
                      ? "bg-indigo-600 text-white"
                      : hasAnswer
                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300"
                        : "bg-gray-100 text-gray-700 border border-gray-300"
                  }`}
                >
                  {actualIndex + 1}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showConfirmSubmit && renderConfirmSubmitModal()}
    </div>
  );
};

export default QcmForRoadmap;