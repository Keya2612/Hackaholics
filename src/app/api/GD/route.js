import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Force mock data to bypass API issues (set to false to try API again)
const FORCE_MOCK = true;

export async function POST(req) {
  try {
    // Log environment and SDK version
    console.log('Environment Check:');
    console.log('- Node Version:', process.version);
    console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? `Present (${process.env.GEMINI_API_KEY.slice(0, 4)}...)` : 'NOT FOUND');
    try {
      const sdkVersion = require('@google/generative-ai/package.json').version;
      console.log('- @google/generative-ai Version:', sdkVersion);
    } catch (e) {
      console.error('- SDK Version Error:', e.message);
    }

    // Validate API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY');
      return NextResponse.json(
        {
          error: 'Server configuration error: Missing API key',
          action: 'Add GEMINI_API_KEY to .env.local and restart server',
        },
        { status: 500 }
      );
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

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error('Invalid request body:', e.message);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const { numQuestions, userAnswers, calculateScore } = body;

    // Handle score calculation
    if (calculateScore && userAnswers) {
      return calculateUserScore(userAnswers);
    }

    // Validate question generation inputs
    if (!topic || !numQuestions || numQuestions <= 0) {
      return NextResponse.json(
        { error: 'Please provide a topic and valid number of questions' },
        { status: 400 }
      );
    }

    // Mock data fallback
    const mockQuestions = Array.from({ length: numQuestions }, (_, i) => ({
      question: `Mock Question ${i + 1}: What is ${i + 2} + 2?`,
      options: [`${i + 1}`, `${i + 2}`, `${i + 3}`, `${i + 4}`],
      correct_answer: `${i + 4}`,
      subtopic: 'Arithmetic',
    }));

    if (FORCE_MOCK) {
      console.warn('FORCE_MOCK enabled: Returning mock data');
      return NextResponse.json(mockQuestions);
    }

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-1.5-pro', 'gemini-1.5-flash']; // Try both models
    let lastError = null;

    for (const modelName of models) {
      console.log(`Attempting model: ${modelName}`);
      try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Health check
        console.log('Running API health check...');
        try {
          const healthCheck = await model.generateContent('{"test": "ping"}');
          const healthText = await healthCheck.response.text();
          console.log('Health check response:', healthText.slice(0, 200));
        } catch (healthError) {
          console.error('Health check failed:', healthError.message);
        }

        // Minimal prompt
        const prompt = `Generate ${numQuestions} multiple-choice question(s) about ${topic} in JSON:
[
  {
    "question": "Question text",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "Correct option",
    "subtopic": "Subtopic"
  }
]
Return ONLY the JSON array.`;

        console.log('Sending prompt (length:', prompt.length, ')');
        const retryRequest = async (fn, retries = 3, delay = 1000) => {
          for (let i = 0; i < retries; i++) {
            try {
              return await fn();
            } catch (e) {
              console.warn(`Retry ${i + 1}/${retries} for ${modelName}: ${e.message}`);
              if (i === retries - 1) throw e;
              await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
            }
          }
        };

        const result = await retryRequest(() =>
          model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          })
        );
        console.log('Gemini API responded');

        const responseText = result.response?.text();
        if (!responseText) {
          console.error('Empty response from', modelName);
          lastError = new Error('Empty response');
          continue;
        }

        console.log('Raw response (first 500 chars):', responseText.slice(0, 500));
        if (responseText.trim().startsWith('<!DOCTYPE')) {
          console.error('HTML detected for', modelName, ': Full response:', responseText);
          lastError = new Error('HTML response received');
          continue;
        }

        // Parse questions
        const parseQuestions = (text) => {
          try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              return parsed;
            } else if (parsed.questions && Array.isArray(parsed.questions)) {
              return parsed.questions;
            }
            console.warn('Expected JSON array, got:', parsed);
            return [];
          } catch (jsonError) {
            console.error('JSON parse error:', jsonError.message);
            console.warn('Using mock data due to parse failure');
            return mockQuestions;
          }
        };

        // Subtopic detection
        function determineSubtopic(questionText, mainTopic) {
          const subtopics = mainTopic
            .split('\n')
            .map((line) => line.replace(/^[🔢🧠📊]\s*/, '').trim())
            .filter(Boolean)
            .flatMap((line) => line.split(', '));

          for (const subtopic of subtopics) {
            if (questionText.toLowerCase().includes(subtopic.toLowerCase())) {
              return subtopic;
            }
          }

          if (questionText.match(/algebra|equation/i)) return 'Algebra';
          if (questionText.match(/geometry|triangle/i)) return 'Geometry';
          if (questionText.match(/probability/i)) return 'Probability';
          return 'General';
        }

        const questions = parseQuestions(responseText);

        // Validate questions
        const validatedQuestions = questions
          .filter((q) => q.options?.length === 4 && q.correct_answer && q.question)
          .map((q) => ({
            question: q.question,
            options: q.options.map((opt) => opt.replace(/^[A-D]\.\s*/, '').trim()),
            correct_answer: q.correct_answer.replace(/^[A-D]\.\s*/, '').trim(),
            subtopic: q.subtopic || determineSubtopic(q.question, topic),
          }));

        if (!validatedQuestions.length) {
          console.error('No valid questions from', modelName, ':', responseText.slice(0, 500));
          lastError = new Error('No valid questions parsed');
          continue;
        }

        console.log('Processed questions:', JSON.stringify(validatedQuestions, null, 2));
        return NextResponse.json(validatedQuestions);
      } catch (modelError) {
        console.error(`Error with ${modelName}:`, modelError.message);
        lastError = modelError;
      }
    }

    // All models failed
    console.error('All models failed, using mock data. Last error:', lastError?.message);
    return NextResponse.json(
      {
        error: 'Failed to generate questions from Gemini API',
        details: lastError?.message || 'Unknown error',
        questions: mockQuestions,
        suggestions: [
          'Check API key: https://console.cloud.google.com/apis/credentials',
          'Enable Generative AI API: https://console.cloud.google.com/apis/library/generative-ai',
          'Verify model access (gemini-1.5-pro, gemini-1.5-flash)',
          'Check quotas: https://console.cloud.google.com/apis/api/generative-ai/quotas',
        ],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      {
        error: `Failed to generate questions: ${error.message}`,
        questions: [
          {
            question: 'What is 2 + 2?',
            options: ['1', '2', '3', '4'],
            correct_answer: '4',
            subtopic: 'Arithmetic',
          },
        ],
      },
      { status: 200 }
    );
  }
}

// Calculate user score
function calculateUserScore(userAnswers) {
  try {
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
      return NextResponse.json({ error: 'Invalid user answers format' }, { status: 400 });
    }

    let totalQuestions = userAnswers.length;
    let correctAnswers = 0;
    let incorrectBySubtopic = {};
    let correctBySubtopic = {};

    userAnswers.forEach((answer) => {
      const { userSelected, correctAnswer, subtopic } = answer;

      if (!incorrectBySubtopic[subtopic]) incorrectBySubtopic[subtopic] = 0;
      if (!correctBySubtopic[subtopic]) correctBySubtopic[subtopic] = 0;

      if (userSelected === correctAnswer) {
        correctAnswers++;
        correctBySubtopic[subtopic]++;
      } else {
        incorrectBySubtopic[subtopic]++;
      }
    });

    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

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

    let feedback = '';
    if (scorePercentage >= 90) {
      feedback = 'Excellent job!';
    } else if (scorePercentage >= 70) {
      feedback = 'Good work, keep it up!';
    } else if (scorePercentage >= 50) {
      feedback = 'On the right track, but needs work.';
    } else {
      feedback = 'Time to review!';
    }

    if (weakestSubtopics.length > 0) {
      feedback += ` Focus on ${weakestSubtopics.join(', ')}.`;
    }

    if (strongestSubtopics.length > 0 && strongestSubtopics[0] !== weakestSubtopics[0]) {
      feedback += ` Strong in ${strongestSubtopics.join(', ')}.`;
    }

    const subtopicPerformance = {};
    for (const subtopic in incorrectBySubtopic) {
      const total = (incorrectBySubtopic[subtopic] || 0) + (correctBySubtopic[subtopic] || 0);
      if (total === 0) continue;

      const correctCount = correctBySubtopic[subtopic] || 0;
      const percentage = Math.round((correctCount / total) * 100);

      subtopicPerformance[subtopic] = {
        correct: correctCount,
        total: total,
        percentage: percentage,
      };
    }

    return NextResponse.json({
      score: {
        correct: correctAnswers,
        total: totalQuestions,
        percentage: scorePercentage,
      },
      feedback,
      subtopicPerformance,
      weakestSubtopics,
      strongestSubtopics,
    });
  } catch (error) {
    console.error('Score error:', error);
    return NextResponse.json({ error: `Failed to calculate score: ${error.message}` }, { status: 500 });
  }
}