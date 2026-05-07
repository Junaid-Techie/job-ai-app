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
  const [targetSalary, setTargetSalary] = useState<number | "">("");

  // Links
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Demographics / Work Auth
  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [veteranStatus, setVeteranStatus] = useState("");
  const [disabilityStatus, setDisabilityStatus] = useState("");
  const [workAuthorization, setWorkAuthorization] = useState("");
  const [requiresSponsorship, setRequiresSponsorship] = useState(false);

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
        setTargetSalary(data.target_salary ?? "");
        setLinkedinUrl(data.linkedin_url || "");
        setGithubUrl(data.github_url || "");
        setPortfolioUrl(data.portfolio_url || "");
        
        setGender(data.gender || "");
        setEthnicity(data.ethnicity || "");
        setVeteranStatus(data.veteran_status || "");
        setDisabilityStatus(data.disability_status || "");
        setWorkAuthorization(data.work_authorization || "");
        setRequiresSponsorship(data.requires_sponsorship || false);
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
          experience_years: experienceYears === "" ? null : Number(experienceYears),
          target_salary: targetSalary === "" ? null : Number(targetSalary),
          gender,
          ethnicity,
          veteran_status: veteranStatus,
          disability_status: disabilityStatus,
          work_authorization: workAuthorization,
          requires_sponsorship: requiresSponsorship
        })
      });

      if (res.ok) {
        setStatusMsg("Profile successfully updated! Your agent is now fully equipped.");
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
    <div className="relative pt-32 pb-24 min-h-[85vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Career Profile</h1>
            <p className="text-gray-400">Complete this entire form so your AI agent can bypass hundreds of manual dropdowns.</p>
          </div>
        </div>

        {statusMsg && <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-xl mb-6 border border-emerald-500/30 text-center font-medium">{statusMsg}</div>}
        {errorMsg && <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 border border-red-500/30 text-center font-medium">{errorMsg}</div>}

        <form onSubmit={updateProfile} className="space-y-8">
          
          {/* Section 1: Intro */}
          <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
            <h2 className="text-xl font-semibold text-white mb-6">1. Core Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">First Name *</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Last Name *</label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Professional Headline</label>
                <input type="text" placeholder="e.g. Senior Software Engineer at TechCorp" value={headline} onChange={(e) => setHeadline(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Summary / About Me</label>
                <textarea rows={4} placeholder="Describe your career goals and expertise..." value={about} onChange={(e) => setAbout(e.target.value)} className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition resize-none" />
              </div>
            </div>
          </div>

          {/* Section 2: Requirements */}
          <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">2. Job Preferences & Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Preferred Location</label>
                <input type="text" placeholder="e.g. Remote, San Francisco, CA" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Target Salary (USD)</label>
                <input type="number" min="0" placeholder="e.g. 150000" value={targetSalary} onChange={(e) => setTargetSalary(e.target.value ? Number(e.target.value) : "")} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Years of Experience</label>
                <input type="number" min="0" placeholder="e.g. 5" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value ? Number(e.target.value) : "")} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Preferred Job Type</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition">
                  <option value="">Select...</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Top Skills (Comma Separated)</label>
                <input type="text" placeholder="e.g. Python, React, Next.js, System Design" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
            </div>
          </div>

          {/* Section 3: Compliance & Demographics */}
          <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">3. Compliance & Demographics</h2>
            <p className="text-sm text-gray-500 mb-8">This information is strictly required to bypass EEOC and compliance checkboxes during the automated application process.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Work Authorization</label>
                <select value={workAuthorization} onChange={(e) => setWorkAuthorization(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition">
                  <option value="">Select...</option>
                  <option value="Authorized to work in US">Authorized to work in US</option>
                  <option value="Not Authorized">Not Authorized</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex items-center mt-6">
                <input type="checkbox" id="sponsor" checked={requiresSponsorship} onChange={(e) => setRequiresSponsorship(e.target.checked)} className="w-5 h-5 rounded border-white/10 bg-black/50 accent-blue-500" />
                <label htmlFor="sponsor" className="ml-3 text-sm font-medium text-gray-300">I require visa sponsorship now or in the future.</label>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition">
                  <option value="">Decline to state</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Race / Ethnicity</label>
                <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition">
                  <option value="">Decline to state</option>
                  <option value="Hispanic or Latino">Hispanic or Latino</option>
                  <option value="White">White</option>
                  <option value="Black or African American">Black or African American</option>
                  <option value="Asian">Asian</option>
                  <option value="Two or More Races">Two or More Races</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Veteran Status</label>
                <select value={veteranStatus} onChange={(e) => setVeteranStatus(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition">
                  <option value="">Decline to state</option>
                  <option value="I am not a protected veteran">I am not a protected veteran</option>
                  <option value="I am a protected veteran">I am a protected veteran</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Disability Status</label>
                <select value={disabilityStatus} onChange={(e) => setDisabilityStatus(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition">
                  <option value="">Decline to state</option>
                  <option value="No, I don't have a disability">No, I don't have a disability</option>
                  <option value="Yes, I have a disability">Yes, I have a disability</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: External Links */}
          <div className="bg-[#0A0A0A] p-8 rounded-2xl border border-white/10 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">4. Web Presence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">LinkedIn URL</label>
                <input type="url" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">GitHub URL</label>
                <input type="url" placeholder="https://github.com/username" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Personal Portfolio</label>
                <input type="url" placeholder="https://yourwebsite.com" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:border-blue-500 outline-none transition" />
              </div>
            </div>
          </div>

          <div className="sticky bottom-8 z-20 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Configuration"}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
