import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiRefreshCw, FiZap, FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useUserData } from "../../hooks/useUserData";
import { AUTH_PROVIDERS } from "../../constants";
import {
  createUserDocument,
  updateUserDocument,
  createPortfolio,
  getPortfolioByUsername,
  addPortfolioSection,
} from "../../services/firestore";
import { fetchGitHubProfile, summarizeReposForAI } from "../../services/github";
import { generatePortfolioContent } from "../../services/groq";
import ProfileCard from "../../components/dashboard/ProfileCard";
import RepoSelector from "../../components/dashboard/RepoSelector";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { user, authProvider } = useAuth();
  const { userData, portfolio, loading: userDataLoading, setPortfolio } = useUserData();
  const navigate = useNavigate();

  const [githubUsername, setGithubUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (userData?.githubUsername && !githubUsername) {
      setGithubUsername(userData.githubUsername);
    }
  }, [userData, githubUsername]);

  async function handleFetchProfile() {
    if (!githubUsername.trim()) return;

    setLoadingProfile(true);
    setProfileError("");
    setError("");

    try {
      const data = await fetchGitHubProfile(githubUsername.trim());
      setProfileData(data);
      setRepos(data.repositories?.nodes || []);

      if (!userData?.githubUsername) {
        await updateUserDocument(user.uid, { githubUsername: githubUsername.trim() });
      }
    } catch (err) {
      setProfileError(err.message || "Failed to fetch GitHub profile");
    } finally {
      setLoadingProfile(false);
    }
  }

  function handleRepoToggle(repo) {
    setSelectedRepos((prev) => {
      const exists = prev.find((r) => r.name === repo.name);
      if (exists) return prev.filter((r) => r.name !== repo.name);
      return [...prev, repo];
    });
  }

  async function handleGeneratePortfolio() {
    if (!profileData || selectedRepos.length === 0) {
      setError("Please select at least one repository");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const usernameCheck = await getPortfolioByUsername(githubUsername.trim());
      if (usernameCheck) {
        setError("A portfolio already exists for this GitHub username");
        setGenerating(false);
        return;
      }

      const summarized = summarizeReposForAI(
        repos.filter((r) => selectedRepos.find((s) => s.name === r.name)),
        selectedRepos.length
      );

      const aiContent = await generatePortfolioContent(profileData, summarized);

      const newPortfolio = await createPortfolio(user.uid, {
        slug: githubUsername.trim(),
        githubUsername: githubUsername.trim(),
        title: `${profileData.name || githubUsername}'s Portfolio`,
        summary: aiContent.about || "",
        themeMode: "dark",
        status: "generated",
      });

      const sectionTypes = [
        { type: "hero", content: aiContent.hero, order: 1 },
        { type: "about", content: { text: aiContent.about }, order: 2 },
        { type: "skills", content: { items: aiContent.skills }, order: 3 },
        { type: "projects", content: { items: aiContent.projects }, order: 4 },
        { type: "experience", content: { items: aiContent.experience }, order: 5 },
        { type: "education", content: { items: aiContent.education }, order: 6 },
        { type: "achievements", content: { items: aiContent.achievements }, order: 7 },
        { type: "contact", content: aiContent.contact, order: 8 },
      ];

      for (const section of sectionTypes) {
        await addPortfolioSection(newPortfolio.id, {
          ...section,
          title: section.type.charAt(0).toUpperCase() + section.type.slice(1),
          source: "ai",
        });
      }

      await createUserDocument(user.uid, {
        displayName: profileData.name || user.displayName || "",
        email: user.email,
        authProvider,
        profileImage: profileData.avatarUrl || user.photoURL || "",
        githubUsername: githubUsername.trim(),
      });

      setPortfolio(newPortfolio);
      navigate(`/${githubUsername.trim()}`);
    } catch (err) {
      setError(err.message || "Failed to generate portfolio");
    } finally {
      setGenerating(false);
    }
  }

  if (userDataLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasExistingPortfolio = !!portfolio;

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto relative z-10 space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="gradient-text">{user?.displayName?.split(" ")[0] || "Developer"}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1.5">
            {hasExistingPortfolio ? "Manage your portfolio and keep it up to date." : "Let's build your portfolio. Connect GitHub to get started."}
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {hasExistingPortfolio ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <ProfileCard
              profileData={profileData}
              portfolio={portfolio}
              username={portfolio.githubUsername || portfolio.slug}
            />

            {/* Portfolio Status */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-5 rounded-xl bg-slate-900/40 border border-white/[0.06]">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-0.5">Your Portfolio is Live</h3>
                <p className="text-xs text-slate-500 truncate">/{portfolio.slug}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-white/[0.06] transition-colors"
                  onClick={() => navigate(`/${portfolio.slug}`)}
                >
                  <FiEye size={15} /> View
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-sm font-bold rounded-lg transition-colors"
                  onClick={() => {
                    setProfileData(null);
                    setSelectedRepos([]);
                    handleFetchProfile();
                  }}
                  disabled={loadingProfile}
                >
                  <FiRefreshCw size={15} className={loadingProfile ? "animate-spin" : ""} />
                  Regenerate
                </button>
              </div>
            </div>

            {loadingProfile && (
              <div className="py-16 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {profileData && !loadingProfile && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-slate-900/30 border border-white/[0.06] overflow-hidden"
              >
                <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
                  <div>
                    <h2 className="text-base font-bold text-white">Select Repositories</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Choose projects to feature in your regenerated portfolio</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {selectedRepos.length} selected
                  </span>
                </div>

                <div className="p-5">
                  <RepoSelector
                    repos={repos}
                    selectedRepos={selectedRepos}
                    onToggle={handleRepoToggle}
                  />
                </div>

                <div className="p-5 border-t border-white/[0.04]">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGeneratePortfolio}
                    disabled={generating || selectedRepos.length === 0}
                  >
                    {generating ? (
                      <><LoadingSpinner size="sm" /> Generating AI Content...</>
                    ) : (
                      <><FiZap size={16} /> Confirm & Regenerate</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Step 1: Connect GitHub */}
            {authProvider !== AUTH_PROVIDERS.GITHUB && (
              <div className="rounded-2xl bg-slate-900/40 border border-white/[0.06] p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-1">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">1</span>
                  <h2 className="text-lg font-bold text-white">Connect GitHub</h2>
                </div>
                <p className="text-sm text-slate-500 mb-6 ml-10">Enter your GitHub username to fetch your profile and projects.</p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 ml-10">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <span className="text-slate-600 text-sm">@</span>
                      </div>
                      <input
                        type="text"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        placeholder="torvalds"
                        className="w-full pl-8 pr-4 py-3 bg-slate-950/50 border border-white/[0.06] rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>
                  <button
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 text-sm font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    onClick={handleFetchProfile}
                    disabled={loadingProfile || !githubUsername.trim()}
                  >
                    {loadingProfile ? "Fetching..." : "Fetch Profile"}
                  </button>
                </div>
                {profileError && <p className="text-red-400 text-sm mt-3 ml-10">{profileError}</p>}
              </div>
            )}

            {loadingProfile && (
              <div className="py-16 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Step 2: Review & Select */}
            {profileData && !loadingProfile && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <ProfileCard profileData={profileData} username={githubUsername} />

                <div className="rounded-2xl bg-slate-900/30 border border-white/[0.06] overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">2</span>
                      <div>
                        <h2 className="text-base font-bold text-white">Select Repositories</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Choose projects you want AI to analyze and feature</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {selectedRepos.length} selected
                    </span>
                  </div>

                  <div className="p-5">
                    <RepoSelector
                      repos={repos}
                      selectedRepos={selectedRepos}
                      onToggle={handleRepoToggle}
                    />
                  </div>

                  {/* Step 3: Generate */}
                  <div className="p-5 border-t border-white/[0.04]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">3</span>
                      <span className="text-sm text-slate-400">Generate your portfolio with AI</span>
                    </div>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={handleGeneratePortfolio}
                      disabled={generating || selectedRepos.length === 0}
                    >
                      {generating ? (
                        <><LoadingSpinner size="sm" /> Analyzing Code & Generating...</>
                      ) : (
                        <><FiZap size={16} /> Generate Portfolio</>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
