import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaRocket,
  FaSearch,
  FaCheck,
  FaSpinner,
  FaExclamationCircle,
  FaSync,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";
import {
  fetchGitHubUser,
  fetchGitHubRepos,
  fetchProfileReadme,
  calculateMostUsedLanguages,
  fetchUserEvents,
  calculateContributionActivity,
} from "../services/github";
import {
  generateBio,
  generateProjectDescriptions,
  extractSkills,
  parseProfileReadme,
} from "../services/groqllm";
import { savePortfolio, saveUsernameMapping, getPortfolio } from "../services/firestore";

const STEPS = [
  { label: "Fetching GitHub profile", icon: FaGithub },
  { label: "Analyzing with AI", icon: FaRocket },
  { label: "Saving portfolio", icon: FaCheck },
];

export default function Dashboard() {
  const { user, isGithubAuth, githubAccessToken } = useAuth();
  const [githubUsername, setGithubUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPortfolio, setCheckingPortfolio] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [existingPortfolio, setExistingPortfolio] = useState(null);
  const navigate = useNavigate();

  // Get display name or email prefix
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "User";
  const firstLetter = displayName.charAt(0).toUpperCase();

  // Get GitHub username for OAuth users
  const githubUsernameFromAuth = isGithubAuth
    ? user?.reloadUserInfo?.screenName || null
    : null;

  // Check for existing portfolio on mount
  useEffect(() => {
    async function checkExistingPortfolio() {
      if (user?.uid) {
        try {
          const portfolio = await getPortfolio(user.uid);
          setExistingPortfolio(portfolio);
        } catch (err) {
          console.error("Error checking portfolio:", err);
        } finally {
          setCheckingPortfolio(false);
        }
      }
    }
    checkExistingPortfolio();
  }, [user?.uid]);

  async function handleGeneratePortfolio(isRegeneration = false) {
    try {
      setLoading(true);
      setError("");
      setCurrentStep(0);

      // Determine username - use existing portfolio username for regeneration
      let username;
      if (isRegeneration && existingPortfolio?.username) {
        // Regeneration: always use the existing portfolio's username
        username = existingPortfolio.username;
      } else if (isGithubAuth) {
        // New portfolio via GitHub OAuth
        username =
          user.reloadUserInfo?.screenName ||
          githubUsername.trim() ||
          null;

        if (!username) {
          setError("Could not determine your GitHub username. Please enter it manually above.");
          setLoading(false);
          return;
        }
      } else {
        // New portfolio via manual entry
        username = githubUsername.trim();
        if (!username) return;
      }

      // Step 1: Fetch GitHub data in parallel
      setCurrentStep(0);
      const apiToken = githubAccessToken || import.meta.env.VITE_GITHUB_TOKEN || null;
      const [profileData, repos, readmeContent, events] = await Promise.all([
        fetchGitHubUser(username, apiToken),
        fetchGitHubRepos(username, 30, apiToken),
        fetchProfileReadme(username, apiToken),
        fetchUserEvents(username, apiToken),
      ]);

      // Calculate languages and contributions
      const [languages, contributionActivity] = await Promise.all([
        calculateMostUsedLanguages(repos, apiToken),
        Promise.resolve(calculateContributionActivity(events)),
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
        bio: bio || null,
        avatarUrl: profileData.avatar_url || null,
        profileUrl: profileData.html_url || `https://github.com/${username}`,
        location: profileData.location || null,
        company: profileData.company || null,
        blog: profileData.blog || null,
        email: profileData.email || null,
        twitterUsername: profileData.twitter_username || null,
        skills: skills || [],
        projects: projects || [],
        languages: languages || [],
        contributions: contributionActivity || {},
        stats: {
          repos: profileData.public_repos || 0,
          stars: repos.reduce(
            (sum, r) => sum + (r.stargazers_count || 0),
            0
          ),
          followers: profileData.followers || 0,
          following: profileData.following || 0,
          totalContributions: contributionActivity.totalRecent || 0,
          currentStreak: contributionActivity.streakDays || 0,
        },
        readmeSections: readmeSections || null,
      };

      // Check username ownership - allows regeneration for same user
      await saveUsernameMapping(username, user.uid, isRegeneration);
      await savePortfolio(user.uid, portfolioData);

      // Update local state
      setExistingPortfolio(portfolioData);

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

  // Show loader while checking for existing portfolio
  if (checkingPortfolio) {
    return (
      <div className="min-h-screen bg-surface-900">
        <Navbar />
        <main className="flex items-center justify-center px-6 pt-24">
          <FaSpinner className="animate-spin text-2xl text-primary" />
        </main>
      </div>
    );
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
              {existingPortfolio
                ? "Manage your portfolio or regenerate with fresh data."
                : isGithubAuth
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
                    {existingPortfolio ? "Regenerating your portfolio..." : "Building your portfolio..."}
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
              ) : existingPortfolio ? (
                /* Existing Portfolio - Show View/Regenerate options */
                <motion.div
                  key="existing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center"
                >
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm text-success">
                    <FaCheck />
                    Portfolio Ready
                  </div>
                  <p className="mb-2 text-lg font-medium text-text-primary">
                    @{existingPortfolio.username}
                  </p>
                  <p className="mb-6 text-sm text-text-secondary">
                    Your portfolio is live and ready to share.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={() => navigate(`/portfolio/${existingPortfolio.username}`)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      <FaExternalLinkAlt />
                      View Portfolio
                    </button>
                    <button
                      onClick={() => handleGeneratePortfolio(true)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-surface-500 bg-surface-700 px-6 py-3 font-semibold text-text-primary transition-colors hover:bg-surface-600"
                    >
                      <FaSync />
                      Regenerate
                    </button>
                  </div>
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
                  {githubUsernameFromAuth ? (
                    <>
                      <p className="mb-2 text-lg font-medium text-text-primary">
                        @{githubUsernameFromAuth}
                      </p>
                      <p className="mb-6 text-sm text-text-secondary">
                        We&apos;ll fetch your repositories, profile, and
                        contribution data to build your portfolio.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mb-4 text-sm text-text-secondary">
                        Enter your GitHub username to continue:
                      </p>
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
                    </>
                  )}
                  <button
                    onClick={() => handleGeneratePortfolio(false)}
                    disabled={loading || (isGithubAuth && !githubUsernameFromAuth && !githubUsername.trim())}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
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
                  className="relative perspective-1000"
                >
                  <label className="mb-2 block text-sm font-medium text-muted-foreground">
                    GitHub Username
                  </label>
                  <div className="mb-6 flex flex-col gap-3">
                    <div className="relative group focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all rounded-md">
                      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="e.g. octocat"
                        className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 pl-10 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleGeneratePortfolio(false);
                        }}
                      />
                    </div>

                    <AnimatePresence>
                      {githubUsername.length > 2 && !loading && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, rotateX: -10 }}
                          animate={{ opacity: 1, y: 5, rotateX: 0 }}
                          exit={{ opacity: 0, y: -10, rotateX: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full p-4 bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-xl text-left"
                        >
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                              {githubUsername.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1 text-foreground">
                              <h3 className="font-semibold text-lg truncate">{githubUsername}</h3>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <FaGithub /> {githubUsername}
                              </p>
                              <p className="text-xs mt-1 text-foreground/80 line-clamp-1">
                                Generating a professional portfolio for {githubUsername}...
                              </p>
                            </div>
                          </div>
                      </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                  <button
                    onClick={() => handleGeneratePortfolio(false)}
                    disabled={loading || !githubUsername.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
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
                className="mt-4 flex items-start gap-3 rounded-lg border border-destructive bg-destructive/10 px-4 py-3 text-destructive"
              >
                <FaExclamationCircle className="mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
