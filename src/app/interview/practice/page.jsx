"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

function InterviewList({ setActiveSection }) {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setActiveSection("interview-practice");
    if (user) {
      fetchInterviews();
    }
  }, [user, setActiveSection]);

  const fetchInterviews = async (retryCount = 0) => {
    const maxRetries = 3;
    try {
      setLoading(true);
      setError(null);

      // Log auth state for debugging
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Supabase session:", session);

      if (!user?.id) {
        throw new Error("User ID not available");
      }

      const { data, error } = await supabase
        .from("mockinterview")
        .select("*")
        .eq("createdby", user.id)
        .order("createdat", { ascending: false });

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      setInterviews(data || []);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      const errorMessage = err.message || "Unknown error occurred";
      
      if (retryCount < maxRetries && err.code === "ECONNREFUSED") {
        console.log(`Retrying fetch (${retryCount + 1}/${maxRetries})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchInterviews(retryCount + 1);
      }

      setError(errorMessage);
      toast.error(`Failed to load interviews: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center p-5 ml-64">Please sign in to view interviews.</div>;
  }

  if (error) {
    return (
      <div className="text-red-600 p-5 ml-64">
        Error: {error}
        <Button
          onClick={() => fetchInterviews()}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 ml-64">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Available Mock Interviews</h1>
        <Link href="/interview/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Create New Interview
          </Button>
        </Link>
      </div>
      {loading ? (
        <p className="text-gray-600">Loading interviews...</p>
      ) : interviews.length === 0 ? (
        <p className="text-gray-600">No interviews found. Create a new one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview.mockinterviewid}
              className="border p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800">{interview.jobposition}</h2>
              <p className="text-gray-600 mt-2">Experience: {interview.jobexperience} years</p>
              <p className="text-gray-600 mt-1 line-clamp-2">{interview.jobdescription}</p>
              <Link href={`/interview/practice/${interview.mockinterviewid}`}>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Start Interview</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InterviewList;