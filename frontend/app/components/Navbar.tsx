"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative z-20 flex justify-between items-center px-10 py-6 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <Link href="/" className="text-lg font-semibold">
        Job AI Matcher
      </Link>

      <div className="space-x-6 text-sm text-gray-300">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Login</Link>
      </div>
    </nav>
  );
}
