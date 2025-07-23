import { useState, useEffect } from "react";
import { ChevronLeft, BookOpen, Trophy, Clock, CheckCircle, XCircle } from "lucide-react";
import {useGoogle} from "../context/googleapi";


export default function Quiz() {
  const { quizData, quizloading } = useGoogle();
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  const handleOptionChange = (qIndex, answer) => {
    setUserAnswers({ ...userAnswers, [qIndex]: answer });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
    setTimeout(() => setAnimateScore(true), 500);
  };

  const calculateScore = () => {
    return Object.entries(userAnswers).filter(
      ([i, ans]) => quizData[i]?.answer === ans
    ).length;
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  if (quizloading) {
    return (
      <div className="quiz-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">
            <Clock className="w-6 h-6 mr-3 animate-spin" />
            Generating Quiz...
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || quizData.length === 0) {
    return (
      <div className="quiz-container">
        <div className="no-quiz-container">
          <XCircle className="w-16 h-16 text-red-400 mb-4" />
          <p className="no-quiz">No quiz data available for this file.</p>
        </div>
      </div>
    );
  }

  const score = calculateScore();
  const total = quizData.length;

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <div className="header-content">
          <BookOpen className="w-8 h-8 text-indigo-400 mr-3" />
          <h2 className="header-title">Interactive Quiz</h2>
        </div>
        <button className="back-button" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(Object.keys(userAnswers).length / quizData.length) * 100}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {Object.keys(userAnswers).length} / {quizData.length} answered
        </span>
      </div>

      {/* Quiz Body */}
      <div className="quiz-body">
        {quizData.map((q, i) => (
          <div key={i} className="quiz-question-card">
            <div className="question-header">
              <span className="question-number">Q{i + 1}</span>
              <p className="quiz-question">{q.question}</p>
            </div>
            
            <div className="quiz-options">
              {q.options.map((opt, idx) => {
                const label = opt.charAt(0);
                const selected = userAnswers[i] === label;
                const correct = q.answer === label;
                const isCorrect = submitted && selected && correct;
                const isWrong = submitted && selected && !correct;
                const isCorrectAnswer = submitted && correct;

                return (
                  <label
                    key={idx}
                    className={`quiz-option ${selected ? 'selected' : ''} ${
                      isCorrect ? 'correct' : ''
                    } ${isWrong ? 'wrong' : ''} ${
                      isCorrectAnswer && !selected ? 'correct-answer' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={label}
                      disabled={submitted}
                      checked={selected}
                      onChange={() => handleOptionChange(i, label)}
                      className="option-input"
                    />
                    <div className="option-content">
                      <span className="option-text">{opt}</span>
                      {submitted && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      )}
                      {submitted && isWrong && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {submitted && (
              <div className="answer-feedback">
                <div className="feedback-icon">
                  {userAnswers[i] === q.answer ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <span>
                  {userAnswers[i] === q.answer ? 'Correct!' : `Correct answer: ${q.answer}`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button / Results */}
      {!submitted ? (
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={Object.keys(userAnswers).length !== quizData.length}
        >
          <Trophy className="w-5 h-5 mr-2" />
          Submit Quiz
        </button>
      ) : (
        <div className="results-container">
          <div className={`score-card ${animateScore ? 'animate' : ''}`}>
            <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="score-title">Quiz Completed!</h3>
            <div className={`score-display ${getScoreColor(score, total)}`}>
              <span className="score-number">{score}</span>
              <span className="score-divider">/</span>
              <span className="score-total">{total}</span>
            </div>
            <div className="score-percentage">
              {Math.round((score / total) * 100)}% Correct
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .quiz-container {
          color: #f8fafc;
          padding: 2rem;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          min-height: 100vh;
          max-height: 100vh;
          overflow-y: auto;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
          position: relative;
        }

        .quiz-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .quiz-container > * {
          position: relative;
          z-index: 1;
        }

        /* Scrollbar Styling */
        .quiz-container::-webkit-scrollbar {
          width: 8px;
        }
        .quiz-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 6px;
        }
        .quiz-container::-webkit-scrollbar-track {
          background-color: #1e293b;
        }
        .quiz-container {
          scrollbar-color: #6366f1 #1e293b;
          scrollbar-width: thin;
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #334155;
        }

        .header-content {
          display: flex;
          align-items: center;
        }

        .header-title {
          font-size: 1.875rem;
          font-weight: 700;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .back-button {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #374151, #4b5563);
          color: #f1f5f9;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .back-button:hover {
          background: linear-gradient(135deg, #4b5563, #6b7280);
          transform: translateY(-2px);
          box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.2);
        }

        .progress-container {
          margin-bottom: 2rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #1e293b;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          transition: width 0.5s ease;
          border-radius: 4px;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .quiz-body {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding-bottom: 2rem;
        }

        .quiz-question-card {
          background: linear-gradient(135deg, #1e293b, #334155);
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .quiz-question-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
        }

        .quiz-question-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
        }

        .question-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .question-number {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          margin-right: 1rem;
          min-width: 50px;
          text-align: center;
          flex-shrink: 0;
        }

        .quiz-question {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9;
          line-height: 1.6;
          margin: 0;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quiz-option {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          background: rgba(51, 65, 85, 0.5);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          overflow: hidden;
        }

        .quiz-option::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .quiz-option:hover::before {
          left: 100%;
        }

        .quiz-option:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateX(5px);
        }

        .quiz-option.selected {
          background: rgba(99, 102, 241, 0.2);
          border-color: #6366f1;
        }

        .quiz-option.correct {
          background: rgba(34, 197, 94, 0.2) !important;
          border-color: #22c55e !important;
          color: #dcfce7;
        }

        .quiz-option.wrong {
          background: rgba(239, 68, 68, 0.2) !important;
          border-color: #ef4444 !important;
          color: #fecaca;
        }

        .quiz-option.correct-answer {
          background: rgba(34, 197, 94, 0.1) !important;
          border-color: rgba(34, 197, 94, 0.3) !important;
        }

        .option-input {
          margin-right: 1rem;
          width: 18px;
          height: 18px;
          accent-color: #6366f1;
        }

        .option-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .option-text {
          font-size: 1rem;
          font-weight: 500;
        }

        .answer-feedback {
          display: flex;
          align-items: center;
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(51, 65, 85, 0.3);
          border-radius: 12px;
          font-style: italic;
          color: #cbd5e1;
          border-left: 4px solid #6366f1;
        }

        .feedback-icon {
          margin-right: 0.75rem;
        }

        .submit-button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2rem;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 16px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.3);
        }

        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .results-container {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .score-card {
          background: linear-gradient(135deg, #1e293b, #334155);
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
          transform: scale(0.9);
          opacity: 0;
          transition: all 0.5s ease;
        }

        .score-card.animate {
          transform: scale(1);
          opacity: 1;
        }

        .score-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 1rem;
        }

        .score-display {
          font-size: 3rem;
          font-weight: 900;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .score-number {
          font-size: 4rem;
        }

        .score-divider {
          font-size: 2rem;
          color: #64748b;
        }

        .score-total {
          font-size: 2rem;
          color: #94a3b8;
        }

        .score-percentage {
          font-size: 1.25rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-top: 0.5rem;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(99, 102, 241, 0.2);
          border-top: 4px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 2rem;
        }

        .loading-text {
          display: flex;
          align-items: center;
          font-size: 1.25rem;
          color: #6366f1;
          font-weight: 600;
        }

        .no-quiz-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
        }

        .no-quiz {
          font-size: 1.25rem;
          color: #f87171;
          text-align: center;
          font-weight: 600;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .quiz-container {
            padding: 1rem;
          }

          .quiz-question-card {
            padding: 1.5rem;
          }

          .header-title {
            font-size: 1.5rem;
          }

          .quiz-question {
            font-size: 1.125rem;
          }

          .question-header {
            flex-direction: column;
            gap: 1rem;
          }

          .question-number {
            align-self: flex-start;
          }

          .submit-button {
            width: 100%;
          }

          .score-card {
            padding: 2rem;
          }

          .score-display {
            font-size: 2rem;
          }

          .score-number {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
}