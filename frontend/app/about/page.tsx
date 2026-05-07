"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <div className="relative pt-32 pb-24 min-h-screen text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 text-center space-y-10"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
          The End of Manual Applications.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl mx-auto font-light">
          We believe the job application process is fundamentally broken. Thousands of highly qualified candidates are filtered out daily by archaic keyword-matching ATS systems. We are building the antidote.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-left">
          <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/40 transition-colors" />
            <div className="text-4xl mb-6">📉</div>
            <h2 className="text-2xl font-bold mb-4">The Problem</h2>
            <p className="text-gray-400 leading-relaxed">
              Recruiters spend an average of 7 seconds looking at a resume. Applicant Tracking Systems (ATS) ruthlessly discard candidates simply because they used the word "Programmer" instead of "Software Engineer". The system rewards formatting over talent.
            </p>
          </div>

          <div className="glass-panel p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full group-hover:bg-emerald-500/40 transition-colors" />
            <div className="text-4xl mb-6">💡</div>
            <h2 className="text-2xl font-bold mb-4">The Solution</h2>
            <p className="text-gray-400 leading-relaxed">
              We leverage High-Dimensional Semantic Vectors (1536-D embeddings) to analyze the actual *meaning* and *context* of your experience. We find the roles you are genuinely qualified for, and automate the tedious process of writing cover letters and applying.
            </p>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-10 border-b border-white/10 pb-4 inline-block">Core Principles</h2>
          <div className="text-left space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-blue-500">01.</span> Candidate First</h3>
              <p className="text-gray-400 text-lg">We don't sell your data to recruiters. Our AI agents work exclusively for you, the candidate, optimizing your chances of landing the best possible role.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-emerald-500">02.</span> Full Autonomy</h3>
              <p className="text-gray-400 text-lg">You shouldn't have to fill out the same Workday form 500 times. Upload your profile once, and our agents handle the entire pipeline.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3"><span className="text-purple-500">03.</span> Unbiased Matching</h3>
              <p className="text-gray-400 text-lg">Mathematical vectors do not care about your formatting. They care about your skills. We aim to create the most meritocratic job matching engine on the planet.</p>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-white/10">
          <h2 className="text-3xl font-bold mb-6">Ready to upgrade your job search?</h2>
          <Link href="/login">
            <button className="px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Create Your Agent
            </button>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
