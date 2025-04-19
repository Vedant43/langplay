import React, { useState } from 'react';

export const Quiz = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  if (!quizData || quizData.length === 0) {
    return <div>No quiz questions available.</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];

  const handleOptionSelect = (option) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestionIndex]: option });
  };

  const handleInputChange = (e) => {
    setSelectedOptions({ ...selectedOptions, [currentQuestionIndex]: e.target.value.trim().toLowerCase() });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    quizData.forEach((question, index) => {
      const userAnswer = selectedOptions[index];
      const correctAnswer =
        question.type === 'fill_blank'
          ? question.answer.trim().toLowerCase()
          : question.answer;

      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  if (showResults) {
    return (
      <div>
        <h3 className="text-xl font-bold mb-2">Quiz Results</h3>
        <p className="text-lg">You scored {score} out of {quizData.length}!</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Question {currentQuestionIndex + 1}</h4>
      <p className="mb-4">{currentQuestion.question}</p>

      {currentQuestion.type === 'fill_blank' ? (
        <input
          type="text"
          value={selectedOptions[currentQuestionIndex] || ''}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          placeholder="Type your answer"
        />
      ) : (
        <ul className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <li key={index} className='list-none'>
              <button
                onClick={() => handleOptionSelect(option.charAt(0))} 
                className={`block w-full py-2 px-4 rounded-md border ${
                  selectedOptions[currentQuestionIndex] === option.charAt(0)
                    ? 'bg-blue-200 border-blue-500'
                    : 'border-gray-300 hover:bg-gray-100'
                } text-left`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={goToNextQuestion}
        className="mt-4 bg-primary hover:bg-h-primary text-white font-bold py-2 px-4 rounded"
        disabled={
          selectedOptions[currentQuestionIndex] === undefined ||
          selectedOptions[currentQuestionIndex] === ''
        }
      >
        {currentQuestionIndex === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  );
}