"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [resume, setResume] = useState("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    work_mode: "",
    min_salary: "",
  });

  const addResume = async () => {
    if (!resume) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/add-resume/?content=${encodeURIComponent(resume)}`,
        { method: "POST" }
      );

      const data = await response.json();
      setResumeId(data.resume_id);
    } catch {
      setError("Failed to add resume.");
    } finally {
      setLoading(false);
    }
  };

  const matchJobs = async () => {
    if (!resumeId) return;

    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        work_mode: filters.work_mode,
        min_salary: filters.min_salary,
      });

      const response = await fetch(
        `${API_URL}/match-jobs/${resumeId}?${queryParams}`
      );

      const data = await response.json();
      setMatches(data);
    } catch {
      setError("Failed to match jobs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🚀 Job AI Matcher
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Panel */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Resume</h2>

          <textarea
            className="w-full border p-3 rounded mb-4 text-sm"
            rows={6}
            placeholder="Paste your resume here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />

          <button
            onClick={addResume}
            disabled={!resume || loading}
            className="w-full bg-gray-800 text-white py-2 rounded mb-4"
          >
            {loading ? "Processing..." : "Add Resume"}
          </button>

          <h2 className="font-semibold mb-3">Filters</h2>

          <select
            className="w-full border p-2 rounded mb-3"
            onChange={(e) =>
              setFilters({ ...filters, work_mode: e.target.value })
            }
          >
            <option value="">Work Mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>

          <input
            type="number"
            placeholder="Minimum Salary"
            className="w-full border p-2 rounded mb-3"
            onChange={(e) =>
              setFilters({ ...filters, min_salary: e.target.value })
            }
          />

          <button
            onClick={matchJobs}
            disabled={!resumeId || loading}
            className="w-full bg-gray-700 text-white py-2 rounded"
          >
            {loading ? "Matching..." : "Match Jobs"}
          </button>

          {error && (
            <div className="mt-3 text-red-500 text-sm">{error}</div>
          )}
        </div>

        {/* Right Panel */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            {matches.map((job) => (
              <div
                key={job.job_id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <span className="text-sm font-semibold text-gray-700">
                    {job.similarity_score}%
                  </span>
                </div>

                {/* Match Bar */}
                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-gray-800 h-2 rounded"
                    style={{ width: `${job.similarity_score}%` }}
                  />
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p>📍 {job.location || "Location not specified"}</p>
                  <p>💼 {job.work_mode || "Work mode not specified"}</p>
                </div>
              </div>
            ))}

            {matches.length === 0 && !loading && (
              <p className="text-gray-500">
                No matches yet. Add resume and apply filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
