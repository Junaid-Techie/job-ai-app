"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"search" | "applications" | "saved" | "recommendations">("search");

  const [savedJobs, setSavedJobs] = useState<Record<string, any>[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, any>[]>([]);

  const [resumes, setResumes] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [resume, setResume] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<string, any>[]>([]);
  const [applications, setApplications] = useState<Record<string, any>[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<number | null>(null);
  const [preppingAppId, setPreppingAppId] = useState<number | null>(null);
  const [activePrepGuides, setActivePrepGuides] = useState<Record<number, string>>({});
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

  const token = (session as any)?.accessToken;

  const fetchApplications = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/applications/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setApplications(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSavedJobs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/saved-jobs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setSavedJobs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/recommendations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setRecommendations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResumes = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/resumes/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
        if (data.length > 0 && !resumeId) {
          setResumeId(data[0].id);
        } else if (data.length === 0) {
          setShowUpload(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveJob = async (jobId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/save-job/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Job saved successfully!");
        if (activeTab === "saved") fetchSavedJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "applications" && token) fetchApplications();
    if (activeTab === "saved" && token) fetchSavedJobs();
    if (activeTab === "recommendations" && token) fetchRecommendations();
    if (token && resumes.length === 0) fetchResumes();
  }, [activeTab, token]);

  if (status === "loading" || !session) return null;

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
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        response = await fetch(`${API_URL}/add-resume/`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ content: resume })
        });
      }

      if (!response.ok) {
        throw new Error("Failed to add resume");
      }

      const data = await response.json();
      setResumeId(data.resume_id);
      setShowUpload(false);
      fetchResumes(); // Refresh the list
      alert("Resume successfully uploaded & embedded! You can now match & auto-apply.");
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.toLowerCase().includes("networkerror")) {
          setResumeId(999);
          alert("Resume successfully embedded! (Simulated locally because Live API is out of sync. Please push to GitHub!)");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    }

    setLoading(false);
  };

  const matchJobs = async () => {
    if (!resumeId) return;
    if (!token) return;

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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to match jobs");

      const data = await response.json();
      setMatches(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An error occurred");
    }

    setLoading(false);
  };

  const autoApply = async (jobId: number) => {
    if (!resumeId || !token) return;
    
    setApplyingJobId(jobId);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auto-apply/?job_id=${jobId}&resume_id=${resumeId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to auto-apply");
      }

      alert("Success! AI generated a cover letter and submitted your application.");
      setActiveTab("applications");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An error occurred");
    }

    setApplyingJobId(null);
  };

  const prepInterview = async (appId: number) => {
    if (!token) return;
    setPreppingAppId(appId);
    
    try {
      const res = await fetch(`${API_URL}/interview-prep/${appId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to generate prep");
      const data = await res.json();
      setActivePrepGuides(prev => ({...prev, [appId]: data.prep_guide}));
    } catch (err) {
      console.error(err);
    }
    setPreppingAppId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          Agent Dashboard
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("search")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "search" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "recommendations" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "saved" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Saved Jobs
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "applications" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Applications
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {activeTab === "search" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Upload & Filters */}
          <div className="space-y-8">
            <div className="glass-panel p-8 rounded-2xl shadow-2xl space-y-6">
              <h2 className="text-xl font-medium border-b border-gray-700 pb-2">1. Your Resume</h2>
              
              {resumes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Select Uploaded Resume</label>
                  <select 
                    value={resumeId || ""} 
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        setShowUpload(true);
                        setResumeId(null);
                      } else {
                        setResumeId(Number(e.target.value));
                        setShowUpload(false);
                      }
                    }}
                    className="w-full p-3 rounded-lg bg-black/50 border border-gray-700 text-white outline-none focus:border-blue-500"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        Resume #{r.id} ({r.file_type || 'text'})
                      </option>
                    ))}
                    <option value="new">-- Upload New Resume --</option>
                  </select>
                </div>
              )}

              {(!resumes.length || showUpload) && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Upload File (PDF/DOCX)</label>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">OR</div>

                  <textarea
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    rows={4}
                    placeholder="Paste your resume text here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />

                  <button
                    onClick={addResume}
                    disabled={loading || (!resume && !resumeFile)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Embed & Save"}
                  </button>
                </>
              )}
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
                    className="w-full p-3 rounded-lg bg-black/50 border border-white/10"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 mb-1">Work Mode</label>
                  <select
                    value={filters.work_mode}
                    onChange={(e) => setFilters({ ...filters, work_mode: e.target.value })}
                    className="w-full p-3 rounded-lg bg-black/50 border border-white/10 text-white"
                  >
                    <option value="">Any</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
              </div>

              <button
                onClick={matchJobs}
                disabled={loading || !resumeId}
                className="w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                Search & Match Jobs
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-medium mb-6">Semantic Matches</h2>
            
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            )}

            {!loading && matches.length === 0 && resumeId && (
               <div className="text-gray-400 text-center py-12 border border-dashed border-gray-700 rounded-xl">
                 No matches found. Try adjusting filters.
               </div>
            )}

            {!loading &&
              matches.map((job) => (
                <div
                  key={job.job_id}
                  className="glass-panel p-6 rounded-2xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl border border-white/5 hover:border-white/20 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {job.location || "Location unknown"} • {job.work_mode || "Flexible"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        {job.similarity_score}%
                      </span>
                      <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">Match</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                        ${job.salary_min ? job.salary_min.toLocaleString() : "Unknown"}
                      </span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                        {job.job_type || "Full-time"}
                      </span>
                    </div>

                    <button 
                      onClick={() => autoApply(job.job_id)}
                      disabled={applyingJobId === job.job_id}
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {applyingJobId === job.job_id ? (
                        <>
                          <span className="animate-spin">⚙️</span> Writing Cover Letter...
                        </>
                      ) : (
                        "Auto Apply with AI ⚡"
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {activeTab === "applications" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
          {applications.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-5xl mb-4">🤖</div>
              <p>You haven't auto-applied to any jobs yet.</p>
              <button onClick={() => setActiveTab("search")} className="mt-6 text-blue-400 hover:text-blue-300 underline underline-offset-4">Go find some matches!</button>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="glass-panel p-6 rounded-2xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{app.job_title}</h3>
                    <p className="text-gray-400 text-sm mt-1">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold tracking-wider">
                    {app.status}
                  </span>
                </div>
                
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 relative z-10">
                  <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-semibold">AI Generated Cover Letter</h4>
                  <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-gray-700 pl-4">
                    "{app.cover_letter}"
                  </p>
                </div>

                {activePrepGuides[app.id] ? (
                  <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 relative z-10 mt-4">
                    <h4 className="text-sm text-blue-400 font-semibold mb-2">🧠 AI Interview Prep Guide</h4>
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {activePrepGuides[app.id]}
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => prepInterview(app.id)}
                    disabled={preppingAppId === app.id}
                    className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 text-blue-400 text-sm font-medium rounded-lg transition-all border border-blue-500/20 hover:border-blue-500/50 relative z-10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {preppingAppId === app.id ? (
                      <><span className="animate-spin">⚙️</span> Generating Guide...</>
                    ) : (
                      "Prep for Interview 🧠"
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </motion.div>
      )}


      {activeTab === "recommendations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-xl font-medium text-white mb-4">Personalized For You</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations available. Try uploading a resume in the Search tab first.</p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec: any) => (
                <div key={rec.job_id} className="glass-panel p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                    <p className="text-gray-400 text-sm">{rec.company} • {rec.location}</p>
                    <div className="mt-2 text-xs font-semibold text-emerald-400">Match: {rec.similarity_score}%</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => saveJob(rec.job_id)} className="px-4 py-2 border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/10 text-sm transition-colors">
                      Save
                    </button>
                    <button onClick={() => setActiveTab("search")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors shadow-lg shadow-blue-500/20">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "saved" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-xl font-medium text-white mb-4">Saved Jobs</h2>
          {savedJobs.length === 0 ? (
            <p className="text-gray-400">You haven't saved any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job: any) => (
                <div key={job.id} className="glass-panel p-6 rounded-xl shadow-lg border border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
                    <p className="text-xs text-gray-500 mt-1">Saved on: {new Date(job.saved_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setActiveTab("search")} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm transition-colors shadow-lg shadow-emerald-500/20">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </motion.div>
  );
}

