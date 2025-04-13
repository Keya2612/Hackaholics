'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, MicOff, CameraOff } from 'lucide-react';

// Mock LangChain imports (unchanged)
const GDSimulation = () => {
  // Agent definitions (unchanged)
  const gdAgents = [
    {
      id: 'agent1',
      name: 'Alex',
      role: 'Data-Driven Analyst',
      personality: 'Assertive, factual, logical',
      style: 'Presents statistics and structured reasoning',
      avatarColor: 'bg-blue-500',
      model: 'openai',
      modelConfig: {
        modelName: 'gpt-3.5-turbo',
        temperature: 0.5,
      },
      systemPrompt: `You are Alex, a data-driven analyst with an assertive, factual, and logical personality. 
      You communicate using statistics, structured reasoning, and clear evidence. You prefer concrete 
      examples over abstractions. Present your arguments methodically with a focus on measurable outcomes.`,
      history: [],
    },
    {
      id: 'agent2',
      name: 'Priya',
      role: 'Empathetic Visionary',
      personality: 'Emotional, persuasive, human-centered',
      style: 'Connects emotionally with the topic and audience',
      avatarColor: 'bg-purple-500',
      model: 'cohere',
      modelConfig: {
        modelName: 'command',
        temperature: 0.8,
      },
      systemPrompt: `You are Priya, an empathetic visionary with an emotional, persuasive, and human-centered 
      personality. You connect emotionally with topics and audiences. Focus on the human impact of ideas, 
      use storytelling, and appeal to shared values. Your communication style is warm and inspiring.`,
      history: [],
    },
    {
      id: 'agent3',
      name: 'Raj',
      role: 'Diplomatic Moderator',
      personality: 'Balanced, respectful, conflict-resolver',
      style: 'Acknowledges all sides, brings harmony',
      avatarColor: 'bg-green-500',
      model: 'huggingface',
      modelConfig: {
        modelName: 'mistralai/Mistral-7B-Instruct-v0.1',
        temperature: 0.6,
      },
      systemPrompt: `You are Raj, a diplomatic moderator with a balanced, respectful, and conflict-resolving 
      personality. You acknowledge all sides of an argument and seek to bring harmony. Summarize different 
      perspectives fairly, find common ground, and propose compromises. Your tone is calm and your approach 
      is inclusive.`,
      history: [],
    },
    {
      id: 'agent4',
      name: 'Tara',
      role: 'Creative Disruptor',
      personality: 'Innovative, unpredictable, lateral thinker',
      style: 'Introduces unique angles and analogies',
      avatarColor: 'bg-yellow-500',
      model: 'ollama',
      modelConfig: {
        modelName: 'llama2',
        temperature: 0.9,
      },
      systemPrompt: `You are Tara, a creative disruptor with an innovative, unpredictable, and lateral-thinking 
      personality. You introduce dialectical reasoning, unique angles and analogies to discussions. Challenge conventional thinking, 
      use metaphors, and make unexpected connections. Your communication style is energetic and thought-provoking.`,
      history: [],
    },
    {
      id: 'agent5',
      name: 'You',
      role: 'Participant',
      personality: 'User-defined',
      style: 'Dynamic — based on actual user input',
      avatarColor: 'bg-red-500',
      model: null,
      systemPrompt: null,
      history: [],
    },
  ];

  // State management
  const [agents, setAgents] = useState(gdAgents);
  const [currentTopic, setCurrentTopic] = useState('');
  const [discussionActive, setDiscussionActive] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [speakingAgent, setSpeakingAgent] = useState(null);
  const [round, setRound] = useState(0);
  const [waitingForUser, setWaitingForUser] = useState(false);
  const [userPerformance, setUserPerformance] = useState({
    contributions: 0,
    totalLength: 0,
    relevantMessages: 0,
    engagingMessages: 0,
    voiceContributions: 0, // New: Track voice inputs
  });
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [micOn, setMicOn] = useState(true); // Mock mic for UI
  const [cameraOn, setCameraOn] = useState(true); // Mock camera for UI
  const [isRecording, setIsRecording] = useState(false); // New: Track voice recording
  const [speechSupported, setSpeechSupported] = useState(false); // New: Check API support
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null); // New: Reference for SpeechRecognition

  // Sample discussion topics (unchanged)
  const sampleTopics = [
    "Should artificial intelligence development be regulated?",
    "Is remote work better than working from an office?",
    "How can companies balance profit and social responsibility?",
    "Does social media do more harm than good in society?",
    "Should higher education be free for everyone?",
  ];

  // Initialize SpeechRecognition
  useEffect(() => {
    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setUserMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        if (event.error === 'no-speech' || event.error === 'aborted') {
          alert('No speech detected or recording was stopped.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone permissions.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start/stop voice recording
  const toggleRecording = () => {
    if (!speechSupported) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Failed to start speech recognition. Please check microphone permissions.');
      }
    }
  };

  // Start a new discussion
  const startDiscussion = () => {
    if (!currentTopic) {
      alert("Please enter a discussion topic first!");
      return;
    }
    
    setDiscussionActive(true);
    setMessages([
      {
        id: Date.now(),
        sender: 'system',
        text: `Today's discussion topic: ${currentTopic}`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setRound(1);
    
    setTimeout(() => {
      generateAgentResponse('agent1', currentTopic);
    }, 1000);
  };

  // End the discussion
  const endDiscussion = () => {
    setDiscussionActive(false);
    setMessages([]);
    setSpeakingAgent(null);
    setRound(0);
    setWaitingForUser(false);
    setAgents(agents.map(agent => ({ ...agent, history: [] })));
    setShowAnalysis(true);
  };

  // Generate agent response (unchanged)
  const generateAgentResponse = async (agentId, context) => {
    setSpeakingAgent(agentId);
    setIsLoading(true);
    
    const agent = agents.find(a => a.id === agentId);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let responseText = '';
      switch (agent.id) {
        case 'agent1':
          responseText = `Looking at this topic analytically, I've identified several key data points. First, ${getRandomDataPoint(context)}. Second, research shows that ${getRandomDataPoint(context)}. The evidence suggests a clear correlation between ${context.toLowerCase()} and productivity metrics. My conclusion is based on a systematic evaluation of the available evidence.`;
          break;
        case 'agent2':
          responseText = `I feel this topic deeply affects how we connect as humans. When I consider ${context}, I think about the individuals whose lives are changed by our decisions. There's a story I recently heard about someone who experienced ${context.toLowerCase()} firsthand, and their perspective was eye-opening. We should remember that behind every statistic are real human stories and emotions. What matters most is how these policies support human flourishing.`;
          break;
        case 'agent3':
          responseText = `I appreciate both perspectives shared so far. Alex makes valid points about the data-driven approach, while Priya highlights the human element that we can't ignore. Perhaps we can find middle ground by acknowledging that ${getMergedPerspective(context)}. When we focus on our shared values of progress and compassion, we can develop solutions that meet multiple needs simultaneously. Let's see if we can build on these insights together.`;
          break;
        case 'agent4':
          responseText = `What if we think about this differently? Imagine ${context} as ${getCreativeMetaphor(context)}. This completely transforms how we approach the problem! When we break free from conventional thinking, we might discover that the assumed dichotomies are actually false choices. Perhaps the solution lies in a dimension we haven't considered yet - what if we ${getCreativeApproach(context)}? Sometimes the most innovative solutions come from unexpected angles.`;
          break;
        default:
          responseText = `I'd like to contribute to the discussion about ${context}.`;
      }
      
      const newMessage = {
        id: Date.now(),
        sender: agent.id,
        text: responseText,
        name: agent.name,
        role: agent.role,
        avatarColor: agent.avatarColor,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      const updatedAgents = agents.map(a => {
        if (a.id === agent.id) {
          return {
            ...a,
            history: [...a.history, { role: 'assistant', content: responseText }],
          };
        }
        return a;
      });
      
      setAgents(updatedAgents);
      moveToNextSpeaker(agentId);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'system',
          text: `Error generating response from ${agent.name}.`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      moveToNextSpeaker(agentId);
    } finally {
      setIsLoading(false);
      setSpeakingAgent(null);
    }
  };

  // Move to next speaker
  const moveToNextSpeaker = (currentAgentId) => {
    const currentIndex = agents.findIndex(a => a.id === currentAgentId);
    const nextIndex = (currentIndex + 1) % (agents.length - 1);
    
    if (nextIndex === 0) {
      setRound(prevRound => prevRound + 1);
      
      if (round >= 3) {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'system',
            text: 'Discussion complete. Please share your final thoughts.',
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        setWaitingForUser(true);
        return;
      }
      
      setWaitingForUser(true);
      return;
    }
    
    setTimeout(() => {
      generateAgentResponse(agents[nextIndex].id, currentTopic);
    }, 2000);
  };

  // Handle user message submission
  const handleUserMessageSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'agent5',
      text: userMessage,
      name: 'You',
      role: 'Participant',
      avatarColor: 'bg-red-500',
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Update performance
    const isRelevant = userMessage.toLowerCase().includes(currentTopic.toLowerCase());
    const isEngaging = agents.some(agent => userMessage.toLowerCase().includes(agent.name.toLowerCase()));
    
    setUserPerformance(prev => ({
      contributions: prev.contributions + 1,
      totalLength: prev.totalLength + userMessage.length,
      relevantMessages: prev.relevantMessages + (isRelevant ? 1 : 0),
      engagingMessages: prev.engagingMessages + (isEngaging ? 1 : 0),
      voiceContributions: prev.voiceContributions + (isRecording ? 1 : 0),
    }));
    
    const updatedAgents = agents.map(a => {
      if (a.id === 'agent5') {
        return {
          ...a,
          history: [...a.history, { role: 'user', content: userMessage }],
        };
      }
      return a;
    });
    
    setAgents(updatedAgents);
    setUserMessage('');
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    
    if (waitingForUser) {
      setWaitingForUser(false);
      if (round < 3) {
        setTimeout(() => {
          generateAgentResponse('agent1', currentTopic);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        generateAgentResponse('agent1', userMessage);
      }, 1000);
    }
  };

  // Skip user input
  const skipUserInput = () => {
    setWaitingForUser(false);
    if (round < 3) {
      setTimeout(() => {
        generateAgentResponse('agent1', currentTopic);
      }, 1000);
    } else {
      endDiscussion();
    }
  };

  // Analyze performance
  const analyzePerformance = () => {
    const { contributions, totalLength, relevantMessages, engagingMessages, voiceContributions } = userPerformance;
    const avgLength = contributions > 0 ? (totalLength / contributions).toFixed(2) : 0;
    const relevanceScore = contributions > 0 ? ((relevantMessages / contributions) * 100).toFixed(2) : 0;
    const engagementScore = contributions > 0 ? ((engagingMessages / contributions) * 100).toFixed(2) : 0;
    const voiceUsage = contributions > 0 ? ((voiceContributions / contributions) * 100).toFixed(2) : 0;
    
    let summary = `You made ${contributions} contributions during the discussion, with ${voiceContributions} using voice input (${voiceUsage}%). `;
    summary += `Your average message length was ${avgLength} characters, indicating ${avgLength > 100 ? 'good depth' : 'room for more detail'}. `;
    summary += `${relevanceScore}% of your messages were relevant to the topic, and ${engagementScore}% engaged with other participants' points.`;
    
    const suggestions = [];
    if (contributions < 3) {
      suggestions.push("Try contributing more frequently to stay actively involved.");
    }
    if (avgLength < 50) {
      suggestions.push("Elaborate on your points with examples or reasoning to add depth.");
    }
    if (relevanceScore < 50) {
      suggestions.push("Focus on addressing the discussion topic directly.");
    }
    if (engagementScore < 50) {
      suggestions.push("Respond to specific points raised by others to build dialogue.");
    }
    if (voiceContributions === 0 && speechSupported) {
      suggestions.push("Consider using voice input to express your ideas more naturally.");
    } else if (voiceContributions > 0) {
      suggestions.push("Great use of voice input! Combine it with text for variety.");
    }
    if (suggestions.length === 0) {
      suggestions.push("Great job! Keep contributing actively and engaging with others.");
    }
    
    return { summary, suggestions };
  };

  // Helper functions (unchanged)
  function getRandomDataPoint(topic) {
    const dataPoints = [
      `72% of surveyed professionals agree that ${topic.toLowerCase()} has significant impact on productivity`,
      `recent studies indicate a 34% increase in effectiveness when implementing solutions related to ${topic.toLowerCase()}`,
      `market analysis shows a clear trend toward ${topic.toLowerCase()} with annual growth of 18-20%`,
      `comparative research across 5 countries demonstrates consistent patterns regarding ${topic.toLowerCase()}`,
      `longitudinal studies over 5 years show a 28% improvement in outcomes when ${topic.toLowerCase()} is prioritized`,
    ];
    return dataPoints[Math.floor(Math.random() * dataPoints.length)];
  }

  function getMergedPerspective(topic) {
    const perspectives = [
      `we need both data-driven decisions and human-centered implementation when it comes to ${topic.toLowerCase()}`,
      `balancing innovation with proven methods could provide a sustainable approach to ${topic.toLowerCase()}`,
      `considering both short-term results and long-term impact will lead to better outcomes for ${topic.toLowerCase()}`,
      `integrating diverse viewpoints strengthens our overall understanding of ${topic.toLowerCase()}`,
      `approaching ${topic.toLowerCase()} with both analytical rigor and emotional intelligence creates more resilient solutions`,
    ];
    return perspectives[Math.floor(Math.random() * perspectives.length)];
  }

  function getCreativeMetaphor(topic) {
    const metaphors = [
      `a garden where different ideas can grow together and cross-pollinate`,
      `a jazz ensemble where each instrument adds something unique but they create harmony`,
      `a flowing river that changes course when it meets obstacles but always finds its way forward`,
      `a tapestry with different threads that only reveals its full pattern when viewed as a whole`,
      `a quantum particle that exists in multiple states simultaneously until we observe it`,
    ];
    return metaphors[Math.floor(Math.random() * metaphors.length)];
  }

  function getCreativeApproach(topic) {
    const approaches = [
      `inverted the traditional power dynamics in this situation`,
      `applied principles from completely unrelated fields like biomimicry or quantum physics`,
      `eliminated the core assumption that's limiting our thinking`,
      `designed systems that adapt dynamically rather than static solutions`,
      `combined seemingly contradictory approaches simultaneously`,
    ];
    return approaches[Math.floor(Math.random() * approaches.length)];
  }

  // Select random topic
  const selectRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * sampleTopics.length);
    setCurrentTopic(sampleTopics[randomIndex]);
  };

  // Get model details
  const getModelDetails = (agent) => {
    if (!agent.model) return "";
    switch (agent.model) {
      case 'openai':
        return "OpenAI GPT-3.5";
      case 'cohere':
        return "Cohere Command";
      case 'huggingface':
        return "Mistral-7B";
      case 'ollama':
        return "Llama 2";
      default:
        return agent.model;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      {/* Setup Panel */}
      {!discussionActive && (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg m-4">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Interview Simulation
          </h1>
          <div className="mb-4">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
              Discussion Topic
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="topic"
                value={currentTopic}
                onChange={(e) => setCurrentTopic(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a discussion topic..."
              />
              <button
                onClick={selectRandomTopic}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Random
              </button>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Participants</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {agents.map(agent => (
                <div key={agent.id} className="border rounded-lg p-4 bg-gray-50 flex items-center">
                  <div className={`w-10 h-10 rounded-full ${agent.avatarColor} text-white flex items-center justify-center font-medium`}>
                    {agent.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium text-gray-800">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.role}</div>
                    <div className="text-xs text-gray-600 mt-1">{agent.personality}</div>
                    {agent.model && (
                      <div className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded mt-1 inline-block">
                        Model: {getModelDetails(agent)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={startDiscussion}
            disabled={!currentTopic}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:bg-blue-300"
          >
            Start Discussion
          </button>
        </div>
      )}

      {/* Discussion Area */}
      {discussionActive && (
        <div className="flex flex-col h-full">
          {/* Participant Tiles */}
          <div className="bg-white shadow p-4 flex flex-wrap gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                className={`relative w-32 h-24 rounded-lg overflow-hidden border-2 ${
                  speakingAgent === agent.id ? 'border-blue-500' : 'border-gray-200'
                } flex items-center justify-center bg-gray-800`}
              >
                <div className={`w-12 h-12 rounded-full ${agent.avatarColor} text-white flex items-center justify-center text-xl font-medium`}>
                  {agent.name.charAt(0)}
                </div>
                <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                  {agent.name}
                </div>
                {agent.id === 'agent5' && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div
                      className={`p-1 rounded-full ${micOn ? 'bg-green-500' : 'bg-red-500'}`}
                      title="Microphone (UI only)"
                    >
                      {micOn ? <Mic size={12} /> : <MicOff size={12} />}
                    </div>
                    <div
                      className={`p-1 rounded-full ${cameraOn ? 'bg-gray-500' : 'bg-gray-500'}`}
                      title="Camera disabled for simulation"
                    >
                      <CameraOff size={12} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Discussion Area */}
          <div className="flex-1 flex flex-col bg-white m-4 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-800">Topic: {currentTopic}</h2>
                <div className="text-xs text-gray-500">Round: {round} of 3</div>
              </div>
              <button
                onClick={endDiscussion}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
              >
                Leave Meeting
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map(message => (
                <div key={message.id} className="mb-4">
                  {message.sender === 'system' ? (
                    <div className="text-center text-sm text-gray-500 my-3">
                      {message.text}
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-full ${message.avatarColor} text-white flex items-center justify-center font-medium flex-shrink-0`}>
                        {message.name?.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-baseline">
                          <div className="font-medium text-gray-800">
                            {message.name}{' '}
                            {message.role && (
                              <span className="text-xs text-gray-500">({message.role})</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">{message.timestamp}</div>
                        </div>
                        <div className="mt-1 text-gray-700">{message.text}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {speakingAgent && (
                <div className="flex items-center text-sm text-gray-500 italic mb-4">
                  <div className="animate-pulse mr-2">
                    {agents.find(a => a.id === speakingAgent)?.name} is typing...
                  </div>
                </div>
              )}
              {waitingForUser && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700 mb-2">
                    Your turn to share your thoughts on {currentTopic}!
                  </p>
                  <form onSubmit={handleUserMessageSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type or speak your message..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={toggleRecording}
                        disabled={!speechSupported || isLoading || speakingAgent !== null}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                          isRecording ? 'bg-red-500' : 'bg-blue-500'
                        } text-white disabled:bg-gray-300`}
                        title={speechSupported ? 'Toggle voice input' : 'Voice input not supported'}
                      >
                        {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!userMessage.trim() || isLoading || speakingAgent !== null}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:bg-blue-300"
                    >
                      Send
                    </button>
                    <button
                      type="button"
                      onClick={skipUserInput}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      Skip
                    </button>
                  </form>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-gray-800 p-4 flex justify-center gap-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-full ${micOn ? 'bg-gray-600' : 'bg-red-600'} text-white`}
              title="Microphone toggle (UI only)"
            >
              {micOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button
              className="p-3 rounded-full bg-gray-500 text-white"
              title="Camera disabled for simulation"
            >
              <CameraOff size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Performance Analysis Modal */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Performance Analysis</h2>
            <div className="text-gray-700 mb-4">
              <p className="font-medium">Summary:</p>
              <p>{analyzePerformance().summary}</p>
            </div>
            <div className="text-gray-700 mb-6">
              <p className="font-medium">Suggestions for Improvement:</p>
              <ul className="list-disc pl-5">
                {analyzePerformance().suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                setShowAnalysis(false);
                setUserPerformance({
                  contributions: 0,
                  totalLength: 0,
                  relevantMessages: 0,
                  engagingMessages: 0,
                  voiceContributions: 0,
                });
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GDSimulation;