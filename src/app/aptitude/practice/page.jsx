'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

// Dynamically import the form component with SSR disabled
const QuestionForm = dynamic(() => import('@/components/aptitude/QuestionForm'), {
  ssr: false
});

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('loading');
  const [topic, setTopic] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizResult, setQuizResult] = useState(null);
  const [submittingAnswers, setSubmittingAnswers] = useState(false);

  const determineCorrectOption = (question, option) => {
    return option === question.correctAnswer;
  };

  // Handle receiving questions and topic from the form component
  const handleQuestionsGenerated = (newQuestions, generatedTopic) => {
    console.log('New Questions:', newQuestions);
    console.log('Generated Topic:', generatedTopic);

    // Store questions exactly as received (to preserve JSON format)
    setQuestions(newQuestions);
    setTopic(generatedTopic || '');
    setActiveTab('questions');
    setLoading(false);
    
    // Reset quiz state when new questions are generated
    setQuizStarted(false);
    setUserAnswers([]);
    setQuizResult(null);
  };

  const startQuiz = () => {
    // Initialize user answers structure
    const initialAnswers = questions.map(q => ({
      question: q.question,
      options: q.options,
      subtopic: q.subtopic || 'general',
      correctAnswer: q.correct_answer,
      userSelected: null
    }));
    
    setUserAnswers(initialAnswers);
    setQuizStarted(true);
    setActiveTab('quiz');
    setQuizResult(null);
  };

  const handleOptionSelect = (questionIndex, selectedOption) => {
    // Create a new copy of the user answers array
    const updatedAnswers = [...userAnswers];
    // Update the selected option for this question
    updatedAnswers[questionIndex].userSelected = selectedOption;
    setUserAnswers(updatedAnswers);
  };

  const submitQuiz = async () => {
    setSubmittingAnswers(true);
    
    try {
      const response = await fetch('/api/generate-aptitude-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userAnswers: userAnswers,
          calculateScore: true
        }),
      });
      
      // Check for non-JSON response before trying to parse
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Try to get the text to see what's being returned
        const text = await response.text();
        console.error("Received non-JSON response:", text);
        throw new Error("Server returned non-JSON response. Check console for details.");
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to calculate score');
      }
      
      setQuizResult(result);
      setActiveTab('results');
    } catch (err) {
      console.error('Error calculating score:', err);
      setError(err.message || 'An error occurred while calculating your score');
    } finally {
      setSubmittingAnswers(false);
    }
  };

  const downloadJSON = () => {
    if (!questions.length || !topic) return;

    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', `${topic.replace(/\s+/g, '-')}-questions.json`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const downloadTxt = () => {
    if (!questions.length || !topic) return;
  
    let content = '';
  
    questions.forEach((q, qIndex) => {
      content += `${qIndex + 1}. ${q.question}\n`;
      
      // Check if options exists and is an array
      if (q.options && Array.isArray(q.options) && q.options.length > 0) {
        q.options.forEach((option, oIndex) => {
          const letter = String.fromCharCode(65 + oIndex); // A, B, C, etc.
          content += `  ${letter}. ${option}\n`;
        });
      } else {
        content += `  [No options available for this question]\n`;
        console.warn(`Options for question ${qIndex + 1} is not a valid array:`, q.options);
      }
      
      // Handle different formats of correct_answer
      if (q.correct_answer !== undefined) {
        let correctAnswer = q.correct_answer;
        if (typeof correctAnswer === 'string') {
          if (q.options && Array.isArray(q.options)) {
            const index = q.options.findIndex(opt => opt === correctAnswer);
            if (index !== -1) {
              const letter = String.fromCharCode(65 + index);
              content += `  Correct Answer: ${letter}. ${correctAnswer}\n\n`;
            } else {
              content += `  Correct Answer: ${correctAnswer}\n\n`;
            }
          } else {
            content += `  Correct Answer: ${correctAnswer}\n\n`;
          }
        } else {
          content += `  Correct Answer: ${correctAnswer}\n\n`;
        }
      } else {
        content += `  Correct Answer: Not specified\n\n`;
      }
    });
  
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(content);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', `${topic.replace(/\s+/g, '-')}-questions.txt`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Safely check questions array
  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  const questionsCount = hasQuestions ? questions.length : 0;
  
  // Calculate progress of the quiz
  const answeredCount = userAnswers.filter(a => a.userSelected !== null).length;
  const quizProgress = hasQuestions ? Math.round((answeredCount / questions.length) * 100) : 0;
  const allQuestionsAnswered = answeredCount === questions.length;

  // Auto-start quiz when questions are loaded
  useEffect(() => {
    if (hasQuestions && !quizStarted && !loading) {
      startQuiz();
    }
  }, [hasQuestions, quizStarted, loading]);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-blue-50 to-indigo-100">
      <Head>
        <title>Aptitude Test | AI-Powered Practice</title>
        <meta name="description" content="Test your quantitative aptitude, logical reasoning and analytical ability with AI-generated questions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">Aptitude Test</h1>
          </div>

          {/* Card container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {loading && (
                <div className="flex-1 py-4 px-6 text-center font-medium text-indigo-600 border-b-2 border-indigo-600">
                  Loading...
                </div>
              )}
              
              {!loading && (
                <>
                  <button
                    onClick={() => quizStarted ? setActiveTab('quiz') : null}
                    disabled={quizResult}
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === 'quiz'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Quiz {quizProgress > 0 ? `(${quizProgress}%)` : ''}
                  </button>
                  
                  <button
                    onClick={() => hasQuestions ? setActiveTab('questions') : null}
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === 'questions'
                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Questions {hasQuestions ? `(${questionsCount})` : ''}
                  </button>
                  
                  {quizResult && (
                    <button
                      onClick={() => setActiveTab('results')}
                      className={`flex-1 py-4 px-6 text-center font-medium ${
                        activeTab === 'results'
                          ? 'text-indigo-600 border-b-2 border-indigo-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Results
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {/* Loading State */}
              {loading && (
                <QuestionForm
                  onQuestionsGenerated={handleQuestionsGenerated}
                  setLoading={setLoading}
                  setError={setError}
                />
              )}

              {/* Questions Tab */}
              {activeTab === 'questions' && hasQuestions ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {questionsCount} Questions on {topic}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadTxt}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Download TXT
                      </button>
                      <button
                        onClick={downloadJSON}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Download JSON
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {questions.map((q, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 className="font-medium text-gray-800">
                            Question {qIndex + 1}
                            {q.subtopic && <span className="ml-2 text-xs font-normal text-gray-500">Topic: {q.subtopic}</span>}
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="font-medium mb-4">
                            {q.question}
                          </p>

                          <div className="space-y-2">
                            {Array.isArray(q.options) && q.options.length > 0 ? (
                              q.options.map((option, oIndex) => {
                                // Determine if this option is correct using multiple methods
                                const isCorrect = determineCorrectOption(q, option, oIndex);
                                const letter = String.fromCharCode(65 + oIndex); // A, B, C, etc.
                                
                                return (
                                  <div
                                    key={oIndex}
                                    className={`p-3 rounded-lg ${
                                      isCorrect
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-gray-50 border border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-start">
                                      <div className={`flex-shrink-0 h-5 w-5 mt-0.5 ${
                                        isCorrect ? 'text-green-500' : 'text-gray-400'
                                      }`}>
                                        {isCorrect ? (
                                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                        ) : (
                                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                      <p className={`ml-2 ${isCorrect ? 'text-green-800 font-medium' : 'text-gray-800'}`}>
                                        {letter}. {option}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-gray-500">No options available for this question.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'questions' && !loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No questions available at the moment.</p>
                </div>
              ) : null}

              {/* Quiz Tab */}
              {activeTab === 'quiz' && quizStarted && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Quiz on {topic}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{answeredCount}/{questionsCount} answered</span>
                      <div className="w-40 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${quizProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {userAnswers.map((q, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h3 className="font-medium text-gray-800">
                            Question {qIndex + 1}
                            {q.subtopic && <span className="ml-2 text-xs font-normal text-gray-500">Topic: {q.subtopic}</span>}
                          </h3>
                        </div>
                        <div className="p-4">
                          <p className="font-medium mb-4">
                            {q.question}
                          </p>

                          <div className="space-y-2">
                            {Array.isArray(q.options) && q.options.length > 0 ? (
                              q.options.map((option, oIndex) => { // A, B, C, etc.
                                const isSelected = q.userSelected === option;
                                
                                return (
                                  <div
                                    key={oIndex}
                                    className={`p-3 rounded-lg cursor-pointer ${
                                      isSelected
                                        ? 'bg-indigo-50 border border-indigo-300'
                                        : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                    }`}
                                    onClick={() => handleOptionSelect(qIndex, option)}
                                  >
                                    <div className="flex items-start">
                                      <div className={`flex-shrink-0 h-5 w-5 mt-0.5 ${
                                        isSelected ? 'text-indigo-600' : 'text-gray-400'
                                      }`}>
                                        {isSelected ? (
                                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                          </svg>
                                        ) : (
                                          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                          </svg>
                                        )}
                                      </div>
                                      <p className={`ml-2 ${isSelected ? 'text-indigo-800 font-medium' : 'text-gray-800'}`}>
                                        {option}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-gray-500">No options available for this question.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={submitQuiz}
                      className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 `}
                    >
                      {submittingAnswers ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  </div>
                </div>
              )}

              {/* Results Tab */}
              {activeTab === 'results' && quizResult && (
                <div className="space-y-6">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-2">
                      Your Score: {quizResult.score.percentage}%
                    </h2>
                    <p className="text-lg text-indigo-700">
                      {quizResult.score.correct} correct out of {quizResult.score.total} questions
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Feedback</h3>
                    <p className="text-gray-700 mb-6">{quizResult.feedback}</p>

                    <h4 className="font-medium text-gray-800 mb-3">Performance by Topic:</h4>
                    <div className="space-y-3">
                      {Object.entries(quizResult.subtopicPerformance).map(([subtopic, performance]) => (
                        <div key={subtopic} className="flex items-center">
                          <div className="w-1/3 font-medium text-gray-700">{subtopic}</div>
                          <div className="w-2/3">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    performance.percentage >= 80 ? 'bg-green-600' :
                                    performance.percentage >= 60 ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`} 
                                  style={{ width: `${performance.percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-16 text-right">
                                {performance.percentage}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {performance.correct}/{performance.total} correct
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {quizResult.weakestSubtopics && quizResult.weakestSubtopics.length > 0 && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc pl-5 text-red-700">
                          {quizResult.weakestSubtopics.map((subtopic) => (
                            <li key={subtopic}>{subtopic}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {quizResult.strongestSubtopics && quizResult.strongestSubtopics.length > 0 && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Strong Areas:</h4>
                        <ul className="list-disc pl-5 text-green-700">
                          {quizResult.strongestSubtopics.map((subtopic) => (
                            <li key={subtopic}>{subtopic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        startQuiz(); // Restart the quiz with the same questions
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Retry Quiz
                    </button>
                    <button
                      onClick={() => {
                        window.location.reload(); // Reload the page to generate new questions
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      New Questions
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}