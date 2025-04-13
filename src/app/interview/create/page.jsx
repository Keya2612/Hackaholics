"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { chatSession } from "@/lib/GeminiAi";

function CreateInterview({ setActiveSection }) {
  const { user } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDescription: "",
    jobExperience: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateQuestions = async (jobPosition, jobDescription, jobExperience) => {
    try {
      const prompt = `
        Generate 5 interview questions and answers for a ${jobPosition} role requiring ${jobExperience} years of experience. Use the following job description: "${jobDescription}". Return the result in JSON format as an array of objects, each with "question" and "answer" fields.
        Example:
        [
          {"question": "What is your experience with X?", "answer": "You should mention specific projects using X..."},
          ...
        ]
      `;
      const result = await chatSession.sendMessage(prompt);
      let responseText = await result.response.text();
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const questions = JSON.parse(responseText);
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions generated");
      }
      return questions;
    } catch (err) {
      console.error("Error generating questions:", err);
      throw new Error("Failed to generate interview questions");
    }
  };

  const createMockInterview = async () => {
    if (!user) {
      setError("You must be signed in to create an interview.");
      toast.error("Please sign in.");
      return;
    }

    const { jobPosition, jobDescription, jobExperience } = formData;
    if (!jobPosition || !jobDescription || !jobExperience) {
      setError("All fields are required.");
      toast.error("Please fill in all fields.");
      return;
    }

    if (isNaN(jobExperience) || jobExperience < 0) {
      setError("Experience must be a valid number.");
      toast.error("Please enter a valid number for experience.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate questions using AI
      const questions = await generateQuestions(
        jobPosition,
        jobDescription,
        jobExperience
      );

      // Insert into Supabase
      const { data, error } = await supabase
        .from("mockinterview")
        .insert({
          jobposition: jobPosition,
          jobdescription: jobDescription,
          jobexperience: parseInt(jobExperience),
          jsonmockresp: questions,
          createdby: user.id,
          createdat: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Mock interview created successfully!");
      router.push(`/interview/practice/${data.mockinterviewid}`);
    } catch (err) {
      console.error("Error creating interview:", err);
      setError(err.message);
      toast.error(`Failed to create interview: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5 ml-64">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">
        Create a New Mock Interview
      </h1>
      <div className="max-w-2xl bg-white p-6 border rounded-lg shadow-sm">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <Label htmlFor="jobPosition" className="text-gray-700">
              Job Position
            </Label>
            <Input
              id="jobPosition"
              name="jobPosition"
              value={formData.jobPosition}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer"
              className="mt-1"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="jobDescription" className="text-gray-700">
              Job Description
            </Label>
            <Textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              placeholder="e.g., Develop and maintain web applications using React and Node.js..."
              rows={6}
              className="mt-1"
              disabled={loading}
            />
          </div>
          <div>
            <Label htmlFor="jobExperience" className="text-gray-700">
              Years of Experience
            </Label>
            <Input
              id="jobExperience"
              name="jobExperience"
              type="number"
              value={formData.jobExperience}
              onChange={handleInputChange}
              placeholder="e.g., 3"
              className="mt-1"
              min="0"
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/interview/practice")}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={createMockInterview}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creating...
                </span>
              ) : (
                "Create Interview"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateInterview;