"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type AuthMode = "signIn" | "signUp" | "forgotPassword";

export default function AuthPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [mode, setMode] = useState<AuthMode>("signIn");
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Simple password strength check
  const isPasswordStrong = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);

  const resetState = () => {
    setError("");
    setSuccessMsg("");
    setLoading(false);
  };

  const handleSignIn = async () => {
    resetState();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSignUp = async () => {
    resetState();
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isPasswordStrong) {
      setError("Password must be at least 8 characters, with 1 uppercase letter and 1 number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (typeof data.detail === 'string') setError(data.detail);
        else if (Array.isArray(data.detail)) setError(data.detail[0].msg);
        else setError("Registration failed");
        
        setLoading(false);
        return;
      }

      setSuccessMsg("Account created! You can now sign in.");
      setMode("signIn");
    } catch (err) {
      setError("Network error occurred.");
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    resetState();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    // Simulating network request for password reset (since no email server is configured)
    setTimeout(() => {
      setSuccessMsg("If an account exists, a password reset link has been sent to your email.");
      setLoading(false);
      setTimeout(() => {
        setMode("signIn");
        resetState();
      }, 3000);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signIn") handleSignIn();
    else if (mode === "signUp") handleSignUp();
    else handleForgotPassword();
  };

  return (
    <div className="relative z-20 min-h-[85vh] flex items-center justify-center py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
          
          {/* Ambient Backgrounds */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
              {mode === "signIn" ? "Welcome Back" : mode === "signUp" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === "signIn" ? "Sign in to your Agent Dashboard" : mode === "signUp" ? "Join the AI job search revolution" : "We'll send you a recovery link"}
            </p>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center relative z-10">
                {error}
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg mb-6 text-sm text-center relative z-10">
                {successMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            
            {mode === "signUp" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {mode !== "forgotPassword" && (
              <div>
                <div className="flex justify-between items-center mb-1 px-1">
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider">Password</label>
                  {mode === "signIn" && (
                    <button type="button" onClick={() => { setMode("forgotPassword"); resetState(); }} className="text-xs text-blue-400 hover:text-blue-300 hover:underline">
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}

            {mode === "signUp" && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full p-3.5 rounded-xl bg-black/50 border text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${confirmPassword && password !== confirmPassword ? "border-red-500/50" : "border-white/10"}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-spin">⚙️</span> : mode === "signIn" ? "Secure Sign In" : mode === "signUp" ? "Create Account" : "Send Reset Link"}
            </button>
          </form>

          {/* Footer Toggles */}
          <div className="text-center text-sm text-gray-500 mt-8 relative z-10">
            {mode === "signIn" ? (
              <p>Don't have an account? <button onClick={() => { setMode("signUp"); resetState(); }} className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 transition">Create one</button></p>
            ) : mode === "signUp" ? (
              <p>Already have an account? <button onClick={() => { setMode("signIn"); resetState(); }} className="text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 transition">Sign in</button></p>
            ) : (
              <p>Remembered your password? <button onClick={() => { setMode("signIn"); resetState(); }} className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 transition">Sign in</button></p>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
