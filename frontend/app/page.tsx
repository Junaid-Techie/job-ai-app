"use client";

import { useState } from "react";

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [resume, setResume] = useState("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [dark, setDark] = useState(false);

  const addResume = async () => {
    if (!resume) return;
    setLoading(true);

    const response = await fetch(
      `${API_URL}/add-resume/?content=${encodeURIComponent(resume)}`,
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
      `${API_URL}/match-jobs/${resumeId}`
    );

    const data = await response.json();
    setMatches(data);
    setLoading(false);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300">

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Job AI Matcher
          </h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Semantic job intelligence powered by vector embeddings.
          </p>

          <button
            onClick={() => setDark(!dark)}
            className="mt-6 px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Toggle {dark ? "Light" : "Dark"} Mode
          </button>
        </div>

        {/* Main Layout */}
        <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Glass Panel */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-xl transition hover:shadow-2xl">

            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              Resume
            </h2>

            <textarea
              className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              rows={6}
              placeholder="Paste your resume..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />

            <button
              onClick={addResume}
              className="mt-4 w-full py-3 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl transition hover:opacity-90"
            >
              Add Resume
            </button>

            <button
              onClick={matchJobs}
              className="mt-3 w-full py-3 bg-gray-700 text-white rounded-xl transition hover:opacity-90"
            >
              Match Jobs
            </button>
          </div>

          {/* Results */}
          <div className="space-y-6">

            {loading && (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 bg-gray-300 dark:bg-gray-800 rounded-xl" />
                ))}
              </div>
            )}

            {!loading && matches.map((job) => (
              <div
                key={job.job_id}
                onClick={() => setSelectedJob(job)}
                className="cursor-pointer backdrop-blur-xl bg-white/60 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl p-6 shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {job.similarity_score}%
                  </span>
                </div>

                <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded">
                  <div
                    className="h-2 bg-gray-900 dark:bg-white rounded"
                    style={{ width: `${job.similarity_score}%` }}
                  />
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                {selectedJob.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Match Score: {selectedJob.similarity_score}%
              </p>

              <button
                onClick={() => setSelectedJob(null)}
                className="mt-6 w-full py-2 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
