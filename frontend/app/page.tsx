"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [resume, setResume] = useState("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addResume = async () => {
    if (!resume) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/add-resume/?content=${encodeURIComponent(resume)}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to add resume");

      const data = await response.json();
      setResumeId(data.resume_id);
    } catch (err: any) {
      setError("Error adding resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const matchJobs = async () => {
    if (!resumeId) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/match-jobs/${resumeId}`
      );

      if (!response.ok) throw new Error("Failed to match jobs");

      const data = await response.json();
      setMatches(data);
    } catch (err: any) {
      setError("Error matching jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            🚀 Job AI Matcher
          </h1>
          <p className="text-gray-500 mt-2">
            AI-powered semantic job matching using vector search.
          </p>
        </div>

        {/* Resume Section */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Resume Content
          </label>

          <textarea
            className="w-full border border-gray-300 
                       focus:ring-2 focus:ring-indigo-400 focus:outline-none 
                       p-4 rounded-xl resize-none 
                       placeholder-gray-500 text-gray-800 bg-white"
            rows={6}
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={addResume}
            disabled={!resume || loading}
            className={`px-6 py-3 rounded-xl font-semibold shadow-md transition 
              ${
                !resume || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
          >
            {loading ? "Processing..." : "Add Resume"}
          </button>

          <button
            onClick={matchJobs}
            disabled={!resumeId || loading}
            className={`px-6 py-3 rounded-xl font-semibold shadow-md transition 
              ${
                !resumeId || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
          >
            {loading ? "Matching..." : "Match Jobs"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        <div>
          {matches.length > 0 && (
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Top Matches
            </h2>
          )}

          <div className="grid gap-4">
            {matches.map((job) => (
              <div
                key={job.job_id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-gray-800">
                    {job.title}
                  </h3>

                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {job.similarity_score}%
                  </span>
                </div>

                <div className="text-gray-500 text-sm space-y-1">
                  <p>📍 {job.location || "Location not specified"}</p>
                  <p>💼 {job.work_mode || "Work mode not specified"}</p>
                  <p>💰 {job.salary_min ? `$${job.salary_min}` : "Salary not specified"}</p>
                </div>
              </div>
            ))}
          </div>

          {matches.length === 0 && !loading && !error && (
            <p className="text-gray-400 text-center mt-4">
              No matches yet. Add resume and click Match Jobs.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
