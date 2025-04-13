import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { juryMember, userResponse } = await request.json();

    if (!juryMember || !userResponse) {
      return NextResponse.json(
        { error: 'Missing juryMember or userResponse' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      You are ${juryMember.name}, a ${juryMember.behavior} jury member interviewing a candidate.
      Description: ${juryMember.description}.
      The candidate responded: "${userResponse}".
      Provide a concise follow-up question or comment that aligns with your behavior, designed to be spoken aloud.
      Keep the response under 50 words and ensure it sounds natural for voice delivery.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}