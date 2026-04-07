import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-[calc(100vh-4rem)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {hasExistingPortfolio ? (
          <div className="space-y-6">
            <ProfileCard
              profileData={profileData}
              portfolio={portfolio}
              username={portfolio.githubUsername || portfolio.slug}
            />

            <div className="flex items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(`/${portfolio.slug}`)}
              >
                View Portfolio
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setProfileData(null);
                  setSelectedRepos([]);
                  handleFetchProfile();
                }}
                loading={loadingProfile}
              >
                Regenerate Portfolio
              </Button>
            </div>

            {loadingProfile && (
              <div className="py-8">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {profileData && !loadingProfile && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Select Repositories</h2>
                <RepoSelector
                  repos={repos}
                  selectedRepos={selectedRepos}
                  onToggle={handleRepoToggle}
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleGeneratePortfolio}
                  loading={generating}
                  disabled={selectedRepos.length === 0}
                >
                  Regenerate Portfolio
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {authProvider !== AUTH_PROVIDERS.GITHUB && (
              <div className="flex items-end gap-3">
                <Input
                  label="GitHub Username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="Enter your GitHub username"
                  className="flex-1"
                />
                <Button
                  onClick={handleFetchProfile}
                  loading={loadingProfile}
                  disabled={!githubUsername.trim()}
                >
                  Fetch Profile
                </Button>
              </div>
            )}

            {profileError && (
              <p className="text-red-400 text-sm">{profileError}</p>
            )}

            {loadingProfile && <LoadingSpinner size="lg" />}

            {profileData && !loadingProfile && (
              <>
                <ProfileCard profileData={profileData} />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">
                    Select Repositories to Showcase
                  </h2>
                  <RepoSelector
                    repos={repos}
                    selectedRepos={selectedRepos}
                    onToggle={handleRepoToggle}
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleGeneratePortfolio}
                    loading={generating}
                    disabled={selectedRepos.length === 0}
                  >
                    Generate Portfolio
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
