"use client";

import { motion } from "framer-motion";

export default function Features() {
  return (
    <div className="relative pt-32 pb-16 min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-6"
      >
        <div className="text-center space-y-6 mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white">Platform Features</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to automate your job search and land your next role.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Vector Embeddings", desc: "We convert resumes and jobs into 1536-D math vectors." },
            { title: "Automated Applications", desc: "1-click apply uses GPT-4 to write perfect cover letters." },
            { title: "Interview Prep Agent", desc: "Generates custom behavioral & technical questions based on gaps." },
            { title: "Daily Match Engine", desc: "Constantly scans the market for new high-similarity jobs." }
          ].map((feat, i) => (
            <div key={i} className="glass-panel p-10 rounded-3xl border border-white/5 hover:border-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-4">{feat.title}</h3>
              <p className="text-gray-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
