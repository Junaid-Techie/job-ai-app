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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            🚀 Job AI Matcher
          </h1>
          <p className="text-gray-500 mt-2">
            Semantic job intelligence powered by vector search.
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
            
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Resume
              </h2>

              <textarea
                className="w-full border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                rows={6}
                placeholder="Paste your resume here..."
                value={resume}
                onChange={(e) => setResume(e.target.value)}
              />
            </div>

            <button
              onClick={addResume}
              disabled={!resume || loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-40"
            >
              {loading ? "Processing..." : "Add Resume"}
            </button>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Filters
              </h2>

              <div className="space-y-4">
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm"
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
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                  onChange={(e) =>
                    setFilters({ ...filters, min_salary: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              onClick={matchJobs}
              disabled={!resumeId || loading}
              className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-40"
            >
              {loading ? "Matching..." : "Match Jobs"}
            </button>

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
          </div>

          {/* Right Results */}
          <div className="space-y-6">
            {matches.length === 0 && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-gray-500">
                No matches yet. Add resume and apply filters.
              </div>
            )}

            {matches.map((job) => (
              <div
                key={job.job_id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h3>
                  <span className="text-sm font-medium text-gray-700">
                    {job.similarity_score}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded">
                  <div
                    className="bg-gray-900 h-2 rounded"
                    style={{ width: `${job.similarity_score}%` }}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>📍 {job.location || "Location not specified"}</p>
                  <p>💼 {job.work_mode || "Work mode not specified"}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
