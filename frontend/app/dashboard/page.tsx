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
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") return null;
  if (!session) return null;

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-10"
    >
      <h1 className="text-3xl font-semibold">
        Welcome, {session.user?.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <div className="glass-panel p-8 rounded-2xl shadow-2xl space-y-6">
          <textarea
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-sm"
            rows={6}
            placeholder="Paste your resume..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />

          <button
            onClick={addResume}
            className="w-full py-3 bg-white text-black rounded-xl"
          >
            {loading ? "Processing..." : "Add Resume"}
          </button>

          <button
            onClick={matchJobs}
            className="w-full py-3 bg-gray-700 rounded-xl"
          >
            Match Jobs
          </button>
        </div>

        <div className="space-y-6">
          {loading && (
            <>
              <div className="h-24 rounded-2xl skeleton" />
              <div className="h-24 rounded-2xl skeleton" />
              <div className="h-24 rounded-2xl skeleton" />
            </>
          )}

          {!loading &&
            matches.map((job) => (
              <div
                key={job.job_id}
                className="glass-panel p-6 rounded-2xl shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex justify-between mb-2">
                  <h3>{job.title}</h3>
                  <span>{job.similarity_score}%</span>
                </div>

                <div className="w-full bg-gray-700 h-2 rounded">
                  <div
                    className="h-2 bg-white rounded"
                    style={{ width: `${job.similarity_score}%` }}
                  />
                </div>
              </div>
            ))}
        </div>

      </div>
    </motion.div>
  );
}
