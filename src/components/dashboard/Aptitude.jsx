import React from 'react';
import { BookOpen } from 'lucide-react';

const Aptitude = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Aptitude Learning</h2>
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <BookOpen className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Aptitude Learning</h3>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">72% Complete</span>
        </div>
        <div className="mb-6">
          <h4 className="font-medium mb-3">Topics to Master</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Logical Reasoning</span>
                <span className="text-sm text-gray-500">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Quantitative Aptitude</span>
                <span className="text-sm text-gray-500">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Verbal Ability</span>
                <span className="text-sm text-gray-500">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Resume Learning
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
            Take Practice Test
          </button>
        </div>
      </section>
    </div>
  );
};

export default Aptitude;