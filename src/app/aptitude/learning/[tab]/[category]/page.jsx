"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { progressData, tabs } from "../../../learning/data";
import { learningContent } from "../../../learning/learningContent";

const CategoryLearning = () => {
  const { tab, category } = useParams();

  // Find tab name for display
  const tabData = tabs.find((t) => t.id === tab);
  const tabName = tabData ? tabData.name : tab;

  // Get initial topics for the category
  const initialTopics = progressData[tab]?.[category] || [];

  // Get learning content for the category
  const content = learningContent[tab]?.[category] || {};

  // State for PDF modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState("");

  // State to track checkbox status and topics
  const [completionStatus, setCompletionStatus] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`completion_${tab}_${category}`);
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });

  // State to track topics and their progress
  const [topics, setTopics] = useState(() => {
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem(`progress_${tab}_${category}`);
      return savedProgress
        ? JSON.parse(savedProgress)
        : initialTopics.map((topic) => ({ ...topic, progress: 0 }));
    }
    return initialTopics.map((topic) => ({ ...topic, progress: 0 }));
  });

  // Save to localStorage and update progress whenever completionStatus changes
  useEffect(() => {
    // Save completion status
    localStorage.setItem(
      `completion_${tab}_${category}`,
      JSON.stringify(completionStatus)
    );

    // Calculate and update progress for each topic
    const updatedTopics = topics.map((topic) => {
      const youtubeCompleted = completionStatus[`${topic.title}_youtube`] || false;
      const pdfCompleted = completionStatus[`${topic.title}_pdf`] || false;
      const resourceCount =
        (content[topic.title]?.youtubeLink ? 1 : 0) +
        (content[topic.title]?.pdfLink ? 1 : 0);
      const completedCount = (youtubeCompleted ? 1 : 0) + (pdfCompleted ? 1 : 0);
      const progress = resourceCount > 0 ? Math.round((completedCount / resourceCount) * 100) : 0;

      return { ...topic, progress };
    });

    // Update topics state
    setTopics(updatedTopics);

    // Save updated progress to localStorage
    localStorage.setItem(
      `progress_${tab}_${category}`,
      JSON.stringify(updatedTopics)
    );
  }, [completionStatus, tab, category, content]);

  // Handle checkbox change
  const handleCheckboxChange = (topicTitle, resourceType) => {
    setCompletionStatus((prev) => ({
      ...prev,
      [`${topicTitle}_${resourceType}`]: !prev[`${topicTitle}_${resourceType}`],
    }));
  };

  // Open PDF modal
  const openPdfModal = (pdfUrl) => {
    const resolvedUrl = pdfUrl.startsWith("/") ? pdfUrl : `/${pdfUrl}`;
    setCurrentPdfUrl(resolvedUrl);
    setShowPdfModal(true);
  };

  // Close PDF modal
  const closePdfModal = () => {
    setShowPdfModal(false);
    setCurrentPdfUrl("");
  };

  // Handle ESC key to close modal and manage body scroll
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && showPdfModal) {
        closePdfModal();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    if (showPdfModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [showPdfModal]);

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <Link
          href="/aptitude/learning"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 inline-block"
        >
          ← Back to Learning
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          {category.charAt(0).toUpperCase() + category.slice(1)} - {tabName}
        </h1>
        <p className="text-gray-600 mt-2">
          Master concepts and explore resources for {category}.
        </p>
      </div>

      {topics.length > 0 ? (
        topics.map((topic, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {topic.title} ({topic.progress}%)
            </h2>

            {/* Concept */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Concept</h3>
              <p className="text-gray-600">
                {content[topic.title]?.concept ||
                  "Learning content for this topic is under development."}
              </p>
            </div>

            {/* Resource Buttons with Checkboxes */}
            <div className="space-y-4">
              {content[topic.title]?.youtubeLink ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={completionStatus[`${topic.title}_youtube`] || false}
                    onChange={() => handleCheckboxChange(topic.title, "youtube")}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <a
                    href={content[topic.title].youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                  >
                    Watch Video
                  </a>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  No video available for this topic.
                </p>
              )}
              {content[topic.title]?.pdfLink ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={completionStatus[`${topic.title}_pdf`] || false}
                    onChange={() => handleCheckboxChange(topic.title, "pdf")}
                    className="h-5 w-5 text-blue-600 rounded"
                  />
                  <button
                    onClick={() => openPdfModal(content[topic.title].pdfLink)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-sm">
                  No PDF available for this topic.
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <p className="text-gray-600">
            No topics found for {category} in {tabName}.
          </p>
        </div>
      )}

      {/* PDF Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 max-w-6xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Learning Material</h3>
              <button
                onClick={closePdfModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-2 overflow-hidden">
              <iframe
                src={currentPdfUrl}
                title="PDF Viewer"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryLearning;