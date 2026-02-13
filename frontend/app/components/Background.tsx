"use client";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 animate-gradient" />
      <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-20 left-20 animate-float" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-20 right-20 animate-float-slow" />
    </div>
  );
}
