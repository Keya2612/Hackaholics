import React from 'react';
import { User } from 'lucide-react';

const Interview = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Personal Interview</h2>
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <User className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Personal Interview</h3>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">74% Complete</span>
        </div>
        <div className="mb-6">
          <h4 className="font-medium mb-3">Topics Covered</h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Introduction & Self-presentation</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Common HR Questions</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Technical Questions & Problem Solving</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Situational & Behavioral Questions</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Continue Learning
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
            Practice Mock Interview
          </button>
        </div>
      </section>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Full Interview Simulation</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded">
          Start New Simulation
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-4">Simulation Process</h3>
        <div className="relative">
          <div className="flex mb-8">
            <div className="w-1/3 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">1</div>
              <div className="mt-2 font-medium">Aptitude Round</div>
              <div className="text-sm text-gray-500">45 Minutes</div>
            </div>
            <div className="w-1/3 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium">2</div>
              <div className="mt-2 font-medium">Group Discussion</div>
              <div className="text-sm text-gray-500">30 Minutes</div>
            </div>
            <div className="w-1/3 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-medium">3</div>
              <div className="mt-2 font-medium">Personal Interview</div>
              <div className="text-sm text-gray-500">60 Minutes</div>
            </div>
          </div>
          <div className="absolute top-5 left-0 w-full">
            <div className="h-1 bg-gray-200">
              <div className="h-1 bg-blue-600" style={{ width: '16.67%' }}></div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Current Status:</span>
              <span className="ml-2 text-blue-600 font-medium">Aptitude Round In Progress</span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
              Resume Simulation
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Previous Simulations</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Full Interview Simulation</div>
                  <div className="text-sm text-gray-500">Completed on: 08/04/2025</div>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-3">Passed</span>
                  <span className="font-medium">85%</span>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="mr-4">
                  <span className="text-xs text-gray-500">Aptitude</span>
                  <div className="font-medium">90%</div>
                </div>
                <div className="mr-4">
                  <span className="text-xs text-gray-500">GD</span>
                  <div className="font-medium">82%</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">PI</span>
                  <div className="font-medium">83%</div>
                </div>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Full Interview Simulation</div>
                  <div className="text-sm text-gray-500">Completed on: 27/03/2025</div>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full mr-3">Failed</span>
                  <span className="font-medium">65%</span>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="mr-4">
                  <span className="text-xs text-gray-500">Aptitude</span>
                  <div className="font-medium">72%</div>
                </div>
                <div className="mr-4">
                  <span className="text-xs text-gray-500">GD</span>
                  <div className="font-medium">75%</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">PI</span>
                  <div className="font-medium">48%</div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Aptitude Only Simulation</div>
                  <div className="text-sm text-gray-500">Completed on: 15/03/2025</div>
                </div>
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-3">Passed</span>
                  <span className="font-medium">78%</span>
                </div>
              </div>
              <div className="flex mt-2">
                <div className="mr-4">
                  <span className="text-xs text-gray-500">Logical</span>
                  <div className="font-medium">82%</div>
                </div>
                <div className="mr-4">
                  <span className="text-xs text-gray-500">Quantitative</span>
                  <div className="font-medium">75%</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Verbal</span>
                  <div className="font-medium">76%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4">Success Metrics</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">86%</div>
              <div className="text-sm text-gray-500 mt-1">Avg. Success Rate</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-500 mt-1">Total Simulations</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-500 mt-1">Passed</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">4</div>
              <div className="text-sm text-gray-500 mt-1">Failed</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Top Areas to Improve</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Problem-solving Skills</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Communication Skills</span>
                  <span className="font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Technical Knowledge</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">AI Interview Simulator Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-medium mb-2">Real-time Feedback</h4>
            <p className="text-sm text-gray-600">
              Get instant feedback on your performance with detailed analysis of your strengths and weaknesses.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-medium mb-2">Video Analysis</h4>
            <p className="text-sm text-gray-600">
              Advanced video recognition to analyze your body language, expressions and confidence during interviews.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h4 className="font-medium mb-2">Speech Recognition</h4>
            <p className="text-sm text-gray-600">
              Our AI system analyzes your speaking pace, clarity, and vocabulary to help improve communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;