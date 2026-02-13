"use client";

export default function JobCard({ job, onClick }: any) {
  return (
    <div
      onClick={() => onClick(job)}
      className="cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition"
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{job.title}</h3>
        <span>{job.similarity_score}%</span>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded">
        <div
          className="h-2 bg-white rounded"
          style={{ width: `${job.similarity_score}%` }}
        />
      </div>
    </div>
  );
}
