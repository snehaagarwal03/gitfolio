import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiRefreshCw, FiZap } from "react-icons/fi";
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
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
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
    <div className="min-h-[calc(100vh-4rem)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Dashboard</span>
          </h1>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {hasExistingPortfolio ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <ProfileCard
              profileData={profileData}
              portfolio={portfolio}
              username={portfolio.githubUsername || portfolio.slug}
            />

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-900/40 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">Your Portfolio is Live</h3>
                <p className="text-sm text-gray-400">View your live portfolio or regenerate it to pull fresh data from GitHub.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition-colors"
                  onClick={() => navigate(`/${portfolio.slug}`)}
                >
                  <FiEye /> View Live
                </button>
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                  onClick={() => {
                    setProfileData(null);
                    setSelectedRepos([]);
                    handleFetchProfile();
                  }}
                  disabled={loadingProfile}
                >
                  <FiRefreshCw className={loadingProfile ? "animate-spin" : ""} /> 
                  Regenerate
                </button>
              </div>
            </div>

            {loadingProfile && (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {profileData && !loadingProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 bg-gray-900/30 p-6 sm:p-8 rounded-3xl border border-gray-800"
              >
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Select Repositories</h2>
                    <p className="text-sm text-gray-400">Choose the projects you want to feature</p>
                  </div>
                  <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {selectedRepos.length} selected
                  </span>
                </div>
                
                <RepoSelector
                  repos={repos}
                  selectedRepos={selectedRepos}
                  onToggle={handleRepoToggle}
                />
                
                <div className="pt-4 border-t border-gray-800">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGeneratePortfolio}
                    disabled={generating || selectedRepos.length === 0}
                  >
                    {generating ? (
                      <><LoadingSpinner size="sm" /> Generating AI Content...</>
                    ) : (
                      <><FiZap /> Confirm & Regenerate Portfolio</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {authProvider !== AUTH_PROVIDERS.GITHUB && (
              <div className="bg-gray-900/50 p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-xl backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-2">Connect GitHub</h2>
                <p className="text-gray-400 text-sm mb-6">Enter your GitHub username to fetch your profile and projects.</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="e.g. torvalds"
                      className="w-full px-4 py-3 bg-gray-950/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <button
                    className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-bold rounded-xl transition-colors disabled:opacity-50 h-[46px] sm:h-auto"
                    onClick={handleFetchProfile}
                    disabled={loadingProfile || !githubUsername.trim()}
                  >
                    {loadingProfile ? "Fetching..." : "Fetch Profile"}
                  </button>
                </div>
                {profileError && <p className="text-red-400 text-sm mt-3">{profileError}</p>}
              </div>
            )}

            {loadingProfile && (
              <div className="py-12 flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {profileData && !loadingProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <ProfileCard profileData={profileData} username={githubUsername} />

                <div className="bg-gray-900/30 p-6 sm:p-8 rounded-3xl border border-gray-800">
                  <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">Select Repositories to Showcase</h2>
                      <p className="text-sm text-gray-400">Choose the projects you want AI to analyze and feature.</p>
                    </div>
                    <span className="text-sm font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                      {selectedRepos.length} selected
                    </span>
                  </div>
                  
                  <RepoSelector
                    repos={repos}
                    selectedRepos={selectedRepos}
                    onToggle={handleRepoToggle}
                  />
                  
                  <div className="pt-6 border-t border-gray-800 mt-6">
                    <button
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleGeneratePortfolio}
                      disabled={generating || selectedRepos.length === 0}
                    >
                      {generating ? (
                        <><LoadingSpinner size="sm" /> Analyzing Code & Generating Portfolio...</>
                      ) : (
                        <><FiZap /> Generate Magic Portfolio</>
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
