import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaRocket,
  FaSearch,
  FaCheck,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  fetchProfileReadme,
} from "../services/github";
import {
  generateBio,
  generateProjectDescriptions,
  extractSkills,
  parseProfileReadme,
} from "../services/gemini";
import { savePortfolio, saveUsernameMapping } from "../services/firestore";

const STEPS = [
  { label: "Fetching GitHub profile", icon: FaGithub },
  { label: "Analyzing with AI", icon: FaRocket },
  { label: "Saving portfolio", icon: FaCheck },
];

export default function Dashboard() {
  const { user, isGithubAuth, logout } = useAuth();
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get display name or email prefix
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  async function handleGeneratePortfolio() {
    try {
      setLoading(true);
      setError("");
      setCurrentStep(0);

      // Determine username
      let username;
      if (isGithubAuth) {
        const githubProfile = user.providerData.find(
          (p) => p.providerId === "github.com"
        );
        username =
          githubProfile?.displayName ||
          user.reloadUserInfo?.screenName ||
          displayName;
      } else {
        username = githubUsername.trim();
        if (!username) return;
      }

      // Step 1: Fetch GitHub data in parallel
      setCurrentStep(0);
      const [profileData, repos, readmeContent] = await Promise.all([
        fetchGitHubUser(username),
        fetchGitHubRepos(username, 30),
        fetchProfileReadme(username),
      ]);

      // Step 2: Process with Gemini AI in parallel
      setCurrentStep(1);
      const [bio, projectDescriptions, skills, readmeSections] =
        await Promise.all([
          generateBio(profileData),
          generateProjectDescriptions(repos),
          extractSkills(repos),
          parseProfileReadme(readmeContent),
        ]);

      // Merge AI-generated descriptions back onto repo data
      const projects = repos.slice(0, 10).map((repo) => {
        const aiDesc = projectDescriptions.find((p) => p.name === repo.name);
        return {
          name: repo.name,
          description: aiDesc?.description || repo.description || "",
          language: repo.language || null,
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          url: repo.html_url,
          homepage: repo.homepage || null,
          topics: repo.topics || [],
        };
      });

      // Step 3: Save to Firestore
      setCurrentStep(2);
      const portfolioData = {
        username,
        name: profileData.name || profileData.login,
        bio,
        avatarUrl: profileData.avatar_url,
        profileUrl: profileData.html_url,
        location: profileData.location || null,
        company: profileData.company || null,
        blog: profileData.blog || null,
        email: profileData.email || null,
        twitterUsername: profileData.twitter_username || null,
        skills,
        projects,
        stats: {
          repos: profileData.public_repos,
          stars: repos.reduce(
            (sum, r) => sum + (r.stargazers_count || 0),
            0
          ),
          followers: profileData.followers,
          following: profileData.following,
        },
        readmeSections: readmeSections || null,
      };

      await Promise.all([
        savePortfolio(user.uid, portfolioData),
        saveUsernameMapping(username, user.uid),
      ]);

      // Done — navigate to the portfolio
      navigate(`/portfolio/${username}`);
    } catch (err) {
      console.error("Error generating portfolio:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setCurrentStep(0);
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
            <AnimatePresence mode="wait">
              {loading ? (
                /* Progress Stepper */
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <p className="mb-6 text-center text-sm font-medium text-text-secondary">
                    Building your portfolio...
                  </p>
                  {STEPS.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    return (
                      <div
                        key={step.label}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : isCompleted
                              ? "text-success"
                              : "text-text-muted"
                        }`}
                      >
                        <div className="flex h-6 w-6 items-center justify-center">
                          {isCompleted ? (
                            <FaCheck className="text-success" />
                          ) : isActive ? (
                            <FaSpinner className="animate-spin text-primary" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-surface-500" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            isActive
                              ? "text-text-primary"
                              : isCompleted
                                ? "text-success"
                                : "text-text-muted"
                          }`}
                        >
                          {step.label}
                          {isActive && "..."}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              ) : isGithubAuth ? (
                /* GitHub OAuth user - auto flow */
                <motion.div
                  key="github"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm text-success">
                    <FaGithub />
                    GitHub connected
                  </div>
                  <p className="mb-6 text-sm text-text-secondary">
                    We&apos;ll fetch your repositories, profile, and
                    contribution data to build your portfolio.
                  </p>
                  <button
                    onClick={handleGeneratePortfolio}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                  >
                    <FaRocket />
                    Generate Portfolio
                  </button>
                </motion.div>
              ) : (
                /* Non-GitHub user - manual username entry */
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
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
                    Generate Portfolio
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3"
              >
                <FaExclamationCircle className="mt-0.5 shrink-0 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
