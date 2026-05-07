"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
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

  // Touch state for dynamic validation
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Dynamic Validation Checks
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLength = password.length >= 8;
  const isPasswordStrong = hasUppercase && hasNumber && hasLength;
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Handle Input Blur for showing errors
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const resetState = () => {
    setError("");
    setSuccessMsg("");
    setLoading(false);
    setTouched({
      firstName: false,
      lastName: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
  };

  const handleSignIn = async () => {
    setError("");
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    
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
    setError("");
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    
    if (!firstName || !lastName || !isValidEmail || !isPasswordStrong || !passwordsMatch) {
      setError("Please fix the highlighted errors before submitting.");
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
    setError("");
    setTouched((prev) => ({ ...prev, email: true }));

    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show the same message regardless of response to prevent enumeration
      setSuccessMsg("If an account exists with that email, a password reset link has been sent. Check your inbox (and spam folder).");
      setTimeout(() => {
        setMode("signIn");
        resetState();
      }, 5000);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signIn") handleSignIn();
    else if (mode === "signUp") handleSignUp();
    else handleForgotPassword();
  };

  // Border logic helpers
  const getInputClass = (isTouched: boolean, isValid: boolean) => {
    const base = "w-full p-3.5 rounded-xl bg-black/50 border text-white outline-none transition-all";
    if (!isTouched) return `${base} border-white/10 focus:ring-2 focus:ring-blue-500/50`;
    if (isValid) return `${base} border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50`;
    return `${base} border-red-500/50 focus:ring-2 focus:ring-red-500/50`;
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
          
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
              {mode === "signIn" ? "Welcome Back" : mode === "signUp" ? "Create Account" : "Reset Password"}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === "signIn" ? "Sign in to your Agent Dashboard" : mode === "signUp" ? "Join the AI job search revolution" : "We'll send you a recovery link"}
            </p>
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            
            {mode === "signUp" && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    className={getInputClass(touched.firstName, firstName.length > 0)}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    onBlur={() => handleBlur("firstName")}
                  />
                  {touched.firstName && !firstName && <p className="text-red-400 text-xs mt-1 ml-1">Required</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    className={getInputClass(touched.lastName, lastName.length > 0)}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    onBlur={() => handleBlur("lastName")}
                  />
                  {touched.lastName && !lastName && <p className="text-red-400 text-xs mt-1 ml-1">Required</p>}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={getInputClass(touched.email, isValidEmail)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              {touched.email && !isValidEmail && <p className="text-red-400 text-xs mt-1 ml-1">Please enter a valid email.</p>}
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
                  className={getInputClass(touched.password, mode === "signUp" ? isPasswordStrong : password.length > 0)}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                />
                
                {/* Dynamic Password Strength Indicator (Only on Sign Up) */}
                {mode === "signUp" && (
                  <div className="mt-2 ml-1 space-y-1">
                    <p className={`text-xs flex items-center gap-1 ${hasLength ? "text-emerald-400" : "text-gray-500"}`}>
                      {hasLength ? "✓" : "○"} At least 8 characters
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${hasUppercase ? "text-emerald-400" : "text-gray-500"}`}>
                      {hasUppercase ? "✓" : "○"} One uppercase letter
                    </p>
                    <p className={`text-xs flex items-center gap-1 ${hasNumber ? "text-emerald-400" : "text-gray-500"}`}>
                      {hasNumber ? "✓" : "○"} One number
                    </p>
                  </div>
                )}
                {mode === "signIn" && touched.password && !password && <p className="text-red-400 text-xs mt-1 ml-1">Required</p>}
              </div>
            )}

            {mode === "signUp" && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={getInputClass(touched.confirmPassword, passwordsMatch)}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur("confirmPassword")}
                />
                {touched.confirmPassword && !passwordsMatch && (
                  <p className="text-red-400 text-xs mt-1 ml-1">Passwords do not match.</p>
                )}
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
