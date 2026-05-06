"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">
        
        <Link href="/" className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-2">
          <span className="text-2xl">⚡</span> Job AI Matcher
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-gray-300 hover:text-white transition">Home</Link>

          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
              <button 
                onClick={() => signOut()}
                className="px-5 py-2 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
