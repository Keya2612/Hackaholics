// /api/gd
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { NextResponse } from 'next/server';

// Predefined agents with their personalities
const agents = [
  {name: 'Aryan', behaviour: 'calm, polite, professional', color: 'red', voice: 'male', voiceId: 'en-US-Neural2-D'},
  {name: 'Rohan', behaviour: 'confident, not so polite, arrogant', color: 'orange', voice: 'male', voiceId: 'en-US-Neural2-A'},
  {name: 'Aesha', behaviour: 'friendly, polite, shy', color: 'blue', voice: 'female', voiceId: 'en-US-Neural2-F'},
  {name: 'Vishwaa', behaviour: 'confident, polite, professional', color: 'pink', voice: 'female', voiceId: 'en-US-Neural2-C'},
  {name: 'You', behaviour: '', color: 'green', voice: 'none'}
];

export async function POST(req) {
  try {
    // Initialize the Gemini model
    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-1.5-pro",
      temperature: 1,
      maxRetries: 2,
    });

    // Parse the request body
    const requestData = await req.json();
    const { action, topic, chatHistory, userInput, currentSpeakerIndex, userResponded, timeRemaining: currentTimeRemaining = 300 } = requestData;
    
    // Initialize the discussion if first call
    if (action === 'initialize') {
      // Generate a GD topic if not provided
      let discussionTopic = topic;
      if (!discussionTopic) {
        discussionTopic = await llm.predict('Suggest a challenging professional group discussion topic for a job interview. Give only the topic name in your response.');
      }
      
      return NextResponse.json({
        status: 'initialized',
        topic: discussionTopic,
        chatHistory: [],
        nextSpeakerIndex: 0, // Start with the first agent
        timeRemaining: 300, // 5 minutes in seconds
        isUserTurn: false,
        userCanSpeak: false,
        userWaitTime: 0
      });
    }
    
    // Handle ongoing discussion
    else if (action === 'continue') {
      // Calculate next speaker based on current situation
      let nextSpeakerIndex;
      let updatedChatHistory = [...chatHistory];
      let userCanSpeak = false;
      let userWaitTime = 0;
      
      // If user provided input after an agent spoke
      if (userInput) {
        updatedChatHistory.push({
          speaker: 'You',
          text: userInput,
          timestamp: new Date().toISOString(),
          color: 'green'
        });
        // After user speaks, move to the next agent
        nextSpeakerIndex = (agents.findIndex(a => a.name === 'You') + 1) % agents.length;
      } 
      // If user didn't respond within the wait time
      else if (requestData.userCanSpeak && !userResponded) {
        // If user didn't speak during their opportunity, move to next agent
        nextSpeakerIndex = (agents.findIndex(a => a.name === 'You') + 1) % agents.length;
      }
      // Normal progression
      else {
        nextSpeakerIndex = (currentSpeakerIndex + 1) % agents.length;
      }
      
      const nextSpeaker = agents[nextSpeakerIndex];
      const isUserTurn = nextSpeaker.name === 'You';
      
      // Generate AI response if it's not user's turn
      let aiResponse = null;
      let audioUrl = null;
      
      if (!isUserTurn) {
        // Generate response from the AI agent
        const prompt = `
          You are ${nextSpeaker.name}, a participant in a group discussion during a job interview.
          Your personality traits are: ${nextSpeaker.behaviour}.
          
          The discussion topic is: "${topic}"
          
          Previous discussion:
          ${updatedChatHistory.map(msg => `${msg.speaker}: ${msg.text}`).join('\n')}
          
          Provide a single response (2-3 sentences) as ${nextSpeaker.name}, speaking in character according to your personality traits.
          Be concise and stay in character. Don't introduce yourself or mention your personality traits explicitly.
          Make your response natural as if you're in a real group discussion. Respond to previous points when appropriate.
        `;
        
        aiResponse = await llm.predict(prompt);
        
        // Add AI response to chat history
        updatedChatHistory.push({
          speaker: nextSpeaker.name,
          text: aiResponse.trim(),
          timestamp: new Date().toISOString(),
          color: nextSpeaker.color
        });
        
        // Generate URL for the browser-based text-to-speech
        audioUrl = `/api/audio/${nextSpeaker.voiceId}?text=${encodeURIComponent(aiResponse.trim())}`;
        
        // After any agent speaks, user can respond
        userCanSpeak = true;
        userWaitTime = 5; // 5 seconds wait time for user to respond
      }
      
      // Calculate time elapsed
      const timeElapsed = Math.floor(Math.random() * 3) + 2; // Random between 2-5 seconds
      const timeRemaining = Math.max(0, parseInt(currentTimeRemaining) - timeElapsed);
      const isDiscussionEnded = timeRemaining <= 0;
      
      return NextResponse.json({
        status: isDiscussionEnded ? 'completed' : 'ongoing',
        topic,
        chatHistory: updatedChatHistory,
        nextSpeakerIndex: isDiscussionEnded ? null : nextSpeakerIndex,
        currentSpeaker: nextSpeaker.name,
        isUserTurn,
        timeRemaining,
        audioUrl,
        userCanSpeak,
        userWaitTime,
        waitTime: isUserTurn ? null : Math.floor(Math.random() * 3) + 2 // Random wait time between 2-5 seconds
      });
    }
    
    // Special action for when user doesn't speak and wait time expires
    else if (action === 'userTimeExpired') {
      // Move to the next agent after user's opportunity expires
      const nextSpeakerIndex = (agents.findIndex(a => a.name === 'You') + 1) % agents.length;
      
      return NextResponse.json({
        status: 'ongoing',
        topic,
        chatHistory,
        nextSpeakerIndex,
        currentSpeaker: agents[nextSpeakerIndex].name,
        isUserTurn: false,
        timeRemaining: currentTimeRemaining,
        userCanSpeak: false,
        userWaitTime: 0
      });
    }
    
    // Invalid action
    else {
      return NextResponse.json(
        { error: 'Invalid action specified' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}