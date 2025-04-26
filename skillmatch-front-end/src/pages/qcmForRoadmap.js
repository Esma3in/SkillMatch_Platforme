import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QcmForRoadmap = () => {
  const { roadmapId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes en secondes
  const [roadmapTitle, setRoadmapTitle] = useState('');

  useEffect(() => {
    // Récupérer les questions du QCM pour cette roadmap
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/roadmap/${roadmapId}/qcm`, {
          headers: {
            'Accept': 'application/json'
          }
        });
        
        setQuestions(response.data);
        
        // Récupérer le titre de la roadmap (si nécessaire)
        if (response.data.length > 0 && response.data[0].roadmap_title) {
          setRoadmapTitle(response.data[0].roadmap_title);
        } else {
          setRoadmapTitle('COMPLETE YOUR ROADMAP SKILLS');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch questions');
        setLoading(false);
        console.error('Error fetching questions:', err);
      }
    };

    fetchQuestions();
    
    // Configurer le minuteur
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz(); // Soumettre automatiquement à la fin du temps
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [roadmapId]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleAnswerSelect = (questionId, optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const submitQuiz = async () => {
    try {
      await axios.post('http://localhost:8000/api/roadmap/qcm/results', {
        roadmap_id: roadmapId,
        answers: selectedAnswers
      });
      
      // Rediriger vers la page de résultats
      navigate(`/roadmap/${roadmapId}/qcm/results`, { 
        state: { 
          answers: selectedAnswers,
          questions: questions
        } 
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz');
    }
  };

  if (loading) return <div className="text-center py-8">Loading questions...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (questions.length === 0) return <div className="text-center py-8">No questions available for this roadmap.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6 border border-blue-200 rounded-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">QCM FOR {roadmapTitle}</h1>
        
        <div className="flex justify-between items-center my-4">
          <div>Question {currentQuestionIndex + 1} of {questions.length} . Time Remaining: {formatTime(timeRemaining)}</div>
          <div className="flex items-center">
            <span className="mr-2">QCM PROGRESS</span>
            <div className="w-64 bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="ml-2">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg">{currentQuestion.question}</h2>
      </div>

      <div className="space-y-2 mb-6">
        {currentQuestion.options.map((option) => (
          <div 
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer flex items-center ${
              selectedAnswers[currentQuestion.id] === option.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 mr-3 flex-shrink-0">
              {option.label}
            </div>
            <div>{option.text}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 border border-indigo-300 rounded text-indigo-600 disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex space-x-1 overflow-x-auto">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index === currentQuestionIndex
                  ? 'bg-indigo-600 text-white'
                  : selectedAnswers[questions[index].id]
                  ? 'bg-indigo-200 text-indigo-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
              onClick={() => goToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <button 
            onClick={submitQuiz}
            className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
          >
            Submit
          </button>
        ) : (
          <button 
            onClick={goToNextQuestion}
            className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QcmForRoadmap;