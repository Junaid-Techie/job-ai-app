"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Basic Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  
  // Details
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");

  // Links
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.accessToken) {
      fetchProfile();
    }
  }, [status, session]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setEmail(data.email || "");
        setHeadline(data.headline || "");
        setLocation(data.location || "");
        setAbout(data.about || "");
        setSkills(data.skills || "");
        setJobType(data.job_type || "");
        setExperienceYears(data.experience_years ?? "");
        setLinkedinUrl(data.linkedin_url || "");
        setGithubUrl(data.github_url || "");
        setPortfolioUrl(data.portfolio_url || "");
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/profile/`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}` 
        },
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName, 
          location, 
          job_type: jobType,
          headline,
          about,
          skills,
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
          portfolio_url: portfolioUrl,
          experience_years: experienceYears === "" ? null : Number(experienceYears)
        })
      });

      if (res.ok) {
        setStatusMsg("Profile successfully updated! Your agent is now smarter.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg("Failed to update profile.");
      }
    } catch (err) {
      setErrorMsg("Network error.");
    }
    setLoading(false);
  };

  if (status === "loading" || !session) return null;

  return (
    <div className="relative pt-32 pb-24 min-h-[85vh] bg-black/95">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Your Career Profile</h1>
            <p className="text-gray-400">Enhance your AI agent's understanding of your career trajectory.</p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
              Profile Strength: {headline && about && skills ? "All-Star ⭐" : "Intermediate"}
            </span>
          </div>
        </div>

        {statusMsg && <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl mb-6 border border-emerald-500/30 text-center font-medium shadow-[0_0_20px_rgba(16,185,129,0.15)]">{statusMsg}</div>}
        {errorMsg && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 border border-red-500/30 text-center font-medium">{errorMsg}</div>}

        <form onSubmit={updateProfile} className="space-y-8">
          
          {/* Section 1: Intro */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">Introduction</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">First Name</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Last Name</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Headline</label>
                <input type="text" placeholder="e.g. Senior Frontend Engineer at TechCorp | React & Typescript" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Location</label>
                <input type="text" placeholder="e.g. San Francisco, CA or Remote" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Account Email</label>
                <input type="email" disabled value={email} className="w-full p-3.5 rounded-xl bg-black/30 border border-white/5 text-gray-500 cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Section 2: About */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">About</h2>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Summary</label>
              <textarea 
                rows={4} 
                placeholder="Tell recruiters about your background, expertise, and what you're looking for..."
                value={about} 
                onChange={(e) => setAbout(e.target.value)} 
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition resize-none" 
              />
            </div>
          </div>

          {/* Section 3: Skills & Expertise */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">Skills & Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Top Skills (Comma Separated)</label>
                <input type="text" placeholder="e.g. Python, React, Next.js, System Design" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Years of Experience</label>
                <input type="number" min="0" placeholder="e.g. 5" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : "")} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Preferred Job Type</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition">
                  <option value="">Select...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: External Links */}
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-white/10 pb-4">Web Presence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
                <input type="url" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">GitHub URL</label>
                <input type="url" placeholder="https://github.com/username" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Personal Portfolio</label>
                <input type="url" placeholder="https://yourwebsite.com" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition" />
              </div>
            </div>
          </div>

          <div className="sticky bottom-8 z-20">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-lg font-bold rounded-2xl hover:scale-[1.02] shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-spin">⚙️</span> : "Save Profile Updates"}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
