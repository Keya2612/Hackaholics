"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import questions from './data';

export default function PracticeTest() {
  const [testQuestions, setTestQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setTestQuestions(questions);
      const initialAnswers = {};
      questions.forEach(q => {
        initialAnswers[q.id] = '';
      });
      setAnswers(initialAnswers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const questionAnalysis = testQuestions.map(q => {
      const userAnswer = answers[q.id];

      if (!userAnswer) {
        unattempted++;
        return {
          ...q,
          userAnswer: '',
          status: 'unattempted',
          score: 0,
          explanation: 'Question was not attempted.'
        };
      }

      const isCorrect = q.correctAnswer.toLowerCase() === userAnswer.toLowerCase();

      if (isCorrect) {
        correct++;
        return {
          ...q,
          userAnswer,
          status: 'correct',
          score: 1,
          explanation: 'Your answer is correct!'
        };
      } else {
        incorrect++;
        return {
          ...q,
          userAnswer,
          status: 'incorrect',
          score: 0,
          explanation: `The correct answer is "${q.correctAnswer}".`
        };
      }
    });

    const analysisData = {
      totalQuestions: testQuestions.length,
      correct,
      incorrect,
      unattempted,
      score: Math.round((correct / testQuestions.length) * 100),
      questionAnalysis
    };

    setAnalysis(analysisData);
    localStorage.setItem('testAnalysis', JSON.stringify(analysisData));

    setSubmitted(true);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const viewAnalysis = () => {
    router.push('/aptitude/analytics');
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading practice test...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AI Interview Simulator - Practice Test</title>
        <meta name="description" content="Practice aptitude, reasoning, and verbal skills with our AI-powered test simulator" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-12">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Simulator</h1>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Practice Test</h2>

              <div className="space-y-8">
                {testQuestions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">{question.question}</h3>

                        {question.type === 'mcq' && (
                          <div className="mt-3 space-y-2">
                            {question.options.map((option, optIdx) => (
                              <div key={optIdx} className="flex items-center">
                                <input
                                  id={`question-${question.id}-option-${optIdx}`}
                                  name={`question-${question.id}`}
                                  type="radio"
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                  value={option.value}
                                  checked={answers[question.id] === option.value}
                                  onChange={() => handleAnswerChange(question.id, option.value)}
                                  disabled={submitted}
                                />
                                <label
                                  htmlFor={`question-${question.id}-option-${optIdx}`}
                                  className="ml-3 text-sm font-medium text-gray-700"
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === 'short' && (
                          <div className="mt-3">
                            <input
                              type="text"
                              id={`question-${question.id}`}
                              className="block w-full rounded-md border border-gray-300 shadow-sm p-2.5 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Your answer"
                              value={answers[question.id]}
                              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                              disabled={submitted}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={submitted}
                  className="w-full sm:w-auto rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        </main>

        {showPopup && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Test Submitted Successfully!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your test has been submitted. You can now view your performance analysis.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={viewAnalysis}
                  >
                    View Analysis
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={closePopup}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}