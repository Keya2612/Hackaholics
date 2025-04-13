"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import QuestionSection from "@/components/interview/QuestionSection";
import RecordAnswerSection from "@/components/interview/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

function StartInterview({ setActiveSection }) {
  const params = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveSection("interview-practice");
    fetchInterviewDetails();
  }, [setActiveSection, params.interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from("mockinterview")
        .select("*")
        .eq("mockinterviewid", params.interviewId)
        .single();

      if (error) throw error;
      if (!result) throw new Error("Interview not found");

      const jsonMockResp = result.jsonmockresp;
      if (!jsonMockResp || !Array.isArray(jsonMockResp)) {
        throw new Error("Invalid questions format in database");
      }

      setMockInterviewQuestions(jsonMockResp);
      setInterviewData(result);
    } catch (err) {
      console.error("Error fetching interview details:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-600 p-5 ml-64">Error: {error}</div>;
  }

  if (loading || !interviewData || !mockInterviewQuestions.length) {
    return (
      <div className="text-center p-5 ml-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading interview...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 ml-64">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        {interviewData.jobposition} Interview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6 mt-6">
        {activeQuestionIndex > 0 && (
          <Button
            variant="outline"
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex < mockInterviewQuestions.length - 1 ? (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Next Question
          </Button>
        ) : (
          <Link href={`/interview/practice/${interviewData.mockinterviewid}/feedback`}>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              End Interview
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;