"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 animate-gradient" />

      {/* Floating blur shapes */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl top-20 left-10 animate-float" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl bottom-10 right-20 animate-float-slow" />
    </div>
  );
}
