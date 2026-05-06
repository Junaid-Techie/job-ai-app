"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="relative pt-32 pb-16 min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 text-center space-y-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-white">Our Mission</h1>
        <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
          We believe the job application process is fundamentally broken. Thousands of highly qualified candidates are filtered out daily by archaic keyword-matching ATS systems. 
        </p>
        <div className="glass-panel p-10 rounded-3xl border border-white/10 text-left mt-16 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-4">The Next Generation ATS</h2>
          <p className="text-gray-400 mb-6 leading-relaxed">
            We built an AI agent that works for *you*. By converting your life's work into multi-dimensional semantic vectors, we find jobs that match your actual skills and cultural fit. We then automate the entire application process, giving you the power of a dedicated recruiter.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Welcome to the future of hiring. Welcome to Job AI Matcher.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
