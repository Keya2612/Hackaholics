"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tabs, progressData } from "./data";

const Learning = () => {
  const [activeTab, setActiveTab] = useState("quantitative");
  const [categoryProgressMap, setCategoryProgressMap] = useState(() => {
    // Initialize with static progressData to ensure SSR consistency
    const initialMap = {};
    tabs.forEach((tab) => {
      initialMap[tab.id] = {};
      Object.keys(progressData[tab.id] || {}).forEach((category) => {
        const items = progressData[tab.id][category];
        const total = items.reduce((sum, item) => sum + (item.progress || 0), 0);
        initialMap[tab.id][category] = items.length > 0 ? Math.round(total / items.length) : 0;
      });
    });
    return initialMap;
  });
  const router = useRouter();

  // Load progress from localStorage on client side after mount
  useEffect(() => {
    const updatedMap = { ...categoryProgressMap };
    tabs.forEach((tab) => {
      updatedMap[tab.id] = { ...updatedMap[tab.id] };
      Object.keys(progressData[tab.id] || {}).forEach((category) => {
        const savedProgress = localStorage.getItem(`progress_${tab.id}_${category}`);
        if (savedProgress) {
          const items = JSON.parse(savedProgress);
          const total = items.reduce((sum, item) => sum + (item.progress || 0), 0);
          updatedMap[tab.id][category] = items.length > 0 ? Math.round(total / items.length) : 0;
        }
      });
    });
    setCategoryProgressMap(updatedMap);
  }, []); // Empty dependency array to run once after mount

  // Helper function to determine text color based on progress
  const getTextColorClass = (progress) => {
    if (progress >= 70) return "text-green-700";
    if (progress >= 50) return "text-yellow-700";
    return "text-red-700";
  };

  // Helper function to determine progress bar color
  const getProgressBarColor = (progress) => {
    if (progress >= 70) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Navigate to category learning page
  const handleCategoryClick = (category) => {
    router.push(`/aptitude/learning/${activeTab}/${category}`);
  };

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Learning</h1>
        <p className="text-gray-600 mt-2">
          Track your learning progress across different aptitude areas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-6 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(progressData[activeTab] || {}).map((category, index) => {
          const categoryProgress = categoryProgressMap[activeTab]?.[category] || 0;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="flex items-center justify-between mb-2 mt-3">
                  <span
                    className={`text-2xl font-bold ${getTextColorClass(categoryProgress)}`}
                  >
                    {categoryProgress}%
                  </span>
                  <span className="text-sm text-gray-500">Average Progress</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`${getProgressBarColor(categoryProgress)} h-2.5 rounded-full`}
                    style={{ width: `${categoryProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Start Learning
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Learning Summary
        </h3>
        <p className="text-gray-600">
          Continue your learning journey to improve your skills across all aptitude
          areas. Focus on lower-scoring topics to balance your progress.
        </p>
      </div>
    </div>
  );
};

export default Learning;