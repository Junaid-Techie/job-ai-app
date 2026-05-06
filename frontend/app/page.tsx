"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="space-y-32 py-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center space-y-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          v2.0 Beta Now Live
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Stop Searching.<br /> Start Matching.
        </h1>

        <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The first AI-powered job matching platform that understands your career. We use vector embeddings to find jobs based on actual skill alignment, not just keyword matching.
        </p>

        <div className="flex justify-center gap-4 pt-6">
          <Link href={session ? "/dashboard" : "/register"}>
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:scale-105 hover:bg-gray-100 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              {session ? "Go to Dashboard" : "Get Started for Free"}
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 backdrop-blur-md">
              Learn More
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        id="how-it-works"
      >
        {[
          {
            title: "Semantic Understanding",
            desc: "Our AI reads your resume like a recruiter, understanding your transferable skills and context beyond simple keywords.",
            icon: "🧠"
          },
          {
            title: "Vector Similarity",
            desc: "Jobs are scored using mathematical distance in 1536-dimensional space for unprecedented match accuracy.",
            icon: "📐"
          },
          {
            title: "Automated Insights",
            desc: "Instantly see exactly why a job is a good fit and what skills you should highlight in your application.",
            icon: "⚡"
          }
        ].map((feature, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors bg-white/5 backdrop-blur-sm">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
