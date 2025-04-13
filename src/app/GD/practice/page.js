'use client'
import { useState, useEffect, useRef } from 'react';
import styles from '@/app/styles/GroupDiscussion.module.css';

export default function GroupDiscussion() {
  const [topic, setTopic] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(null);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isDiscussionStarted, setIsDiscussionStarted] = useState(false);
  const [isDiscussionEnded, setIsDiscussionEnded] = useState(false);
  const [userCanSpeak, setUserCanSpeak] = useState(false);
  const [userWaitTimer, setUserWaitTimer] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  const chatContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const synthRef = useRef(null);
  
  // Initialize SpeechSynthesis for browser audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize speech synthesis
      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (userWaitTimer) {
        clearTimeout(userWaitTimer);
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      stopRecording();
    };
  }, []);
  
  // Initialize the discussion
  const startDiscussion = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      console.log('Initializing discussion...');
      const response = await fetch('/api/group-discusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Initialized discussion:', data);
      
      setTopic(data.topic || 'Default topic');
      setChatHistory([]);
      setTimeRemaining(data.timeRemaining || 300);
      setCurrentSpeakerIndex(data.nextSpeakerIndex !== undefined ? data.nextSpeakerIndex : 0);
      setIsUserTurn(!!data.isUserTurn);
      setUserCanSpeak(!!data.userCanSpeak);
      setIsDiscussionStarted(true);
      
      // Automatically continue the discussion
      setTimeout(() => continueDiscussion(), 500);
    } catch (error) {
      console.error('Error starting discussion:', error);
      setErrorMessage(`Failed to start discussion: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Continue the ongoing discussion
  const continueDiscussion = async (userInput = null) => {
    if (isDiscussionEnded) return;
    
    // Clear any existing user wait timer
    if (userWaitTimer) {
      clearTimeout(userWaitTimer);
      setUserWaitTimer(null);
    }
    
    setIsLoading(true);
    try {
      const requestData = {
        action: 'continue',
        topic,
        chatHistory,
        userInput,
        currentSpeakerIndex,
        timeRemaining,
        userResponded: !!userInput
      };
      
      console.log('Continue discussion request:', requestData);
      
      const response = await fetch('/api/group-discusion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Continue discussion response:', data);
      
      setChatHistory(data.chatHistory || []);
      setTimeRemaining(data.timeRemaining || timeRemaining);
      setCurrentSpeakerIndex(data.nextSpeakerIndex !== undefined ? data.nextSpeakerIndex : currentSpeakerIndex);
      setIsUserTurn(!!data.isUserTurn);
      setUserCanSpeak(!!data.userCanSpeak);
      
      if (data.status === 'completed') {
        setIsDiscussionEnded(true);
      } else if (!data.isUserTurn) {
        // If we have an audioUrl and speech synthesis is available, use it
        if (data.audioUrl && synthRef.current) {
          try {
            // Get speech parameters using the audioUrl
            const voiceId = data.audioUrl.split('/').pop().split('?')[0];
            const speechResponse = await fetch(`/api/audio/${voiceId}?text=${encodeURIComponent(data.chatHistory[data.chatHistory.length - 1].text)}`);
            
            if (speechResponse.ok) {
              const speechData = await speechResponse.json();
              
              // Use the browser's speech synthesis
              speakText(speechData.text, speechData.voiceSettings);
              
              // After speaking, handle the rest of the discussion flow
              setTimeout(() => {
                handleAudioCompletion(data);
              }, 1000); // Allow slight delay for speech to start
            } else {
              console.error('Failed to get speech parameters');
              handleAudioCompletion(data);
            }
          } catch (error) {
            console.error('Error with speech synthesis:', error);
            handleAudioCompletion(data);
          }
        } else {
          // No audio or synthesis, continue after delay
          setTimeout(() => {
            handleAudioCompletion(data);
          }, 3000);
        }
      } else {
        // It's user's turn to speak
        setUserCanSpeak(true);
      }
    } catch (error) {
      console.error('Error continuing discussion:', error);
      setErrorMessage(`Failed to continue discussion: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use speech synthesis to speak text
  const speakText = (text, voiceSettings) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply voice settings
    if (voiceSettings) {
      utterance.lang = voiceSettings.name || 'en-US';
      utterance.pitch = voiceSettings.pitch || 1;
      utterance.rate = voiceSettings.rate || 1;
      
      // Try to find a matching voice if possible
      const voices = synthRef.current.getVoices();
      const matchingVoice = voices.find(v => 
        v.lang.includes(voiceSettings.name) && 
        ((voiceSettings.gender === 'male' && v.name.toLowerCase().includes('male')) ||
         (voiceSettings.gender === 'female' && v.name.toLowerCase().includes('female')))
      );
      
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }
    
    // Speak the text
    synthRef.current.speak(utterance);
  };
  
  // Handle audio completion
  const handleAudioCompletion = (data) => {
    // After agent speaks, start user opportunity timer if enabled
    if (data.userCanSpeak && data.userWaitTime > 0) {
      setUserCanSpeak(true);
      
      // Set timer for user response window
      const timer = setTimeout(() => {
        handleUserTimeExpired(data);
      }, (data.userWaitTime || 5) * 1000);
      
      setUserWaitTimer(timer);
    }
    // If no user opportunity, wait and continue
    else {
      const waitTime = data.waitTime || 3;
      setTimeout(() => {
        continueDiscussion();
      }, waitTime * 1000);
    }
  };
  
  // Handle user time expired
  const handleUserTimeExpired = async (data) => {
    if (!userCanSpeak) return; // Skip if user already finished speaking
    
    stopRecording();
    setUserCanSpeak(false);
    
    try {
      console.log('User time expired, continuing discussion...');
      // No need to make a separate API call, just continue
      continueDiscussion();
    } catch (error) {
      console.error('Error handling user time expired:', error);
      setErrorMessage(`Error: ${error.message}`);
    }
  };
  
  // Start recording user speech
  const startRecording = async () => {
    // Reset audio chunks
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorderRef.current.addEventListener('stop', async () => {
        // Process the recorded audio
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Only process if we have actual audio data
          if (audioBlob.size > 0) {
            try {
              await processAudio(audioBlob);
            } catch (error) {
              console.error('Error processing audio:', error);
              setErrorMessage('Failed to process your speech');
            }
          } else {
            console.log('No audio recorded');
          }
        }
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      });
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      console.log('Started recording audio');
    } catch (error) {
      console.error('Error starting recording:', error);
      setErrorMessage('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  // Stop recording user speech
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        console.log('Stopped recording audio');
      } catch (error) {
        console.error('Error stopping recording:', error);
      }
      setIsRecording(false);
    }
  };
  
  // Process recorded audio with Google Cloud Speech API
  const processAudio = async (audioBlob) => {
    try {
      setIsLoading(true);
      
      // Send the audio blob to our API endpoint
      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: audioBlob
      });
      
      if (!response.ok) {
        throw new Error(`Speech-to-text API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Speech recognition result:', data);
      
      if (data.transcription && data.transcription.trim() !== '') {
        // Use the transcription in the discussion
        continueDiscussion(data.transcription);
      } else {
        console.log('No speech detected or empty transcription');
        continueDiscussion(); // Continue without user input
      }
    } catch (error) {
      console.error('Error in speech processing:', error);
      setErrorMessage(`Speech recognition error: ${error.message}`);
      continueDiscussion(); // Continue without user input
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle recording state
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
      setUserCanSpeak(false);
      
      // Clear the user wait timer
      if (userWaitTimer) {
        clearTimeout(userWaitTimer);
        setUserWaitTimer(null);
      }
    } else if (userCanSpeak || isUserTurn) {
      startRecording();
    }
  };
  
  // Format time remaining
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Scroll to bottom of chat when history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  // Countdown timer
  useEffect(() => {
    let timer;
    if (isDiscussionStarted && !isDiscussionEnded && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsDiscussionEnded(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [isDiscussionStarted, isDiscussionEnded]);
  
  return (
    <div className={styles.container}>
      <h1>Group Discussion Simulator</h1>
      
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)}>Dismiss</button>
        </div>
      )}
      
      {!isDiscussionStarted ? (
        <div className={styles.startSection}>
          <p>Practice your group discussion skills with AI participants</p>
          <button 
            className={styles.startButton} 
            onClick={startDiscussion} 
            disabled={isLoading}
          >
            {isLoading ? 'Starting...' : 'Start Group Discussion'}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.topBar}>
            <h2>Topic: {topic}</h2>
            <div className={styles.timer}>Time: {formatTime(timeRemaining)}</div>
          </div>
          
          <div className={styles.chatContainer} ref={chatContainerRef}>
            {Array.isArray(chatHistory) && chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${message.speaker === 'You' ? styles.userMessage : styles.aiMessage}`}
                style={{ borderColor: message.color }}
              >
                <div className={styles.messageSender} style={{ color: message.color }}>
                  {message.speaker}
                </div>
                <div className={styles.messageContent}>
                  {message.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
          
          <div className={styles.inputArea}>
            {(isUserTurn || userCanSpeak) && !isDiscussionEnded ? (
              <div className={styles.micContainer}>
                <button 
                  className={`${styles.micButton} ${isRecording ? styles.recording : ''}`}
                  onClick={toggleRecording}
                  disabled={isLoading}
                >
                  {isRecording ? 'Stop Speaking' : 'Start Speaking'}
                </button>
                {isRecording && <div className={styles.recordingIndicator}>
                  {userCanSpeak && !isUserTurn ? 'You can respond now (5s)...' : 'Recording...'}
                </div>}
              </div>
            ) : isDiscussionEnded ? (
              <div className={styles.discussionEnded}>
                <p>Discussion has ended</p>
                <button 
                  className={styles.startButton} 
                  onClick={() => {
                    setIsDiscussionStarted(false);
                    setIsDiscussionEnded(false);
                  }}
                >
                  Start New Discussion
                </button>
              </div>
            ) : (
              <div className={styles.waitingMessage}>
                {chatHistory && chatHistory.length > 0 ? `${chatHistory[chatHistory.length - 1].speaker} is speaking...` : 'Discussion starting...'}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}