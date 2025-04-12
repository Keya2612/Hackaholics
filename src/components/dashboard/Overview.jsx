import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Calendar, BookOpen, Users, User } from 'lucide-react';

const progressData = [
  { name: 'Aptitude', progress: 72, status: 'Learning Phase' },
  { name: 'GD', progress: 86, status: 'Learning Phase' },
  { name: 'PI', progress: 74, status: 'Interview Simulation' },
];

const recentActivities = [
  { id: 1, date: '12/04/2025', activity: 'Completed Aptitude Test', score: '85%', result: 'Passed' },
  { id: 2, date: '10/04/2025', activity: 'Group Discussion Practice', score: '76%', result: 'Passed' },
  { id: 3, date: '08/04/2025', activity: 'Mock Interview', score: '68%', result: 'Needs Improvement' },
];

const upcomingTasks = [
  { id: 1, task: 'Aptitude Final Test', date: '15/04/2025', time: '10:00 AM' },
  { id: 2, task: 'Group Discussion Round', date: '18/04/2025', time: '2:00 PM' },
  { id: 3, task: 'Personal Interview Preparation', date: '20/04/2025', time: '11:30 AM' },
];

const performanceData = [
  { name: 'Logical', previous: 65, current: 78 },
  { name: 'Verbal', previous: 70, current: 82 },
  { name: 'Quantitative', previous: 60, current: 75 },
  { name: 'Technical', previous: 72, current: 80 },
];

const Overview = () => {
  const [timeFilter, setTimeFilter] = useState('week');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Interview Preparation Dashboard</h1>
        <div className="flex space-x-4">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded">
            View Reports
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
            Start Simulation
          </button>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Your Progress</h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Time Period:</span>
            <select
              className="bg-white border border-gray-300 rounded px-3 py-1 text-sm"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {progressData.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm">{item.name}</span>
                <span className="text-gray-500 text-sm">{item.status}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{item.progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Performance Analysis</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="previous" name="Previous" fill="#9CA3AF" />
              <Bar dataKey="current" name="Current" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-blue-100 p-2 rounded mr-4">
                  <Clock className="text-blue-600 h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-800">{activity.activity}</span>
                    <span className={`text-sm ${activity.result === 'Passed' ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.result}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">{activity.date}</span>
                    <span className="text-sm font-medium">{activity.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-blue-100 p-2 rounded mr-4">
                  <Calendar className="text-blue-600 h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{task.task}</div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">{task.date}</span>
                    <span className="text-sm text-gray-500">{task.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 text-sm font-medium flex items-center">
            View All Tasks
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Recommended Learning Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded mr-3">
                <BookOpen className="text-blue-600 h-5 w-5" />
              </div>
              <h3 className="font-medium text-gray-800">Aptitude Skills</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Enhance your logical reasoning and quantitative aptitude skills with our targeted modules.
            </p>
            <button className="mt-auto text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-sm">
              Continue Learning
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded mr-3">
                <Users className="text-blue-600 h-5 w-5" />
              </div>
              <h3 className="font-medium text-gray-800">Group Discussion</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Learn effective communication strategies for group discussions and team collaborations.
            </p>
            <button className="mt-auto text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-sm">
              Start Module
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded mr-3">
                <User className="text-blue-600 h-5 w-5" />
              </div>
              <h3 className="font-medium text-gray-800">Personal Interview</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Master personal interview techniques with our AI-powered interview simulator.
            </p>
            <button className="mt-auto text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded text-sm">
              Practice Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Overview;