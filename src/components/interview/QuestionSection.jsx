import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function QuestionSection({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "en-US";
      window.speechSynthesis.speak(speech);
    } else {
      toast.error("Your browser does not support text-to-speech.");
    }
  };

  if (!mockInterviewQuestions?.length) {
    return <div className="p-5 text-gray-600">No questions available.</div>;
  }

  return (
    <div className="p-5 border rounded-lg shadow-sm bg-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {mockInterviewQuestions.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestionIndex(index)}
            className={`p-2 rounded-full text-xs sm:text-sm text-center transition-colors ${
              activeQuestionIndex === index
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Q{index + 1}
          </button>
        ))}
      </div>
      <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-4">
        {mockInterviewQuestions[activeQuestionIndex]?.question}
      </h2>
      <button
        aria-label="Read question aloud"
        onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Volume2 className="w-6 h-6 text-blue-600" />
      </button>
      <div className="border rounded-lg p-4 bg-blue-50 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <strong className="text-blue-800">Tip:</strong>
        </div>
        <p className="text-sm text-blue-700">
          Take your time to think before answering. Speak clearly and concisely.
        </p>
      </div>
    </div>
  );
}

export default QuestionSection;