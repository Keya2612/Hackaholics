"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

function FeedbackPage({ setActiveSection }) {
  const params = useParams();
  const [feedbackData, setFeedbackData] = useState([]);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setActiveSection("interview-practice");
    fetchFeedback();
  }, [setActiveSection, params.interviewId]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);

      const { data: interview, error: interviewError } = await supabase
        .from("mockinterview")
        .select("jobposition")
        .eq("mockinterviewid", params.interviewId)
        .single();

      if (interviewError) throw interviewError;
      if (!interview) throw new Error("Interview not found");

      const { data: answers, error: answersError } = await supabase
        .from("useranswer")
        .select("*")
        .eq("mockinterviewid", params.interviewId)
        .order("createdat", { ascending: true });

      if (answersError) throw answersError;

      setInterviewData(interview);
      setFeedbackData(answers || []);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-600 p-5 ml-64">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="text-center p-5 ml-64">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 ml-64">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Feedback for {interviewData?.jobposition} Interview
      </h1>
      {feedbackData.length === 0 ? (
        <p className="text-gray-600">No answers submitted yet.</p>
      ) : (
        <div className="space-y-6">
          {feedbackData.map((answer, index) => (
            <div key={answer.id} className="border rounded-lg p-5 shadow-sm bg-white">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Question {index + 1}: {answer.question}
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Your Answer:</strong> {answer.userans}
              </p>
              {answer.correctans && (
                <p className="text-gray-700 mb-2">
                  <strong>Expected Answer:</strong> {answer.correctans}
                </p>
              )}
              <p className="text-gray-700 mb-2">
                <strong>Feedback:</strong> {answer.feedback}
              </p>
              <p className="text-gray-700">
                <strong>Rating:</strong> {answer.rating}/10
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Link href="/dashboard">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default FeedbackPage;