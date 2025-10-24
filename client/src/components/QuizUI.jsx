// // components/QuizUI.jsx
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchQuiz, answerQuestion, resetQuiz } from "../redux/quizSlice";

// export default function QuizUI({ token, books }) {
//   const dispatch = useDispatch();
//   const { quiz, current, score, answers, loading, error } = useSelector(state => state.quiz);
//   const [selectedTopic, setSelectedTopic] = useState("");
//   const [difficulty, setDifficulty] = useState("intermediate");
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [completionRecorded, setCompletionRecorded] = useState(false);

//   // Extract unique topics from books
//   const topics = [...new Set(books.map(b => b.topic))];

//   useEffect(() => {
//     if (topics.length > 0 && !selectedTopic) {
//       setSelectedTopic(topics[0]);
//     }
//   }, [topics, selectedTopic]);

//   // Record quiz completion when quiz is finished
//   useEffect(() => {
//     const recordCompletion = async () => {
//       if (quiz.length > 0 && current >= quiz.length && !completionRecorded) {
//         try {
//           await axios.post(
//             "/api/user/quiz-complete",
//             {
//               score,
//               totalQuestions: quiz.length,
//               topic: selectedTopic,
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           setCompletionRecorded(true);
//         } catch (err) {
//           console.error("Failed to record quiz completion:", err);
//         }
//       }
//     };

//     recordCompletion();
//   }, [quiz.length, current, score, completionRecorded, selectedTopic, token]);

//   const handleStartQuiz = () => {
//     if (!selectedTopic) {
//       alert("Please select a topic");
//       return;
//     }
//     setCompletionRecorded(false);
//     dispatch(fetchQuiz({ topic: selectedTopic, token, difficulty, numQuestions }));
//   };

//   const handleAnswerClick = (option) => {
//     if (selectedAnswer !== null) return; // Already answered
//     setSelectedAnswer(option);
//     setShowExplanation(true);
//   };

//   const handleNext = () => {
//     dispatch(answerQuestion(selectedAnswer));
//     setSelectedAnswer(null);
//     setShowExplanation(false);
//   };

//   const handleRetry = () => {
//     dispatch(resetQuiz());
//     setSelectedAnswer(null);
//     setShowExplanation(false);
//   };

//   // Quiz Setup Screen
//   if (quiz.length === 0 && !loading) {
//     return (
//       <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//         <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
//           Generate Quiz
//         </h2>

//         <div className="space-y-6 max-w-md">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Select Topic
//             </label>
//             <select
//               value={selectedTopic}
//               onChange={(e) => setSelectedTopic(e.target.value)}
//               className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//             >
//               <option value="">Choose a topic...</option>
//               {topics.map(topic => (
//                 <option key={topic} value={topic}>{topic}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Difficulty Level
//             </label>
//             <div className="grid grid-cols-3 gap-2">
//               {["beginner", "intermediate", "advanced"].map(level => (
//                 <button
//                   key={level}
//                   onClick={() => setDifficulty(level)}
//                   className={`p-3 rounded-lg font-medium transition ${
//                     difficulty === level
//                       ? "bg-purple-600 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                   }`}
//                 >
//                   {level.charAt(0).toUpperCase() + level.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               Number of Questions: {numQuestions}
//             </label>
//             <input
//               type="range"
//               min="3"
//               max="10"
//               value={numQuestions}
//               onChange={(e) => setNumQuestions(parseInt(e.target.value))}
//               className="w-full"
//             />
//             <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
//               <span>3</span>
//               <span>10</span>
//             </div>
//           </div>

//           <button
//             onClick={handleStartQuiz}
//             disabled={!selectedTopic || loading}
//             className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
//           >
//             {loading ? "Generating Quiz..." : "Start Quiz"}
//           </button>

//           {error && (
//             <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
//               {error}
//             </div>
//           )}
//         </div>

//         <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//           <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
//             💡 Quiz Tips
//           </h3>
//           <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
//             <li>• Questions are generated from your study materials</li>
//             <li>• Each question has 4 options with only 1 correct answer</li>
//             <li>• You'll see explanations after each answer</li>
//             <li>• Try different topics to test your knowledge!</li>
//           </ul>
//         </div>
//       </div>
//     );
//   }

//   // Loading State
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400 font-medium">
//             Generating your quiz...
//           </p>
//           <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
//             Analyzing study materials with AI
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const question = quiz[current];

//   // Quiz completion - record score
//   if (!question) {
//     const handleRecordCompletion = async () => {
//       try {
//         await axios.post(
//           "/api/user/quiz-complete",
//           {
//             score,
//             totalQuestions: quiz.length,
//             topic: quiz[0]?.topic || "General",
//           },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } catch (err) {
//         console.error("Failed to record quiz completion:", err);
//       }
//     };

//     // Record on mount
//     React.useEffect(() => {
//       handleRecordCompletion();
//     }, []);

//     const percentage = Math.round((score / quiz.length) * 100);
//     return (
//       <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow p-8">
//         <div className="text-center max-w-md">
//           <div className="text-6xl mb-4">
//             {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
//             Quiz Completed!
//           </h2>
//           <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">
//             {score} / {quiz.length}
//           </div>
//           <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
//             {percentage >= 80 ? "Excellent work! 🌟" : 
//              percentage >= 60 ? "Good job! Keep practicing!" : 
//              "Keep studying! You'll do better next time!"}
//           </p>

//           {/* Review Answers */}
//           <div className="mb-8 text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
//               Review Your Answers
//             </h3>
//             {answers.map((answer, idx) => (
//               <div key={idx} className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-600 last:border-0">
//                 <div className="flex items-start gap-2">
//                   <span className={`text-lg ${answer.isCorrect ? "text-green-500" : "text-red-500"}`}>
//                     {answer.isCorrect ? "✓" : "✗"}
//                   </span>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">
//                       Q{idx + 1}: {answer.question?.substring(0, 60)}...
//                     </p>
//                     {!answer.isCorrect && (
//                       <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
//                         Correct: {answer.correctAnswer}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-4">
//             <button
//               onClick={handleRetry}
//               className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
//             >
//               Try Another Quiz
//             </button>
//             <button
//               onClick={() => dispatch(resetQuiz())}
//               className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
//             >
//               Back to Setup
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Quiz Question Screen
//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow">
//       {/* Progress Bar */}
//       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Question {current + 1} of {quiz.length}
//           </span>
//           <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
//             Score: {score}
//           </span>
//         </div>
//         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//           <div
//             className="bg-purple-600 h-2 rounded-full transition-all duration-300"
//             style={{ width: `${((current + 1) / quiz.length) * 100}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* Question */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
//           {question.question}
//         </h3>

//         {/* Options */}
//         <div className="space-y-3">
//           {question.options.map((option, idx) => {
//             const isSelected = selectedAnswer === option;
//             const isCorrect = option === question.correctAnswer;
//             const showResult = showExplanation;

//             return (
//               <button
//                 key={idx}
//                 onClick={() => handleAnswerClick(option)}
//                 disabled={showExplanation}
//                 className={`w-full p-4 text-left rounded-lg border-2 transition ${
//                   showResult
//                     ? isCorrect
//                       ? "border-green-500 bg-green-50 dark:bg-green-900/20"
//                       : isSelected
//                       ? "border-red-500 bg-red-50 dark:bg-red-900/20"
//                       : "border-gray-200 dark:border-gray-700"
//                     : isSelected
//                     ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
//                     : "border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                 } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-800 dark:text-gray-200">
//                     {String.fromCharCode(65 + idx)}. {option}
//                   </span>
//                   {showResult && isCorrect && (
//                     <span className="text-green-500 font-bold">✓</span>
//                   )}
//                   {showResult && isSelected && !isCorrect && (
//                     <span className="text-red-500 font-bold">✗</span>
//                   )}
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         {/* Explanation */}
//         {showExplanation && question.explanation && (
//           <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
//             <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
//               💡 Explanation
//             </h4>
//             <p className="text-blue-800 dark:text-blue-400 text-sm">
//               {question.explanation}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Action Button */}
//       <div className="p-6 border-t border-gray-200 dark:border-gray-700">
//         {showExplanation ? (
//           <button
//             onClick={handleNext}
//             className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
//           >
//             {current < quiz.length - 1 ? "Next Question →" : "View Results"}
//           </button>
//         ) : (
//           <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
//             Select an answer to continue
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// components/QuizUI.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz, answerQuestion, resetQuiz } from "../redux/quizSlice";

export default function QuizUI({ token, books }) {
  const dispatch = useDispatch();
  const { quiz, current, score, answers, loading, error } = useSelector(state => state.quiz);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Extract unique topics from books
  const topics = [...new Set(books.map(b => b.topic))];

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  const handleStartQuiz = () => {
    if (!selectedTopic) {
      alert("Please select a topic");
      return;
    }
    dispatch(fetchQuiz({ topic: selectedTopic, token, difficulty, numQuestions }));
  };

  const handleAnswerClick = (option) => {
    if (selectedAnswer !== null) return; // Already answered
    setSelectedAnswer(option);
    setShowExplanation(true);
  };

  const handleNext = () => {
    dispatch(answerQuestion(selectedAnswer));
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleRetry = () => {
    dispatch(resetQuiz());
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // Quiz Setup Screen
  if (quiz.length === 0 && !loading) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Generate Quiz
        </h2>

        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Topic
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a topic...</option>
              {topics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["beginner", "intermediate", "advanced"].map(level => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-3 rounded-lg font-medium transition ${
                    difficulty === level
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Questions: {numQuestions}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>3</span>
              <span>10</span>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            disabled={!selectedTopic || loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition"
          >
            {loading ? "Generating Quiz..." : "Start Quiz"}
          </button>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            💡 Quiz Tips
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Questions are generated from your study materials</li>
            <li>• Each question has 4 options with only 1 correct answer</li>
            <li>• You'll see explanations after each answer</li>
            <li>• Try different topics to test your knowledge!</li>
          </ul>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Generating your quiz...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Analyzing study materials with AI
          </p>
        </div>
      </div>
    );
  }

  const question = quiz[current];

  // Results Screen
  if (!question) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-800 rounded-lg shadow p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">
            {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "📚"}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed!
          </h2>
          <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            {score} / {quiz.length}
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {percentage >= 80 ? "Excellent work! 🌟" : 
             percentage >= 60 ? "Good job! Keep practicing!" : 
             "Keep studying! You'll do better next time!"}
          </p>

          {/* Review Answers */}
          <div className="mb-8 text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Review Your Answers
            </h3>
            {answers.map((answer, idx) => (
              <div key={idx} className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-600 last:border-0">
                <div className="flex items-start gap-2">
                  <span className={`text-lg ${answer.isCorrect ? "text-green-500" : "text-red-500"}`}>
                    {answer.isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Q{idx + 1}: {answer.question?.substring(0, 60)}...
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Correct: {answer.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => dispatch(resetQuiz())}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition"
            >
              Back to Setup
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Progress Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Question {current + 1} of {quiz.length}
          </span>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Score: {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / quiz.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === question.correctAnswer;
            const showResult = showExplanation;

            return (
              <button
                key={idx}
                onClick={() => handleAnswerClick(option)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-lg border-2 transition ${
                  showResult
                    ? isCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : isSelected
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-200 dark:border-gray-700"
                    : isSelected
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-800 dark:text-gray-200">
                    {String.fromCharCode(65 + idx)}. {option}
                  </span>
                  {showResult && isCorrect && (
                    <span className="text-green-500 font-bold">✓</span>
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <span className="text-red-500 font-bold">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Explanation
            </h4>
            <p className="text-blue-800 dark:text-blue-400 text-sm">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        {showExplanation ? (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition"
          >
            {current < quiz.length - 1 ? "Next Question →" : "View Results"}
          </button>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            Select an answer to continue
          </div>
        )}
      </div>
    </div>
  );
}