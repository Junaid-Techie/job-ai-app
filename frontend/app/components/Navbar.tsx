"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-white/10 backdrop-blur-md bg-black/30">
      <Link href="/" className="text-lg font-semibold">
        Job AI Matcher
      </Link>

      <div className="space-x-6 text-sm text-gray-300">
        <Link href="/">Home</Link>

        {session && <Link href="/dashboard">Dashboard</Link>}

        {session ? (
          <button onClick={() => signOut()}>
            Logout
          </button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
