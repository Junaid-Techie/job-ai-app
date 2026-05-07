"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="relative bg-black min-h-screen font-sans text-white overflow-hidden">
      
      {/* Premium Gradient Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-900/40 via-blue-900/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-colors"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium tracking-wide text-gray-300">Introducing Auto-Apply AI 3.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8"
        >
          Your Next Role, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
            Secured Autonomously.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light mb-12"
        >
          Upload your resume once. Our AI agent continuously scans the global market, matches you via high-dimensional semantic vectors, and writes tailored cover letters on your behalf.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
        >
          <Link href={session ? "/dashboard" : "/login"}>
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              {session ? "Enter Dashboard" : "Start For Free"}
            </button>
          </Link>
          <Link href="/features">
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-semibold text-lg rounded-full hover:bg-white/10 backdrop-blur-md transition-all duration-300">
              Explore Platform
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Product Dashboard Preview (Mockup Image) */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-6xl mx-auto px-6 pb-32"
      >
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-4 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5" />
          <div className="aspect-[16/9] w-full rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-center relative overflow-hidden">
            {/* Minimalist Dashboard Mock */}
            <div className="absolute top-0 left-0 w-full h-12 border-b border-white/5 flex items-center px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="h-6 w-64 bg-white/5 rounded mx-auto" />
            </div>
            <div className="flex w-full h-full pt-12">
              <div className="w-64 border-r border-white/5 p-6 space-y-4 hidden md:block">
                <div className="h-4 w-32 bg-white/10 rounded" />
                <div className="h-4 w-24 bg-white/5 rounded" />
                <div className="h-4 w-28 bg-white/5 rounded" />
              </div>
              <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="h-8 w-48 bg-white/10 rounded" />
                  <div className="h-8 w-24 bg-emerald-500/20 rounded" />
                </div>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-24 w-full bg-white/5 rounded-xl border border-white/5 flex items-center px-6">
                      <div className="h-12 w-12 rounded-full bg-blue-500/20 mr-4" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/3 bg-white/10 rounded" />
                        <div className="h-3 w-1/4 bg-white/5 rounded" />
                      </div>
                      <div className="h-8 w-24 bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the Modern Candidate</h2>
          <p className="text-xl text-gray-400">Everything you need to automate your career progression.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-blue-900/20 to-black border border-white/10 p-10 flex flex-col justify-end relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 group-hover:scale-110 transition-transform">🧠</div>
            <h3 className="text-3xl font-bold mb-3">Semantic Vector Engine</h3>
            <p className="text-gray-400 text-lg max-w-md">We don't match keywords. We encode your entire career history into mathematical vectors to find profound structural matches.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-emerald-900/20 to-black border border-white/10 p-10 flex flex-col justify-end relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 group-hover:scale-110 transition-transform">⚡</div>
            <h3 className="text-2xl font-bold mb-3">1-Click Apply</h3>
            <p className="text-gray-400">Let our agents handle the forms.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-purple-900/20 to-black border border-white/10 p-10 flex flex-col justify-end relative overflow-hidden group hover:border-purple-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 group-hover:scale-110 transition-transform">📝</div>
            <h3 className="text-2xl font-bold mb-3">Custom Cover Letters</h3>
            <p className="text-gray-400">GPT-4 generates highly tailored pitches.</p>
          </div>
          <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-orange-900/20 to-black border border-white/10 p-10 flex flex-col justify-end relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-3xl font-bold mb-3">Application Pipeline</h3>
            <p className="text-gray-400 text-lg max-w-md">Track every auto-application in a unified Kanban board. Get interview prep guides instantly generated based on the job description.</p>
          </div>
        </div>
      </section>

      {/* Trust & Footer CTA */}
      <section className="border-t border-white/5 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Stop scrolling job boards.</h2>
          <Link href={session ? "/dashboard" : "/login"}>
            <button className="px-12 py-6 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-xl rounded-full hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-300">
              Create Your Agent Now
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}
