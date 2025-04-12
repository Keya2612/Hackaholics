import React from 'react';
import { Users } from 'lucide-react';

const GroupDiscussion = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Group Discussion</h2>
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Users className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Group Discussion</h3>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">86% Complete</span>
        </div>
        <div className="mb-6">
          <h4 className="font-medium mb-3">Key Skills</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded p-4 text-center">
              <div className="font-medium mb-2">Communication</div>
              <div className="text-lg font-bold text-blue-600">90%</div>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <div className="font-medium mb-2">Leadership</div>
              <div className="text-lg font-bold text-blue-600">82%</div>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <div className="font-medium mb-2">Team Building</div>
              <div className="text-lg font-bold text-blue-600">88%</div>
            </div>
            <div className="border border-gray-200 rounded p-4 text-center">
              <div className="font-medium mb-2">Problem Solving</div>
              <div className="text-lg font-bold text-blue-600">84%</div>
            </div>
            </div>
        </div>
        <div className="flex justify-between items-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Continue Modules
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
            Join Practice GD
          </button>
        </div>
      </section>
    </div>
  );
};

export default GroupDiscussion;