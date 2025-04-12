import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, User } from 'lucide-react';

const analyticsProgressData = [
  { name: 'Week 1', aptitude: 65, gd: 55, pi: 50 },
  { name: 'Week 2', aptitude: 70, gd: 62, pi: 58 },
  { name: 'Week 3', aptitude: 75, gd: 68, pi: 65 },
  { name: 'Week 4', aptitude: 78, gd: 74, pi: 72 },
  { name: 'Week 5', aptitude: 82, gd: 80, pi: 75 }
];

const Analytics = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Performance Analytics</h2>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-4">Progress Over Time</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analyticsProgressData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="aptitude" name="Aptitude" fill="#3B82F6" />
              <Bar dataKey="gd" name="Group Discussion" fill="#8B5CF6" />
              <Bar dataKey="pi" name="Personal Interview" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <BookOpen className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">Aptitude Analysis</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Logical Reasoning</span>
                <span>85/100</span>
              </div>
              <div className="w-full bg鬣-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Verbal Ability</span>
                <span>78/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Quantitative Aptitude</span>
                <span>65/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Data Interpretation</span>
                <span>70/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Focus more on quantitative problem solving</li>
              <li>Practice time management for complex questions</li>
              <li>Review data interpretation techniques</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Users className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">GD Analysis</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Communication</span>
                <span>82/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Leadership</span>
                <span>75/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Team Collaboration</span>
                <span>88/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Critical Thinking</span>
                <span>80/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Practice initiating discussions more confidently</li>
              <li>Work on summarizing key points effectively</li>
              <li>Improve active listening skills</li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <User className="text-blue-600 h-5 w-5" />
            </div>
            <h3 className="text-lg font-medium">PI Analysis</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Technical Knowledge</span>
                <span>76/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Communication</span>
                <span>85/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Problem Solving</span>
                <span>68/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Situational Response</span>
                <span>72/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Practice technical problem solving under pressure</li>
              <li>Prepare more structured responses for behavioral questions</li>
              <li>Work on professional body language</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-medium mb-4">Personalized Improvement Plan</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="font-medium">Short Term (1-2 weeks)</h4>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-6">
              <li>Complete the "Advanced Problem Solving" module</li>
              <li>Practice 3 mock group discussions with AI peers</li>
              <li>Review feedback from your last interview simulation</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="font-medium">Medium Term (2-4 weeks)</h4>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-6">
              <li>Complete all technical modules with at least 80% score</li>
              <li>Practice situational responses for common interview scenarios</li>
              <li>Improve quantitative aptitude with daily practice tests</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <div className="bg-blue-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="font-medium">Long Term (1-2 months)</h4>
            </div>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1 ml-6">
              <li>Complete at least 5 full interview simulations</li>
              <li>Achieve at least 85% success rate across all modules</li>
              <li>Master all key competencies required for your target roles</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;