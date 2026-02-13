"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="bg-white/5 border border-white/10 p-8 rounded-xl">
        <h2 className="text-2xl mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded bg-gray-900 border border-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white text-black py-3 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
