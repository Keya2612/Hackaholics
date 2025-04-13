
'use client';
import { useState } from 'react';

const QuestionForm = ({ onQuestionsGenerated, setLoading, setError }) => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(20);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError('');
    setLoading?.(true);
    setError?.('');

    try {
      const response = await fetch('/api/generate-aptitude-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  numQuestions: parseInt(numQuestions) }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Log the raw API response
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      // Log the raw API response

      
      // Ensure the data is in the correct format without modifying its structure
      let processedData = data;
      
      // If data isn't an array but has a questions property that is an array, use that
      if (!Array.isArray(data) && data.questions && Array.isArray(data.questions)) {
        processedData = data.questions;
      }
      
      // Call the parent callback with the data
      onQuestionsGenerated(processedData, topic);
    } catch (err) {
      console.error('Error generating questions:', err);
      const errorMessage = err.message || 'An error occurred';
      setLocalError(errorMessage);
      setError?.(errorMessage);
    } finally {
      setLocalLoading(false);
      setLoading?.(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
     
      {localError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-sm text-red-700">{localError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={localLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex justify-center items-center disabled:bg-indigo-400"
      >
        {localLoading ? 'Generating Questions...' : 'Generate Questions'}
      </button>
    </form>
  );
};

export default QuestionForm;