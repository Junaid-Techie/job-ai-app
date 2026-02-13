"use client";

export default function ResumePanel({
  resume,
  setResume,
  addResume,
  matchJobs,
  loading,
}: any) {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6 shadow-xl">
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
  );
}
