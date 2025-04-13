"use client"
import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FiUpload, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    
    // Reset states
    setError('');
    setAnalysis(null);
    
    // Check if file is selected
    if (!selectedFile) return;
    
    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    
    // Set file state
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const analyzeResume = async () => {
    if (!file) {
      setError('Please upload a resume first');
      return;
    }
    
    setAnalyzing(true);
    
    try {
      // Read the PDF file
      const fileData = await file.arrayBuffer();
      
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(fileData);
      const pages = pdfDoc.getPages();
      
      // Extract text from each page
      let resumeText = '';
      for (let i = 0; i < pages.length; i++) {
        // Note: pdf-lib doesn't actually extract text content
        // In a real implementation, you would use a library like pdf.js
        // This is a simplified version
        resumeText += `Content from page ${i + 1}`;
      }
      
      // In a real implementation, you would send the text to an API for analysis
      // For now, we'll simulate the analysis response
      setTimeout(() => {
        const mockAnalysis = {
          structure: {
            score: 85,
            feedback: 'Good structure overall. Consider adding a summary section at the top.'
          },
          skills: {
            score: 75,
            feedback: 'Your technical skills are well represented. Consider adding more soft skills.'
          },
          content: {
            score: 80,
            feedback: 'Good use of action verbs. Try quantifying your achievements more consistently.'
          },
          powerWords: {
            missing: ['orchestrated', 'spearheaded', 'revolutionized'],
            feedback: 'Consider adding more impactful power words to strengthen your achievements.'
          },
          suggestions: [
            'Add a professional summary section',
            'Quantify achievements with more specific metrics',
            'Consider a skills section organized by proficiency level',
          ]
        };
        
        setAnalysis(mockAnalysis);
        setAnalyzing(false);
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the PDF. Please try again.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Analyzer</h2>
      <p className="text-gray-600 italic mb-6">"Let your resume speak your value."</p>
      
      <div className="mb-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {!file ? (
            <>
              <FiUpload className="mx-auto text-gray-400 text-4xl mb-4" />
              <label className="block">
                <span className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition">
                  Upload Resume (PDF)
                </span>
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </label>
              <p className="mt-2 text-sm text-gray-500">Maximum file size: 5MB</p>
            </>
          ) : (
            <div>
              <FiCheckCircle className="mx-auto text-green-500 text-3xl mb-2" />
              <p className="font-medium">{fileName}</p>
              <button 
                onClick={() => {
                  setFile(null);
                  setFileName('');
                }}
                className="mt-2 text-sm text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded flex items-center">
            <FiAlertTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <button
          onClick={analyzeResume}
          disabled={!file || analyzing}
          className={`mt-4 w-full py-3 px-4 rounded font-medium ${
            !file || analyzing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {analyzing ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>
      
      {analysis && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <ScoreCard 
              title="Structure"
              score={analysis.structure.score}
              feedback={analysis.structure.feedback}
            />
            <ScoreCard 
              title="Skills Relevance"
              score={analysis.skills.score}
              feedback={analysis.skills.feedback}
            />
            <ScoreCard 
              title="Content Quality"
              score={analysis.content.score}
              feedback={analysis.content.feedback}
            />
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">Missing Power Words</h4>
            <p className="text-gray-700 mb-2">{analysis.powerWords.feedback}</p>
            <div className="flex flex-wrap gap-2">
              {analysis.powerWords.missing.map((word, index) => (
                <span key={index} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  {word}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Improvement Suggestions</h4>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-gray-700">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for score cards
const ScoreCard = ({ title, score, feedback }) => {
  let colorClass = "bg-green-100 text-green-800";
  
  if (score < 60) {
    colorClass = "bg-red-100 text-red-800";
  } else if (score < 80) {
    colorClass = "bg-yellow-100 text-yellow-800";
  }
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className={`text-2xl font-bold ${colorClass} inline-block px-2 py-1 rounded`}>
        {score}%
      </div>
      <p className="mt-2 text-sm text-gray-600">{feedback}</p>
    </div>
  );
};

export default ResumeAnalyzer;