import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaRocket, FaSearch } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";

export default function Dashboard() {
  const { user, isGithubAuth, logout } = useAuth();
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get display name or email prefix
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  async function handleGeneratePortfolio() {
    try {
      setLoading(true);

      if (isGithubAuth) {
        // GitHub OAuth user: use their GitHub username from provider data
        const githubProfile = user.providerData.find(
          (p) => p.providerId === "github.com"
        );
        const username =
          githubProfile?.displayName ||
          user.reloadUserInfo?.screenName ||
          displayName;
        // TODO: Fetch GitHub data, process with Gemini, store in Firestore
        navigate(`/portfolio/${username}`);
      } else {
        // Non-GitHub user: use the manually entered username
        if (!githubUsername.trim()) return;
        // TODO: Fetch GitHub data, process with Gemini, store in Firestore
        navigate(`/portfolio/${githubUsername.trim()}`);
      }
    } catch (err) {
      console.error("Error generating portfolio:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-900">
      <Navbar />

      <main className="flex items-center justify-center px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Welcome */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
              {firstLetter}
            </div>
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome, {displayName}!
            </h1>
            <p className="mt-1 text-text-secondary">
              {isGithubAuth
                ? "Your GitHub data is ready. Generate your portfolio!"
                : "Enter your GitHub username to get started."}
            </p>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-surface-600 bg-surface-800 p-8">
            {isGithubAuth ? (
              /* GitHub OAuth user - auto flow */
              <div className="text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm text-success">
                  <FaGithub />
                  GitHub connected
                </div>
                <p className="mb-6 text-sm text-text-secondary">
                  We&apos;ll fetch your repositories, profile, and contribution
                  data to build your portfolio.
                </p>
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  <FaRocket />
                  {loading ? "Generating..." : "Generate Portfolio"}
                </button>
              </div>
            ) : (
              /* Non-GitHub user - manual username entry */
              <div>
                <label className="mb-2 block text-sm font-medium text-text-secondary">
                  GitHub Username
                </label>
                <div className="mb-6 flex gap-3">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="e.g. octocat"
                      className="w-full rounded-lg border border-surface-500 bg-surface-700 py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted outline-none transition-colors focus:border-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleGeneratePortfolio();
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleGeneratePortfolio}
                  disabled={loading || !githubUsername.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  <FaRocket />
                  {loading ? "Generating..." : "Generate Portfolio"}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
