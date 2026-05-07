"use client";

import { motion } from "framer-motion";

export default function Features() {
  return (
    <div className="relative pt-32 pb-24 min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[200px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-6"
      >
        <div className="text-center space-y-6 mb-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
            Platform Capabilities
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We are building the first truly autonomous career agent. From semantic resume parsing to automated interview prep, explore the technology powering your next career move.
          </p>
        </div>

        <div className="space-y-32">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl">🧠</div>
              <h2 className="text-4xl font-bold">1536-Dimensional Semantic Matching</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Traditional ATS systems rely on keyword extraction, meaning highly qualified candidates are frequently rejected due to formatting. We use OpenAI's advanced embedding models to convert your entire career history into mathematical vectors. This allows us to understand the *context* and *impact* of your work, matching you to jobs based on true similarity.
              </p>
            </div>
            <div className="flex-1 w-full glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent" />
              <div className="text-center font-mono text-xs text-blue-300/50 space-y-2 opacity-50">
                <p>[0.0234, -0.1983, 0.4412, ...]</p>
                <p>Cosine Similarity: 0.982</p>
                <p>Match Found: Senior AI Engineer</p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">⚡</div>
              <h2 className="text-4xl font-bold">Autonomous 1-Click Applications</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Applying to jobs takes hours of repetitive data entry. Once your profile and resume are embedded in our system, you can apply to perfectly matched roles with a single click. Our AI dynamically generates highly tailored cover letters referencing specific requirements from the job description and your relevant experience.
              </p>
            </div>
            <div className="flex-1 w-full glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent" />
              <div className="w-full max-w-sm space-y-4">
                <div className="h-4 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-5/6 bg-white/5 rounded" />
                <div className="h-10 w-full mt-6 bg-emerald-600/50 rounded-xl border border-emerald-500/50 flex items-center justify-center font-bold">
                  Applying...
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl">🎯</div>
              <h2 className="text-4xl font-bold">Predictive Interview Prep</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Getting the interview is only half the battle. Our AI analyzes the job description against your resume to predict the exact technical and behavioral questions you are most likely to be asked. It identifies gaps in your experience and provides tailored talking points to bridge them during the interview.
              </p>
            </div>
            <div className="flex-1 w-full glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-transparent" />
              <div className="text-center font-mono text-sm text-purple-300/70 space-y-2">
                <p>Generating technical questions...</p>
                <p>Analyzing resume gaps...</p>
                <p>Ready: 15 custom practice scenarios.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
