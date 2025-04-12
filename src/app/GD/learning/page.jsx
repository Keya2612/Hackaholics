"use client";


import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { gdLearningContent } from './data';

export default function GroupDiscussionLearning() {
  const [activeSection, setActiveSection] = useState('introduction');
  
  // Handle section navigation
  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
    // Smooth scroll to section
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Group Discussion Learning - AI Interview Simulator</title>
        <meta name="description" content="Learn essential group discussion skills and techniques for interviews" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">AI Interview Simulator</h1>
              <nav className="flex space-x-4">
                <Link href="/practice-test" className="text-gray-500 hover:text-gray-700">
                  Practice Test
                </Link>
                <Link href="/group-discussion" className="text-blue-600 font-medium">
                  Group Discussion
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-md sticky top-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">GD Learning Modules</h3>
                <nav className="space-y-1">
                  {gdLearningContent.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => navigateToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
                <div className="mt-8">
                  <Link href="/group-discussion/practice" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                    Start GD Practice
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Group Discussion - Learning Phase</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Mode:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Learning
                      </span>
                    </div>
                  </div>

                  {/* Content sections */}
                  <div className="space-y-12">
                    {gdLearningContent.sections.map((section) => (
                      <section key={section.id} id={section.id} className="scroll-mt-16">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                        
                        {section.content.map((contentBlock, idx) => (
                          <div key={idx} className="mb-6">
                            {contentBlock.type === 'paragraph' && (
                              <p className="text-gray-700 mb-4">{contentBlock.text}</p>
                            )}
                            
                            {contentBlock.type === 'list' && (
                              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {contentBlock.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>{item}</li>
                                ))}
                              </ul>
                            )}
                            
                            {contentBlock.type === 'tip' && (
                              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm text-blue-700">
                                      <span className="font-medium">Pro Tip:</span> {contentBlock.text}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {contentBlock.type === 'visual' && (
                              <div className="my-6">
                                <h4 className="text-md font-medium text-gray-900 mb-3">{contentBlock.title}</h4>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                  {contentBlock.visualType === 'process' && (
                                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
                                      {contentBlock.steps.map((step, stepIdx) => (
                                        <div key={stepIdx} className="flex flex-col items-center">
                                          <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                            {stepIdx + 1}
                                          </div>
                                          <div className="h-16 flex items-center justify-center mt-2">
                                            <p className="text-center text-sm font-medium">{step}</p>
                                          </div>
                                          {stepIdx < contentBlock.steps.length - 1 && (
                                            <div className="hidden md:block absolute transform translate-x-24">
                                              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                              </svg>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {contentBlock.visualType === 'comparison' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <h5 className="text-green-700 font-medium mb-2">Do's</h5>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                          {contentBlock.dos.map((item, itemIdx) => (
                                            <li key={itemIdx}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                        <h5 className="text-red-700 font-medium mb-2">Don'ts</h5>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                          {contentBlock.donts.map((item, itemIdx) => (
                                            <li key={itemIdx}>{item}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </section>
                    ))}

                    {/* Call to Action */}
                    <div className="border-t border-gray-200 pt-8">
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">Ready to practice?</h3>
                        <p className="text-blue-700 mb-4">
                          Now that you've learned the key principles of group discussions, it's time to put your knowledge into practice.
                        </p>
                        <Link href="/group-discussion/practice" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                          Start Practice Session
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}