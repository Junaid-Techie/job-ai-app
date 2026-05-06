"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
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
      }
    } catch (err) {
      console.error(err);
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
        body: JSON.stringify({ first_name: firstName, last_name: lastName })
      });

      if (res.ok) {
        setStatusMsg("Profile updated successfully!");
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
    <div className="relative pt-32 pb-16 min-h-[85vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-6"
      >
        <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          {statusMsg && <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg mb-6 border border-emerald-500/30 text-center">{statusMsg}</div>}
          {errorMsg && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 border border-red-500/30 text-center">{errorMsg}</div>}

          <form onSubmit={updateProfile} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address (Read Only)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full p-4 rounded-xl bg-black/30 border border-white/5 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
