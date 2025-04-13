// /api/audio/[voiceId]/route.js
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    // Get the voiceId from route params
    const { voiceId } = params;
    
    // Get text from query params
    const url = new URL(req.url);
    const text = url.searchParams.get('text');
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text parameter is required' },
        { status: 400 }
      );
    }

    // Voice settings map for different voice identifiers
    const voiceMap = {
      'en-US-Neural2-A': { name: 'en-US', gender: 'male', pitch: 1.0, rate: 1.0 },
      'en-US-Neural2-D': { name: 'en-US', gender: 'male', pitch: 0.9, rate: 0.95 },
      'en-US-Neural2-C': { name: 'en-US', gender: 'female', pitch: 1.1, rate: 1.0 },
      'en-US-Neural2-F': { name: 'en-US', gender: 'female', pitch: 1.2, rate: 1.05 },
    };

    const voiceSettings = voiceMap[voiceId] || { name: 'en-US', gender: 'male', pitch: 1.0, rate: 1.0 };

    // Return the speech parameters using NextResponse for consistency
    return NextResponse.json({
      text,
      voiceSettings,
      // Include a token to prevent caching issues
      token: Date.now()
    }, {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error in TTS API:', error);
    return NextResponse.json(
      { error: 'Failed to process text-to-speech request', details: error.message },
      { status: 500 }
    );
  }
}