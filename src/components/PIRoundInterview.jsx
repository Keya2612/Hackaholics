
'use client';

import { useState, useEffect, useRef } from 'react';

export default function PIRoundInterview() {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [stream, setStream] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const speechSynthesisRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const juryMembers = [
    {
      name: 'Dr. Meera Patel',
      role: 'Jury Member',
      behavior: 'Friendly',
      description:
        "She creates a welcoming atmosphere and tries to ease the candidate's nervousness with light conversation and encouragement.",
    },
    {
      name: 'Mr. Rajesh Sharma',
      role: 'Jury Member',
      behavior: 'Strict',
      description:
        'He focuses heavily on rules and professionalism, quickly pointing out flaws and expecting precise answers.',
    },
    {
      name: 'Ms. Ananya Roy',
      role: 'Jury Member',
      behavior: 'Skeptical',
      description:
        "She questions the authenticity and depth of the candidate's responses, often asking 'why' repeatedly to test clarity of thought.",
    },
    {
      name: 'Mr. Imran Khan',
      role: 'Jury Member',
      behavior: 'Encouraging',
      description:
        'He looks for potential rather than perfection, often giving hints or asking follow-ups to help the candidate shine.',
    },
    {
      name: 'Prof. Raghav Menon',
      role: 'Jury Member',
      behavior: 'Silent Observer',
      description:
        'He watches the candidate quietly, analyzing body language and expressions, rarely intervening unless necessary.',
    },
  ];

  const juryAvatars = {
    'Dr. Meera Patel': '/female.png',
    'Mr. Rajesh Sharma': '/male.png',
    'Ms. Ananya Roy': '/female.png',
    'Mr. Imran Khan': '/male.png',
    'Prof. Raghav Menon': '/male.png',
  };

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setUserInput(transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  // Initialize Webcam
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    if (isInterviewing) {
      startWebcam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isInterviewing]);

  // Speech Synthesis Voices
  useEffect(() => {
    if (!speechSynthesisRef.current) return;

    const loadVoices = () => {
      speechSynthesisRef.current.getVoices();
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = null;
        }
      }
    };
  }, []);

  // Generate Response using Google Gemini API
  const generateResponse = async (juryMember, userResponse) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          juryMember, 
          userResponse,
          // Add conversation history for context
          history: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setIsLoading(false);
      return data.response || 'Please elaborate further.';
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      return 'Could you clarify your response?';
    }
  };

  // Select Random Jury Member
  const selectRandomJuryMember = () => {
    const weights = [0.25, 0.25, 0.25, 0.25, 0.1];
    const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) return juryMembers[i];
    }
    return juryMembers[0];
  };

  // Start Interview
  const startInterview = () => {
    setIsInterviewing(true);
    setAnalysis(null);
    setConversationHistory([]);
    setVideoUrl(null);
    const firstSpeaker = juryMembers[0];
    setCurrentSpeaker(firstSpeaker);

    const initialQuestion =
      "Welcome to your interview! We're excited to meet you. Could you introduce yourself?";
    speakText(initialQuestion, getVoiceForJuryMember(firstSpeaker));
    
    // Add initial question to conversation history
    setConversationHistory([{
      juryMember: firstSpeaker,
      juryQuestion: initialQuestion,
      userResponse: '',
      timestamp: Date.now(),
    }]);
    
    startRecording();
  };

  // End Interview
  const endInterview = async () => {
    setIsInterviewing(false);
    setCurrentSpeaker(null);
    stopRecording();
    setIsLoading(true);

    const analysisResult = await analyzeConversation(conversationHistory);
    setAnalysis(analysisResult);
    setIsLoading(false);
  };

  // Handle User Response
  const handleUserResponse = async () => {
    if (!userInput.trim()) return;

    // Update the last conversation entry with the user's response
    setConversationHistory((prev) => {
      const updatedHistory = [...prev];
      if (updatedHistory.length > 0) {
        updatedHistory[updatedHistory.length - 1].userResponse = userInput;
      }
      return updatedHistory;
    });

    const response = await generateResponse(currentSpeaker, userInput);
    const nextSpeaker = selectRandomJuryMember();
    setCurrentSpeaker(nextSpeaker);

    // Add the next question to conversation history
    setConversationHistory((prev) => [
      ...prev,
      {
        juryMember: nextSpeaker,
        juryQuestion: response,
        userResponse: '',
        timestamp: Date.now(),
      },
    ]);

    speakText(response, getVoiceForJuryMember(nextSpeaker));
    setUserInput('');
  };

  // Start Speech Recognition
  const startSpeechRecognition = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  // Get Voice for Jury Member
  const getVoiceForJuryMember = (juryMember) => {
    if (!speechSynthesisRef.current) return undefined;
    const voices = speechSynthesisRef.current.getVoices();
    if (!voices.length) return undefined;

    switch (juryMember.name) {
      case 'Dr. Meera Patel':
        return (
          voices.find((v) => v.lang.includes('en-IN') && v.name.includes('Female')) ||
          voices.find((v) => v.name.includes('Female'))
        );
      case 'Mr. Rajesh Sharma':
        return (
          voices.find((v) => v.lang.includes('en-IN') && !v.name.includes('Female')) ||
          voices.find((v) => !v.name.includes('Female'))
        );
      case 'Ms. Ananya Roy':
        return voices.find((v) => v.name.includes('Female') && v.lang.includes('en-US'));
      case 'Mr. Imran Khan':
        return voices.find((v) => !v.name.includes('Female') && v.lang.includes('en-GB'));
      case 'Prof. Raghav Menon':
        return (
          voices.find((v) => !v.name.includes('Female') && v.lang.includes('en-IN')) ||
          voices.find((v) => !v.name.includes('Female'))
        );
      default:
        return undefined;
    }
  };

  // Speak Text with auto-mic activation when done speaking
  const speakText = (text, voice) => {
    if (!speechSynthesisRef.current) return;
    speechSynthesisRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) utterance.voice = voice;

    if (currentSpeaker) {
      switch (currentSpeaker.behavior) {
        case 'Friendly':
          utterance.rate = 1.0;
          utterance.pitch = 1.2;
          break;
        case 'Strict':
          utterance.rate = 0.9;
          utterance.pitch = 0.8;
          break;
        case 'Skeptical':
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          break;
        case 'Encouraging':
          utterance.rate = 1.1;
          utterance.pitch = 1.1;
          break;
        case 'Silent Observer':
          utterance.rate = 0.8;
          utterance.pitch = 0.7;
          break;
      }
    }

    setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      // Auto-activate microphone when speech ends
      setTimeout(() => {
        startSpeechRecognition();
      }, 500); // Small delay to ensure UI updates properly
    };
    speechSynthesisRef.current.speak(utterance);
  };

  // Analyze Conversation using Gemini API
  const analyzeConversation = async (history) => {
    try {
      const response = await fetch('/api/analyze-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ history }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze interview');
      }

      const data = await response.json();
      return data.analysis || {
        score: 70,
        strengths: ['Good communication skills', 'Answered questions thoroughly'],
        suggestions: ['Practice more concise responses', 'Work on body language'],
      };
    } catch (error) {
      console.error('Error analyzing interview:', error);
      
      // Fallback analysis if API fails
      let score = 0;
      const strengths = [];
      const suggestions = [];

      history.forEach(({ userResponse }) => {
        if (userResponse.length > 50) score += 10;
        if (userResponse.toLowerCase().includes('teamwork')) {
          score += 5;
          strengths.push('Mentioned teamwork experience');
        }
        if (userResponse.toLowerCase().includes('leadership')) {
          score += 5;
          strengths.push('Highlighted leadership skills');
        }

        if (userResponse.length < 20) {
          suggestions.push('Try to provide more detailed responses to showcase your skills.');
        }
      });

      return {
        score: Math.min(Math.max(score, 50), 100),
        strengths: strengths.length ? [...new Set(strengths)] : ['Completed the interview process'],
        suggestions: suggestions.length
          ? [...new Set(suggestions)]
          : ['Consider practicing common interview questions to improve confidence.'],
      };
    }
  };

  // Start Recording
  const startRecording = () => {
    if (stream) {
      setRecordedChunks([]);
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };
      mediaRecorderRef.current.start();
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Handle Key Press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading && !speaking && !isRecording) {
      handleUserResponse();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PI Round Interview Simulation</h1>
        {isInterviewing && (
          <button
            onClick={endInterview}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            End Interview
          </button>
        )}
      </div>

      {!isInterviewing && !analysis ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <h2 className="text-2xl mb-6">Prepare for Your Interview</h2>
          <p className="text-center mb-8 max-w-md">
            You will be interviewed by a panel of five jury members. Respond by speaking (mic activates automatically) or typing. Your video will be recorded.
          </p>
          <button
            onClick={startInterview}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Start Interview
          </button>
        </div>
      ) : !isInterviewing && analysis ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <h2 className="text-2xl font-bold mb-6">Interview Analysis</h2>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full">
            <p className="text-lg mb-4">
              <strong>Score:</strong> {analysis.score}/100
            </p>
            <h3 className="text-md font-semibold mb-2">Strengths</h3>
            <ul className="list-disc pl-5 mb-4">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="text-sm">{strength}</li>
              ))}
            </ul>
            <h3 className="text-md font-semibold mb-2">Suggestions for Improvement</h3>
            <ul className="list-disc pl-5 mb-4">
              {analysis.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm">{suggestion}</li>
              ))}
            </ul>
            {videoUrl && (
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-2">Interview Recording</h3>
                <video controls src={videoUrl} className="w-full rounded-lg" />
                <a
                  href={videoUrl}
                  download="interview-recording.webm"
                  className="text-blue-600 hover:underline text-sm block mt-2"
                >
                  Download Recording
                </a>
              </div>
            )}
            <button
              onClick={() => {
                setAnalysis(null);
                setConversationHistory([]);
                setVideoUrl(null);
              }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Start New Interview
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-grow overflow-hidden">
          {/* Main Speaker Panel */}
          <div className="flex-grow p-4 flex flex-col">
            <div className="bg-white rounded-lg shadow-lg flex-grow flex flex-col items-center justify-center relative">
              {currentSpeaker ? (
                <>
                  <img
                    src={
                      juryAvatars[currentSpeaker.name] ||
                      `https://via.placeholder.com/150?text=${currentSpeaker.name[0]}`
                    }
                    alt={currentSpeaker.name}
                    className="w-24 h-24 rounded-full mb-4"
                  />
                  <p className="text-lg font-semibold">{currentSpeaker.name}</p>
                  <p className="text-sm text-gray-500">
                    {currentSpeaker.role} ({currentSpeaker.behavior})
                  </p>
                  {speaking && <p className="text-xs text-blue-500 mt-2">Speaking...</p>}
                  {isLoading && <p className="text-xs text-gray-500 mt-2">Processing...</p>}
                  {isRecording && <p className="text-xs text-red-500 mt-2">Recording your response...</p>}
                </>
              ) : (
                <p className="text-gray-500">Waiting for the next speaker...</p>
              )}
              {/* Candidate Video Preview */}
              <video
                ref={videoRef}
                autoPlay
                muted
                className="absolute bottom-4 right-4 w-32 h-24 rounded-lg border"
              />
            </div>
          </div>

          {/* Jury Members Sidebar */}
          <div className="w-64 bg-gray-50 p-4 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-4">Participants</h3>
            {juryMembers.map((member) => (
              <div
                key={member.name}
                className={`flex items-center mb-4 p-2 rounded-lg ${
                  currentSpeaker?.name === member.name ? 'bg-blue-100' : ''
                }`}
              >
                <img
                  src={
                    juryAvatars[member.name] ||
                    `https://via.placeholder.com/40?text=${member.name[0]}`
                  }
                  alt={member.name}
                  className="w-10 h-10 rounded-full mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.behavior}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Bar */}
      {isInterviewing && (
        <div className="bg-white shadow p-4 flex justify-center space-x-4">
          <button
            onClick={startSpeechRecognition}
            disabled={isLoading || speaking || isRecording}
            className={`p-3 rounded-full ${
              isRecording ? 'bg-red-500' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Start speech recognition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              ></path>
            </svg>
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || speaking || isRecording}
            placeholder="Type your response..."
            className="p-2 border rounded w-1/3"
            aria-label="Candidate response input"
          />
          <button
            onClick={handleUserResponse}
            disabled={isLoading || speaking || isRecording || !userInput.trim()}
            className={`px-6 py-2 rounded font-bold ${
              isLoading || speaking || isRecording || !userInput.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            aria-label="Submit response"
          >
            Respond
          </button>
        </div>
      )}
    </div>
  );
}