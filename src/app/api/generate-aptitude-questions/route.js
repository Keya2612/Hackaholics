import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    // Validate API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing Gemini API key in environment variables');
      return NextResponse.json({ error: 'Server configuration error: Missing API key' }, { status: 500 });
    }

    const topic = `🔢 Quantitative Aptitude
Number System, Divisibility Rules, HCF & LCM, Remainders, Factorials, Base Conversions,
Simplification & Approximation, BODMAS, Surds and Indices, Percentage,
Profit, Loss & Discount, Simple Interest & Compound Interest, Ratio and Proportion,
Average, Mixtures and Alligations, Time, Speed and Distance, Trains, Boats & Streams,
Time and Work, Pipes and Cisterns, Mensuration, Permutations and Combinations,
Probability, Algebra, Geometry, Trigonometry, Logarithms

🧠 Logical Reasoning & Analytical Ability
Series, Coding-Decoding, Blood Relations, Direction Sense, Syllogisms, Puzzles, Data Sufficiency

📊 Data Interpretation
Bar Graphs, Pie Charts, Line Graphs, Tables, Caselets, Data Comparison`;

    // Extract subtopics for later use
    const subtopics = topic
      .replace(/🔢|🧠|📊/g, '')
      .split(/\n+/)
      .flatMap(line => 
        line.split(/,/)
          .map(item => item.trim())
          .filter(item => item.length > 0)
      );

    // Parse request body
    const { numQuestions, userAnswers, calculateScore } = await req.json();

    // If we're calculating the score, process the submitted answers
    if (calculateScore && userAnswers) {
      return calculateUserScore(userAnswers);
    }

    // Otherwise, generate new questions
    if (!topic || !numQuestions || numQuestions <= 0) {
      return NextResponse.json({ error: 'Please provide a topic and a valid number of questions.' }, { status: 400 });
    }

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the specific model version
    const modelName = 'gemini-2.0-flash';
    
    try {
      // Get the model instance
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Prepare a more specific prompt to get well-structured output
      const prompt = `Generate ${numQuestions} multiple-choice questions about ${topic}. 

For each question:
1. Include exactly 4 options labeled A, B, C, and D
2. Clearly indicate one correct answer
3. Format the response as a valid JSON array of objects with this structure:
[
  {
    "question": "Question text here?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correct_answer": "The correct option text (without A/B/C/D prefix)",
    "subtopic": "Specific subtopic this question belongs to within ${topic}"
  }
]
`;

      console.log(`Calling generateContent with model ${modelName} and prompt:`, prompt);
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      console.log("Gemini API response received");

      const responseText = result.response?.text();

      if (!responseText) {
        console.error("Gemini API returned an empty response.");
        return NextResponse.json({ error: 'Gemini API returned an empty response' }, { status: 500 });
      }

      // Try to parse the JSON from the response
      const parseQuestions = (text) => {
        try {
          // First, try to extract JSON if it's wrapped in markdown code blocks
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            try {
              const jsonText = jsonMatch[1];
              const parsed = JSON.parse(jsonText);
              return Array.isArray(parsed) ? parsed : [];
            } catch (e) {
              console.warn("Failed to parse JSON from code block:", e);
            }
          }
          
          // Then try parsing the entire response as JSON
          try {
            const data = JSON.parse(text);
            if (Array.isArray(data)) {
              return data; // If it's already a JSON array, return it.
            } else if (data.questions && Array.isArray(data.questions)) {
              return data.questions; // If it's an object with a questions array
            } else {
              console.error("Expected an array of questions, but got:", data);
              return [];
            }
          } catch (directJsonError) {
            console.warn("Failed direct JSON parsing:", directJsonError);
            
            // Fall back to text parsing if JSON parsing fails
            const questions = [];
            let currentQuestion = null;
            
            // Split by numbered questions pattern (e.g., "1. ", "2. ")
            const questionBlocks = text.split(/\n\s*\d+\.\s*/).filter(Boolean);
            
            for (const block of questionBlocks) {
              try {
                const questionMatch = block.match(/^(.+?)(?:\n|$)/);
                if (!questionMatch) continue;
                
                const questionText = questionMatch[1].trim();
                currentQuestion = {
                  question: questionText,
                  options: [],
                  correct_answer: "",
                  subtopic: determineSubtopic(questionText, topic)
                };
                
                // Extract options
                const optionsMatches = [...block.matchAll(/([A-D])\.\s*([^\n]+)/g)];
                if (optionsMatches.length > 0) {
                  for (const optionMatch of optionsMatches) {
                    const optionLetter = optionMatch[1];
                    const optionText = optionMatch[2].trim();
                    currentQuestion.options.push(optionText); // Store just the text, not the letter prefix
                  }
                }
                
                // Extract correct answer
                const correctMatch = block.match(/(?:Correct Answer|Answer|Correct):\s*(?:([A-D])|([^.\n]+))/i);
                if (correctMatch) {
                  const correctLetter = correctMatch[1];
                  const correctText = correctMatch[2];
                  
                  if (correctLetter && currentQuestion.options.length > 0) {
                    // If letter format (A/B/C/D), get the corresponding option text
                    const letterIndex = correctLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
                    if (letterIndex >= 0 && letterIndex < currentQuestion.options.length) {
                      currentQuestion.correct_answer = currentQuestion.options[letterIndex];
                    } else {
                      currentQuestion.correct_answer = correctLetter;
                    }
                  } else if (correctText) {
                    currentQuestion.correct_answer = correctText.trim();
                  }
                }
                
                questions.push(currentQuestion);
              } catch (blockError) {
                console.warn("Error parsing question block:", blockError);
              }
            }
            
            return questions;
          }
        } catch (error) {
          console.error("Failed to parse questions:", error);
          return [];
        }
      };

      // Helper function to determine subtopic based on question content
      function determineSubtopic(questionText, mainTopic) {
        // Logic to determine subtopic based on keywords in the question
        if (subtopics.length > 0) {
          for (const subtopic of subtopics) {
            if (questionText.toLowerCase().includes(subtopic.toLowerCase())) {
              return subtopic;
            }
          }
        }
        
        // If it's a math question, try to categorize it
        if (mainTopic.toLowerCase().includes('math')) {
          if (questionText.match(/equation|formula|algebra|variable|x\s*=/i)) return 'algebra';
          if (questionText.match(/triangle|circle|angle|square|rectangle|polygon|shape/i)) return 'geometry';
          if (questionText.match(/probability|chance|likely|random|odds/i)) return 'probability';
          if (questionText.match(/add|subtract|multiply|divide|fraction|decima|percent/i)) return 'arithmetic';
        }
        
        // Clock topic subtopics
        if (mainTopic.toLowerCase().includes('clock')) {
          if (questionText.match(/angle|between hands|degree/i)) return 'clock angles';
          if (questionText.match(/time|hours|minutes|seconds/i)) return 'time calculation';
          if (questionText.match(/fast|slow|gain|lose/i)) return 'clock errors';
        }
        
        return 'general ' + mainTopic;
      }

      const questions = parseQuestions(responseText);
      
      // Validate the questions structure and add subtopics if needed
      const validatedQuestions = questions.map(q => {
        // Ensure options is always an array
        if (!q.options || !Array.isArray(q.options)) {
          q.options = [];
        }
        
        // Remove any letter prefixes from options if they still exist
        q.options = q.options.map(opt => 
          opt.replace(/^[A-D]\.\s*/, '').trim()
        );
        
        // Ensure there's a correct_answer field
        if (!q.correct_answer) {
          q.correct_answer = "";
        }
        
        // Add subtopic if missing
        if (!q.subtopic) {
          q.subtopic = determineSubtopic(q.question, topic);
        }
        
        return q;
      });

      if (!validatedQuestions.length) {
        console.error("Failed to parse questions from response:", responseText);
        return NextResponse.json({ error: 'Failed to parse generated questions.' }, { status: 500 });
      }

      // Log the processed questions for debugging
      console.log("Processed questions:", JSON.stringify(validatedQuestions, null, 2));
      
      return NextResponse.json(validatedQuestions);
    } catch (apiError) {
      console.error('Gemini API error:', apiError);
      
      // Check for specific error types and provide helpful responses
      if (apiError.message && apiError.message.includes('404 Not Found')) {
        return NextResponse.json({
          error: 'Model not found or not accessible',
          details: apiError.message,
          suggestions: [
            "Verify you're using the correct Google Generative AI SDK version",
            "Ensure your API key has access to the gemini-2.0-flash model",
            "Check if you need to enable the Gemini API in your Google Cloud Console"
          ]
        }, { status: 404 });
      }
      
      return NextResponse.json({
        error: 'Error communicating with Gemini API',
        details: apiError.message,
        status: apiError.status || 500,
        statusText: apiError.statusText,
        code: apiError.code,
      }, { status: apiError.status || 500 });
    }
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json({ error: 'Failed to generate questions, Error: ' + error.message }, { status: 500 });
  }
}

// Function to calculate user score and provide feedback
function calculateUserScore(userAnswers) {
  try {
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
      return NextResponse.json({ error: 'Invalid user answers format' }, { status: 400 });
    }
    
    let totalQuestions = userAnswers.length;
    let correctAnswers = 0;
    let incorrectBySubtopic = {};
    let correctBySubtopic = {};
    
    userAnswers.forEach(answer => {
      const { question, userSelected, correctAnswer, subtopic } = answer;
      
      // Initialize subtopic counters if they don't exist
      if (!incorrectBySubtopic[subtopic]) incorrectBySubtopic[subtopic] = 0;
      if (!correctBySubtopic[subtopic]) correctBySubtopic[subtopic] = 0;
      
      if (userSelected === correctAnswer) {
        correctAnswers++;
        correctBySubtopic[subtopic]++;
      } else {
        incorrectBySubtopic[subtopic]++;
      }
    });
    
    // Calculate overall score percentage
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Determine weakest and strongest subtopics
    let weakestSubtopics = [];
    let highestIncorrectRate = 0;
    
    let strongestSubtopics = [];
    let highestCorrectRate = 0;
    
    for (const subtopic in incorrectBySubtopic) {
      const total = (incorrectBySubtopic[subtopic] || 0) + (correctBySubtopic[subtopic] || 0);
      if (total === 0) continue;
      
      const incorrectRate = incorrectBySubtopic[subtopic] / total;
      const correctRate = correctBySubtopic[subtopic] / total;
      
      if (incorrectRate > highestIncorrectRate) {
        weakestSubtopics = [subtopic];
        highestIncorrectRate = incorrectRate;
      } else if (incorrectRate === highestIncorrectRate && incorrectRate > 0) {
        weakestSubtopics.push(subtopic);
      }
      
      if (correctRate > highestCorrectRate) {
        strongestSubtopics = [subtopic];
        highestCorrectRate = correctRate;
      } else if (correctRate === highestCorrectRate && correctRate > 0) {
        strongestSubtopics.push(subtopic);
      }
    }
    
    // Generate feedback based on performance
    let feedback = '';
    if (scorePercentage >= 90) {
      feedback = 'Excellent job! You have a strong understanding of this subject.';
    } else if (scorePercentage >= 70) {
      feedback = 'Good work! You have a solid grasp of the material with some room for improvement.';
    } else if (scorePercentage >= 50) {
      feedback = 'You\'re on the right track, but there\'s definitely room for improvement.';
    } else {
      feedback = 'You should consider reviewing this topic more thoroughly before moving on.';
    }
    
    // Add subtopic-specific feedback
    if (weakestSubtopics.length > 0) {
      feedback += ` You may want to focus more on ${weakestSubtopics.join(', ')} where you had the most difficulty.`;
    }
    
    if (strongestSubtopics.length > 0 && strongestSubtopics[0] !== weakestSubtopics[0]) {
      feedback += ` You showed particular strength in ${strongestSubtopics.join(', ')}.`;
    }
    
    // Create detailed performance breakdown
    const subtopicPerformance = {};
    for (const subtopic in incorrectBySubtopic) {
      const total = (incorrectBySubtopic[subtopic] || 0) + (correctBySubtopic[subtopic] || 0);
      if (total === 0) continue;
      
      const correctCount = correctBySubtopic[subtopic] || 0;
      const percentage = Math.round((correctCount / total) * 100);
      
      subtopicPerformance[subtopic] = {
        correct: correctCount,
        total: total,
        percentage: percentage
      };
    }
    
    // Return the score and feedback
    return NextResponse.json({
      score: {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: scorePercentage
      },
      feedback,
      subtopicPerformance,
      weakestSubtopics,
      strongestSubtopics
    });
  } catch (error) {
    console.error('Error calculating score:', error);
    return NextResponse.json({ error: 'Failed to calculate score: ' + error.message }, { status: 500 });
  }
}