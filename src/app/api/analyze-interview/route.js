// File: /app/api/analyze-interview/route.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { history } = await request.json();
    
    if (!history || !Array.isArray(history) || history.length === 0) {
      return Response.json(
        { error: "Invalid conversation history provided" },
        { status: 400 }
      );
    }

    // Format the conversation history for the prompt
    const formattedHistory = history.map((entry, index) => {
      return `Question ${index + 1} by ${entry.juryMember.name} (${entry.juryMember.behavior}): "${entry.juryQuestion}"\n` +
        `Candidate's Response: "${entry.userResponse || '[No response]'}"\n`;
    }).join("\n");

    // Create a prompt for Gemini
    const prompt = `
You are an expert interview coach analyzing a recorded interview. Below is the transcript of a personal interview (PI) round where different jury members interviewed a candidate. Analyze the candidate's responses and provide:

1. An overall score out of 100
2. 3-5 key strengths displayed in the responses
3. 2-4 specific suggestions for improvement

The interview transcript:
${formattedHistory}

Format your analysis as a JSON object with the following structure:
{
  "score": [number between 0-100],
  "strengths": [array of 3-5 strength strings],
  "suggestions": [array of 2-4 suggestion strings]
}

Assess based on these criteria:
- Communication clarity and articulateness
- Depth and relevance of responses
- Confidence and professionalism
- Technical knowledge where applicable
- How well they handled difficult questions
`;

    // Call Gemini API for analysis
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();

    // Extract the JSON object from the response
    // Look for a JSON structure in the text and parse it
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    let analysis;
    
    if (jsonMatch) {
      try {
        analysis = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Error parsing Gemini response as JSON:", parseError);
        // Fallback to manually extracting items
        analysis = extractAnalysisManually(textResponse);
      }
    } else {
      analysis = extractAnalysisManually(textResponse);
    }

    return Response.json({ analysis });
  } catch (error) {
    console.error("Error analyzing interview:", error);
    return Response.json(
      { 
        error: "Failed to analyze interview",
        analysis: {
          score: 65,
          strengths: [
            "Completed the interview process",
            "Responded to questions asked",
            "Maintained professional demeanor"
          ],
          suggestions: [
            "Provide more detailed examples in responses",
            "Work on addressing the specific questions more directly",
            "Practice common interview questions to improve confidence"
          ]
        }
      },
      { status: 500 }
    );
  }
}

// Helper function to extract analysis manually if JSON parsing fails
function extractAnalysisManually(text) {
  // Default values
  const analysis = {
    score: 70,
    strengths: [],
    suggestions: []
  };

  // Try to extract score
  const scoreMatch = text.match(/score[\s\S]*?(\d+)/i);
  if (scoreMatch) {
    analysis.score = parseInt(scoreMatch[1]);
  }

  // Try to extract strengths
  const strengthsSection = text.match(/strengths[\s\S]*?:[\s\S]*?suggestions/i);
  if (strengthsSection) {
    const strengthMatches = strengthsSection[0].match(/[-•*]\s*([^-•*\n]+)/g);
    if (strengthMatches) {
      analysis.strengths = strengthMatches
        .map(s => s.replace(/[-•*]\s*/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 5);
    }
  }

  // Try to extract suggestions
  const suggestionsSection = text.match(/suggestions[\s\S]*?:[\s\S]*/i);
  if (suggestionsSection) {
    const suggestionMatches = suggestionsSection[0].match(/[-•*]\s*([^-•*\n]+)/g);
    if (suggestionMatches) {
      analysis.suggestions = suggestionMatches
        .map(s => s.replace(/[-•*]\s*/, '').trim())
        .filter(s => s.length > 0)
        .slice(0, 4);
    }
  }

  // Ensure we have at least some values
  if (analysis.strengths.length === 0) {
    analysis.strengths = [
      "Participated in the interview process",
      "Responded to questions",
      "Demonstrated interest in the position"
    ];
  }

  if (analysis.suggestions.length === 0) {
    analysis.suggestions = [
      "Provide more specific examples in responses",
      "Practice articulating experiences more clearly"
    ];
  }

  return analysis;
}