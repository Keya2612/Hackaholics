"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Analysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve analysis data from localStorage
    const storedAnalysis = localStorage.getItem('testAnalysis');

    if (storedAnalysis) {
      try {
        setAnalysis(JSON.parse(storedAnalysis));
        setLoading(false);
      } catch (error) {
        console.error('Failed to parse analysis data:', error);
        setFallbackAnalysis();
      }
    } else {
      setFallbackAnalysis();
    }
  }, []);

  const setFallbackAnalysis = () => {
    setTimeout(() => {
      setAnalysis({
        totalQuestions: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        score: 0,
        questionAnalysis: [],
      });
      setLoading(false);
    }, 1000);
 concessions
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading analysis...</p>
        </div>
      </div>
    );
  }

  // Safeguard for null analysis
  if (!analysis) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-700">No analysis data available.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>AI Interview Simulator - Test Analysis</title>
        <meta name="description" content="View your practice test results and analysis" />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-12">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Simulator</h1>
              <Link href="/aptitude/practice" className="text-blue-600 hover:text-blue-800 font-medium">
                Back to Test
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Test Results</h2>

              {/* Score Summary */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-sm mb-3">
                    <span className="text-3xl font-bold text-blue-600">{analysis.score}%</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your Score</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">{analysis.correct}</div>
                    <div className="text-sm font-medium text-green-800">Correct</div>
                  </div>
                  <div className="bg-red-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">{analysis.incorrect}</div>
                    <div className="text-sm font-medium text-red-800">Incorrect</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-1">{analysis.unattempted}</div>
                    <div className="text-sm font-medium text-gray-800">Unattempted</div>
                  </div>
                </div>
              </div>

              {/* Detailed Question Analysis */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">Question Analysis</h3>

              <div className="space-y-8">
                {(analysis.questionAnalysis || []).map((question, index) => (
                  <div
                    key={question.id || index}
                    className={`border-l-4 ${
                      question.status === 'correct'
                        ? 'border-green-500'
                        : question.status === 'incorrect'
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } bg-white p-4 shadow-sm rounded-lg`}
                  >
                    <div className="flex items-start">
                      <span
                        className={`
                          font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3 mt-0.5 text-sm
                          ${
                            question.status === 'correct'
                              ? 'bg-green-100 text-green-800'
                              : question.status === 'incorrect'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        `}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 mb-2">{question.question}</h4>

                        {question.type === 'mcq' && (
                          <div className="mt-2 space-y-1">
                            {(question.options || []).map((option, optIdx) => {
                              const optionText =
                                typeof option === 'object' ? option.label || option.value : option;
                              const optionValue = typeof option === 'object' ? option.value : option;

                              return (
                                <div
                                  key={optIdx}
                                  className={`flex items-center p-2 rounded ${
                                    optionValue === question.correctAnswer &&
                                    optionValue === question.userAnswer
                                      ? 'bg-green-50'
                                      : optionValue === question.correctAnswer
                                      ? 'bg-green-50'
                                      : optionValue === question.userAnswer
                                      ? 'bg-red-50'
                                      : ''
                                  }`}
                                >
                                  <div className="flex-shrink-0 w-5 h-5 mr-2">
                                    {optionValue === question.correctAnswer &&
                                      optionValue === question.userAnswer && (
                                        <svg
                                          className="w-5 h-5 text-green-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    {optionValue === question.correctAnswer &&
                                      optionValue !== question.userAnswer && (
                                        <svg
                                          className="w-5 h-5 text-green-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                    {optionValue !== question.correctAnswer &&
                                      optionValue === question.userAnswer && (
                                        <svg
                                          className="w-5 h-5 text-red-500"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                  </div>
                                  <span
                                    className={`
                                      ${
                                        optionValue === question.correctAnswer
                                          ? 'font-medium'
                                          : 'font-normal'
                                      }
                                      ${
                                        optionValue === question.userAnswer &&
                                        optionValue !== question.correctAnswer
                                          ? 'line-through'
                                          : ''
                                      }
                                    `}
                                  >
                                    {optionText}
                                  </span>
                                  {optionValue === question.userAnswer && (
                                    <span className="ml-2 text-sm text-gray-500">(Your answer)</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {question.type === 'short' && (
                          <div className="mt-2 space-y-3">
                            <div className="flex items-start">
                              <div className="mr-2 font-medium">Your answer:</div>
                              <div
                                className={`${
                                  question.status === 'correct'
                                    ? 'text-green-600'
                                    : question.status === 'incorrect'
                                    ? 'text-red-600'
                                    : 'text-gray-500'
                                }`}
                              >
                                {question.userAnswer || 'Not attempted'}
                              </div>
                            </div>
                            <div className="flex items-start">
                              <div className="mr-2 font-medium">Correct answer:</div>
                              <div className="text-green-600">{question.correctAnswer}</div>
                            </div>
                          </div>
                        )}

                        <div
                          className={`mt-3 text-sm ${
                            question.status === 'correct'
                              ? 'text-green-600'
                              : question.status === 'incorrect'
                              ? 'text-red-600'
                              : 'text-gray-500'
                          }`}
                        >
                          {question.explanation}
                        </div>

                        {/* Learn this Concept Button for Incorrect Answers */}
                        {question.status === 'incorrect' && (
                          <div className="mt-4">
                            <Link
                              href={question.learningLink || `/learn/${question.id}`}
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Learn this Concept
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/aptitude/practice"
                  className="w-full sm:w-auto rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Take Another Test
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}