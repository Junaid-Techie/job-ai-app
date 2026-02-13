"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-semibold"
      >
        Semantic Job Intelligence
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-gray-400 max-w-2xl mx-auto"
      >
        AI-powered job matching using vector embeddings and real semantic search.
      </motion.p>
    </div>
  );
}
