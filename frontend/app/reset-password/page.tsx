"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLength = password.length >= 8;
  const isStrong = hasUppercase && hasNumber && hasLength;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isStrong) {
      setError("Password must be at least 8 characters, include an uppercase letter and a number.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to reset password.");
      } else {
        setSuccess("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
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
              Set New Password
            </h2>
            <p className="text-gray-400 text-sm">Choose a strong password for your account.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-6 text-sm text-center relative z-10">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg mb-6 text-sm text-center relative z-10">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token}
              />
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
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full p-3.5 rounded-xl bg-black/50 border text-white outline-none transition-all focus:ring-2 ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? "border-emerald-500/50 focus:ring-emerald-500/50"
                      : "border-red-500/50 focus:ring-red-500/50"
                    : "border-white/10 focus:ring-blue-500/50"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!token}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-red-400 text-xs mt-1 ml-1">Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !token || !isStrong || !passwordsMatch}
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-spin">⚙️</span> : "Reset Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
