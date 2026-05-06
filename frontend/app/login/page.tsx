"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
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
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to your AI Agent Dashboard</p>
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-spin">⚙️</span> : "Secure Sign In"}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-8 relative z-10">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 transition">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
