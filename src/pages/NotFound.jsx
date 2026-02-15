import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { APP_NAME } from "../utils/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="mb-2 text-8xl font-bold text-primary">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">
          Page Not Found
        </h2>
        <p className="mb-8 text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Back to {APP_NAME}
        </Link>
      </motion.div>
    </div>
  );
}
