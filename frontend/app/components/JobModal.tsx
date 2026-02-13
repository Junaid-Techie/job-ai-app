"use client";

export default function JobModal({ job, onClose }: any) {
  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl max-w-lg w-full shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">{job.title}</h2>
        <p className="text-sm text-gray-400">
          Match Score: {job.similarity_score}%
        </p>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-white text-black rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
}
