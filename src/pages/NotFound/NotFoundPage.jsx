import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-7xl font-black gradient-text mb-4">404</h1>
        <p className="text-slate-400 text-lg mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold text-sm rounded-xl transition-all"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
