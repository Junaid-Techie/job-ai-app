"use client";

import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResume = async () => {
    if (!resume) return;

    setLoading(true);

    const response = await fetch(
      `http://127.0.0.1:8000/add-resume/?content=${encodeURIComponent(resume)}`,
      { method: "POST" }
    );

    const data = await response.json();
    setResumeId(data.resume_id);
    setLoading(false);
  };

  const matchJobs = async () => {
    if (!resumeId) return;

    setLoading(true);

    const response = await fetch(
      `http://127.0.0.1:8000/match-jobs/${resumeId}`
    );

    const data = await response.json();
    setMatches(data);
    setLoading(false);
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
        <div className="flex gap-4 mb-8">
          <button
            onClick={addResume}
            disabled={!resume}
            className={`px-6 py-3 rounded-xl font-semibold shadow-md transition 
              ${resume
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {loading ? "Processing..." : "Add Resume"}
          </button>

          <button
            onClick={matchJobs}
            disabled={!resumeId}
            className={`px-6 py-3 rounded-xl font-semibold shadow-md transition 
              ${resumeId
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            {loading ? "Matching..." : "Match Jobs"}
          </button>
        </div>

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
                </div>
              </div>
            ))}
          </div>

          {matches.length === 0 && !loading && (
            <p className="text-gray-400 text-center mt-4">
              No matches yet. Add resume and click Match Jobs.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
