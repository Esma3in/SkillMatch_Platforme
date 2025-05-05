import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api";

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

  // Fetch and process quiz data
  useEffect(() => {
    const fetchQcmData = async () => {
      try {
        const response = await api.get(`/api/qcm/roadmap/${id}`);
        const formattedData = response.data.map(item => {
          let options = [];
          if (typeof item.options === 'string') {
            try {
              options = JSON.parse(item.options);
            } catch (e) {
              console.error(`Failed to parse options for question ${item.id}:`, item.options, e);
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
          } else {
            console.warn(`No valid options found for question ${item.id}`);
          }

          return { ...item, ...optionMap, parsedOptions: options };
        });

        // Group questions by course
        const questionsByCourse = {};
        formattedData.forEach(question => {
          const courseName = question.course_name || 'General';
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

        courseNames.forEach(courseName => {
          const courseQuestions = questionsByCourse[courseName];
          const questionsToTake = Math.min(questionsPerCourse, courseQuestions.length);
          const selectedQuestions = courseQuestions
            .sort(() => Math.random() - 0.5) // Shuffle questions within each course
            .slice(0, questionsToTake);
          finalQuestions = [...finalQuestions, ...selectedQuestions];
        });

        // Cap at 20 questions
        finalQuestions = finalQuestions.slice(0, maxTotalQuestions);

        // Shuffle options while preserving correct answer
        const randomizedData = finalQuestions.map(question => {
          if (question.parsedOptions && Array.isArray(question.parsedOptions) && question.parsedOptions.length > 0) {
            const originalOptions = [...question.parsedOptions];
            const correctText = question.correct_answer.startsWith('option_')
              ? originalOptions[question.correct_answer.charAt(question.correct_answer.length - 1).charCodeAt(0) - 97]
              : question.correct_answer;

            const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
            const newCorrectIndex = shuffledOptions.findIndex(opt => opt === correctText);
            const newOptionMap = {};
            shuffledOptions.forEach((option, index) => {
              const key = `option_${String.fromCharCode(97 + index)}`;
              newOptionMap[key] = option;
            });

            return {
              ...question,
              ...newOptionMap,
              parsedOptions: shuffledOptions,
              correct_answer: `option_${String.fromCharCode(97 + newCorrectIndex)}`
            };
          }
          return question;
        });

        setQcmData(randomizedData);
        const initialAnswers = {};
        randomizedData.forEach(item => {
          initialAnswers[item.id] = "";
        });
        setSelectedAnswers(initialAnswers); // Fixed: Changed initialResults to initialAnswers
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
      setTimeLeft(prevTime => {
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

  // Handle time up
  const handleTimeUp = () => {
    calculateScore();
    setIsSubmitted(true);
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, option) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    calculateScore();
    setIsSubmitted(true);
  };

  // Calculate score
  const calculateScore = () => {
    let correctAnswers = 0;
    qcmData.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = question.correct_answer;
      
      if (userAnswer && userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const calculatedScore = (correctAnswers / qcmData.length) * 100;
    setScore(calculatedScore);
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
        ? "bg-purple-100 border-purple-500"
        : "bg-white border-gray-200 hover:bg-gray-50";
    }

    const isSelected = selectedAnswers[question.id] === option;
    const isCorrect = option === question.correct_answer;

    if (isSelected && isCorrect) return "bg-green-100 border-green-500";
    if (isSelected && !isCorrect) return "bg-red-100 border-red-500";
    if (!isSelected && isCorrect) return "bg-green-50 border-green-300";
    return "bg-white border-gray-200";
  };

  // Render options for a question
  const renderOptions = (question) => {
    if (question.parsedOptions && Array.isArray(question.parsedOptions) && question.parsedOptions.length > 0) {
      return question.parsedOptions.map((optionText, index) => {
        const option = `option_${String.fromCharCode(97 + index)}`;
        return (
          <div
            key={option}
            onClick={() => !isSubmitted && handleAnswerSelect(question.id, option)}
            className={`p-4 rounded-lg border mb-3 cursor-pointer transition-all ${getAnswerStyle(question, option)}`}
          >
            <div className="flex items-center">
              <div className={`w-6 h-6 mr-3 flex items-center justify-center rounded-full border ${
                selectedAnswers[question.id] === option
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-400'
              }`}>
                <span className="text-white font-medium">{String.fromCharCode(65 + index)}</span>
              </div>
              <span>{optionText}</span>
            </div>
            {isSubmitted && option === question.correct_answer && (
              <div className="mt-2 text-green-600 font-medium">Correct answer</div>
            )}
          </div>
        );
      });
    }
    return <div className="text-red-500">No options available for this question</div>;
  };

  // Render pagination buttons
  const renderPagination = () => (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={goToPreviousQuestion}
        disabled={currentQuestion === 0}
        className={`px-4 py-2 rounded ${
          currentQuestion === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Previous
      </button>

      <div className="flex space-x-1">
        {qcmData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`⊂w-8 h-8 rounded-full flex items-center justify-center ${
              currentQuestion === index
                ? 'bg-purple-600 text-white'
                : selectedAnswers[qcmData[index]?.id]
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-white border border-gray-300 text-gray-700'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={goToNextQuestion}
        disabled={isSubmitted}
        className={`px-4 py-2 rounded ${
          currentQuestion === qcmData.length - 1
            ? isSubmitted
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        {currentQuestion === qcmData.length - 1 && !isSubmitted ? 'Submit' : 'Next'}
      </button>
    </div>
  );

  // Render results
  const renderResults = () => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Quiz Results</h2>
        <p className="text-gray-600 mt-2">
          You scored {score.toFixed(0)}% ({Math.round((score / 100) * qcmData.length)} out of {qcmData.length})
        </p>
        <button
          onClick={handleReturnToRoadmap}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Return to Roadmap
        </button>
      </div>

      <div className="space-y-6">
        {qcmData.map((question, index) => {
          const userAnswer = selectedAnswers[question.id];
          const isCorrect = userAnswer === question.correct_answer;

          const getAnswerText = (answerKey) => {
            if (!answerKey) return 'No answer';
            if (answerKey.startsWith('option_')) {
              const optionIndex = answerKey.charAt(answerKey.length - 1).charCodeAt(0) - 97;
              return question.parsedOptions?.[optionIndex] || answerKey;
            }
            return answerKey;
          };

          return (
            <div
              key={question.id}
              className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
            >
              <div className="font-semibold">{index + 1}. {question.question}</div>
              <div className="mt-2">
                <span className="font-medium">Your answer:</span>{" "}
                {getAnswerText(userAnswer)}
              </div>
              <div>
                <span className="font-medium">Correct answer:</span>{" "}
                {getAnswerText(question.correct_answer)}
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Course: {question.course_name || 'General'} | Skill: {question.skill_name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render time up message
  const renderTimeUpMessage = () => (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      <svg className="w-16 h-16 mx-auto text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-900 mt-4">Time's Up!</h2>
      <p className="text-gray-600 mt-2">Your quiz has been submitted automatically.</p>
      <p className="text-gray-600">Let's see how you did.</p>
      <button
        onClick={() => setIsTimeUp(false)}
        className="mt-6 bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-all"
      >
        View Results
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && isTimeUp && renderTimeUpMessage()}
      {!loading && !error && isSubmitted && !isTimeUp && renderResults()}
      {!loading && !error && !isSubmitted && !isTimeUp && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Question {currentQuestion + 1} / {getTotalQuestions()}</h2>
            <div className="text-gray-600">Time Left: {formatTime(timeLeft)}</div>
          </div>
          <div className="bg-white p-6 rounded shadow mb-4">
            <h3 className="text-lg font-semibold mb-4">{getCurrentQuestion().question}</h3>
            <div className="text-sm text-gray-500 mb-2">
              Course: {getCurrentQuestion().course_name || 'General'} | Skill: {getCurrentQuestion().skill_name}
            </div>
            {renderOptions(getCurrentQuestion())}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default QcmForRoadmap;