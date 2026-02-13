"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
  setError("");

  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(data.detail || "Registration failed");
    return;
  }

  router.push("/login");
};


  return (
    <div className="relative z-20 max-w-md mx-auto py-20">
      <div className="glass-panel p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-gray-900 border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-white text-black py-3 rounded-lg hover:opacity-90 transition"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
