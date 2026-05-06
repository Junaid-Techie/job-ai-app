"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.detail === 'string') {
          setError(data.detail);
        } else if (Array.isArray(data.detail)) {
          setError(data.detail[0].msg);
        } else {
          setError("Registration failed");
        }
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch (err) {
      setError("Network error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="relative z-20 min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-2">Create Account</h2>
            <p className="text-gray-400 text-sm">Join the AI job search revolution</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center relative z-10">
              {error}
            </motion.div>
          )}

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading || !email || !password}
              className="w-full py-4 mt-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-spin">⚙️</span> : "Create Account"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8 relative z-10">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 transition">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
