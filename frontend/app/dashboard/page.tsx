"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    min_salary: "",
    job_type: "",
    work_mode: "",
    location: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (!session) return null;

  const token = session.accessToken;

  const addResume = async () => {
    if (!resume && !resumeFile) return;
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);

        response = await fetch(`${API_URL}/upload-resume`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(
          `${API_URL}/add-resume/?content=${encodeURIComponent(resume)}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to add resume");
      }

      const data = await response.json();
      setResumeId(data.resume_id);
      alert("Resume successfully uploaded & embedded!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }

    setLoading(false);
  };

  const matchJobs = async () => {
    if (!resumeId) return;
    if (!token) {
      setError("Authentication token missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams();
      if (filters.min_salary) queryParams.append("min_salary", filters.min_salary);
      if (filters.job_type) queryParams.append("job_type", filters.job_type);
      if (filters.work_mode) queryParams.append("work_mode", filters.work_mode);
      if (filters.location) queryParams.append("location", filters.location);

      const url = `${API_URL}/match-jobs/${resumeId}?${queryParams.toString()}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to match jobs");
      }

      const data = await response.json();
      setMatches(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      <h1 className="text-3xl font-semibold">
        Welcome, {session.user?.email}
      </h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Upload & Filters */}
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-2xl shadow-2xl space-y-6">
            <h2 className="text-xl font-medium border-b border-gray-700 pb-2">1. Your Resume</h2>
            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Upload File (PDF/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="text-center text-sm text-gray-500">OR</div>

            <textarea
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
              rows={4}
              placeholder="Paste your resume text here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />

            <button
              onClick={addResume}
              disabled={loading || (!resume && !resumeFile)}
              className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Resume"}
            </button>
          </div>

          <div className="glass-panel p-8 rounded-2xl shadow-2xl space-y-6">
            <h2 className="text-xl font-medium border-b border-gray-700 pb-2">2. Match Filters</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-gray-400 mb-1">Min Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 100000"
                  value={filters.min_salary}
                  onChange={(e) => setFilters({ ...filters, min_salary: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Work Mode</label>
                <select
                  value={filters.work_mode}
                  onChange={(e) => setFilters({ ...filters, work_mode: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
                >
                  <option value="">Any</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Job Type</label>
                <select
                  value={filters.job_type}
                  onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700"
                >
                  <option value="">Any</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            <button
              onClick={matchJobs}
              disabled={loading || !resumeId}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              Match Jobs
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-medium mb-6">Match Results</h2>
          
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-gray-800/50 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && matches.length === 0 && resumeId && (
             <div className="text-gray-400 text-center py-12">No matches found. Try adjusting filters or adding more jobs to the DB.</div>
          )}

          {!loading &&
            matches.map((job) => (
              <div
                key={job.job_id}
                className="glass-panel p-6 rounded-2xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl border border-white/5 hover:border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {job.location || "Location unknown"} • {job.work_mode || "Flexible"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                      {job.similarity_score}%
                    </span>
                    <span className="text-xs text-gray-500">Match</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                    ${job.salary_min ? job.salary_min.toLocaleString() : "Unknown"}
                  </span>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                    {job.job_type || "Full-time"}
                  </span>
                </div>
              </div>
            ))}
        </div>

      </div>
    </motion.div>
  );
}
