"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Contact() {
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    setTimeout(() => {
      setContactStatus("success");
      setTimeout(() => setContactStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <div className="relative pt-32 pb-24 min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full px-6"
      >
        <div className="glass-panel p-10 md:p-16 rounded-[40px] border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
            <p className="text-gray-400 text-lg">Enterprise solutions, API access, or just want to say hi?</p>
          </div>

          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Name</label>
                <input type="text" required placeholder="Jane Doe" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email</label>
                <input type="email" required placeholder="jane@company.com" className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Message</label>
              <textarea required rows={5} placeholder="How can we help you..." className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition resize-none" />
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
