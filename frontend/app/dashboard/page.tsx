"use client";

import { useState } from "react";
import ResumePanel from "../components/ResumePanel";
import JobCard from "../components/JobCard";
import JobModal from "../components/JobModal";
import SkeletonCard from "../components/SkeletonCard";

export default function Dashboard() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [resume, setResume] = useState("");
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <ResumePanel
        resume={resume}
        setResume={setResume}
        addResume={addResume}
        matchJobs={matchJobs}
        loading={loading}
      />

      <div className="space-y-6">
        {loading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading &&
          matches.map((job) => (
            <JobCard
              key={job.job_id}
              job={job}
              onClick={setSelectedJob}
            />
          ))}
      </div>

      <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
