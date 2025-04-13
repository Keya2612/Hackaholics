"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Webcam from "react-webcam";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/lib/GeminiAi";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

const useSpeechToText = dynamic(
  () => import("react-hook-speech-to-text").then((mod) => mod.default),
  { ssr: false }
);

function RecordAnswerSection({
  mockInterviewQuestions,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const {
    error: speechError,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      lang: "en-US",
      interimResults: true,
    },
  });

  useEffect(() => {
    if (results.length > 0) {
      const latestTranscript = results[results.length - 1].transcript;
      setUserAnswer((prev) => (prev ? `${prev} ${latestTranscript}` : latestTranscript));
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10 && mockInterviewQuestions) {
      saveUserAnswer();
    }
  }, [isRecording, userAnswer]);

  const startStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      try {
        await startSpeechToText();
        setUserAnswer("");
        setResults([]);
        toast.success("Recording started");
      } catch (err) {
        console.error("Speech recognition error:", err);
        toast.error("Failed to start recording. Check microphone permissions.");
      }
    }
  };

  const saveUserAnswer = async () => {
    if (!mockInterviewQuestions?.[activeQuestionIndex] || !userAnswer.trim() || !user) {
      return;
    }

    try {
      setLoading(true);
      const feedbackPrompt = `
        Question: ${mockInterviewQuestions[activeQuestionIndex].question}
        User Answer: ${userAnswer}
        Please provide a rating (1-10) and feedback for improvement in JSON format:
        {
          "rating": number,
          "feedback": "string"
        }
      `;

      const result = await chatSession.sendMessage(feedbackPrompt);
      let responseText = await result.response.text();
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const jsonFeedback = JSON.parse(responseText);

      if (!jsonFeedback.rating || !jsonFeedback.feedback) {
        throw new Error("Invalid feedback response from AI");
      }

      const { error } = await supabase.from("useranswer").insert({
        mockinterviewid: interviewData.mockinterviewid,
        question: mockInterviewQuestions[activeQuestionIndex].question,
        correctans: mockInterviewQuestions[activeQuestionIndex].answer || null,
        userans: userAnswer,
        feedback: jsonFeedback.feedback,
        rating: Number(jsonFeedback.rating),
        useremail: user.primaryEmailAddress.emailAddress,
        createdat: new Date().toISOString().slice(0, 50),
      });

      if (error) throw error;

      toast.success("Answer recorded and saved successfully");
      setUserAnswer("");
      setResults([]);
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error(`Failed to save answer: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (speechError) {
    console.error("Speech-to-Text Error:", speechError);
    toast.error("Speech recognition unavailable. Please try again.");
  }

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="relative flex flex-col items-center bg-black rounded-lg p-4 w-full max-w-md">
        {webcamError ? (
          <div className="h-[200px] w-full bg-gray-200 flex items-center justify-center rounded-lg">
            <p className="text-red-600">Webcam unavailable</p>
          </div>
        ) : (
          <>
            <Image
              src="/webcam.png"
              width={150}
              height={150}
              className="absolute top-[-75px]"
              alt="webcam icon"
              priority
            />
            <Webcam
              mirrored={true}
              videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
              className="w-full h-[200px] rounded-lg"
              onUserMediaError={(err) => {
                console.error("Webcam error:", err);
                setWebcamError("Failed to access webcam");
                toast.error("Webcam access failed. Check permissions.");
              }}
            />
          </>
        )}
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="mt-6 w-48 border-gray-300 text-gray-700 hover:bg-gray-100"
        onClick={startStopRecording}
      >
        {isRecording ? (
          <span className="text-red-600 flex gap-2 items-center">
            <StopCircle className="w-5 h-5" />
            Stop
          </span>
        ) : (
          <span className="text-blue-600 flex gap-2 items-center">
            <Mic className="w-5 h-5" />
            Record
          </span>
        )}
      </Button>
      {interimResult && (
        <p className="text-gray-600 mt-4 text-sm max-w-md break-words">
          <strong>Live:</strong> {interimResult}
        </p>
      )}
      {userAnswer && !isRecording && (
        <p className="text-gray-700 mt-4 text-sm max-w-md break-words">
          <strong>Recorded Answer:</strong> {userAnswer}
        </p>
      )}
    </div>
  );
}

export default RecordAnswerSection;