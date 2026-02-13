"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-5xl mx-auto px-6 py-32 text-center"
    >
      <h1 className="text-5xl font-semibold tracking-tight">
        Semantic Job Intelligence
      </h1>

      <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
        AI-powered job matching using vector embeddings and real semantic search.
      </p>
    </motion.div>
  );
}
