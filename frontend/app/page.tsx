"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    // Simulate network request
    setTimeout(() => {
      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setTimeout(() => setContactStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="relative pt-32 pb-16 overflow-hidden">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center space-y-10 px-6"
      >
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 shadow-xl backdrop-blur-md">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white">v3.0 Auto-Apply ATS is Live</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-gray-500 drop-shadow-sm">
          The End of Manual <br className="hidden md:block"/> Job Applications.
        </h1>

        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
          Meet your personal AI career agent. We semantically match your resume to thousands of jobs and autonomously generate tailored cover letters.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
          <Link href={session ? "/dashboard" : "/login"}>
            <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-lg font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center gap-3">
              {session ? "Enter Agent Dashboard" : "Start Auto-Applying"} <span className="text-2xl">🚀</span>
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white text-lg font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
              See How It Works
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats/Social Proof Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="max-w-6xl mx-auto mt-32 border-y border-white/5 py-12 flex flex-col md:flex-row justify-center items-center gap-12 md:gap-32 text-center"
      >
        <div>
          <h4 className="text-4xl font-bold text-white mb-2">10k+</h4>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold">Jobs Indexed</p>
        </div>
        <div>
          <h4 className="text-4xl font-bold text-white mb-2">1.2M</h4>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold">Vector Matches</p>
        </div>
        <div>
          <h4 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">99%</h4>
          <p className="text-gray-500 uppercase tracking-widest text-sm font-semibold">Match Accuracy</p>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto mt-32 px-6"
        id="how-it-works"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How Your AI Agent Works</h2>
          <p className="text-xl text-gray-400">A completely autonomous pipeline from resume upload to interview.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "1. Semantic Parsing",
              desc: "Upload your PDF. We convert your life's work into a 1,536-dimensional vector embedding that understands context, not just keywords.",
              icon: "🧠",
              color: "from-purple-500/20 to-fuchsia-500/5"
            },
            {
              title: "2. Precision Matching",
              desc: "Our engine scans thousands of remote jobs simultaneously, calculating exact mathematical distance to find your perfect technical and cultural fit.",
              icon: "🎯",
              color: "from-blue-500/20 to-cyan-500/5"
            },
            {
              title: "3. Auto-Application",
              desc: "Click one button and our AI writes a deeply personalized, highly-tailored cover letter and submits the application on your behalf.",
              icon: "⚡",
              color: "from-emerald-500/20 to-teal-500/5"
            }
          ].map((feature, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${feature.color} p-1 rounded-3xl`}>
              <div className="bg-black/80 backdrop-blur-xl p-10 rounded-[22px] h-full border border-white/5 hover:border-white/20 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto mt-40 px-6"
      >
        <div className="glass-panel p-10 md:p-16 rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="text-center mb-12 relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-400 text-lg">Enterprise solutions, API access, or just want to say hi?</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Message</label>
              <textarea
                required
                rows={5}
                placeholder="How can we help you..."
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={contactStatus !== "idle"}
              className={`w-full py-5 text-lg font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                contactStatus === "success" 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" 
                  : "bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              }`}
            >
              {contactStatus === "sending" && <><span className="animate-spin">⚙️</span> Sending...</>}
              {contactStatus === "success" && <>Message Sent! ✓</>}
              {contactStatus === "idle" && "Send Message"}
            </button>
          </form>
        </div>
      </motion.div>

    </div>
  );
}
