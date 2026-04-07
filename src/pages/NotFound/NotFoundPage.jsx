import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-gray-400 mb-8">Page not found</p>
        <Link
          to="/"
          className="px-6 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
